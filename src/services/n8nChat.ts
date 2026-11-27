import { BRANCHES, formatRupiah, PRODUCTS } from '../data/products';
import { BranchId, CartItem, Product } from '../types/store';

export const DEFAULT_N8N_WEBHOOK_URL =
  'https://misterhvzs22.app.n8n.cloud/webhook/4am-chat';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: 'n8n' | 'store';
  suggestedProducts?: Product[];
  showCheckoutAction?: boolean;
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

export interface N8nReplyResult {
  text: string;
  source: 'n8n' | 'store';
  diagnostic?: string;
  suggestedProducts?: Product[];
  showCheckoutAction?: boolean;
}

export interface N8nTestResult {
  ok: boolean;
  status?: number;
  message: string;
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

function extractErrorDetail(rawText: string): string {
  const trimmed = rawText.trim();
  if (!trimmed) return '';
  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (parsed && typeof parsed === 'object') {
      const record = parsed as Record<string, unknown>;
      const msg = record.message ?? record.error;
      if (typeof msg === 'string' && msg.trim()) {
        return msg.trim();
      }
    }
  } catch {
    // Non-JSON text
  }
  return trimmed.slice(0, 140);
}

async function postToN8nEndpoint(
  cleanUrl: string,
  payload: N8nWebhookPayload,
  signal: AbortSignal
): Promise<Response> {
  // Prefer same-origin /api/chat proxy (Vercel serverless + Vite dev) to avoid browser CORS blocks
  const proxyResponse = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
    },
    body: JSON.stringify({
      webhookUrl: cleanUrl,
      payload,
    }),
    signal,
  });

  if (proxyResponse.headers.get('x-chat-proxy') === '1') {
    return proxyResponse;
  }

  // Fallback to direct webhook call if /api/chat runtime is unavailable
  return fetch(cleanUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
    },
    body: JSON.stringify(payload),
    signal,
  });
}

/**
 * Grounded 4 AM store assistant powered by live catalog, branches, and cart.
 * Automatically activates when the external n8n workflow is offline or returns 404/500,
 * so shoppers always get immediate, accurate responses without dead-end error screens.
 */
export function generateSmartStoreReply(params: {
  message: string;
  branch: BranchId;
  cart: CartItem[];
  subtotal: number;
}): {
  text: string;
  suggestedProducts?: Product[];
  showCheckoutAction?: boolean;
} {
  const { message, branch, cart, subtotal } = params;
  const q = message.toLowerCase().trim();
  const activeBranch = BRANCHES[branch];
  const otherBranch = BRANCHES[branch === 'jakarta' ? 'aceh' : 'jakarta'];

  // 1. Cart & subtotal inquiry
  if (
    /\b(keranjang|cart|belanjaan|total|subtotal|isi keranjang|cek pesanan)\b/.test(
      q
    )
  ) {
    if (cart.length === 0) {
      const topPicks = [...PRODUCTS]
        .sort((a, b) => a.branchPriority[branch] - b.branchPriority[branch])
        .slice(0, 3);
      return {
        text: `Keranjang Anda di ${activeBranch.name} masih kosong. Berikut 3 produk favorit ${activeBranch.cityLabel} yang bisa langsung Anda tambahkan:`,
        suggestedProducts: topPicks,
      };
    }

    const lines = cart.map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name} (${item.product.unit}) x${item.quantity} — ${formatRupiah(item.product.price * item.quantity)}`
    );
    return {
      text: `Isi keranjang Anda saat ini (${activeBranch.name}):\n${lines.join('\n')}\n\nSubtotal: ${formatRupiah(subtotal)}. Siap lanjut checkout via WhatsApp?`,
      showCheckoutAction: true,
    };
  }

  // 2. Branch hours, location, coverage
  if (
    /\b(jam|buka|tutup|alamat|lokasi|cabang|jakarta|aceh|jangkauan|dimana|di mana)\b/.test(
      q
    )
  ) {
    if (q.includes('aceh') && !q.includes('jakarta')) {
      const aceh = BRANCHES.aceh;
      return {
        text: `${aceh.name}\nJam operasional: ${aceh.hours}\nAlamat: ${aceh.address}\nJangkauan antar: ${aceh.coverage}\nWhatsApp: ${aceh.whatsappDisplay}`,
      };
    }
    if (q.includes('jakarta') && !q.includes('aceh')) {
      const jkt = BRANCHES.jakarta;
      return {
        text: `${jkt.name}\nJam operasional: ${jkt.hours}\nAlamat: ${jkt.address}\nJangkauan antar: ${jkt.coverage}\nWhatsApp: ${jkt.whatsappDisplay}`,
      };
    }
    return {
      text: `Cabang aktif Anda: ${activeBranch.name}\n• Jam buka: ${activeBranch.hours} (setiap hari)\n• Alamat: ${activeBranch.address}\n• Jangkauan antar: ${activeBranch.coverage}\n\nKami juga melayani ${otherBranch.name} (${otherBranch.address}). Anda bisa ganti cabang kapan saja lewat tombol Lokasi di header.`,
    };
  }

  // 3. Ordering, delivery, pickup, QRIS, WhatsApp
  if (
    /\b(pesan|antar|ongkir|ambil|qris|bayar|tunai|cod|whatsapp|wa|checkout|cara)\b/.test(
      q
    )
  ) {
    return {
      text: `Cara belanja di 4 AM (${activeBranch.name}):\n1. Tambahkan produk ke keranjang dari katalog.\n2. Klik Keranjang lalu pilih Checkout.\n3. Pilih layanan Pesan Antar (sesuai jangkauan ${activeBranch.coverage}) atau Ambil di Toko.\n4. Pilih metode bayar QRIS (scan di tempat / kirim bukti) atau Tunai.\n5. Kirim ringkasan pesanan langsung ke WhatsApp cabang (${activeBranch.whatsappDisplay}).`,
      showCheckoutAction: true,
    };
  }

  // 4. UMKM Lokal spotlight
  if (/\b(umkm|lokal|gayo|khas|pengrajin|oleh|camilan|keripik|madu)\b/.test(q)) {
    const umkmItems = PRODUCTS.filter((p) => p.isUmkm).sort(
      (a, b) => a.branchPriority[branch] - b.branchPriority[branch]
    );
    return {
      text: `Berikut pilihan Etalase UMKM Lokal di 4 AM (${activeBranch.name}) dengan pasokan langsung dari pengrajin Aceh & Jakarta:`,
      suggestedProducts: umkmItems.slice(0, 3),
    };
  }

  // 5. Category & intent matching
  const categoryMatches: Array<{ pattern: RegExp; category: Product['category']; title: string }> = [
    {
      pattern: /\b(pokok|sembako|beras|minyak|gula|telur|dapur)\b/,
      category: 'kebutuhan-pokok',
      title: 'Kebutuhan Pokok',
    },
    {
      pattern: /\b(praktis|sarapan|roti|onigiri|siap santap|cepat|dingin|cold brew|teh)\b/,
      category: 'produk-praktis',
      title: 'Produk Praktis',
    },
    {
      pattern: /\b(makanan|minuman|kopi|mi|mie|air|mineral|haus|lapar)\b/,
      category: 'makanan-minuman',
      title: 'Makanan & Minuman',
    },
    {
      pattern: /\b(rumah tangga|deterjen|cuci|piring|tisu|tissue|sabun cuci)\b/,
      category: 'rumah-tangga',
      title: 'Perlengkapan Rumah Tangga',
    },
    {
      pattern: /\b(perawatan|mandi|sampo|shampoo|pasta gigi|odol|pribadi)\b/,
      category: 'perawatan-pribadi',
      title: 'Perawatan Pribadi',
    },
  ];

  // Direct keyword match across product names & descriptions first
  const tokens = q
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !['yang', 'ada', 'apa', 'saja', 'harga', 'berapa', 'beli', 'cari', 'mau', 'tolong', 'rekomendasi', 'produk', 'untuk'].includes(w));

  if (tokens.length > 0) {
    const exactMatches = PRODUCTS.filter((p) => {
      const hay = `${p.name} ${p.shortNote} ${p.categoryLabel} ${p.umkmOrigin ?? ''} ${p.umkmRegion ?? ''}`.toLowerCase();
      return tokens.some((t) => hay.includes(t));
    }).sort((a, b) => a.branchPriority[branch] - b.branchPriority[branch]);

    if (exactMatches.length > 0) {
      const shown = exactMatches.slice(0, 3);
      return {
        text: `Saya menemukan ${exactMatches.length} produk yang sesuai di stok ${activeBranch.name}. Anda bisa langsung menambahkannya ke keranjang di bawah ini:`,
        suggestedProducts: shown,
      };
    }
  }

  for (const matcher of categoryMatches) {
    if (matcher.pattern.test(q)) {
      const items = PRODUCTS.filter((p) => p.category === matcher.category)
        .sort((a, b) => a.branchPriority[branch] - b.branchPriority[branch])
        .slice(0, 3);
      return {
        text: `Ini pilihan kategori ${matcher.title} yang paling dicari di ${activeBranch.name}:`,
        suggestedProducts: items,
      };
    }
  }

  // 6. Greetings & gratitude
  if (/^(halo|hai|hi|hello|selamat|pagi|siang|sore|malam|assalam|permisi)\b/.test(q)) {
    const picks = [...PRODUCTS]
      .sort((a, b) => a.branchPriority[branch] - b.branchPriority[branch])
      .slice(0, 2);
    return {
      text: `Halo! Selamat datang di 4 AM (${activeBranch.name}). Saya siap bantu cek harga produk harian, rekomendasi UMKM lokal, jam buka cabang (${activeBranch.hours}), atau proses pesan antar via WhatsApp & QRIS. Mau cari apa hari ini?`,
      suggestedProducts: picks,
    };
  }

  if (/\b(terima kasih|makasih|thanks|oke|ok|siap)\b/.test(q)) {
    return {
      text: `Sama-sama! Jika butuh cek produk lain atau ingin langsung checkout keranjang via WhatsApp ${activeBranch.name}, kabari saya kapan saja.`,
      showCheckoutAction: cart.length > 0,
    };
  }

  // 7. Budget / cheapest queries
  if (/\b(murah|termurah|hemat|promo|rekomendasi|favorit|terlaris)\b/.test(q)) {
    const picks = [...PRODUCTS]
      .sort((a, b) =>
        q.includes('murah') || q.includes('hemat')
          ? a.price - b.price
          : a.branchPriority[branch] - b.branchPriority[branch]
      )
      .slice(0, 3);
    return {
      text: `Berikut rekomendasi produk pilihan di ${activeBranch.name} dengan harga bersahabat:`,
      suggestedProducts: picks,
    };
  }

  // 8. General helpful default with top branch items
  const defaultPicks = [...PRODUCTS]
    .sort((a, b) => a.branchPriority[branch] - b.branchPriority[branch])
    .slice(0, 3);
  return {
    text: `Saya siap membantu belanja di 4 AM (${activeBranch.name}). Coba ketik nama barang yang dicari (misalnya: beras, kopi Gayo, onigiri, telur, atau deterjen), cek jam buka, atau lihat rekomendasi populer berikut:`,
    suggestedProducts: defaultPicks,
  };
}

/**
 * Primary chat dispatch: calls the configured n8n webhook first.
 * If n8n returns HTTP 200 with a reply, uses n8n's reply directly.
 * If n8n is inactive (404), errors (500), times out, or unreachable,
 * seamlessly falls back to the grounded 4 AM store assistant while surfacing
 * the technical n8n status inside Settings diagnostics.
 */
export async function sendChatMessage(params: {
  webhookUrl: string;
  sessionId: string;
  message: string;
  branch: BranchId;
  cart: CartItem[];
  subtotal: number;
}): Promise<N8nReplyResult> {
  const { webhookUrl, sessionId, message, branch, cart, subtotal } = params;
  const cleanUrl = webhookUrl.trim();
  const activeBranch = BRANCHES[branch];

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

  if (isValidWebhookUrl(cleanUrl)) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 30000);

    try {
      const response = await postToN8nEndpoint(
        cleanUrl,
        payload,
        controller.signal
      );

      // Always read as text first to prevent "Unexpected end of JSON input"
      const rawText = await response.text();
      const trimmedText = rawText.trim();

      if (response.ok && trimmedText) {
        try {
          const data: unknown = JSON.parse(trimmedText);
          const extracted = extractReplyFromParsedJson(data);
          if (extracted) {
            return {
              text: extracted,
              source: 'n8n',
            };
          }
        } catch {
          return {
            text: trimmedText,
            source: 'n8n',
          };
        }

        const fallback = generateSmartStoreReply({
          message,
          branch,
          cart,
          subtotal,
        });
        return {
          ...fallback,
          source: 'store',
          diagnostic:
            'n8n merespons HTTP 200 tetapi tanpa field output/reply/message/text.',
        };
      }

      const detail = extractErrorDetail(trimmedText);
      const diagnostic = !response.ok
        ? `n8n HTTP ${response.status}${detail ? `: ${detail}` : ''}`
        : 'n8n merespons kosong (pastikan workflow di-Publish & ada Respond to Webhook).';

      const fallback = generateSmartStoreReply({
        message,
        branch,
        cart,
        subtotal,
      });
      return {
        ...fallback,
        source: 'store',
        diagnostic,
      };
    } catch (err) {
      const diagnostic =
        err instanceof DOMException && err.name === 'AbortError'
          ? 'n8n timeout (>30 detik).'
          : err instanceof Error
            ? `Koneksi n8n gagal: ${err.message}`
            : 'Koneksi n8n gagal.';

      const fallback = generateSmartStoreReply({
        message,
        branch,
        cart,
        subtotal,
      });
      return {
        ...fallback,
        source: 'store',
        diagnostic,
      };
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  const fallback = generateSmartStoreReply({
    message,
    branch,
    cart,
    subtotal,
  });
  return {
    ...fallback,
    source: 'store',
    diagnostic: 'URL Webhook n8n belum valid.',
  };
}

export async function testN8nConnection(
  webhookUrl: string,
  branch: BranchId
): Promise<N8nTestResult> {
  const cleanUrl = webhookUrl.trim();
  if (!isValidWebhookUrl(cleanUrl)) {
    return {
      ok: false,
      message: 'URL harus diawali https:// atau http://.',
    };
  }

  const activeBranch = BRANCHES[branch];
  const payload: N8nWebhookPayload = {
    chatInput: 'Halo tes koneksi 4 AM',
    message: 'Halo tes koneksi 4 AM',
    sessionId: getOrCreateSessionId(),
    context: {
      branch: activeBranch.cityLabel,
      cartItems: 'Kosong',
      cartTotal: 'Rp 0',
    },
  };

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 15000);

  try {
    const response = await postToN8nEndpoint(
      cleanUrl,
      payload,
      controller.signal
    );
    const rawText = (await response.text()).trim();

    if (!response.ok) {
      const detail = extractErrorDetail(rawText);
      if (response.status === 404 && /not registered/i.test(detail)) {
        return {
          ok: false,
          status: 404,
          message:
            'HTTP 404: Webhook POST belum aktif di n8n. Nyalakan toggle Active / Publish di workflow n8n.',
        };
      }
      if (response.status === 500) {
        return {
          ok: false,
          status: 500,
          message: `HTTP 500 (${detail || 'Error in workflow'}): Webhook masuk ke n8n, cek tab Executions untuk node yang merah.`,
        };
      }
      return {
        ok: false,
        status: response.status,
        message: `HTTP ${response.status}${detail ? `: ${detail}` : ''}`,
      };
    }

    if (!rawText) {
      return {
        ok: false,
        status: response.status,
        message:
          'HTTP 200 tetapi respons kosong. Pastikan node Respond to Webhook mengembalikan teks/JSON.',
      };
    }

    return {
      ok: true,
      status: response.status,
      message: 'Terhubung penuh ke workflow n8n (HTTP 200 OK).',
    };
  } catch (err) {
    return {
      ok: false,
      message:
        err instanceof DOMException && err.name === 'AbortError'
          ? 'Timeout 15 detik saat menghubungi n8n.'
          : 'Gagal menjangkau server n8n.',
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}
