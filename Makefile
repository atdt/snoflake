SHELL := /bin/bash

test:
	@npm test

translate:
	@node ./src/translate.js >| ./js/SNOBOL/snobol.sil.js

run:
	@node ./run.js --debug

.PHONY: test
