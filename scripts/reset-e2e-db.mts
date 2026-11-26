import { rmSync } from "node:fs";

const dbPath = process.env.DATABASE_PATH ?? "";
if (!dbPath.includes("e2e")) {
  throw new Error(`reset-e2e-db: отказ, DATABASE_PATH не похож на e2e-базу: "${dbPath}"`);
}
for (const suffix of ["", "-wal", "-shm"]) {
  rmSync(dbPath + suffix, { force: true });
}
console.log(`e2e-база очищена: ${dbPath}`);
