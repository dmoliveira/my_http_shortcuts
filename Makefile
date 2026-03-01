SHELL := /bin/bash
PROJECT := my_http_shortcuts
VERSION := $(shell node -p "require('./package.json').version")

.PHONY: help install lint test typecheck build package release-notes release-check tag

help:
	@printf "$(PROJECT) v$(VERSION)\n"
	@printf "Commands:\n"
	@printf "  make install        Install dependencies\n"
	@printf "  make lint           Run lint checks\n"
	@printf "  make typecheck      Run TypeScript checks\n"
	@printf "  make test           Run automated tests\n"
	@printf "  make build          Build extension to dist/\n"
	@printf "  make package        Create release.zip\n"
	@printf "  make release-notes  Generate draft release notes\n"
	@printf "  make release-check  Validate release metadata\n"
	@printf "  make tag            Create annotated git tag from version\n"

install:
	npm install --yes

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

release-check:
	npm run release-check

tag:
	git tag -a "v$(VERSION)" -m "Release v$(VERSION)"
