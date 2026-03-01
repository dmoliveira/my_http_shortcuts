# 🚀 Getting Started

This is the fastest way to install and test **My HTTP Shortcuts** locally.

## 1) Build the extension

From repo root:

```bash
make install
make build
```

## 2) Load in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select `dist/`

## 3) Basic usage

1. Open extension **Options**
2. Create a shortcut (name, method, URL, optional headers/body/scripts)
3. Select some text on a webpage
4. Open popup and run the shortcut
5. Inspect response, copy result, and review history

## 4) Context menu usage

1. In options, set a **default context shortcut**
2. Select text on any page
3. Right-click and run from context menu

## 5) Validate quality locally

```bash
make validate-local
```

## 6) Run manual smoke checks

Use `docs/runbooks/extension-smoke-test.md` for a complete end-to-end test checklist.
