import { rmSync } from "node:fs";
import path from "node:path";

const dbPath = process.env.DATABASE_PATH ?? "";
const resolved = path.resolve(dbPath);
const expected = path.resolve(process.cwd(), "data", "e2e.sqlite");

if (!dbPath || resolved !== expected) {
  throw new Error(`reset-e2e-db: отказ, разрешён сброс только ${expected}`);
}
for (const suffix of ["", "-wal", "-shm"]) {
  rmSync(resolved + suffix, { force: true });
}
console.log(`e2e-база очищена: ${resolved}`);
