import { describe, expect, it } from "vitest";
import { consumeRateLimit } from "@/server/rate-limit";

describe("consumeRateLimit", () => {
  it("пускает max запросов, блокирует следующий и сбрасывается после окна", () => {
    const key = `test:${Date.now()}`;
    const t0 = 1_000_000;
    expect(consumeRateLimit(key, 3, 60_000, t0).allowed).toBe(true);
    expect(consumeRateLimit(key, 3, 60_000, t0 + 1).allowed).toBe(true);
    expect(consumeRateLimit(key, 3, 60_000, t0 + 2).allowed).toBe(true);

    const blocked = consumeRateLimit(key, 3, 60_000, t0 + 3);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSec).toBe(60);

    expect(consumeRateLimit(key, 3, 60_000, t0 + 60_000).allowed).toBe(true);
  });

  it("разные ключи не влияют друг на друга", () => {
    const now = 5_000_000;
    expect(consumeRateLimit("a:1", 1, 60_000, now).allowed).toBe(true);
    expect(consumeRateLimit("b:1", 1, 60_000, now).allowed).toBe(true);
    expect(consumeRateLimit("a:1", 1, 60_000, now).allowed).toBe(false);
  });
});
