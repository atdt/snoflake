# Runtime Strategy

Goal: get a small SNOBOL program to execute an observable action, then harden
the surrounding runtime behavior.

## Verified Baseline
- `npm test`: 205 passing.
- Required guarded run form:
  `node run.js --file=tmp/program.sno --maxSteps=100000 --maxMillis=1000`
- `tmp/hello.sno` containing only `END` compiles and terminates normally.
- `tmp/hello2-endlabel.sno` containing `OUTPUT = 'HELLO, WORLD'` followed by
  `END` compiles, generates assignment object code, and terminates without
  printing the user string.

## What Changed Recently
- Source input is record-oriented: `STREAD` reads one physical source line,
  strips line ending bytes, truncates or pads to the requested record width,
  and advances to the next physical line.
- `STREAD` marks the unit descriptor closed at EOF and falls through for
  self-target EOF branches.
- `INIT` interns `ENDSP` into dynamic storage and stores that pointer in
  `ENDPTR`.
- `STREAM` now sends `STOP` termination to the success location. Previously
  `=` and closing literal delimiters could take the runout path and trigger
  unintended reads.
- `LOCAPV` now copies `DESCR2.value`; the old `DESCR2.values` typo crashed when
  output association lookup was reached.

## Current Hypothesis
The compiler can now build object code for a simple assignment, but the
interpreter is not starting from the intended code block.

Observed symptoms:
- `ASGNCL.addr` appears in memory outside the static function table after
  compiling `OUTPUT = 'HELLO, WORLD'`.
- Final `OCBSCL`/`CMBSCL` may point at the END function region instead of the
  assignment code region, yielding normal termination with zero statements
  executed.
- With `END START` style input, compilation can repeatedly process the consumed
  END card or empty `TEXTSP`, so the end-card protocol is still suspect.

## Next Debug Steps
1. Trace `XLATRN -> XLATNX -> XLATP -> XLAEND -> XLATND` for the minimal
   assignment program.
2. Identify exactly where `OCBSCL` is set after object-code generation.
3. Verify whether `CMPILE` should treat an `END` label by returning to the END
   handler instead of compiling it as a normal statement.
4. Re-evaluate the recent `ENDPTR` initialization and `STREAD` EOF fallthrough
   fixes if they conflict with the original SIL control flow.
5. Once output starts, add an integration test that captures `File.write` output
   for a minimal program.

## Pitfalls
- Do not edit `js/SNOBOL/snobol.sil.js` directly.
- `run.js` can loop forever without the required guards.
- `watch` output for ordinary symbols is not the same as descriptor contents;
  inspect `vm.d(symbol).raw()` in targeted probes when descriptor values matter.
- Keep scratch `.sno` files and logs uncommitted unless intentionally promoting
  one to a test fixture.
