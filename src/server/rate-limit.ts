import "server-only";
import { sqlite } from "@/db";

const UPSERT_SQL = `
INSERT INTO app_rate_limits (key, count, reset_at)
VALUES (@key, 1, @resetAt)
ON CONFLICT(key) DO UPDATE SET
  count = CASE WHEN app_rate_limits.reset_at <= @now THEN 1 ELSE app_rate_limits.count + 1 END,
  reset_at = CASE WHEN app_rate_limits.reset_at <= @now THEN excluded.reset_at ELSE app_rate_limits.reset_at END
RETURNING count, reset_at AS resetAt
`;

type Params = { key: string; now: number; resetAt: number };
type Row = { count: number; resetAt: number };

const prepare = () => sqlite.prepare<Params, Row>(UPSERT_SQL);
let statement: ReturnType<typeof prepare> | undefined;

export type RateLimitResult = { allowed: boolean; retryAfterSec: number };

export function consumeRateLimit(
  key: string,
  max: number,
  windowMs: number,
  now: number = Date.now(),
): RateLimitResult {
  statement ??= prepare();
  const row = statement.get({ key, now, resetAt: now + windowMs });
  if (!row) throw new Error("rate limit store returned no row");
  return {
    allowed: row.count <= max,
    retryAfterSec: Math.max(1, Math.ceil((row.resetAt - now) / 1000)),
  };
}
