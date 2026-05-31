Snoflake is a JavaScript port of the macro implementation of SNOBOL4.

## Project Intent

It is an homage to a piece of computing history and a pedagogical tool for
understanding the SNOBOL4 macro implementation. The code should be
crystal-clear, beautiful, simple, and well-documented. Reading it should be
pleasurable and instructive, so treat cleanliness as a primary goal rather than
a finishing step.

## Repository Structure

- `bin/snoflake.js`: CLI entry point for running a SNOBOL source file.
- `build/`: handwritten SIL parser (`sil-parser.js`), and build script
  (`build-image.js`) that together emit `src/generated-snobol-image.js`.
- `external/`: Upstream SIL and syntax-table sources.
  - `v311.sil`: Untouched historical baseline (the 1985 macro implementation).
  - `v311-csnobol4.sil`: Phil Budne's CSNOBOL4 SIL, the source that ported
    `[PLBnn]` fixes are lifted from.
  - `v311-snoflake.sil`: Snoflake's working SIL input, derived from `v311.sil`.
    Annotated snoflake fixes belong here. See "Working on the SIL".
  - `syntax.tbl`: Historical syntax-table source.
  - `syntax-snoflake.tbl`: Snoflake's working syntax-table source.
- `src/`: Runtime.
  - `snobol.js`: Runtime assembly and entry point.
  - `sil.js`: JS implementations of SIL macros (authoritative spec).
  - `generated-snobol-image.js`: Generated translation; do not hand-edit,
    regenerate via `make build`.
  - `{vm,mem,datatypes,string,file,syntax}.js`: Core VM components.
- `test/`: Focused macro/runtime tests (`test-*.js`) and end-to-end `*.sno`
  fixtures (`test/programs/`).
- `tmp/`: Scratch programs, probes, and logs (do not commit).
- `SIL-CHANGES.md`: Notes on candidate fixes from later CSNOBOL4 SIL.

## Pipeline

Build time turns SIL into a runnable image. `build/sil-parser.js` parses
`external/v311-snoflake.sil` into statements, `src/assemble.js` runs a two-pass
assembler that binds labels and lays out memory, and `build/build-image.js`
serializes the result to `src/generated-snobol-image.js`. Run time (`run()`, the
CLI, the browser demo) loads that image into the VM (`src/vm.js`), which runs
its dispatch loop and feeds your `.sno` program in as input to the running
SNOBOL4 system.

## Working on the SIL

Edit `external/v311-snoflake.sil`, never `v311.sil` (the untouched baseline) or
`v311-csnobol4.sil` (Budne's reference). Consult those two when changing the
working SIL: diff against `v311.sil` to see what an edit actually changes, and
read `v311-csnobol4.sil` to lift a CSNOBOL4 fix faithfully. Tag every change as
the file's header comment establishes, `[PLBnn]` for a fix ported from Budne and
`[SNFnn]` for a snoflake-local extension, and add a matching header entry.
Regenerate the image with `make build` afterward.

To watch a change run, `tools/sil-trace.js` runs a program and emits the SIL
source line behind every executed instruction (trace on stderr, program output
on stdout). It assembles the image from the working SIL on each run, so edits
trace without `make build`. It also exports `runWithTrace()` for debugging from
a short script.

## Code style

- `deno fmt` formats (4-space indent, 80 cols) and `deno lint` checks the code.
  Formatting runs on a post-edit hook, so match the surrounding style rather
  than hand-formatting.
- Comments are calm and quiet. Say only what the code, its location, and common
  knowledge do not already supply, then stop. Do not narrate the obvious,
  restate the code, or recount change history. Avoid em dashes and semicolons,
  and prefer two short sentences to one clause-spliced line.

## Runtime and tests

- Keep the runtime dependency-free and portable across Node, Bun, and Deno.
- `make test` is enough for almost every change. Reach for `make test-all` (all
  three runtimes) only when a change might depend on one runtime's
  idiosyncrasies.
- Program fixtures under `test/programs/` use a small header syntax for
  declaring input and expected output. Read `test/programs/README.md` before
  adding one.
- Benchmark with `make bench-deno`.

## Commands

Read @Makefile
