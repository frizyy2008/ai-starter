---
tags: [plan, day-1]
status: todo
---

# День 1. Среда, проект, инженерный каркас, CI и Dust (4–5 ч)

[[00-START-HERE|Дашборд]] · [[00-STATUS|Статус]] · [[Day-2-DB-Auth-API|День 2 →]]

## Задача 1. Подготовка Windows и инструментов (45 мин)
- [ ] **1.1.** Установить стек (старый Node.js предварительно удалить):
  ```powershell
  winget install OpenJS.NodeJS.LTS
  winget install Git.Git
  winget install Microsoft.VisualStudioCode
  winget install Gitleaks.Gitleaks
  ```
- [ ] **1.2.** Перезапустить PowerShell и проверить:
  ```powershell
  node -v; npm -v; git --version; gitleaks version; code --version
  ```
- [ ] **1.3.** Antigravity (`antigravity.google`): войти Google AI Pro → **Settings → AI Credit Overages → Never** → проверить `/usage`.
- [ ] **1.4.** VS Code → расширение GitHub Copilot → убедиться, что план **Free**.
- [ ] **1.5.** Проверить доступ к `https://app.dust.tt/`.
- [ ] **1.6.** Настроить Git:
  ```powershell
  git config --global user.name "Твоё Имя"
  git config --global user.email "твой-email-на-github"
  git config --global init.defaultBranch main
  ```
- [ ] **✅ Проверка 1:** все 5 команд печатают версии, Node `v26.x`, `overages = Never`.

## Задача 2. Создать Next.js-проект и зависимости (40 мин)
- [ ] **2.1.** Создать проект (в `C:\dev`):
  ```powershell
  npx create-next-app@latest ai-starter --ts --tailwind --eslint --app --src-dir --import-alias "@/*"
  cd ai-starter
  ```
- [ ] **2.2.** Проверить `git log --oneline`, наличие `AGENTS.md` и `cacheComponents: true` в `next.config.ts`.
- [ ] **2.3.** Проверить `npm run dev` → `http://localhost:3000` → `Ctrl+C`.
- [ ] **2.4.** Поставить пакеты (`server-only` и `@types/node@26` обязательны):
  ```powershell
  npm install zod better-auth @better-auth/drizzle-adapter drizzle-orm better-sqlite3 server-only
  npm install -D drizzle-kit @types/better-sqlite3 vitest @playwright/test @types/node@26
  npx playwright install chromium
  ```
- [ ] **2.5.** Проверить `better-sqlite3` под Node 26 (при ошибке `node-gyp` → `npm install better-sqlite3@latest`):
  ```powershell
  node -e "const D=require('better-sqlite3'); const d=new D(':memory:'); console.log(d.prepare('select sqlite_version()').get())"
  ```
- [ ] **✅ Проверка 2:** стартовая страница открывалась, `node -e` вывел версию SQLite.

## Задача 3. Инженерный каркас и база знаний (90 мин)
- [ ] **3.1.** Создать папки:
  ```powershell
  New-Item -ItemType Directory -Force docs/ai, docs/adr, docs/vault, .githooks, scripts, tests/integration, tests/e2e, tests/stubs, src/db, src/lib, src/server/notes, src/features/notes
  ```
- [ ] **3.2.** Перенести файлы этого хранилища Obsidian в `docs/vault/` и открыть её как Vault.
- [ ] **3.3.** Зафиксировать Node 26 и `LF`:
  ```powershell
  Set-Content -Encoding ascii .nvmrc "26"
  Set-Content -Encoding ascii .gitattributes "* text=auto eol=lf"
  ```
- [ ] **3.4.** Дополнить `.gitignore`:
  ```gitignore
  !.env.example
  /data/
  *.sqlite
  *.sqlite-wal
  *.sqlite-shm
  /playwright-report/
  /test-results/
  /blob-report/
  docs/vault/.obsidian/
  ```
- [ ] **3.5.** Создать `.env.example` (`DATABASE_PATH=./data/app.sqlite`, `BETTER_AUTH_SECRET=replace-me`, `BETTER_AUTH_URL=http://localhost:3000`).
- [ ] **3.6.** Сгенерировать `.env.local` в ASCII и проверить ignore:
  ```powershell
  $secret = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  @"
  DATABASE_PATH=./data/app.sqlite
  BETTER_AUTH_SECRET=$secret
  BETTER_AUTH_URL=http://localhost:3000
  "@ | Set-Content -Encoding ascii .env.local
  git check-ignore -v .env.local
  ```
- [ ] **3.7.** Создать `src/lib/env.ts` (Zod, без `server-only`), обновить `next.config.ts` (сохранить `cacheComponents`/`partialPrefetching`/`turbopack`, добавить `poweredByHeader: false` и заголовки безопасности), создать файлы Vitest (`tests/stubs/server-only.ts`, `tests/setup-env.ts`, `vitest.config.mts`, `tests/sanity.test.ts`).
- [ ] **3.8.** Обновить `scripts` и `engines` (`"node": ">=26"`) в `package.json` — проверь порт `-p 3100` в `e2e:server`:
  ```json
  "e2e:server": "node scripts/reset-e2e-db.mts && npm run db:migrate && next build && next start -p 3100",
  "typecheck": "next typegen && tsc --noEmit",
  "quality": "npm run typecheck && npm run lint && npm run test"
  ```
- [ ] **3.9.** Включить хук Gitleaks:
  ```powershell
  Set-Content -Encoding ascii -NoNewline .githooks/pre-commit "#!/bin/sh`ngitleaks git --pre-commit --staged --redact --no-banner`n"
  git config core.hooksPath .githooks
  ```
- [ ] **3.10.** Дополнить `AGENTS.md` (правила проекта + чтение `docs/vault/00-STATUS.md` и `docs/vault/04-Issues/`).
- [ ] **3.11.** Создать ассистентов `@dev-advisor` и `@sec-auditor` в Dust по [[Dust-Assistants]].
- [ ] **3.12.** Проверить каркас через Antigravity (добавить `.next`, `drizzle`, `playwright-report`, `test-results` в `ignores` `eslint.config.mjs`).
- [ ] **✅ Проверка 3:** `npm run quality` и `npm run build` зелёные; в `git status --short` нет `.env.local`, `.sqlite` и `.obsidian/`.

## Задача 4. GitHub, первый CI и подключение Dust (45 мин)
- [ ] **4.1.** Создать `.github/workflows/ci.yml` (джобы `quality` + `secrets`).
- [ ] **4.2.** Создать пустой Private репозиторий `ai-starter` на GitHub.
- [ ] **4.3.** Первый коммит и пуш:
  ```powershell
  git add .
  git status --short
  gitleaks git --pre-commit --staged --redact --no-banner
  git commit -m "chore: engineering baseline"
  git branch -M main
  git remote add origin <URL_РЕПОЗИТОРИЯ>
  git push -u origin main
  ```
- [ ] **4.4.** Дождаться зелёных `quality` и `secrets` в GitHub Actions.
- [ ] **4.5.** Подключить репозиторий `ai-starter` в Dust как Data Source для `@dev-advisor`.
- [ ] **4.6.** Обновить [[00-STATUS]].
