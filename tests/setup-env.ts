import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomBytes } from "node:crypto";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const dir = mkdtempSync(path.join(tmpdir(), "ai-starter-test-"));
process.env.DATABASE_PATH = path.join(dir, "test.sqlite");
process.env.BETTER_AUTH_SECRET = randomBytes(32).toString("hex");
process.env.BETTER_AUTH_URL = "http://localhost:3000";

if (existsSync("drizzle/meta/_journal.json")) {
  const sqlite = new Database(process.env.DATABASE_PATH);
  sqlite.pragma("foreign_keys = ON");
  migrate(drizzle({ client: sqlite }), { migrationsFolder: "drizzle" });
  sqlite.close();
}
