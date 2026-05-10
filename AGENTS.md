# Repository Guidelines

This repository is a JavaScript port of the macro implementation of SNOBOL4.

## Project Intent

It is an homage to a piece of computing history and a pedagogical tool for
understanding the SNOBOL4 macro implementation. The code should be
crystal-clear, beautiful, simple, and well-documented.

## Repository Structure

- `bin/snoflake.js`: CLI entry point for running a SNOBOL source file.
- `translator/`: SIL parser grammar (`sil.peg`) and translator (`translate.js`)
  that emit `src/generated-snobol-image.js`.
- `external/`: Upstream SIL and syntax-table sources.
  - `v311.sil`: Untouched historical reference source.
  - `v311-snoflake.sil`: Snoflake's working SIL input for translation. Began
    as a copy of `v311.sil`; annotated snoflake fixes belong here.
  - `snobol4-v311.sil`: Later CSNOBOL4 SIL source. A potential source for
    surgical, evidence-backed fixes; do not treat it as a replacement
    baseline or port modern CSNOBOL4 features wholesale. See
    `SIL-CHANGES.md`.
  - `syntax.tbl`: Historical syntax-table source.
- `src/`: Runtime.
  - `snobol.js`: Runtime assembly and entry point.
  - `sil.js`: JS implementations of SIL macros (authoritative spec).
  - `generated-snobol-image.js`: Generated translation (regenerate via `make translate`).
  - `{vm,mem,datatypes,string,file,syntax}.js`: Core VM components.
- `test/`: Focused macro/runtime tests (`test-*.js`) and end-to-end `*.sno`
  fixtures (`test/programs/`).
- `tmp/`: Scratch programs, probes, and logs (do not commit).
- `SIL-CHANGES.md`: Notes on candidate fixes from later CSNOBOL4 SIL.

## Rules & Workflow

### Source of truth

- The macro comment blocks in `src/sil.js` are the canonical local
  spec. When tests or guesses disagree with those comments, trust the
  comments until you have strong evidence.
- Do not hand-edit `src/generated-snobol-image.js`. Regenerate it with
  `make translate` when the translator or SIL input changes.
- `make translate` reads `external/v311-snoflake.sil`. Keep
  `external/v311.sil` as the historical baseline and compare against it when
  reviewing local SIL edits.

### Code & commits

- Write clean, well-documented code. Comments should illuminate complex
  logic or historical conventions, not narrate the obvious.
- Commit each logical fix separately with an imperative subject. The body
  should explain why the change is correct, what evidence supports it, and
  which macro/spec invariant it preserves.

### Tests

- Prefer focused tests in `test/test-*.js` for changed macro/runtime
  behavior.
- Use program-level fixtures under `test/programs/`. Read
  `test/programs/README.md` first to understand the fixture format.

### Running & debugging

- Keep scratch programs and logs in `tmp/`; do not commit them.
- Avoid ingesting huge runtime output. Redirect probe output to `tmp/`,
  check size, and inspect targeted excerpts.

## Commands

- `npm test` (or `make test`): run all tests.
- `npx mocha test/test-programs.js`: run only the program-level tests.
- `npx mocha test/test-sil.js`: run a specific unit test file.
- `npm test -- -g "Arbitrarily long integers"`: run a specific test by title.
- `make translate`: regenerate `src/generated-snobol-image.js`.
- `node bin/snoflake.js --file=tmp/example.sno`: run a SNOBOL program.

### Sample debug commands

- Create and run the minimal visible-output probe:
  ```sh
  printf " OUTPUT = 'HELLO, WORLD'\nEND\n" > tmp/min-output.sno
  node bin/snoflake.js --file=tmp/min-output.sno
  ```
- Run noisy probes through a log-size check before inspection:
  ```sh
  node bin/snoflake.js --file=tmp/min-output.sno > tmp/min-output.log 2>&1
  wc -l tmp/min-output.log
  tail -n 80 tmp/min-output.log
  ```
- Capture a run for later searching:
  ```sh
  node bin/snoflake.js --file=tmp/min-output.sno > tmp/min-output.log 2>&1
  rg "XLATRN|XLATNX|INTERP|ASGN|PUTOUT|END" tmp/min-output.log
  ```
- **Custom descriptor probes:** to capture descriptor contents during
  execution, write a short Node script that instantiates `vm`, overrides
  `vm.exec = function (label, macro, args, comment) { ... }` to log values
  like `vm.d('OCBSCL').raw()` or `vm.s('IOSP').specified` on specific
  `label` or `comment` matches, then calls the original `exec` and runs the
  interpreter.
