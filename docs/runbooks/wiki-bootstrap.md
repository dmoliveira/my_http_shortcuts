# 📘 Wiki Bootstrap (One-Time)

The wiki sync workflow publishes markdown docs into the repository wiki.

## Why this may be needed

GitHub wiki repositories (`<repo>.wiki.git`) are not always initialized until a first wiki page exists.

If the workflow warns that the wiki repo is unavailable, run this one-time bootstrap.

Current repo status may still be pending until first page is created. Check anytime with:

```bash
make wiki-status
```

Pre-check command (same as above) should report `Wiki status: available` before automated sync can push pages.

## One-time bootstrap steps

1. Open: `https://github.com/dmoliveira/my_http_shortcuts/wiki`
2. Click **Create the first page**
3. Save a simple placeholder page (for example: `Home`)
4. Re-run **Wiki Sync** workflow from Actions tab (or push a docs change)

CLI shortcut (after wiki is initialized):

```bash
make wiki-sync-run
```

Automatic fallback:

- `wiki-monitor.yml` checks wiki availability every 30 minutes and dispatches `wiki-sync.yml` automatically once initialization is detected.

After that, wiki sync automation should push generated pages successfully.
