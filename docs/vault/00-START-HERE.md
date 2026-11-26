---
tags: [dashboard, obsidian, ai-starter]
updated: 2026-11-26
---

# База знаний `ai-starter` (Obsidian + AI)

Единый источник правды для тебя и всех нейронок (**Dust**, **Antigravity**, **Copilot Free**, **Gemini**).

## Навигация
- **Главный файл для нейронок:** [[00-STATUS]] ← *обновляй перед каждым вопросом к AI*
- **План на 3 дня:**
  - [[Day-1-Setup-CI|День 1 — Среда, проект, каркас, CI]]
  - [[Day-2-DB-Auth-API|День 2 — База данных, Better Auth, API заметок]]
  - [[Day-3-UI-E2E-Audit|День 3 — Интерфейс, Playwright, аудит в Dust, PR]]
- **Работа с AI:**
  - [[AI-Routing-and-Rules|Кто что делает и запреты]]
  - [[Dust-Assistants|Настройка @dev-advisor и @sec-auditor в Dust]]
  - [[Prompts-Library|Готовые промпты]]
- **Архитектура и справочник:**
  - [[ADR-0001-Architecture|ADR 0001 — Базовая архитектура]]
  - [[Security-Invariants|Неприкосновенные правила безопасности]]
  - [[Troubleshooting|Шпаргалка по сбоям]]
- **Проблемы и правки плана:**
  - [[README-Issues|Журнал проблем (04-Issues)]]
  - [[06-Changelog-Plan|История изменений плана]]

## Подключение ко всем нейронкам
1. **Obsidian:** Настройки → Встроенные плагины → **Шаблоны** → папка шаблонов `05-Templates`.
2. **Репозиторий (после Задачи 2):** перенеси эту папку в `ai-starter/docs/vault/` и добавь в `.gitignore` строку `docs/vault/.obsidian/`.
3. **Antigravity / Copilot:** добавь в `AGENTS.md`: `Before starting any task, read docs/vault/00-STATUS.md and active issues in docs/vault/04-Issues/. Update docs/vault/00-STATUS.md after finishing.`
4. **Dust (`app.dust.tt`):** подключи приватный GitHub-репозиторий (`docs/vault` + `AGENTS.md`) к ассистентам `@dev-advisor` и `@sec-auditor`.
5. **Мгновенный сброс контекста в любой чат (PowerShell):**
   ```powershell
   Get-Content docs/vault/00-STATUS.md, docs/vault/04-Issues/ISSUE-001.md | Set-Clipboard
   ```
