# Repository Guidelines

This repository is a JavaScript port of the macro implementation of SNOBOL4.

## Project Intent

It is an homage to a piece of computing history and a pedagogical tool for
understanding the SNOBOL4 macro implementation. The code should be
crystal-clear, beautiful, simple, and well-documented.

## Repository Structure

- `bin/snoflake.js`: CLI entry point for running a SNOBOL source file.
- `build/`: SIL grammar (`sil-grammar.peg`) and build script (`build-image.js`)
  that emit `src/generated-snobol-image.js`.
- `external/`: Upstream SIL and syntax-table sources.
  - `v311.sil`: Untouched historical reference source.
  - `v311-snoflake.sil`: Snoflake's working SIL input for translation. Began
    as a copy of `v311.sil`; annotated snoflake fixes belong here.
  - `syntax.tbl`: Historical syntax-table source.
- `src/`: Runtime.
  - `snobol.js`: Runtime assembly and entry point.
  - `sil.js`: JS implementations of SIL macros (authoritative spec).
  - `generated-snobol-image.js`: Generated translation (regenerate via `make build`).
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
  `make build` when the translator or SIL input changes.
- When reading commit diffs, exclude `src/generated-snobol-image.js` unless
  the generated artifact itself is the subject of review; it is large and
  pollutes context. For example:
  `git show --stat -- . ':(exclude)src/generated-snobol-image.js'` and
  `git diff HEAD~1..HEAD -- . ':(exclude)src/generated-snobol-image.js'`.
- `make build` reads `external/v311-snoflake.sil`. Keep
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
- `make build`: regenerate `src/generated-snobol-image.js`.
- `node bin/snoflake.js --file=tmp/example.sno`: run a SNOBOL program.
- `make bench` (or `node tools/bench-snoflake.js [opts]`): run the
  Snoflake benchmark harness against a default fixture suite. Pass `-h`
  for full options. To benchmark an arbitrary `.sno` program, pass its
  path explicitly, e.g. `node tools/bench-snoflake.js tmp/example.sno`.
- `make bench-vs-csnobol4` (or `node tools/bench-vs-csnobol4.js [opts]`):
  wall-clock comparison against CSNOBOL4. Requires `snobol4` on PATH;
  override with `--snobol4=PATH`.
- `make profile` (or `node tools/profile.js [bench-snoflake.js opts]`):
  capture a V8 tick profile of `bench-snoflake.js --mode=vm` and post-
  process it into a report under `tmp/profiles/`. The first ~60 lines
  (Summary + JavaScript hot list) are printed; a full timestamped report
  path is logged at the end. Forward any `bench-snoflake.js` flag to
  scope the profile (e.g. `node tools/profile.js --iterations=10
  kalah-opening-search`). To profile an arbitrary `.sno` program, pass its
  path directly, e.g. `node tools/profile.js tmp/example.sno`.

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
