# 📘 Execution Contract (MVP)

## Input

- `shortcutId` (required)
- execution context:
  - `input` (string)
  - `pageUrl` (string)

## Context Menu Trigger

- when triggered from context menu, extension uses configured `defaultContextShortcutId`
- if configured shortcut is missing, fallback is first available shortcut
- if no shortcuts exist, no request is executed
- invalid saved default id is auto-healed to `null` during migration/update

## Pipeline

1. resolve shortcut by id
2. validate shortcut schema
3. run pre-script (optional)
4. resolve templates in URL/body
5. execute request with timeout
6. run post-script (optional)
7. persist sanitized history with execution source metadata (`popup` or `context_menu`)
8. return `ExecutionResult`

## Failure Behavior

- fail fast on invalid configuration
- return typed error message to UI
- always log structured error with `correlationId`

## Security Notes

- redact secret-like fields in logs and history
- never persist raw access tokens in debug output

## Portability Notes

- exported state is JSON with current schema version
- imported state is migrated to the current schema
- malformed JSON import must fail fast and return `null`
