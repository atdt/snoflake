Snoflake is a JavaScript port of the macro implementation of SNOBOL4. The macro
implementation is the SNOBOL4 system written in SIL, a macro assembly language,
and a port implements the SIL macros for a new machine. Snoflake's machine is
JavaScript: a build step (`make build`) assembles the SIL source
(`external/v311-snoflake.sil`) into a memory image
(`src/generated-snobol-image.json`), which a dispatch loop (`src/vm.js`)
executes through SIL operations implemented in JavaScript (`src/sil.js`). The
SNOBOL4 compiler and interpreter live in that image, and the JavaScript is an
engine that only knows how to execute SIL. SNOBOL-visible behavior therefore
changes in the SIL source or in a macro's JS implementation, and SIL edits take
effect only after rebuilding the image. A user's `.sno` program is never parsed
by JavaScript: the VM feeds it as input to the running SNOBOL4 system.

## Project intent

Snoflake is an homage to a piece of computing history and a pedagogical tool for
understanding the SNOBOL4 macro implementation. The code should be
crystal-clear, beautiful, simple, and well-documented. Reading it should be
pleasurable and instructive, so treat cleanliness as a primary goal rather than
a finishing step.

## Repository structure

- `bin/snoflake.js`: CLI entry point for running a SNOBOL source file.
- `build/`: handwritten SIL parser (`sil-parser.js`) and build script
  (`build-image.js`) that together emit `src/generated-snobol-image.json`.
- `external/`: Upstream SIL and syntax-table sources.
  - `v311.sil`: Untouched historical baseline (the 1985 macro implementation).
  - `v311-csnobol4.sil`: Phil Budne's CSNOBOL4 SIL, the source that ported
    `[PLBnn]` fixes are lifted from.
  - `v311-snoflake.sil`: Snoflake's working SIL input, derived from `v311.sil`.
    Annotated snoflake fixes belong here. See "Working on the SIL".
  - `syntax.tbl` and `syntax-snoflake.tbl`: Historical and working syntax-table
    sources.
- `src/`: Runtime.
  - `snobol.js`: Runtime assembly and entry point.
  - `sil.js`: JS implementations of the SIL macros (authoritative spec).
  - `generated-snobol-image.json`: Generated translation; do not hand-edit,
    regenerate via `make build`.
  - `{vm,datatypes,string,file,syntax}.js`: Core VM components.
  - `{extensions,host}.js`: Extension API for SNOBOL programs calling host
    JavaScript.
- `test/`: Focused macro/runtime tests (`test-*.js`) and end-to-end `*.sno`
  fixtures (`test/programs/`).
- `demo/`: Browser demo.
- `docs/`: `manual.md` (user-facing manual), `architecture.md` (how the image,
  memory model, and dispatch fit together), `sil-guide.md` (working on the SIL).
- `tmp/`: Scratch programs, probes, and logs (do not commit).

## Before you start

- Changing SNOBOL-visible behavior means changing the SIL or a macro's JS
  implementation. Read `docs/sil-guide.md` first. The non-negotiables: edit
  `v311-snoflake.sil` only, tag every change, `make build` after.
- Adding a test fixture: read `test/programs/README.md` first.
- The runtime is dependency-free and portable across Node, Deno, and Bun. Keep
  it that way.
- `make test` is enough for almost every change. A green run does not prove a
  SIL edit was reached, but `make coverage` does. `make bench-diff` judges a
  performance change against HEAD.
- `make run` is interactive; do not use it from automation. For everything else,
  read @Makefile.

## Code style

- `deno fmt` formats and `deno lint` checks. Formatting runs on a post-edit
  hook, so match the surrounding style rather than hand-formatting.
- Comments are calm and quiet. Say only what the code, its location, and common
  knowledge do not already supply, then stop. Avoid em dashes and semicolons,
  and prefer two short sentences to one clause-spliced line.
