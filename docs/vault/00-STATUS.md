---
tags: [status, handoff, ai-context]
current_day: 1
current_task: "Задача 1. Подготовка Windows и инструментов"
status: in-progress
updated: 2026-11-26
---

# Текущий статус `ai-starter` (Single Source of Truth)

> **Для AI:** читай этот файл первым. Не меняй архитектуру без явного запроса.

## 1. Где я сейчас
- **День:** [[Day-1-Setup-CI|День 1]]
- **Задача / шаг:** Задача 1, Шаг 1.1
- **Ветка Git:** `main` *(в День 2: `feat/auth-notes`)*
- **Последний стабильный коммит:** *(пока нет)*
- **Следующее действие:** Установить Node 26 LTS, Git, VS Code, Gitleaks и проверить версии.

## 2. Активные проблемы / блокеры
- *Нет активных блокеров.* *(При проблеме: создай `04-Issues/ISSUE-001.md` из [[Template-Issue]] и добавь ссылку сюда.)*

## 3. Установленные версии (заполнить в День 1)
- OS: Windows 10/11 (PowerShell)
- Node.js: `v26.x` | Next.js: `16.x` (`cacheComponents: true`)
- better-auth: `1.x` | drizzle-orm / drizzle-kit: `0.45.x / 0.31.x`
- better-sqlite3: `13.x` | zod: `4.x` | vitest / playwright: `5.x / 1.65.x`

## 4. Последние прогнанные проверки (только факты)
- [ ] `npm run typecheck` — не запускалось
- [ ] `npm run lint` — не запускалось
- [ ] `npm run test` — не запускалось
- [ ] `npm run build` — не запускалось
- [ ] `npm run test:e2e` — не запускалось
- [ ] `gitleaks` — не запускалось
- [ ] GitHub Actions CI — не запускалось

## 5. Отклонения от плана и решения
- База: [[ADR-0001-Architecture]], [[Security-Invariants]], [[06-Changelog-Plan]].
- Главная `/` перенаправляет на `/notes`.

## 6. Известные риски (после аудита)
- *(Заполнить после мини-аудита в День 2 и финального аудита в День 3)*
