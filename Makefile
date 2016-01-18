SHELL := /bin/bash

test:
	@NODE_ENV=test ./node_modules/.bin/buster-test

translate:
	@node ./src/translate.js >| ./js/SNOBOL/snobol.sil.js

run:
	@node ./run.js --debug

.PHONY: test
