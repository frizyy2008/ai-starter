---
tags: [issue, example]
status: solved
day: 2
step: "Задача 5, Шаг 5.2"
---

# ISSUE-000 (Пример): Better Auth CLI не видит `DATABASE_PATH`

- **Команда:** `npx auth@latest generate --config src/lib/auth.ts --output src/db/auth-schema.ts --yes`
- **Ошибка:** `DATABASE_PATH не задан`
- **Причина:** Новое окно PowerShell без загруженного `.env.local`.
- **Решение:** Выполнить загрузку `.env.local` в текущей сессии и повторить команду.
