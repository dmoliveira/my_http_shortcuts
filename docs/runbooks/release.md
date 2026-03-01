# 🚀 Release Runbook

## Goal

Publish a tagged release with validated metadata, package artifact, and release notes.

## Preconditions

1. PR is merged to `main`.
2. CI is green.
3. `VERSION`, `package.json`, and `CHANGELOG.md` are updated.

## Release Steps

1. Sync local main:

```bash
git checkout main
git pull --rebase
```

2. Validate release metadata:

```bash
make release-check
make release-check-smoke
```

This must pass before creating release artifacts or tags.

3. Build and package:

```bash
make package
```

4. Generate release notes draft:

```bash
make release-notes-file
make release-notes-smoke
```

Draft file is written to `docs/release-notes-draft.md`.

5. Tag release:

```bash
make tag
git push origin --tags
```

6. Verify GitHub release workflow uploads artifact.

## Post-release

- confirm release notes/changelog categories: Adds, Changes, Fixes, Removals
- update roadmap statuses for release tasks
