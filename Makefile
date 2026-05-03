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

translate:
	@node ./src/translate.js >| ./js/SNOBOL/snobol.sil.js

run:
	@node ./run.js --debug

.PHONY: test test-node test-deno test-bun test-all translate run
