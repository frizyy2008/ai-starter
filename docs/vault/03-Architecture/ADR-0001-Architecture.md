---
tags: [architecture, adr]
status: accepted
date: 2026-11-26
---

# ADR 0001: Базовая архитектура `ai-starter`

1. **БД:** один постоянный Node-хост + SQLite WAL (`synchronous=FULL`, `foreign_keys=ON`, `busy_timeout=5000`). Не для serverless.
2. **Auth:** Better Auth (email+пароль ≥ 12), сессии в БД через Drizzle, без `nextCookies`.
3. **Rate limit:** таблица `app_rate_limits` с атомарным `UPSERT` (fail-closed); в Better Auth `storage: "database"` (в `test` выключен).
4. **CSRF:** проверка `Origin === BETTER_AUTH_URL` + `Content-Type: application/json`.
5. **Заголовки:** `nosniff`, `Referrer-Policy`, `X-Frame-Options: DENY`, базовая CSP (`frame-ancestors 'none'`), `Permissions-Policy`, `poweredByHeader: false`.
6. **Cache Components:** чтение сессии/cookies/headers только внутри `<Suspense>`.

## На будущий деплой (после MVP)
- [ ] `HSTS`, `advanced.ipAddress` и лимит тела запроса на HTTPS-прокси.
- [ ] Ежедневные бэкапы SQLite + очистка старых строк `app_rate_limits`.
