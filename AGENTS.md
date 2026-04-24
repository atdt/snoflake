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
- `npm test` passes: 211 tests.
- `tmp/hello.sno` (just `END`) compiles and terminates normally with guards.
- A correctly blank-prefixed minimal visible-output program now compiles,
  executes, and prints `HELLO, WORLD` with the required guards:
  ```sh
  printf " OUTPUT = 'HELLO, WORLD'\nEND\n" > tmp/min-output.sno
  node run.js --file=tmp/min-output.sno --maxSteps=100000 --maxMillis=1000
  ```
- Multiple literal `OUTPUT` statements compile, execute in order, and visibly
  print both lines. Covered by commit `2ccfd4b`:
  ```sh
  printf " OUTPUT = 'HELLO, WORLD'\n OUTPUT = 'SECOND LINE'\nEND\n" > tmp/two-output.sno
  node run.js --file=tmp/two-output.sno --maxSteps=100000 --maxMillis=1000
  ```
- Variable assignment followed by variable output compiles, executes, and
  visibly prints the assigned value. Covered by commit `59c7822`:
  ```sh
  printf " X = 'HELLO, WORLD'\n OUTPUT = X\nEND\n" > tmp/var-output.sno
  node run.js --file=tmp/var-output.sno --maxSteps=100000 --maxMillis=1000
  ```
- Variable/literal concatenation in an output expression compiles, executes,
  and visibly prints the concatenated string. Covered by commit `95de0c8`:
  ```sh
  printf " X = 'HELLO'\n OUTPUT = X ' WORLD'\nEND\n" > tmp/concat-output.sno
  node run.js --file=tmp/concat-output.sno --maxSteps=100000 --maxMillis=1000
  ```
- Minimal pattern replacement compiles, executes, and can be observed by
  printing the replaced subject. Covered by commit `baa8cf4`:
  ```sh
  printf " X = 'HELLO'\n X 'H' OUTPUT = 'MATCHED'\n OUTPUT = X\nEND\n" > tmp/pattern-replace-output.sno
  node run.js --file=tmp/pattern-replace-output.sno --maxSteps=100000 --maxMillis=1000
  ```
- Pattern-match failure goto now branches correctly when a string/string match
  fails. Covered by commit `576d6a5`:
  ```sh
  printf " X = 'HELLO'\n X 'Z' :F(SKIP)\n OUTPUT = 'BAD'\nSKIP OUTPUT = 'GOOD'\nEND\n" > tmp/pattern-failure-goto.sno
  node run.js --file=tmp/pattern-failure-goto.sno --maxSteps=100000 --maxMillis=1000
  ```
- Recent confirmed fixes: fixed-width source records, `ENDPTR` initialization,
  EOF handling in `STREAD`, `STREAM` STOP branching, `LOCAPV` value-field
  copying, unlabeled `DESCR`/`SPEC` assembly into preallocated slots,
  descriptor-aligned `VARID`/`ENDPTR` bucket offsets, `LOCAPV` relative
  list-size bounds, and omitted-branch fallthrough in `LEXCMP`.
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
  - `LEXCMP` must distinguish "no difference found yet" from "a difference
    selected an omitted branch." Otherwise `SCANVV` can treat a non-equal
    string/string comparison such as `H` versus `Z` as equality and skip the
    statement failure path.

### Active Target
The previous active targets are complete: multiple literal `OUTPUT` statements,
variable assignment followed by variable output, variable/literal
concatenation, minimal pattern replacement, and pattern failure goto all visibly
work. The next goal is to broaden pattern/goto behavior one small step at a
time and keep each success covered by a focused integration test.

Recommended progression:
1. Multiple literal output statements: complete, covered by `2ccfd4b`.
   ```snobol
    OUTPUT = 'HELLO, WORLD'
    OUTPUT = 'SECOND LINE'
   END
   ```
2. Variable assignment followed by variable output: complete, covered by
   `59c7822`.
   ```snobol
    X = 'HELLO, WORLD'
    OUTPUT = X
   END
   ```
3. String expression or concatenation: complete, covered by `95de0c8`.
   ```snobol
    X = 'HELLO'
    OUTPUT = X ' WORLD'
   END
   ```
4. Minimal pattern replacement: complete, covered by `baa8cf4`.
   ```snobol
    X = 'HELLO'
    X 'H' OUTPUT = 'MATCHED'
    OUTPUT = X
   END
   ```
   This enters SNOBOL-specific pattern behavior. The second statement is
   replacement syntax: `OUTPUT` is part of the pattern, not the output
   association target. With a matching leading `H`, the subject becomes
   `MATCHEDELLO`; with a non-matching literal such as `Z`, the subject remains
   `HELLO`.
5. Pattern failure goto behavior: complete, covered by `576d6a5`.
   ```snobol
    X = 'HELLO'
    X 'Z' :F(SKIP)
    OUTPUT = 'BAD'
   SKIP OUTPUT = 'GOOD'
   END
   ```
   This fixed `LEXCMP` omitted-branch fallthrough: a non-equal comparison with
   an omitted branch must fall through to the scanner retry/failure path, not
   later take the equality branch.
6. Pattern success/failure combined goto:
   ```snobol
    X = 'HELLO'
    X 'H' :S(MATCH)F(DONE)
   MATCH OUTPUT = 'MATCHED'
   DONE
   END
   ```
   Start by checking both the success and failure forms:
   ```sh
   printf " X = 'HELLO'\n X 'H' :S(MATCH)F(DONE)\nMATCH OUTPUT = 'MATCHED'\nDONE\nEND\n" > tmp/pattern-branch-success.sno
   node run.js --file=tmp/pattern-branch-success.sno --maxSteps=100000 --maxMillis=1000
   printf " X = 'HELLO'\n X 'Z' :S(MATCH)F(DONE)\nMATCH OUTPUT = 'MATCHED'\nDONE\nEND\n" > tmp/pattern-branch-failure.sno
   node run.js --file=tmp/pattern-branch-failure.sno --maxSteps=100000 --maxMillis=1000
   ```
   If both behave, add a focused integration test for the combined
   success/failure goto form.

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
