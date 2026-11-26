import { mkdirSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { env } from "../lib/env";
import * as schema from "./schema";

function open(): Database.Database {
  mkdirSync(path.dirname(path.resolve(env.DATABASE_PATH)), { recursive: true });
  const sqlite = new Database(env.DATABASE_PATH);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("synchronous = FULL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.pragma("busy_timeout = 5000");
  return sqlite;
}

const globalForDb = globalThis as unknown as { __sqlite?: Database.Database };
export const sqlite = globalForDb.__sqlite ?? open();
if (env.NODE_ENV !== "production") globalForDb.__sqlite = sqlite;

export const db = drizzle({ client: sqlite, schema });
