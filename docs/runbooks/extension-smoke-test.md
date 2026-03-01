# Extension Smoke Test Checklist

Use this checklist after loading `dist/` in Chrome to validate end-user flows.

## Preconditions

1. Build extension artifacts:

```bash
make build
```

   Iteration shortcut after first load:

```bash
make refresh-extension
```

2. In Chrome, open `chrome://extensions`, enable Developer mode, and load unpacked `dist/`.

## Core Functional Checks

1. **Options: create shortcut**
   - Open extension options page.
   - Create a shortcut with method `POST`, URL using `{{tenant}}`, and body using `{{input}}`.
   - Save and confirm it appears in the shortcut list.

2. **Popup: run shortcut with prompts**
   - Select text on any webpage.
   - Open popup and run the created shortcut.
   - Confirm popup prompts for `tenant`, and result renders with status/body.

   - Confirm the extension icon appears as a teal tile with a yellow bolt in toolbar and extension list.

3. **Popup: copy result**
   - Click copy result button.
   - Confirm success status message appears and clipboard contains rendered result text.

4. **Context menu execution**
   - Set a default context shortcut in options.
   - Select text on a webpage and execute via context menu item.
   - Confirm run appears in history with source `context_menu`.

5. **History controls**
   - In popup, toggle error-only filter and max-items selector.
   - Click popup history reset and verify defaults are restored.
   - In options, exercise source/result/query/sort/max/min-duration filters and reset.

6. **Import/export round trip**
   - Export extension state.
   - Clear history and remove one shortcut.
   - Import previous export and verify shortcuts/settings/history restore correctly.

## Reliability/Guardrail Checks

1. **Validation**
   - Try invalid URL in options and confirm clear validation error.
   - Try malformed headers JSON and confirm fail-fast error messaging.

2. **Hook guardrails**
   - Configure pre-script returning non-object and verify execution fails with typed script error.
   - Configure post-script returning non-string and verify execution fails with typed script error.

3. **Runtime messaging safety**
   - Trigger normal popup/actions/options workflows.
   - Confirm no uncaught runtime-message errors in extension service-worker console.

## Pass Criteria

- All six core functional checks pass.
- Guardrail checks produce expected controlled failures.
- No uncaught errors appear in popup/options/service-worker console during normal flows.
