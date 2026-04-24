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

## Core Working Rules
These are the durable project rules. Treat them as more important than any
temporary debugging notes below.

- The macro comment blocks in `js/SNOBOL/sil.js` are the canonical local spec.
  When tests or guesses disagree with those comments, trust the comments until
  you have strong evidence.
- Do not hand-edit `js/SNOBOL/snobol.sil.js`. Regenerate it with
  `make translate` when translator or SIL input changes.
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
- `js/`: runtime; entry point is `js/snobol.js`, core modules are under
  `js/SNOBOL/`.
- `test/`: Mocha tests.
- `tmp/`: scratch programs and logs.

## Commands
- `npm test`: run all tests.
- `make test`: alias for `npm test`.
- `make translate`: regenerate `js/SNOBOL/snobol.sil.js`.
- `node run.js --file=tmp/example.sno --maxSteps=100000 --maxMillis=1000`:
  run a SNOBOL program with required execution guards.

## Development Rules
- JavaScript style: CommonJS modules, `"use strict"`, 4-space indentation.
- Prefer focused tests in `test/test-*.js` for changed macro/runtime behavior.
- Use `rg` for searching.
- A good commit should be reviewable on its own: one bug, one invariant, one
  testable behavior change, or one focused documentation update.
- Commit subjects should use imperative form. For non-trivial runtime changes,
  the body should explain why the change is correct, what evidence supports it,
  and which macro/spec invariant it preserves.

## Runtime Invariants
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
- `STREAM` diagnostics should remain gated behind debug logging.

## Current Debugging Handoff
The notes below describe the active investigation and may become stale. Keep
them accurate, but do not let them override the core working rules above.

### Current State
- `npm test` passes: 206 tests.
- `tmp/hello.sno` (just `END`) compiles and terminates normally with guards.
- A correctly blank-prefixed minimal visible-output program now compiles,
  executes, and prints `HELLO, WORLD` with the required guards:
  ```sh
  printf " OUTPUT = 'HELLO, WORLD'\nEND\n" > tmp/min-output.sno
  node run.js --file=tmp/min-output.sno --maxSteps=100000 --maxMillis=1000
  ```
- Recent confirmed fixes: fixed-width source records, `ENDPTR` initialization,
  EOF handling in `STREAD`, `STREAM` STOP branching, `LOCAPV` value-field
  copying, unlabeled `DESCR`/`SPEC` assembly into preallocated slots,
  descriptor-aligned `VARID`/`ENDPTR` bucket offsets, and `LOCAPV` relative
  list-size bounds.
- Confirmed during tracing:
  - Static adjacent descriptor lists such as `OTLIST` depend on unlabeled
    `DESCR` entries being initialized in place. Allocating fresh descriptors
    during the second assembly pass leaves holes and breaks association lookup.
  - `VARID` bucket offsets must fall on descriptor boundaries. Computing `K`
    over all character addresses can create unaligned chain links and cycles
    through unrelated memory.
  - `ENDPTR` must be interned with the same bucket rule as `GENVAR`; otherwise
    the physical `END` card can be treated as a normal label and later fail as a
    duplicate definition.
  - `LOCAPV` treats the attribute-list size as relative to the list base
    (`A + size`), not as an absolute memory address.
  - Static `STRING` declarations such as `OUTSP` are converted to dynamic string
    structures during initialization, so association lookup currently succeeds
    by descriptor equality after that conversion.

### Active Target
The previous active target is complete: the minimal blank-prefixed
`OUTPUT = 'HELLO, WORLD'` program visibly prints. The next goal is to get
slightly more sophisticated SNOBOL scripts running, adding one new semantic
feature at a time and keeping each success covered by a focused integration
test.

Recommended progression:
1. Multiple literal output statements:
   ```snobol
    OUTPUT = 'HELLO, WORLD'
    OUTPUT = 'SECOND LINE'
   END
   ```
   This checks object-code sequencing and interpreter continuation while
   reusing the now-working literal-output path.
2. Variable assignment followed by variable output:
   ```snobol
    X = 'HELLO, WORLD'
    OUTPUT = X
   END
   ```
   This adds variable lookup after assignment. If it fails, inspect `GENVAR`,
   `ARGVAL`, `ASGN`, `ASGNVV`, and object-code descriptors for `X`.
3. String expression or concatenation:
   ```snobol
    X = 'HELLO'
    OUTPUT = X ' WORLD'
   END
   ```
   This starts exercising expression evaluation beyond a single literal or
   variable.
4. A minimal pattern-match-driven output:
   ```snobol
    X = 'HELLO'
    X 'H' OUTPUT = 'MATCHED'
   END
   ```
   This enters SNOBOL-specific pattern behavior and should come after statement
   sequencing and variable lookup are understood.

For each step, first reproduce with a scratch `.sno` file in `tmp/` and the
required guards, then add or extend a focused integration test only after the
runtime behavior is understood.

Known areas still worth checking:
- Runtime statistics still report zero statements and zero writes for the
  minimal output program even though visible output occurs.
- `STPRNT` and `OUTPUT` are still minimal JavaScript implementations of
  FORTRAN-like formatting. Exercise more formats before broadening behavior.
- More complex start-location and `END` card forms remain under-tested. Keep
  verifying object-code bases (`OCBSCL`, `CMBSCL`, `OCICL`) with descriptor
  probes before changing compiler control flow.
- I/O association behavior now works for `OUTPUT`, but other `INPUT`/`OUTPUT`
  forms should be checked with targeted tests before assuming the representation
  issues are fully solved.

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
