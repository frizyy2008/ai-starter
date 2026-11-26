import "server-only";
import { env } from "@/lib/env";

const appOrigin = new URL(env.BETTER_AUTH_URL).origin;

export function isSameOrigin(request: Request): boolean {
  return request.headers.get("origin") === appOrigin;
}

export function jsonError(
  status: number,
  error: string,
  init: { headers?: HeadersInit; details?: unknown } = {},
): Response {
  const headers = new Headers(init.headers);
  if (!headers.has("Cache-Control")) {
    headers.set("Cache-Control", "private, no-store");
  }
  const body = init.details === undefined ? { error } : { error, details: init.details };
  return Response.json(body, { status, headers });
}

type BodyResult = { ok: true; data: unknown } | { ok: false; status: 400 | 413 };

export async function readJsonBody(request: Request, maxBytes: number): Promise<BodyResult> {
  const rawLength = request.headers.get("content-length");
  if (rawLength !== null) {
    const declared = Number(rawLength);
    if (Number.isFinite(declared) && declared > maxBytes) {
      return { ok: false, status: 413 };
    }
  }

  let text: string;
  if (request.body) {
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!value) continue;
        total += value.byteLength;
        if (total > maxBytes) {
          await reader.cancel("payload_too_large").catch(() => undefined);
          return { ok: false, status: 413 };
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    const merged = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      merged.set(chunk, offset);
      offset += chunk.byteLength;
    }
    text = new TextDecoder("utf-8").decode(merged);
  } else {
    text = await request.text();
    if (new TextEncoder().encode(text).byteLength > maxBytes) {
      return { ok: false, status: 413 };
    }
  }

  try {
    return { ok: true, data: JSON.parse(text) as unknown };
  } catch {
    return { ok: false, status: 400 };
  }
}
