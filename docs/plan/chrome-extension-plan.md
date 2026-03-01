# 🧭 Chrome Shortcuts Extension Plan (Lean, Robust, Public)

## 🎯 Goal

Build a lean Chrome extension that lets users run configured shortcuts from the browser:

- click extension action
- choose shortcut
- preprocess input (optional)
- send request to configured URL
- process/format response
- show result quickly and clearly

Project targets:

- public repository
- MIT license
- strong debugging and logs
- fail-fast behavior
- incremental delivery in small commits

---

## ✅ Product Scope

### MVP (v0.1)

1. Shortcut CRUD in Options page
2. Trigger from popup
3. Variable templates (`{{var}}`) with prompt support
4. Request execution in background service worker
5. Optional pre-script and post-script hooks
6. Response panel (status, headers, body preview)
7. Local execution history (bounded)
8. JSON import/export

### Next (v0.2+)

1. Context-menu trigger with selected text/page URL
2. Retry/backoff policy per shortcut
3. Redaction rules for history/logs
4. cURL import
5. Chained shortcuts

### Non-goals for MVP

1. Full feature parity with any existing app
2. Multi-browser packaging at launch
3. Remote backend sync

---

## 🧱 Engineering Principles

1. **Lean code first:** small modules, minimal dependencies, explicit interfaces.
2. **Fail fast:** validate at boundaries, return typed errors early.
3. **Debuggable by default:** structured logs with correlation ID per execution.
4. **Robustness:** deterministic execution pipeline and safe fallback paths.
5. **Future proofing:** versioned schema, stable domain models, migration hooks.

---

## 🗂️ File & Module Layout

```text
src/
  background/
    worker.ts
    executor.ts
    message-router.ts
  popup/
    popup.ts
    popup-view.ts
  options/
    options.ts
    shortcut-editor.ts
  domain/
    shortcut.ts
    execution.ts
    history.ts
  utils/
    log/
      logger.ts
      redact.ts
    io/
      storage.ts
      serialization.ts
    net/
      request-builder.ts
      timeout.ts
    validation/
      schema.ts
      errors.ts
  config/
    constants.ts
    defaults.ts
  scripts/
    sandbox.ts
    hooks.ts
  types/
    api.ts
    storage.ts
```

Module rules:

- if a utility area grows beyond 2 meaningful functions, split into its own file
- no cross-layer imports that bypass domain boundaries
- constants live in `config/constants.ts`
- default values live in `config/defaults.ts`

---

## 🧩 Design Rules

### Functions & docstrings

- every function gets a short docstring explaining purpose (1-2 lines)
- docstrings explain **why/purpose**, not obvious implementation detail

### OOP vs functional

- default to functional modules
- use small classes only when stateful orchestration is clearer (e.g., `ExecutionOrchestrator`)
- avoid deep inheritance; prefer composition

### Config strategy

- runtime extension settings in `chrome.storage`
- repository-level tooling config in YAML when useful (e.g., CI, release config)
- no sensitive secrets in repo configs

---

## 🔐 Security, Privacy, Reliability

1. Minimal permissions first (`storage`, `activeTab`, `contextMenus`, selective `host_permissions`).
2. Secrets masked in UI and redacted in logs/history.
3. Scripts constrained to explicit hook contracts (input/output shape validated).
4. All failures produce actionable user message + structured debug log entry.
5. Timeouts and abort signals enforced on all network requests.

---

## 🧪 Testing & Quality Gates

### Test layers

- unit: resolver, request builder, script adapters, redaction
- integration: popup↔background messages, storage persistence, import/export
- e2e smoke (Playwright): create shortcut, run shortcut, verify result/history

### Minimum gate per PR

1. lint pass
2. typecheck pass
3. unit+integration pass
4. smoke e2e for release branches

---

## 📦 DevEx, Makefile, Versioning, Releases

### Make targets (required)

- `make help` (shows project name/version and commands)
- `make install`
- `make lint`
- `make test`
- `make typecheck`
- `make build`
- `make package`
- `make release-notes`

### Versioning

- SemVer tags: `vMAJOR.MINOR.PATCH`
- release branch checklist must pass before tag
- changelog categories: Adds / Changes / Fixes / Removals

### Release notes

- generated from merged PR titles + manual summary
- include risk notes and migration notes (if any)

---

## 📚 Documentation Requirements

### README

- emoji-enhanced overview
- badges: build, coverage (if available), license, latest release
- quickstart (install unpacked extension)
- architecture map
- security/privacy notes
- contributor workflow (branch + PR)

### Additional docs

- `docs/plan/` for roadmap and execution status
- `docs/specs/` for behavior contracts
- `docs/runbooks/` for debugging and incident triage

---

## 🗺️ Epics, Tasks, and Status

Legend: `todo` ⏳ `doing` 🔄 `done` ✅ `blocked` ⛔

### Epic E0 — Foundation

| ID | Task | Status | Done Criteria |
|---|---|---|---|
| E0-T1 | Scaffold MV3 + TypeScript extension | done ✅ | Extension runs unpacked |
| E0-T2 | Add MIT license + public README with badges | done ✅ | README + LICENSE merged |
| E0-T3 | Add Makefile + CI lint/test/typecheck/build | blocked ⛔ | Pending lockfile/dependency policy gate |

### Epic E1 — Shortcut Core

| ID | Task | Status | Done Criteria |
|---|---|---|---|
| E1-T1 | Shortcut schema + validation + migrations | done ✅ | Versioned schema tested |
| E1-T2 | Options CRUD UI | done ✅ | A11y checks pass |
| E1-T3 | Popup run flow | done ✅ | Trigger works end-to-end |

### Epic E2 — Variables & Hooks

| ID | Task | Status | Done Criteria |
|---|---|---|---|
| E2-T1 | Variable resolver engine | todo ⏳ | Unit tests cover edge cases |
| E2-T2 | Prompt components (text/secret/select) | todo ⏳ | Keyboard + focus verified |
| E2-T3 | Pre/post script hooks with guardrails | todo ⏳ | Typed errors + safe fallback |

### Epic E3 — Execution UX

| ID | Task | Status | Done Criteria |
|---|---|---|---|
| E3-T1 | Request executor + timeout + retry policy seed | done ✅ | Deterministic error map |
| E3-T2 | Response details panel | doing 🔄 | Handles large payload preview |
| E3-T3 | History and debug trace view | done ✅ | Redaction validated |

### Epic E4 — Portability & Release

| ID | Task | Status | Done Criteria |
|---|---|---|---|
| E4-T1 | JSON import/export | done ✅ | Round-trip validated |
| E4-T2 | Release process + tagging + notes | todo ⏳ | First public tag created |
| E4-T3 | Publish package workflow docs | todo ⏳ | Runbook complete |

---

## ✅ Definition of Done

Feature DoD:

1. Behavior implemented and test-covered
2. Brief docstring added for each new function
3. Debug logs and error paths included
4. Docs updated (`README` and relevant `docs/*`)
5. Security/privacy review done for changed surfaces

Release DoD:

1. MIT license present
2. Public README with badges complete
3. CI green on default branch
4. Tag created and release notes published

---

## 🔄 Ways of Working (WT Flow E2E)

For every task:

1. `git checkout main && git pull --rebase`
2. `git worktree add ../my_http_shortcuts-<task> -b my_http_shortcuts-<task>`
3. Implement in small commits (single concern per commit)
4. Run risk-based review/fix passes (1 low, 2 medium, 3-5 high)
5. Push branch and open PR with testing notes
6. Merge after checks pass
7. Remove worktree and resync local main

Parallelization rule:

- parallelize only disjoint tasks/files
- one writer per overlapping path
- use sub-agents for discovery/review/verification when beneficial

---

## 🧾 Decision Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-03-01 | TypeScript for core extension | Best fit for MV3 and speed-to-delivery |
| 2026-03-01 | Rust optional (future utility/WASM only) | Keep MVP complexity low |
| 2026-03-01 | Local-first storage model | Privacy and simpler operations |

---

## 📍 Current Status

- overall: implementation 🔄
- active epic: E3 Execution UX
- active task: E3-T2 Response details panel
- blockers: validation still blocked by local dependency installation policy gate
