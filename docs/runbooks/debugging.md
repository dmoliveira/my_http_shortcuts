# 🧪 Debugging Runbook

## Goal

Provide a fast path to diagnose shortcut execution failures.

## Steps

1. Open extension service worker logs from `chrome://extensions`.
2. Search for `correlationId` in structured log lines.
3. Confirm request URL/method and timeout behavior.
4. Validate script hook output (pre/post) and error messages.
5. Check sanitized history entry in options/popup response output.
6. Check popup status messages (run started/completed/failed/copy state).
7. Check popup history stats line for total/ok/error drift.
8. Check options history stats line for popup/context source split drift.
9. Use options history source filter to isolate popup vs context-menu issues.

## Common Failure Types

- invalid URL validation error
- fetch timeout / network failure
- script runtime error
- malformed headers JSON
- clipboard permission/write failure in popup
- invalid runtime message payload rejected by background listener

## Fast Checks

```bash
make lint
make typecheck
make test
make build
```
