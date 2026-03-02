# 📚 Documentation Index

## Start Here

- [Getting Started](getting-started.md) - install, load in Chrome, and run your first shortcut
- [Extension Smoke Test](runbooks/extension-smoke-test.md) - manual extension testing checklist
- [Debugging](runbooks/debugging.md) - troubleshooting and diagnostics workflow
- `make refresh-extension` - rebuild extension and open `chrome://extensions` for one-click reload

## Release & Operations

- [Release Runbook](runbooks/release.md) - release flow and checks
- [Wiki Bootstrap](runbooks/wiki-bootstrap.md) - one-time wiki initialization steps for sync automation
- `make wiki-status` - quick pre-check to confirm wiki backend availability
- `make wiki-status-json` - machine-readable wiki backend status for automation
- `make wiki-watch` - poll for wiki bootstrap and auto-dispatch wiki sync when ready
- `make wiki-verify` - verify expected generated wiki pages are present
- `make wiki-complete` - watch, dispatch wiki sync, and verify pages in one command
- `make wiki-pulse` - run doctor/reminder/monitor cycle for pending bootstrap (with monitor cooldown)
- `make wiki-autopilot` - run `wiki-status --json` precheck, skip watch when uninitialized, then pulse fallback
- [Dependency Gate](runbooks/dependency-gate.md) - dependency policy unblock path
- [Validation Blocker Log](runbooks/validation-blocker-log.md) - blocker evidence log
- [Release Notes Draft](release-notes-draft.md) - generated release notes draft

## Plans & Specs

- [Chrome Extension Plan](plan/chrome-extension-plan.md) - roadmap and implementation tracking
- [Execution Contract](specs/execution-contract.md) - runtime behavior contract

## Security & Validation Artifacts

- [Dependency Security Report](dependency-security-report.md) - dependency metadata report
- [Dependency Unblock Packet](dependency-unblock-packet.md) - command evidence bundle for approval workflows

## Support

- [Support This Project](support-the-project.md) - donation options, non-monetary support ideas, and sustainability notes
