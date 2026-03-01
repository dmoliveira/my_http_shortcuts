SHELL := /bin/bash
PROJECT := my_http_shortcuts
VERSION := $(shell node -p "require('./package.json').version")

.PHONY: help install toolchain-check validate-local lint test typecheck build package release-notes release-notes-file release-notes-smoke release-check release-check-smoke tag

help:
	@printf "$(PROJECT) v$(VERSION)\n"
	@printf "Commands:\n"
	@printf "  make install        Install dependencies\n"
	@printf "  make toolchain-check Verify required local binaries\n"
	@printf "  make validate-local Run toolchain + lint/typecheck/test/build\n"
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

toolchain-check:
	node scripts/toolchain-check.mjs

validate-local: toolchain-check lint typecheck test build

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
