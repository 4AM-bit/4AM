import type { IncomingMessage, ServerResponse } from 'node:http';

const DEFAULT_N8N_WEBHOOK_URL =
  'https://misterhvzs22.app.n8n.cloud/webhook/4am-chat';
const MAX_BODY_BYTES = 64 * 1024;
const TIMEOUT_MS = 28000;

function isSafePublicWebhookUrl(rawUrl: string): boolean {
  const trimmed = rawUrl.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return false;
    }
    const host = parsed.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host === '::1' ||
      host.endsWith('.local') ||
      host.endsWith('.internal') ||
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^169\.254\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  // Vercel Node runtime may pre-parse req.body on some configurations
  const maybePreParsed = (req as IncomingMessage & { body?: unknown }).body;
  if (maybePreParsed !== undefined && maybePreParsed !== null) {
    if (typeof maybePreParsed === 'string') {
      return JSON.parse(maybePreParsed);
    }
    return maybePreParsed;
  }

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let totalBytes = 0;

    req.on('data', (chunk: Buffer | string) => {
      const buf = typeof chunk === 'string' ? Buffer.from(chunk) : chunk;
      totalBytes += buf.length;
      if (totalBytes > MAX_BODY_BYTES) {
        reject(new Error('Payload terlalu besar.'));
        req.destroy();
        return;
      }
      chunks.push(buf);
    });

    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8').trim();
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error('Format body JSON tidak valid.'));
      }
    });

    req.on('error', reject);
  });
}

function sendJson(
  res: ServerResponse,
  statusCode: number,
  body: Record<string, unknown>
): void {
  res.statusCode = statusCode;
  res.setHeader('X-Chat-Proxy', '1');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  res.setHeader('X-Chat-Proxy', '1');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method tidak diizinkan. Gunakan POST.' });
    return;
  }

  let body: Record<string, unknown>;
  try {
    const parsed = await readJsonBody(req);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      sendJson(res, 400, { error: 'Body permintaan harus berupa objek JSON.' });
      return;
    }
    body = parsed as Record<string, unknown>;
  } catch (err) {
    sendJson(res, 400, {
      error: err instanceof Error ? err.message : 'Body JSON tidak valid.',
    });
    return;
  }

  const envUrl =
    (process.env.N8N_WEBHOOK_URL || process.env.VITE_N8N_WEBHOOK_URL || '').trim();
  const requestedUrl =
    typeof body.webhookUrl === 'string' ? body.webhookUrl.trim() : '';
  const targetUrl = requestedUrl || envUrl || DEFAULT_N8N_WEBHOOK_URL;

  if (!isSafePublicWebhookUrl(targetUrl)) {
    sendJson(res, 400, {
      error: 'URL Webhook n8n tidak valid atau tidak diizinkan.',
    });
    return;
  }

  const forwardPayload =
    body.payload && typeof body.payload === 'object' ? body.payload : body;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const upstream = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
      },
      body: JSON.stringify(forwardPayload),
      signal: controller.signal,
    });

    const rawText = await upstream.text();
    const contentType =
      upstream.headers.get('content-type') || 'text/plain; charset=utf-8';

    res.statusCode = upstream.status;
    res.setHeader('Content-Type', contentType);
    res.end(rawText);
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      sendJson(res, 504, {
        error: 'Koneksi ke server n8n melebihi batas waktu.',
      });
      return;
    }
    sendJson(res, 502, {
      error:
        err instanceof Error
          ? `Gagal menghubungi server n8n: ${err.message}`
          : 'Gagal menghubungi server n8n.',
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
