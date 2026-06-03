SHELL := /bin/bash

TEST_GLOB := ./test/test-*.js
VERSION ?= patch

test: test-node

test-node:
	@npm test

test-deno:
	@deno test -A $(TEST_GLOB)

test-bun:
	@bun test --timeout 15000 $(TEST_GLOB)

test-all: test-node test-deno test-bun

build:
	@node ./build/build-image.js >| ./src/generated-snobol-image.js

run:
	@node ./bin/snoflake.js --debug

profile:
	@node ./tools/profile.js

coverage:
	@node ./tools/sil-coverage.js

bench:
	@node ./tools/bench-snoflake.js

bench-deno:
	@deno bench -A ./tools/snoflake.bench.js

# Benchmark the working tree (uncommitted changes included) against a clean
# checkout of HEAD. A detached worktree provides the baseline, so the working
# tree is never disturbed. Pass FIXTURES="name ..." to narrow the set.
bench-diff:
	@if git diff --quiet HEAD; then \
		echo "Working tree matches HEAD; nothing to compare."; exit 1; \
	fi
	@worktree="$$(mktemp -d)/head"; \
	trap 'git worktree remove --force "$$worktree" 2>/dev/null' EXIT; \
	git worktree add --quiet --detach "$$worktree" HEAD; \
	deno bench -A ./tools/snoflake.bench.js -- --baseline="$$worktree" $(FIXTURES)

bench-vs-csnobol4:
	@node ./tools/bench-vs-csnobol4.js

demo:
	@npm run demo

# To release: run make release from a clean master checkout. It defaults to
# VERSION=patch; use VERSION=minor, VERSION=major, or VERSION=X.Y.Z when
# needed. GitHub Actions publishes the package to npm after the release is
# created.
release-check:
	@test "$$(git branch --show-current)" = "master" || { echo "Release from master."; exit 1; }
	@test -z "$$(git status --porcelain --untracked-files=no)" || { git status --short --untracked-files=no; echo "Commit or stash tracked changes before releasing."; exit 1; }
	@git fetch origin master --tags
	@test "$$(git rev-list --count HEAD..origin/master)" = "0" || { echo "Local master is behind origin/master."; exit 1; }
	@gh auth status >/dev/null
	@npm test
	@npm pack --dry-run

release: release-check
	@case "$(VERSION)" in \
		patch|minor|major|prepatch|preminor|premajor|prerelease|[0-9]*.[0-9]*.[0-9]*) ;; \
		*) echo "Use VERSION=patch, minor, major, prerelease, or an explicit semver."; exit 1 ;; \
	esac
	@npm version "$(VERSION)"
	@tag="v$$(node -p "require('./package.json').version")"; \
	git push origin master "$$tag"; \
	gh release create "$$tag" --verify-tag --title "$$tag" --generate-notes

.PHONY: test test-node test-deno test-bun test-all build run profile coverage bench bench-deno bench-diff bench-vs-csnobol4 demo release-check release
