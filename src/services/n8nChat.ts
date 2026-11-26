import { BRANCHES, formatRupiah } from '../data/products';
import { BranchId, CartItem } from '../types/store';

export const DEFAULT_N8N_WEBHOOK_URL =
  'https://misterhvzs22.app.n8n.cloud/webhook/4am-chat';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: 'n8n';
  isError?: boolean;
}

export interface N8nWebhookPayload {
  chatInput: string;
  message: string;
  sessionId: string;
  context: {
    branch: string;
    cartItems: string;
    cartTotal: string;
  };
}

const STORAGE_WEBHOOK_KEY = '4am_n8n_webhook_url_v1';
const STORAGE_SESSION_KEY = '4am_n8n_session_id_v1';

export function getEnvWebhookUrl(): string {
  const raw = import.meta.env.VITE_N8N_WEBHOOK_URL;
  return typeof raw === 'string' ? raw.trim() : '';
}

export function getDefaultWebhookUrl(): string {
  const envUrl = getEnvWebhookUrl();
  if (envUrl && isValidWebhookUrl(envUrl)) {
    return envUrl;
  }
  return DEFAULT_N8N_WEBHOOK_URL;
}

export function isValidWebhookUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Resolves the active n8n Webhook URL in strict priority order:
 * 1) localStorage override (set via chat header settings)
 * 2) import.meta.env.VITE_N8N_WEBHOOK_URL
 * 3) Production fallback URL: https://misterhvzs22.app.n8n.cloud/webhook/4am-chat
 */
export function resolveWebhookUrl(): string {
  try {
    const stored = window.localStorage.getItem(STORAGE_WEBHOOK_KEY);
    if (stored && isValidWebhookUrl(stored)) {
      return stored.trim();
    }
  } catch {
    // Ignore storage access errors
  }

  const envUrl = getEnvWebhookUrl();
  if (envUrl && isValidWebhookUrl(envUrl)) {
    return envUrl;
  }

  return DEFAULT_N8N_WEBHOOK_URL;
}

export function saveWebhookUrlOverride(url: string): string {
  const trimmed = url.trim();
  try {
    if (!trimmed || trimmed === getDefaultWebhookUrl()) {
      window.localStorage.removeItem(STORAGE_WEBHOOK_KEY);
    } else {
      window.localStorage.setItem(STORAGE_WEBHOOK_KEY, trimmed);
    }
  } catch {
    // Ignore storage access errors
  }
  return resolveWebhookUrl();
}

export function clearWebhookUrlOverride(): string {
  try {
    window.localStorage.removeItem(STORAGE_WEBHOOK_KEY);
  } catch {
    // Ignore storage access errors
  }
  return resolveWebhookUrl();
}

export function createSessionId(): string {
  const randomPart =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `4am-${randomPart}`;
}

export function getOrCreateSessionId(): string {
  try {
    const existing = window.localStorage.getItem(STORAGE_SESSION_KEY);
    if (existing && existing.trim()) return existing.trim();
    const next = createSessionId();
    window.localStorage.setItem(STORAGE_SESSION_KEY, next);
    return next;
  } catch {
    return createSessionId();
  }
}

export function resetSessionId(): string {
  const next = createSessionId();
  try {
    window.localStorage.setItem(STORAGE_SESSION_KEY, next);
  } catch {
    // Ignore storage access errors
  }
  return next;
}

export function formatTimeNow(): string {
  return new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatCartItemsSummary(cart: CartItem[]): string {
  if (cart.length === 0) return 'Kosong';
  return cart
    .map(
      ({ product, quantity }) =>
        `${product.name} (${product.unit}) x${quantity} = ${formatRupiah(product.price * quantity)}`
    )
    .join(', ');
}

function extractReplyFromParsedJson(data: unknown): string {
  if (typeof data === 'string') {
    return data.trim();
  }

  if (Array.isArray(data)) {
    const first = data[0];
    if (first && typeof first === 'object') {
      const item = first as Record<string, unknown>;
      const candidate =
        item.output ?? item.reply ?? item.message ?? item.text ?? '';
      if (typeof candidate === 'string' && candidate.trim()) {
        return candidate.trim();
      }
    }
    if (typeof first === 'string' && first.trim()) {
      return first.trim();
    }
    return '';
  }

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    const candidate =
      record.output ?? record.reply ?? record.message ?? record.text ?? '';
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }

  return '';
}

const EMPTY_REPLY_MESSAGE =
  'Pesan terkirim ke n8n, tetapi belum ada balasan teks. Pastikan workflow n8n sudah di-Publish.';

export async function sendMessageToN8n(params: {
  webhookUrl: string;
  sessionId: string;
  message: string;
  branch: BranchId;
  cart: CartItem[];
  subtotal: number;
}): Promise<string> {
  const { webhookUrl, sessionId, message, branch, cart, subtotal } = params;
  const cleanUrl = webhookUrl.trim();
  const activeBranch = BRANCHES[branch];

  if (!isValidWebhookUrl(cleanUrl)) {
    throw new Error(
      'URL Webhook n8n tidak valid. Pastikan diawali dengan https:// atau http://.'
    );
  }

  const payload: N8nWebhookPayload = {
    chatInput: message,
    message,
    sessionId,
    context: {
      branch: activeBranch.cityLabel,
      cartItems: formatCartItemsSummary(cart),
      cartTotal: formatRupiah(subtotal),
    },
  };

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(cleanUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    // Always read response as text first to avoid "Unexpected end of JSON input"
    const rawText = await response.text();
    const trimmedText = rawText.trim();

    if (!response.ok) {
      throw new Error(
        `Gagal menghubungi Asisten 4 AM (HTTP ${response.status}). Pastikan workflow n8n sudah di-Publish dan aktif.`
      );
    }

    if (!trimmedText) {
      return EMPTY_REPLY_MESSAGE;
    }

    try {
      const data: unknown = JSON.parse(trimmedText);
      const reply = extractReplyFromParsedJson(data);
      return reply || EMPTY_REPLY_MESSAGE;
    } catch {
      // Plain text response from n8n
      return trimmedText;
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error(
        'Asisten membutuhkan waktu lebih dari 30 detik untuk merespons. Silakan coba kirim ulang.'
      );
    }
    if (err instanceof TypeError) {
      throw new Error(
        'Tidak dapat terhubung ke Webhook n8n. Periksa koneksi internet Anda atau pengaturan CORS pada node Webhook n8n.'
      );
    }
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Terjadi kendala saat menghubungi Asisten 4 AM.');
  } finally {
    window.clearTimeout(timeoutId);
  }
}
