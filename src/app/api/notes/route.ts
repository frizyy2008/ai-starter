import { z } from "zod";
import { createNoteSchema } from "@/features/notes/schema";
import { createNote, listNotes } from "@/server/notes/service";
import { getUserFromRequest } from "@/server/session";
import { isSameOrigin, jsonError, readJsonBody } from "@/server/http";
import { consumeRateLimit } from "@/server/rate-limit";

const MAX_BODY_BYTES = 16 * 1024;
const CREATE_LIMIT = { max: 20, windowMs: 60_000 };
const NO_STORE = { "Cache-Control": "private, no-store" };

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return jsonError(401, "unauthorized");
  return Response.json({ notes: listNotes(user.id) }, { headers: NO_STORE });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError(403, "forbidden_origin");

  const mediaType = (request.headers.get("content-type") ?? "").split(";", 1)[0].trim().toLowerCase();
  if (mediaType !== "application/json") {
    return jsonError(415, "unsupported_media_type");
  }

  const user = await getUserFromRequest(request);
  if (!user) return jsonError(401, "unauthorized");

  const limit = consumeRateLimit(`notes:create:${user.id}`, CREATE_LIMIT.max, CREATE_LIMIT.windowMs);
  if (!limit.allowed) {
    return jsonError(429, "rate_limited", {
      headers: { "Retry-After": String(limit.retryAfterSec) },
    });
  }

  const body = await readJsonBody(request, MAX_BODY_BYTES);
  if (!body.ok) {
    return jsonError(body.status, body.status === 413 ? "payload_too_large" : "invalid_json");
  }

  const parsed = createNoteSchema.safeParse(body.data);
  if (!parsed.success) {
    return jsonError(400, "validation_failed", { details: z.flattenError(parsed.error).fieldErrors });
  }

  const note = createNote(user.id, parsed.data);
  return Response.json({ note }, { status: 201, headers: NO_STORE });
}
