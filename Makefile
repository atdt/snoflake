SHELL := /bin/bash

TEST_GLOB := ./test/test-*.js
VERSION ?= patch

test: test-node

test-node:
	@npm test

test-deno:
	@deno test -A $(TEST_GLOB)

test-bun:
	@bun test $(TEST_GLOB)

test-all: test-node test-deno test-bun

build:
	@node ./build/build-image.js >| ./src/generated-snobol-image.js

run:
	@node ./bin/snoflake.js --debug

profile:
	@node ./tools/profile.js

bench:
	@node ./tools/bench-snoflake.js

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

.PHONY: test test-node test-deno test-bun test-all build run profile bench bench-vs-csnobol4 demo release-check release
