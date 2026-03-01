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
8. Use popup errors-only history filter for fast failure triage.
9. Use popup max-entries limiter to inspect a tighter failure window.
10. Use popup reset-history-view button to restore default triage controls.
11. Check options history stats line for popup/context source split drift.
12. Use avg/max duration stats to detect latency regressions.
13. Use success-rate percentage to detect reliability regressions.
14. Use options history source filter to isolate popup vs context-menu issues.
15. Use options history result filter to isolate success-only or error-only runs.
16. Use options history search filter to isolate one shortcut by name.
17. Use options history sort mode to inspect latency outliers quickly.
18. Use options max-items control to focus on the latest or smallest slice.
19. Use min-duration filter to isolate slow executions above a threshold.
20. Use reset-filters button to restore default debug view quickly.
21. If numeric filters look broken, reset to defaults and re-apply values.

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
