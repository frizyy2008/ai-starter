---
tags: [plan, day-2]
status: todo
---

# День 2. База данных, Better Auth, API заметок и ранний аудит (5–6 ч)

[[Day-1-Setup-CI|← День 1]] · [[00-STATUS|Статус]] · [[Day-3-UI-E2E-Audit|День 3 →]]

- [ ] Создать ветку: `git switch -c feat/auth-notes`

> **Порядок:** сначала схема Better Auth (таблица `user`), потом `notes` со ссылкой на `user.id`. В `src/db` и `src/lib` только относительные импорты (`../`), не `@/`.

## Задача 5. SQLite + Drizzle + Better Auth (2–2,5 ч)
- [ ] **5.1.** Создать `src/db/index.ts` (WAL, `synchronous=FULL`, `foreign_keys=ON`, `busy_timeout=5000`), `src/db/auth-schema.ts` (`export {};`), `src/db/schema.ts` (v1), `src/lib/auth.ts` (`minPasswordLength: 12`, `rateLimit.storage="database"`, без `nextCookies`), `src/app/api/auth/[...all]/route.ts`.
- [ ] **5.2.** Подгрузить `.env.local` и сгенерировать схему Better Auth (не запускать `auth migrate`!):
  ```powershell
  Get-Content .env.local | Where-Object { $_ -match '^[A-Z_]+=' } | ForEach-Object { $k, $v = $_ -split '=', 2; [Environment]::SetEnvironmentVariable($k, $v, 'Process') }
  npx auth@latest generate --config src/lib/auth.ts --output src/db/auth-schema.ts --yes
  ```
- [ ] **5.3.** Заменить `src/db/schema.ts` полной версией (добавить `notes` с `onDelete: "cascade"`, индексом и `CHECK`).
- [ ] **5.4.** Создать `drizzle.config.ts`, `scripts/reset-e2e-db.mts`, `scripts/migrate.mts`.
- [ ] **5.5.** Сгенерировать, накатить и проверить миграции:
  ```powershell
  npm run db:generate
  npm run db:migrate
  node -e "const D=require('better-sqlite3'); const d=new D('./data/app.sqlite',{readonly:true}); console.log(d.prepare(\"SELECT name FROM sqlite_master WHERE type='table' ORDER BY name\").all().map(r=>r.name))"
  ```
- [ ] **5.6.** Создать `src/lib/auth-client.ts` и `src/app/login/page.tsx`.
- [ ] **5.7.** Прогнать `npm run quality` и `npm run build` (при сложных ошибках: тикет в `04-Issues/` → Dust `@dev-advisor` → патч в Antigravity).
- [ ] **✅ Проверка 5:** регистрация на `/login` (пароль ≥ 12) → cookie `better-auth.session_token` имеет `HttpOnly` → перезапуск сервера → вход работает. Коммит:
  ```powershell
  git add src drizzle drizzle.config.ts scripts
  git commit -m "feat(auth): sqlite + drizzle + better-auth"
  ```

## Задача 6. API заметок, тесты и ранний мини-аудит в Dust (2,5–3 ч)
- [ ] **6.1.** Создать `src/features/notes/schema.ts`, `src/server/session.ts`, `src/server/http.ts`, `src/server/rate-limit.ts`, `src/server/notes/service.ts`, `src/app/api/notes/route.ts` (Origin 403 → Content-Type 415 → Auth 401 → RateLimit 429 → Body 413/400 → Zod 400 → 201), `src/app/api/notes/[id]/route.ts`.
- [ ] **6.2.** Создать `tests/integration/helpers.ts`, `tests/integration/notes-api.test.ts`, `tests/integration/rate-limit.test.ts`.
- [ ] **6.3.** Прогнать `npm run quality`.
- [ ] **6.4.** Ранний мини-аудит серверного API через Dust `@sec-auditor` (15 мин):
  ```powershell
  git diff main -- src/server src/app/api src/features/notes | Set-Clipboard
  ```
- [ ] **✅ Проверка 6:** `npm run quality` зелёный, обновить [[00-STATUS]], закоммитить и запушить:
  ```powershell
  git add src tests docs
  git commit -m "feat(notes): secure notes API with rate limit and integration tests"
  git push -u origin feat/auth-notes
  ```
