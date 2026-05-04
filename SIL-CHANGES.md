# SIL Change Reference

This file summarizes potentially portable bug fixes found by comparing the
original SNOBOL4 3.11 SIL source with Phil Budne's later CSNOBOL4 SIL source.
Use it as a reference when debugging behavior that appears to come from a
defect in the historical SIL, not as a reason to import the modern source
wholesale.

## Source Roles

- `external/v311.sil`: historical SNOBOL4 3.11 SIL baseline.
- `external/v311-snoflake.sil`: snoflake's working SIL input. It began as a
  copy of `external/v311.sil` and is the only SIL source that should be changed
  for local fixes used by `make translate`.
- `external/snobol4-v311.sil`: Phil Budne's CSNOBOL4 version, with later bug
  fixes, portability work, extensions, and non-original behavior.
- `src/SNOBOL/sil.js`: canonical local macro semantics for this JavaScript port.
  Its comment blocks remain the first local spec to check.
- `src/SNOBOL/snobol.sil.js`: generated output from `external/v311-snoflake.sil`.
  Do not hand-edit it.

## How To Use This Reference

Consult this file when:
- a behavior looks wrong after representation, translation, and JavaScript
  runtime issues have been ruled out;
- the failing area matches one of the fix candidates below;
- the macro comments or original SIL appear internally inconsistent;
- a CSNOBOL4 change can explain the failure with a narrow, testable invariant.

Do not use this file to:
- replace `external/v311.sil`, `external/v311-snoflake.sil`, or
  `src/SNOBOL/snobol.sil.js` wholesale;
- import CSNOBOL4 extensions such as SPITBOL/BLOCKS features as bug fixes;
- override `src/SNOBOL/sil.js` comments without direct evidence.

Before porting any SIL fix:
1. Reproduce the failure with a minimal SNOBOL program or macro-level test.
2. Verify descriptor/specifier state with targeted probes.
3. Compare `external/v311.sil`, `external/snobol4-v311.sil`, and
   `src/SNOBOL/sil.js` for the exact macro/procedure involved.
4. Decide whether the fix belongs in JavaScript runtime representation,
   translator behavior, `external/v311-snoflake.sil`, or a macro
   implementation.
5. If editing SIL, make the change in `external/v311-snoflake.sil`, not
   `external/v311.sil`, and annotate the changed area with:
   - why the change is needed;
   - the original invariant or macro behavior it preserves;
   - attribution for the source of the fix.
6. If porting from Phil Budne's CSNOBOL4 SIL, explicitly attribute it to
   CSNOBOL4/Phil Budne and include the `PLB` marker when one is known.
7. Run `make translate` after any SIL input change.
8. Add a focused test that fails before the change and passes after it.
9. Commit the fix separately from probe artifacts and unrelated cleanup.

## Candidate Fixes

### Lexical Comparison Operators

- Budne marker: `[PLB76]`
- Area: `LGT`, `LGE`, `LLT`, `LLE`, `LNE`
- Reported issue: original logic mishandles null arguments and `IDENT`-style
  edge cases before raw lexical comparison.
- Porting trigger: incorrect results or crashes in lexical comparison
  predicates, especially with null strings or identical operands.
- Expected fix shape: preserve identity/null checks before comparing character
  contents.

### Compiler Syntax Diagnostics

- Budne marker: `[PLB77]`
- Area: compiler parsing and syntax error reporting.
- Reported issues:
  - malformed constructs such as ` ()(` can trigger an internal compiler error
    instead of a normal syntax error;
  - syntax error pointer placement can be wrong when tabs occur before the
    error position.
- Porting trigger: compiler crash or misleading error pointer while compiling
  malformed input.
- Expected fix shape: add a narrow parse guard for invalid element/parenthesis
  combinations; adjust diagnostic pointer calculation without changing valid
  parse behavior.

### LOADed Function Argument Processing

- Budne marker: `[PLB87]`
- Area: invocation of functions introduced via `LOAD`.
- Reported issue: calls with more actual arguments than formal arguments can
  scan past the formal argument list.
- Porting trigger: runtime failure only when a `LOAD`ed function receives extra
  actual arguments.
- Expected fix shape: pass extra arguments through without applying formal-list
  conversion past the list end.

### Unevaluated Expression Pattern Backtracking

- Budne marker: `[PLB91]`
- Area: pattern matching for the `*` unevaluated-expression operator.
- Reported issue: backtracking can leave `PATBCL` based incorrectly after
  `UNSC` handling.
- Porting trigger: crashes or wrong matches during pattern backtracking through
  unevaluated expressions.
- Expected fix shape: clear the unevaluated-expression state and restore the
  pattern base pointer before resuming backtracking.

### Termination Control Flow

- Budne marker: `[PLB110]`
- Area: `END`/termination procedures.
- Reported issue: continuation from `END` after errors and duplicate `END2`
  labeling can produce unreliable termination control flow.
- Porting trigger: incorrect fatal/normal termination path, especially after an
  error condition.
- Expected fix shape: inspect labels and branch targets around `END`, `END2`,
  `FTLEND`, and continuation points before changing local control flow.

### Block/String Mutation Safety

- Budne markers: `[PLB118]`, `[PLB119]`
- Areas: `BLAND`, `BCHAR`.
- Reported issues:
  - `BLAND` uses an unsafe block move in cases that require overlap-aware
    behavior;
  - `BCHAR()` can mutate constant string storage.
- Porting trigger: memory corruption or mutation of static/constant strings
  during string/block operations.
- Expected fix shape: use the safer block move semantics where overlap is
  possible; ensure character mutation targets writable storage.

### Garbled Historical Source

- Budne marker: early cleanup near `[PLB1]`
- Area: labels near `END2` and `AERROR`.
- Reported issue: source corruption in some historical copies.
- Porting trigger: only relevant if regenerating or comparing SIL source reveals
  unparsable or nonsensical text near those labels.
- Expected fix shape: treat as source transcription repair, not a runtime
  semantic change.

## Non-Goals

The Budne SIL includes decades of useful work, but most of it is outside this
project's current scope. Avoid porting:
- new language features or operators;
- portability scaffolding for native CSNOBOL4;
- broad restructurings that obscure the macro implementation;
- behavior changes that cannot be tied to a demonstrated bug in this port.
