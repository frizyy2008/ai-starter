import "server-only";
import { sqlite } from "@/db";

const UPSERT_SQL = `
INSERT INTO app_rate_limits (key, count, reset_at)
VALUES (@key, 1, @resetAt)
ON CONFLICT(key) DO UPDATE SET
  count = CASE WHEN app_rate_limits.reset_at <= @now THEN 1 ELSE app_rate_limits.count + 1 END,
  reset_at = CASE WHEN app_rate_limits.reset_at <= @now THEN excluded.reset_at ELSE app_rate_limits.reset_at END
WHERE app_rate_limits.reset_at <= @now OR app_rate_limits.count < @max
RETURNING count, reset_at AS resetAt
`;

const SELECT_RESET_SQL = `SELECT reset_at AS resetAt FROM app_rate_limits WHERE key = @key`;

type UpsertParams = { key: string; now: number; resetAt: number; max: number };
type UpsertRow = { count: number; resetAt: number };
type SelectParams = { key: string };
type SelectRow = { resetAt: number };

const prepareUpsert = () => sqlite.prepare<UpsertParams, UpsertRow>(UPSERT_SQL);
const prepareSelect = () => sqlite.prepare<SelectParams, SelectRow>(SELECT_RESET_SQL);

let upsertStmt: ReturnType<typeof prepareUpsert> | undefined;
let selectStmt: ReturnType<typeof prepareSelect> | undefined;

export type RateLimitResult = { allowed: boolean; retryAfterSec: number };

export function consumeRateLimit(
  key: string,
  max: number,
  windowMs: number,
  now: number = Date.now(),
): RateLimitResult {
  upsertStmt ??= prepareUpsert();
  const row = upsertStmt.get({ key, now, resetAt: now + windowMs, max });
  if (row) {
    return {
      allowed: true,
      retryAfterSec: Math.max(1, Math.ceil((row.resetAt - now) / 1000)),
    };
  }

  selectStmt ??= prepareSelect();
  const existing = selectStmt.get({ key });
  const resetAt = existing?.resetAt ?? now + windowMs;
  return {
    allowed: false,
    retryAfterSec: Math.max(1, Math.ceil((resetAt - now) / 1000)),
  };
}
