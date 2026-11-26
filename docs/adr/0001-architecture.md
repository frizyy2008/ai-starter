# ADR 0001: Базовая архитектура ai-starter
- Один Node-хост + SQLite WAL (`synchronous = FULL`, `foreign_keys = ON`, `busy_timeout = 5000`).
- Better Auth (email + пароль >= 12), сессии в БД через Drizzle, без `nextCookies`.
- Rate limiting: таблица `app_rate_limits` с атомарным `UPSERT` (fail-closed); Better Auth `storage: "database"`.
- CSRF: проверка `Origin === BETTER_AUTH_URL` + `application/json`.
- Security headers в `next.config.ts`; HSTS и `advanced.ipAddress` настраиваются на HTTPS-прокси при деплое.
