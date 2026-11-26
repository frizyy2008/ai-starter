---
tags: [troubleshooting, windows]
---

# Шпаргалка по сбоям

| Симптом | Решение |
| :--- | :--- |
| `node` не найден | Перезапустить PowerShell / перезагрузить Windows |
| `node-gyp` / C++ у `better-sqlite3` | `npm install better-sqlite3@latest` |
| `ERESOLVE` про `@types/node` | Добавить `@types/node@26` в `npm install -D` |
| Некорректные env-переменные | Секрет ≥ 32 символов, `.env.local` сохранён в `-Encoding ascii` (без BOM) |
| Better Auth CLI не видит env / `@/` | Загрузить `.env.local` в PowerShell; в `src/db` и `src/lib` только `../` |
| Ошибка `Suspense` / uncached data | Обернуть чтение сессии в `<Suspense>` |
| `tsc` в CI ругается на типы роутов | `typecheck`: `next typegen && tsc --noEmit` |
| E2E получает `429` | В `e2e:server` должен быть `reset-e2e-db.mts` и `-p 3100` |
| `getByRole('alert')` нашёл 2 элемента | Фильтровать `.filter({ hasText: "..." })` |
| Ошибка хука `pre-commit` (`\r` / права) | `.gitattributes` с `eol=lf`, хук в `-Encoding ascii`, `git update-index --chmod=+x .githooks/pre-commit` |
| `Select-String -Path src\**\*.ts` пустой | В PowerShell 5.1: `Get-ChildItem -Path src -Recurse -Include *.ts,*.tsx \| Select-String ...` |
| Секрет попал в коммит | Перегенерировать `BETTER_AUTH_SECRET` и переписать историю до `push` |
