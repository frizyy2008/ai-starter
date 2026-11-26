---
tags: [plan, day-3]
status: todo
---

# День 3. Интерфейс, Playwright, аудит в Dust и Pull Request (4–5 ч)

[[Day-2-DB-Auth-API|← День 2]] · [[00-STATUS|Статус]] · [[00-START-HERE|Дашборд]]

## Задача 7. Интерфейс заметок и главная страница (1–1,5 ч)
- [ ] **7.1.** Создать `src/app/notes/note-form.tsx`, `src/app/notes/sign-out-button.tsx`, `src/app/notes/page.tsx` (сессия внутри `<Suspense>`, без `dangerouslySetInnerHTML`).
- [ ] **7.2.** В `src/app/page.tsx` поставить `redirect("/notes")`.
- [ ] **7.3.** Улучшить вёрстку через Copilot Free (отступы, `dark:`, `focus-visible`, `360px`; не трогать `fetch`, `aria`, тексты кнопок и подписей).
- [ ] **✅ Проверка 7:** `/` → `/login` или `/notes`; создание заметки + `F5`; пустая форма → ошибки; `Tab` фокус; `360px`; перезапуск сервера.

## Задача 8. Playwright E2E и CI (1 ч)
- [ ] **8.1.** Создать `playwright.config.ts` и `tests/e2e/notes.spec.ts`.
- [ ] **8.2.** Остановить `npm run dev`, прогнать `npm run test:e2e` (при падении: `npx playwright show-report` → Dust `@dev-advisor` → Antigravity).
- [ ] **8.3.** Добавить джоб `e2e` (`needs: quality`) в `.github/workflows/ci.yml`.
- [ ] **8.4.** Коммит и пуш:
  ```powershell
  git add src tests playwright.config.ts .github
  git commit -m "feat(notes): UI and e2e tests"
  git push
  ```

## Задача 9. Кросс-модельный аудит в Dust (1 ч)
- [ ] **9.1.** Собрать diff (глазами проверить отсутствие секретов):
  ```powershell
  git diff main --stat
  git diff main -- src scripts next.config.ts tests ':!src/db/auth-schema.ts' | Set-Clipboard
  ```
- [ ] **9.2.** Проход 1: Dust `@sec-auditor` (флагман Claude) → таблица находок.
- [ ] **9.3.** Проход 2: второе мнение на флагмане OpenAI Reasoning по спорным находкам и `src/server/*`.
- [ ] **9.4.** Подтверждённые Critical/High закрыть через Antigravity (падающий тест → фикс → зелёный тест). Medium/Low записать в [[00-STATUS]].

## Задача 10. Финальная проверка и Pull Request (45 мин)
- [ ] **10.1.** Автопроверки:
  ```powershell
  npm run quality; npm run build; npm run test:e2e
  npm audit --omit=dev --audit-level=high
  gitleaks git --redact --no-banner
  ```
- [ ] **10.2.** Заголовки вручную: `npx next start -p 3200` → во втором окне `curl.exe -sI http://localhost:3200/login` (есть `nosniff`, `Referrer-Policy`, `DENY`, `CSP`; нет `X-Powered-By`).
- [ ] **10.3.** Чистота кода (PowerShell 5.1):
  ```powershell
  git status --short
  Get-ChildItem -Path src -Recurse -Include *.ts,*.tsx | Select-String -Pattern "TODO|FIXME|console\.log|dangerouslySetInnerHTML"
  ```
- [ ] **10.4.** Обновить [[00-STATUS]], закоммитить и запушить `docs`.
- [ ] **10.5.** PR `feat/auth-notes → main` на GitHub → дождаться зелёных `quality`, `secrets`, `e2e` → Merge → `git switch main && git pull && git branch -d feat/auth-notes`.
