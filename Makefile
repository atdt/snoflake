SHELL := /bin/bash

test:
	@NODE_ENV=test ./node_modules/.bin/buster-test

parser:
	@node ./src/makeParser.js >| ./js/SNOBOL/snobol.sil.js

.PHONY: test
