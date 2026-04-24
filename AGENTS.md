# Repository Guidelines

This repository is a JavaScript port of the macro implementation of SNOBOL4,
based on `macro-implementation-of-snobol-4_ocr.pdf`. It still does not fully
run SNOBOL programs.

## Layout
- `src/`: SIL parser and translator (`sil.peg`, `translate.js`).
- `external/`: upstream SIL and syntax-table sources.
- `js/`: runtime; entry point is `js/snobol.js`, core modules are under
  `js/SNOBOL/`.
- `test/`: Mocha tests.
- `tmp/`: scratch programs and logs.

Do not hand-edit `js/SNOBOL/snobol.sil.js`; regenerate it with
`make translate` when translator or SIL input changes.

The comment blocks in `js/SNOBOL/sil.js` are extracted macro specifications
from the book and should be treated as canonical when tests disagree.

## Commands
- `npm test`: run all tests.
- `make test`: alias for `npm test`.
- `make translate`: regenerate `js/SNOBOL/snobol.sil.js`.
- `node run.js --file=tmp/example.sno --maxSteps=100000 --maxMillis=1000`:
  run a SNOBOL program with required execution guards.

Always include both `--maxSteps=100000` and `--maxMillis=1000` when invoking
`run.js`. Larger values are not permitted.

## Development Rules
- JavaScript style: CommonJS modules, `"use strict"`, 4-space indentation.
- Prefer focused tests in `test/test-*.js` for changed macro/runtime behavior.
- Use `rg` for searching.
- Commit each logical fix. Use useful commit messages with a clear subject and
  body for non-trivial runtime changes.
- Do not revert unrelated dirty or untracked files.

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

## Current State
- `npm test` passes: 205 tests.
- `tmp/hello.sno` (just `END`) compiles and terminates normally with guards.
- A simple assignment such as `OUTPUT = 'HELLO, WORLD'` now reaches object-code
  generation for `ASGN`, but user output still does not print.
- Recent confirmed fixes: fixed-width source records, `ENDPTR` initialization,
  EOF handling in `STREAD`, `STREAM` STOP branching, and `LOCAPV` value-field
  copying.

## Active Debugging Target
Focus on making a minimal program visibly do work, not on preserving
`tmp/hello.sno` behavior at all costs.

The next failure appears to be around end-card/start-location handling:
- `tmp/hello2-endlabel.sno` compiles and generates an `ASGN` descriptor, but
  `OCBSCL` ends up at the END function block, so interpretation starts at END
  and reports zero statements executed.
- A labeled start card plus `END START` can generate assignment code, but the
  compiler can loop on the consumed END card/empty `TEXTSP` path.
- Re-check the `ENDPTR` and `STREAD` EOF changes if they prove to be masking
  the real end-card protocol.

Useful probes:
- Dump object code after a guarded run and look for `ASGNCL.addr`.
- Trace `CMPILE`, `XLATP`/`XLAEND`, `OCBSCL`, `CMBSCL`, `CMOFCL`, `TEXTSP`, and
  `BRTYPE`.
- Keep probe logs in `tmp/` and do not commit them.
