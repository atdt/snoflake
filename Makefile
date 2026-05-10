SHELL := /bin/bash

MOCHA_GLOB := 'test/**/*.js'

test: test-node

test-node:
	@npm test

test-deno:
	@deno run -A npm:mocha --timeout 10000 $(MOCHA_GLOB)

test-bun:
	@bun x mocha --timeout 10000 $(MOCHA_GLOB)

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

.PHONY: test test-node test-deno test-bun test-all build run profile bench bench-vs-csnobol4
