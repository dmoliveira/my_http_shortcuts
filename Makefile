SHELL := /bin/bash
PROJECT := my_http_shortcuts
VERSION := $(shell node -p "require('./package.json').version")

.PHONY: help install dependency-security-report dependency-unblock-packet gate-status wiki-status wiki-status-json wiki-doctor wiki-remind wiki-sync-run wiki-watch wiki-verify wiki-complete wiki-pulse wiki-autopilot toolchain-check validate-local release-ready lint test typecheck build package release-notes release-notes-file release-notes-smoke release-check release-check-smoke tag

help:
	@printf "$(PROJECT) v$(VERSION)\n"
	@printf "Commands:\n"
	@printf "  make install        Install dependencies\n"
	@printf "  make dependency-security-report Generate dependency metadata report\n"
	@printf "  make dependency-unblock-packet Capture blocker evidence bundle\n"
	@printf "  make gate-status    Print dependency-gate readiness\n"
	@printf "  make wiki-status    Check wiki git backend readiness\n"
	@printf "  make wiki-status-json  Print wiki status as JSON\n"
	@printf "  make wiki-doctor    Print full wiki diagnostics snapshot\n"
	@printf "  make wiki-remind    Post wiki status comment to reminder issue\n"
	@printf "  make wiki-sync-run  Dispatch wiki sync workflow if ready\n"
	@printf "  make wiki-watch     Wait for wiki bootstrap, then dispatch sync\n"
	@printf "  make wiki-verify    Verify wiki contains expected generated pages\n"
	@printf "  make wiki-complete  Watch, sync, and verify wiki in one flow\n"
	@printf "  make wiki-pulse     Doctor + remind + monitor dispatch in one command\n"
	@printf "  make wiki-autopilot Attempt complete flow, then pulse fallback\n"
	@printf "  make toolchain-check Verify required local binaries\n"
	@printf "  make validate-local Run toolchain + lint/typecheck/test/build\n"
	@printf "  make release-ready  Run release validation sequence\n"
	@printf "  make lint           Run lint checks\n"
	@printf "  make typecheck      Run TypeScript checks\n"
	@printf "  make test           Run automated tests\n"
	@printf "  make build          Build extension to dist/\n"
	@printf "  make package        Create release.zip\n"
	@printf "  make release-notes  Generate draft release notes\n"
	@printf "  make release-notes-file  Write draft notes to docs/\n"
	@printf "  make release-notes-smoke Verify release notes sections\n"
	@printf "  make release-check  Validate release metadata\n"
	@printf "  make release-check-smoke Execute release-check smoke run\n"
	@printf "  make tag            Create annotated git tag from version\n"

install:
	npm install --yes

dependency-security-report:
	node scripts/dependency-security-report.mjs

dependency-unblock-packet:
	node scripts/dependency-unblock-packet.mjs

gate-status:
	node scripts/gate-status.mjs

wiki-status:
	node scripts/wiki-status.mjs

wiki-status-json:
	node scripts/wiki-status.mjs --json

wiki-doctor:
	node scripts/wiki-doctor.mjs

wiki-remind:
	node scripts/wiki-remind.mjs

wiki-sync-run:
	node scripts/wiki-sync-run.mjs

wiki-watch:
	node scripts/wiki-watch.mjs

wiki-verify:
	node scripts/wiki-publish-verify.mjs

wiki-complete:
	$(MAKE) wiki-watch && $(MAKE) wiki-verify

wiki-pulse:
	node scripts/wiki-pulse.mjs

wiki-autopilot:
	node scripts/wiki-autopilot.mjs

toolchain-check:
	node scripts/toolchain-check.mjs

validate-local: toolchain-check lint typecheck test build

release-ready: release-check release-check-smoke validate-local package release-notes-smoke

lint:
	npm run lint

typecheck:
	npm run typecheck

test:
	npm run test

build:
	npm run build

package:
	npm run package

release-notes:
	npm run release-notes

release-notes-file:
	node scripts/release-notes.mjs > docs/release-notes-draft.md

release-notes-smoke:
	npm run release-notes:smoke

release-check:
	npm run release-check

release-check-smoke:
	npm run release-check:smoke

tag:
	git tag -a "v$(VERSION)" -m "Release v$(VERSION)"
