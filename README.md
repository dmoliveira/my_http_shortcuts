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

## 🤝 Contributing

Use feature branches and open PRs with testing notes. Keep changes small and focused.

## 📄 License

MIT — see `LICENSE`.
