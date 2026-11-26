---
tags: [issues, index]
---

# Журнал проблем (`04-Issues`)

1. Создай `ISSUE-001-суть.md` → вставь шаблон [[Template-Issue]] (`Ctrl+P` → Вставить шаблон).
2. Добавь ссылку в [[00-STATUS]].
3. Отдай в Dust `@dev-advisor`:
   ```powershell
   Get-Content docs/vault/00-STATUS.md, docs/vault/04-Issues/ISSUE-001-суть.md | Set-Clipboard
   ```
4. После фикса поставь `status: solved` и перенеси короткую строку в [[Troubleshooting]].

## Тикеты
- [[Issue-Example-Template|Пример тикета]]
