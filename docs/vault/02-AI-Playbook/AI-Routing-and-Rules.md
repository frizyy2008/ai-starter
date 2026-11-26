---
tags: [ai, rules, workflow]
---

# Регламент AI: «Мозг (Dust) → Руки (Antigravity / Copilot)»

| Задача | Инструмент |
| :--- | :--- |
| Диагностика ошибок, логов CI, Playwright trace, ревью архитектуры | **Dust (`@dev-advisor`)** |
| Точечные локальные патчи, подгонка под версии, запуск проверок | **Antigravity (Google AI Pro)** |
| Аудит безопасности (День 2 мини + День 3 кросс-модельный) | **Dust (`@sec-auditor`)** |
| Вёрстка, Tailwind, мелкие правки в одном файле | **Copilot Free в VS Code** |

## Запреты
- Не запускать два пишущих агента одновременно.
- Не использовать субагентов и встроенный браузер Antigravity.
- Никогда не отправлять `.env.local`, секреты, токены, `.sqlite` ни в один чат.
- Сначала вставлять код из плана, потом подгонять под версии.

## Алгоритм при затыке (3 минуты)
1. Создай заметку `04-Issues/ISSUE-XXX.md` из [[Template-Issue]].
2. Вставь шаг, команду и 20–50 строк ошибки (без секретов). Поставь ссылку в [[00-STATUS]].
3. Скопируй в буфер: `Get-Content docs/vault/00-STATUS.md, docs/vault/04-Issues/ISSUE-XXX.md | Set-Clipboard`
4. Отдай в **Dust `@dev-advisor`** → получи диагноз → примени через **Antigravity** ([[Prompts-Library]]).
5. Запиши решение в [[Troubleshooting]], а если менял план — в [[06-Changelog-Plan]].
