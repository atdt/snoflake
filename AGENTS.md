# Repository Guidelines

This repository is a JavaScript port of the macro implementation of SNOBOL4,
based on `macro-implementation-of-snobol-4_ocr.pdf`. It still does not fully
run SNOBOL programs.

## Project Intent
This is not expected to become a production SNOBOL runtime for day-to-day work.
It is an homage to a fascinating piece of computing history and a pedagogical
tool for understanding the SNOBOL4 macro implementation. Favor clean,
well-documented, and principled changes over expedient kludges.

The original SIL implementation, the OCR text, and even the specification may
contain errors. Treat that as possible but rare. Establish such diagnoses with
strong evidence before deviating from the macro comments in `js/SNOBOL/sil.js`
or altering the original SIL sources. When in doubt, preserve the documented
SIL semantics and isolate JavaScript runtime fixes around representation or
translation mismatches.

`external/v311.sil` is the historical reference source. `external/v311-snoflake.sil`
is snoflake's working SIL input for translation; it began as a copy of
`external/v311.sil` and is the place for any carefully justified local SIL
fixes. Do not modify `external/v311.sil` for snoflake behavior changes. Any
local SIL edit must be clearly annotated in `external/v311-snoflake.sil` with
the reason, the preserved invariant, and source attribution. Fixes ported from
Phil Budne's CSNOBOL4 SIL must explicitly say so and, when possible, include
the relevant `PLB` marker or nearby CSNOBOL4 label/procedure context.

`SIL-CHANGES.md` summarizes candidate bug fixes identified in Phil Budne's
later CSNOBOL4 SIL source. Consult it only after checking the local macro
comments, the JavaScript representation/translation layer, and targeted runtime
probes. It is a guide for surgical, evidence-backed fixes; do not treat
`external/snobol4-v311.sil` as a replacement baseline or port modern CSNOBOL4
features wholesale.

## Core Working Rules
These are the durable project rules. Treat them as more important than any
temporary debugging notes below.

- The macro comment blocks in `js/SNOBOL/sil.js` are the canonical local spec.
  When tests or guesses disagree with those comments, trust the comments until
  you have strong evidence.
- Do not hand-edit `js/SNOBOL/snobol.sil.js`. Regenerate it with
  `make translate` when translator or SIL input changes.
- `make translate` reads `external/v311-snoflake.sil`. Keep
  `external/v311.sil` as the historical baseline and compare against it when
  reviewing local SIL edits.
- Always invoke `run.js` with both guards:
  `--maxSteps=100000 --maxMillis=1000`. Larger values are not permitted.
- Avoid ingesting huge runtime output. Redirect probe output to `tmp/`, check
  size with `wc`, and inspect targeted excerpts with `tail`, `head`, and `rg`.
- Keep scratch programs and logs in `tmp/`; do not commit them.
- Commit each logical fix separately with a clear, expressive message. Do not
  mix probe artifacts, unrelated cleanup, and behavior changes in one commit.
- Do not revert unrelated dirty or untracked files.

## Layout
- `src/`: SIL parser and translator (`sil.peg`, `translate.js`).
- `external/`: upstream SIL and syntax-table sources.
  - `external/v311.sil`: historical reference source.
  - `external/v311-snoflake.sil`: snoflake's working SIL input for
    translation; local SIL fixes belong here.
- `js/`: runtime; entry point is `js/snobol.js`, core modules are under
  `js/SNOBOL/`.
- `test/`: Mocha tests. Focused macro/runtime/syntax tests live as
  `test/test-*.js`; end-to-end SNOBOL program tests live as `*.sno` fixtures
  under `test/programs/` (see `test/programs/README.md`).
- `tmp/`: scratch programs and logs.

## Project Map
- `run.js`: command-line entry point for running a SNOBOL source file through
  the translated SIL interpreter.
- `js/snobol.js`: runtime assembly point; loads the base runtime, memory,
  datatypes, SIL macro implementations, and generated translated SIL.
- `js/SNOBOL/sil.js`: JavaScript implementations of SIL macros. The comment
  blocks here are the local macro spec and should be treated as authoritative.
- `js/SNOBOL/snobol.sil.js`: generated JavaScript translation of
  `external/v311-snoflake.sil`; regenerate with `make translate`.
- `js/SNOBOL/vm.js`, `mem.js`, `datatypes.js`, `string.js`, `file.js`,
  `syntax.js`: VM execution, descriptor/specifier memory model, string and
  file primitives, and syntax constants.
- `external/v311.sil`: untouched historical SNOBOL4 3.11 SIL baseline.
- `external/v311-snoflake.sil`: local SIL input for translation; carefully
  annotated snoflake behavior fixes belong here.
- `external/syntax.tbl`: historical syntax-table source/reference; the active
  JavaScript syntax tables live in `js/SNOBOL/syntax.js`.
- `external/snobol4-v311.sil`: optional later CSNOBOL4 reference when present;
  useful for evidence-backed comparisons, not a replacement baseline.
- `src/sil.peg` and `src/translate.js`: SIL parser grammar and translator that
  emit `js/SNOBOL/snobol.sil.js`.
- `test/test-sil.js`, `test/test-runtime.js`, `test/test-syntax.js`: focused
  macro/runtime/syntax coverage.
- `test/programs/`: end-to-end SNOBOL program tests. Each `*.sno` is a
  runnable program with an embedded `*` comment header declaring `@title`,
  optional `@options` (single-line JSON), optional `@input` block, `@expect`
  block, and `@match` mode. Driven by `test/test-programs.js`. Convention
  documented in `test/programs/README.md`.
- `SIL-CHANGES.md`: notes on candidate fixes from later CSNOBOL4 SIL.
- `tmp/`: scratch SNOBOL programs, probes, and logs. Do not commit contents.

## Commands
- `npm test`: run all tests.
- `make test`: alias for `npm test`.
- `make translate`: regenerate `js/SNOBOL/snobol.sil.js`.
- `node run.js --file=tmp/example.sno --maxSteps=100000 --maxMillis=1000`:
  run a SNOBOL program with required execution guards.

## Development Rules
- JavaScript style: CommonJS modules, `"use strict"`, 4-space indentation.
- Prefer focused tests in `test/test-*.js` for changed macro/runtime behavior.
  Use a program-level fixture under `test/programs/` only when the behavior
  is observable solely by running a full SNOBOL program through `run.js`.
- Use `rg` for searching.
- Comments should be tasteful and useful. Prefer comments that illuminate
  complex code, representation mismatches, historical computing conventions,
  or non-obvious SNOBOL/SIL quirks. Avoid narrating obvious assignments or
  control flow.
- A good commit should be reviewable on its own: one bug, one invariant, one
  testable behavior change, or one focused documentation update.
- Commit subjects should use imperative form. For non-trivial runtime changes,
  the body should explain why the change is correct, what evidence supports it,
  and which macro/spec invariant it preserves.

## Runtime Invariants
- `SNOBOL.options` is currently process-global, not VM-local. Creating a new
  `SNOBOL.VM(options)` merges into that shared options object, so tests and
  probes that mutate options should restore them.
- `vm.run(program)` has assembly phases before execution: it binds built-in
  symbols, preallocates `DESCR`/`SPEC` storage so forward references can
  resolve, initializes those preallocated records in a second pass, then skips
  data-assembly macros during the execution loop.
- Descriptors and specifiers are lightweight views over `vm.mem`, not copied
  objects. `Descriptor` is three words (`addr`, `flags`, `value`);
  `Specifier` is six words and adds `offset` and `length`.
- Normal fallthrough depends on `instructionPointerChanged`. Branching macros
  should use `vm.jmp(...)` or otherwise set both `instructionPointer` and
  `instructionPointerChanged`; otherwise the VM advances to the next
  instruction after the macro returns.
- `CSTACK` and `OSTACK` are VM register descriptors, not normal memory-backed
  descriptors. Use `vm.d('CSTACK')` and `vm.d('OSTACK')` for proxy descriptor
  access when a macro expects a descriptor.
- Stack behavior is pre-increment on `PUSH`/`SPUSH` and post-decrement on
  `POP`/`SPOP`. Bounds checks use the `STACK` and `STSIZE` symbols.
- `PROC`/`LHERE` labels bind to memory entries whose contents are instruction
  indices. Keep that indirection intact.
- `RCALL`/`RRTURN` currently use a JS callback stack plus VM stack descriptors.
  Treat this area carefully; it is central to compiler/interpreter control
  flow.
- `STREAD` reads fixed-width source records into the input buffer and marks the
  input unit closed at EOF.
- File objects are cached by role and unit number. Source-card reads use the
  program file role; runtime `INPUT` on `UNITI` can use the separate `--input`
  role. This is a JavaScript representation split around the historical unit
  model.
- `LOCA2` is accelerated by `sil._fastLOCA2` during VM execution. Treat it as a
  native equivalent of the SIL lookup loop: it must preserve descriptor side
  effects and branch to the same SIL labels.
- `STREAM` diagnostics should remain gated behind debug logging.

## Current Debugging Handoff
The notes below describe the active investigation and may become stale. Keep
them accurate, but do not let them override the core working rules above.

### Debugging Tips
- SNOBOL source statement cards normally need a leading blank. Without it,
  `OUTPUT = 'HELLO, WORLD'` is parsed as a label field, not as an assignment.
- The `--watch` option prints symbol addresses, not descriptor contents. For
  useful probes, wrap `vm.exec` in a small Node script and log
  `vm.d('OCBSCL').raw()`, `vm.d('CMBSCL').raw()`, `vm.d('CMOFCL').raw()`,
  `vm.d('OCICL').raw()`, `vm.d('XPTR').raw()`, and `vm.s('IOSP').specified`.
- Good trace points for compilation are `XLATRN`, `XLATNX`, `XLATP`, `XLAEND`,
  `XLATND`, `CMPILE`, `CMPILC`, `CMPILA`, `CMPFRM`, and `CMPFT`.
- Good trace points for interpretation/output are `INTERP`, `INIT`, `ASGN`,
  `ASGNVV`, `LOCAPV` with `OUTATL`, `PUTOUT`, `PUTV`, `PUTVU`, `STPRNT`, `BASE`,
  and `END`.
- Dump object code around `vm.d('OCBSCL').addr` and `vm.d('CMBSCL').addr` after
  a guarded run. Look for function descriptors such as `INITCL`, `ASGNCL`,
  `LIT1CL`, `BASECL`, and `ENDCL`.
- Keep scratch `.sno` files and logs in `tmp/`; do not commit probe logs.

### Sample Debug Commands
- Create and run the minimal visible-output probe:
  ```sh
  printf " OUTPUT = 'HELLO, WORLD'\nEND\n" > tmp/min-output.sno
  node run.js --file=tmp/min-output.sno --maxSteps=100000 --maxMillis=1000
  ```
- Run noisy probes through a log-size check before inspection:
  ```sh
  node run.js --file=tmp/min-output.sno --maxSteps=100000 --maxMillis=1000 > tmp/min-output.log 2>&1
  wc -l tmp/min-output.log
  tail -n 80 tmp/min-output.log
  ```
- Capture a debug run for later searching:
  ```sh
  node run.js --file=tmp/min-output.sno --maxSteps=100000 --maxMillis=1000 --debug=true > tmp/min-output-debug.log 2>&1
  wc -l tmp/min-output-debug.log
  rg "XLATRN|XLATNX|XLATP|XLAEND|CMPILE|ASGN|PUTOUT|STPRNT|BASE|END" tmp/min-output-debug.log
  ```
- Use a Node one-off probe when descriptor contents matter:
  ```sh
  node - <<'NODE'
  const SNOBOL = require('./js/snobol.js');
  const vm = new SNOBOL.VM({ file: 'tmp/min-output.sno', maxSteps: 100000, maxMillis: 1000 });
  const orig = vm.exec;

  function d(name) {
      try {
          return vm.d(name).raw();
      } catch (e) {
          return [];
      }
  }

  vm.exec = function (label, macro, args, comment) {
      const hit = /Compile statement|Call interpreter|Perform output|Perform print/.test(comment || '') ||
          ['XLATRN', 'XLATNX', 'XLATP', 'XLAEND', 'INTERP', 'ASGN', 'PUTV', 'PUTVU', 'END'].includes(label);
      if (hit) {
          console.error(label, macro, comment || '',
              'OCBSCL=', d('OCBSCL'),
              'CMBSCL=', d('CMBSCL'),
              'OCICL=', d('OCICL'),
              'XPTR=', d('XPTR'));
      }
      return orig.apply(this, arguments);
  };

  vm.reset();
  vm.run(SNOBOL.interp(vm));
  NODE
  ```
