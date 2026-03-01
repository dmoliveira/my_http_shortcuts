# ⚡ My HTTP Shortcuts

[![CI](https://github.com/dmoliveira/my_http_shortcuts/actions/workflows/ci.yml/badge.svg)](https://github.com/dmoliveira/my_http_shortcuts/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Release](https://img.shields.io/github/v/release/dmoliveira/my_http_shortcuts)](https://github.com/dmoliveira/my_http_shortcuts/releases)

A lean Chrome extension to run configurable HTTP shortcuts from the browser, with input preprocessing and response postprocessing.

## ✨ Highlights

- 🧩 Shortcut-based request execution
- 🧠 Variable templates with prompts (`{{name}}`)
- 🔁 Optional pre/post script hooks
- 🧪 Test-first utility modules
- 🛡️ Fail-fast validation and robust error mapping
- 🧭 Structured logs for debugging
- 📦 JSON import/export with schema migration support
- ✂️ Selected text context capture from active tab
- 🕘 Popup history preview with one-click clear
- ✅ Fail-fast JSON/header validation in options workflows
- 🧾 Options debug history list with correlation IDs
- 📋 Structured popup response details (status, headers, body, duration)
- 🔄 Timeout/network retry seed with deterministic error mapping
- 📎 One-click result copy and storage-safe history body truncation
- 🎯 Configurable default shortcut for context-menu runs
- 🟢 Popup run status feedback and busy-state controls
- 🧰 Runtime message envelope validation for safer extension messaging
- 📋 Clipboard copy now reports success/failure clearly
- 🧯 Popup actions use centralized error handling for clearer diagnostics
- 🛡️ Background listener rejects invalid runtime message payloads early
- ♻️ Default context shortcut setting self-heals when referenced shortcut is removed
- 🧾 History entries record execution source (`popup` / `context_menu`)

## 🚀 Quickstart

1. Install dependencies:

```bash
make install
```

2. Build extension:

```bash
make build
```

3. Load unpacked extension:
- open `chrome://extensions`
- enable Developer mode
- click "Load unpacked"
- select `dist/`

## 🏗️ Architecture

- `src/background`: orchestration and execution pipeline
- `src/options`: shortcut management UI
- `src/popup`: run shortcuts quickly
- `src/domain`: core models and template resolver
- `src/utils`: logging, io, networking, validation helpers
- `src/config`: constants and defaults

## 🧪 Quality Commands

```bash
make lint
make typecheck
make test
make build
```

## 🔐 Security & Privacy

- data is local-first (`chrome.storage.local`)
- logs/history are sanitized
- network requests are timeout-bounded
- script hooks are explicitly scoped and validated

## 📦 Releases

- release process guide: `docs/runbooks/release.md`
- draft notes command: `make release-notes`
- draft notes file: `make release-notes-file` -> `docs/release-notes-draft.md`
- metadata check command: `make release-check`

## 🤝 Contributing

Use feature branches and open PRs with testing notes. Keep changes small and focused.

## 📄 License

MIT — see `LICENSE`.
