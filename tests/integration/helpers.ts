import Database from "better-sqlite3";
import { auth } from "@/lib/auth";

export const BASE_URL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
export const PASSWORD = "correct-horse-battery-1";

let counter = 0;

export async function signUpUser(): Promise<{ cookie: string; email: string }> {
  const email = `user-${Date.now()}-${++counter}@example.test`;
  const res = await auth.handler(
    new Request(`${BASE_URL}/api/auth/sign-up/email`, {
      method: "POST",
      headers: { "content-type": "application/json", origin: BASE_URL },
      body: JSON.stringify({ name: "Test", email, password: PASSWORD }),
    }),
  );
  if (!res.ok) throw new Error(`sign-up failed: ${res.status}`);
  const cookie = res.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
  if (!cookie) throw new Error("no session cookie");
  return { cookie, email };
}

type RequestOptions = {
  cookie?: string;
  body?: unknown;
  rawBody?: string;
  origin?: string | null;
  contentType?: string;
};

export function apiRequest(method: "GET" | "POST", path: string, opts: RequestOptions = {}): Request {
  const headers = new Headers();
  if (opts.cookie) headers.set("cookie", opts.cookie);
  const origin = opts.origin === undefined ? BASE_URL : opts.origin;
  if (origin) headers.set("origin", origin);

  let body: string | undefined;
  if (opts.rawBody !== undefined) body = opts.rawBody;
  else if (opts.body !== undefined) body = JSON.stringify(opts.body);

  if (body !== undefined) headers.set("content-type", opts.contentType ?? "application/json");
  return new Request(`${BASE_URL}${path}`, { method, headers, body });
}

export function countNotesOnDisk(): number {
  const db = new Database(process.env.DATABASE_PATH!, { readonly: true, fileMustExist: true });
  try {
    return (db.prepare("SELECT count(*) AS n FROM notes").get() as { n: number }).n;
  } finally {
    db.close();
  }
}
