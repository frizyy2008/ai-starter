import { mkdirSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const file = process.env.DATABASE_PATH;
if (!file) {
  console.error("DATABASE_PATH не задан (проверь .env.local)");
  process.exit(1);
}

mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
const sqlite = new Database(file);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
migrate(drizzle({ client: sqlite }), { migrationsFolder: "drizzle" });
sqlite.close();
console.log(`Миграции применены: ${file}`);
