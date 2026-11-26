---
tags: [security, invariants]
---

# Неприкосновенные правила безопасности

1. Env-переменные только в `src/lib/env.ts` + `.env.example`. `.env.local` никогда не коммитится и не шлётся в AI.
2. `userId` берётся только из сессии Better Auth (`HttpOnly` cookie); лишние поля в теле → `400` (`z.strictObject`).
3. Владелец проверяется в `WHERE`; чужая заметка и невалидный UUID → `404`.
4. Порядок проверок `POST /api/notes`: Origin (403) → Content-Type (415) → Сессия (401) → RateLimit (429 + `Retry-After`) → Размер/JSON (413/400) → Zod (400) → Запись (201 + `Cache-Control: private, no-store`, без `userId` в DTO).
5. Отказы `400/401/403/404/413/415/429` никогда не меняют БД.
6. Никакого `dangerouslySetInnerHTML`, никакого отключения тестов/линта/CI.
