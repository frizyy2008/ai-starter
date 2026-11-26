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
  const body = init.details === undefined ? { error } : { error, details: init.details };
  return Response.json(body, { status, headers: init.headers });
}

type BodyResult = { ok: true; data: unknown } | { ok: false; status: 400 | 413 };

export async function readJsonBody(request: Request, maxBytes: number): Promise<BodyResult> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > maxBytes) return { ok: false, status: 413 };

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maxBytes) return { ok: false, status: 413 };

  try {
    return { ok: true, data: JSON.parse(text) as unknown };
  } catch {
    return { ok: false, status: 400 };
  }
}
