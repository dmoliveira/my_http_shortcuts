# 📚 Documentation Index

## Start Here

- `docs/getting-started.md` - install, load in Chrome, and run your first shortcut
- `docs/runbooks/extension-smoke-test.md` - manual extension testing checklist
- `docs/runbooks/debugging.md` - troubleshooting and diagnostics workflow

## Release & Operations

- `docs/runbooks/release.md` - release flow and checks
- `docs/runbooks/wiki-bootstrap.md` - one-time wiki initialization steps for sync automation
- `make wiki-status` - quick pre-check to confirm wiki backend availability
- `make wiki-status-json` - machine-readable wiki backend status for automation
- `make wiki-watch` - poll for wiki bootstrap and auto-dispatch wiki sync when ready
- `make wiki-verify` - verify expected generated wiki pages are present
- `make wiki-complete` - watch, dispatch wiki sync, and verify pages in one command
- `make wiki-pulse` - run doctor/reminder/monitor cycle for pending bootstrap (with monitor cooldown)
- `make wiki-autopilot` - attempt full completion and fall back to wiki pulse when blocked
- `docs/runbooks/dependency-gate.md` - dependency policy unblock path
- `docs/runbooks/validation-blocker-log.md` - blocker evidence log
- `docs/release-notes-draft.md` - generated release notes draft

## Plans & Specs

- `docs/plan/chrome-extension-plan.md` - roadmap and implementation tracking
- `docs/specs/execution-contract.md` - runtime behavior contract

## Security & Validation Artifacts

- `docs/dependency-security-report.md` - dependency metadata report
- `docs/dependency-unblock-packet.md` - command evidence bundle for approval workflows

## Support

- `docs/support-the-project.md` - donation options and sustainability note
