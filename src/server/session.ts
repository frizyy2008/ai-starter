import "server-only";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export type SessionUser = { id: string };

export async function getUserFromRequest(request: Request): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: request.headers });
  return session ? { id: session.user.id } : null;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session ? { id: session.user.id } : null;
}
