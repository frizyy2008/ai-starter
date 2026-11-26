import { noteIdSchema } from "@/features/notes/schema";
import { getNote } from "@/server/notes/service";
import { getUserFromRequest } from "@/server/session";
import { jsonError } from "@/server/http";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request);
  if (!user) return jsonError(401, "unauthorized");

  const { id } = await context.params;
  const parsedId = noteIdSchema.safeParse(id);
  if (!parsedId.success) return jsonError(404, "not_found");

  const note = getNote(user.id, parsedId.data);
  if (!note) return jsonError(404, "not_found");

  return Response.json({ note }, { headers: { "Cache-Control": "private, no-store" } });
}
