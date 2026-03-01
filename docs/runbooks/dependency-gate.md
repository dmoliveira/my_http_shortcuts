# 🔐 Dependency Gate Runbook

## Goal

Provide a minimal, repeatable path to clear the local dependency-policy gate and unblock full validation.

## Why this gate is currently blocking

- `npm install --yes` is rejected by local policy.
- Without install, required local binaries are missing: `eslint`, `tsc`, `vitest`, `rimraf`.
- This blocks `make lint`, `make typecheck`, `make test`, and `make build`.

## Required dependency set

All required packages are already declared in `package.json` `devDependencies`:

- `eslint`
- `@eslint/js`
- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `typescript`
- `vitest`
- `rimraf`
- `@types/chrome`
- `@types/node`
- `globals`

## Unblock steps

1. Run or approve dependency security validation in your local environment/policy workflow.
2. Install dependencies:

```bash
make install
```

3. Verify toolchain presence:

```bash
make gate-status
make toolchain-check
```

4. Run full validation gate:

```bash
make release-ready
```

For current command evidence and exact error text, see `docs/runbooks/validation-blocker-log.md`.

## Expected success criteria

- `make toolchain-check` passes.
- `make release-ready` passes end-to-end.
- branch is ready for final release/tag steps.
