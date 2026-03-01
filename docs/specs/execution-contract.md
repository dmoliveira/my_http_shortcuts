# 📘 Execution Contract (MVP)

## Input

- `shortcutId` (required)
- execution context:
  - `input` (string)
  - `pageUrl` (string)

## Pipeline

1. resolve shortcut by id
2. validate shortcut schema
3. run pre-script (optional)
4. resolve templates in URL/body
5. execute request with timeout
6. run post-script (optional)
7. persist sanitized history
8. return `ExecutionResult`

## Failure Behavior

- fail fast on invalid configuration
- return typed error message to UI
- always log structured error with `correlationId`

## Security Notes

- redact secret-like fields in logs and history
- never persist raw access tokens in debug output
