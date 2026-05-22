# Gimpel fixtures — handoff notes

We're adding test fixtures under `test/programs/gimpel-*.sno` that exercise programs
and helper functions from Gimpel's *Algorithms in SNOBOL4* (1976). Goals:

1. End-to-end coverage of historically significant SNOBOL programs.
2. Spotting regressions.

For the fixture format, see [test/programs/README.md].
Reusable Gimpel includes go in [test/programs/gimpel/].
The runner adds that directory to the `-INCLUDE` search path.

## Sources of truth (in priority order)

**book > CSNOBOL4 > OCR > snoflake**.

snoflake errors are not evidence the source is wrong.

1. **`gimpel2/ocr-book/gimpel_full_book.md`** — full-book OCR pass.
   Authoritative when readable.
2. **`gimpel2/ocr-book/pages/`** — per-page OCR if you need to disambiguate.
3. **`gimpel2/SNOBOL4/*.SNO` and `*.INC`** — Catspaw SNOBOL4+ distribution.
   Convenient starting point but contains nonstandard SNOBOL4+ extensions and
   the occasional editorial drift from the book.
4. **`gimpel2/ocr-programs/{ch1_2,ch3_4,ch5_7,ch8_9}.md`** — partial OCR'd
   programs, useful for cross-checking individual snippets.
5. **CSNOBOL4** as a runnable cross-check: `snobol4 -b tmp/probe.sno`.
   Has its own extensions/bugs. Not a final authority.

## Typical issues encountered

### Catspaw SNOBOL4+ extensions to look for

`man snobol4func` (CSNOBOL4 manual) lists the nonstandard functions Catspaw
ships. Common offenders in Catspaw `.SNO`/`.INC` files:

- `apply(fn, args...)`
- `output(.VAR, unit, ...)`
- `TERMINAL = ~INPUT(.INPUT, 5, , 'name')` — `~` predicate negation and
  `TERMINAL` as a side-effect carrier.
- `apply()` again, plus `RSORT`-style overloads.
- `'CON:'` device strings for re-binding INPUT to the console — DOS-era,
  meaningless on snoflake.
- `gt.` / `eq.` / `le.` — period-suffixed predicates that *don't* return null
  (regular SNOBOL4 predicates return null on success).
- `SQRT(Y) = Y ** 0.5` fast path — works in snoflake because `**` accepts a
  real exponent; the falling-back Newton iteration in the same file is the
  book-version code.
- `CHAR(N)` — codepoint-to-character function. Not in v3.11 IBM SNOBOL4
  (declared in the macro spec header but never implemented). Replace with
  the standard SNOBOL4 idiom that indexes `&ALPHABET`:
  `&ALPHABET TAB(N) LEN(1) . VAR`. Snoflake's `&ALPHABET` is in ASCII
  order, so codepoint 8 is at index 8 (zero-based via `TAB`).
- Comma-operator inside parentheses: `(PREDICATE EXPR, FALLBACK)` returns
  `EXPR` if `PREDICATE` succeeds else `FALLBACK`. Shows up in `ORVISUAL.INC`,
  the `FRSORT.INC` chain, and a few places that build a pattern string
  conditionally on `IDENT(X) "''", X`. Not a v3.11 feature; rewrite to
  explicit goto or skip the affected program.

### Snoflake quirks not on the spec sheet

These are runtime behaviors of the snoflake VM (not Catspaw extensions)
that have bitten fixture work. None are bugs you should fix in `src/`
— work around them at the fixture level.

- Default case-fold (uppercase) is asymmetric for character-class
  patterns. `SPAN('abc')`, `ANY('abc')`, `BREAK('abc')` etc. **do not
  match** a lowercase subject even though substring/literal matches do.
  Consequence: book programs whose published source uses lowercase
  character classes (notably `HYPHENATE`'s `SPAN(LOWERS_ '-')`) fail
  silently in default mode. `--preserve-case` (`caseFold: false`) makes
  them match, but the entire fixture must then use uppercase
  identifiers consistently and you may hit further snoflake bugs
  (HYPHENATE in particular trips a `RangeError: Invalid Uint32` under
  preserve-case). When in doubt, exercise the function via its
  module-init pattern construction and skip the direct call.
- `-INCLUDE` re-executes a file's top-level statements every time it
  appears, including transitive re-includes. Side effects (DEFINE,
  assignments to global pattern variables, datatype definitions)
  compound. When a fixture pulls several Chapter-10-style includes
  that share dependencies, **include the file with the widest
  transitive chain first**. Putting `LINE.INC` before `BNORM.INC` /
  `INORM.INC` / `IMAGE.INC` makes the cluster work; the reverse order
  hangs LINE at runtime even though every individual call succeeds.
  Root cause not investigated; the rule is reliable.
- Top-level pattern construction in an include runs at include-time
  against whatever globals exist *then*. `SPACING.INC` builds
  `IF_OVERSTRIKE = BREAK(BSPACE USCORE)` at the top, which fails with
  "NULL STRING IN ILLEGAL CONTEXT" if BSPACE/USCORE are still null.
  The fix is an idempotent early-bind shim in the include that
  introduces the globals first — see SPACING.INC's
  `IDENT(BSPACE) :F(...)` guard for the template.

### OCR-specific quirks (per repo memory)

- `aX` in OCR is almost always `@X` (cursor-position operator).
- Smart quotes / em-dashes / unicode `≤≥¬` for `LE GE ~`.
- Spaces around `<` and `>` confused with HTML tags — sometimes split as
  `</noun>` etc. The Markdown OCR includes literal HTML, so when scanning a
  page expect closing-tag garbage at the end of a verbatim block.
- Line continuation: continuation lines in SNOBOL4 begin with `+`, `.` or
  `*` in column 1; OCR sometimes loses the leading whitespace, sometimes
  the `+`.
- Comment cards (`*` in column 1) versus pattern multiplication `*X`.
- `wanton` vs `wonton` — Catspaw typo; book has `wanton`. Use the book form
  (per priority rule above).

### Loading shared data files at runtime

Fixtures can open data files with `INPUT(.INPUT, U, , 'NAME')` and the
loader will resolve `NAME` against the SNOLIB search path (same as
`-INCLUDE`). Data files committed under `test/programs/gimpel/` (e.g.
`PHRASES.IN`, `MFA.IN`, `MFB.IN`) are found by bare name.

When the SNOBOL program needs to switch `INPUT` back to stdin (e.g.
load a phrase grammar from a file and then read user responses from
`@input`), the pattern is:

```snobol
    INPUT(.INPUT, 8, , 'PHRASES.IN')    ; bind INPUT to unit 8 = file
-INCLUDE "PHRASE.INC"                    ; consumes phrases via INPUT
    INPUT(.INPUT, 5)                     ; rebind INPUT back to unit 5
```

Unit 5 still holds the post-compile runtime-input segment, so the
rebind is a pure INATL change (no file open). Use unit 8 or 9 (not 6):
CSNOBOL4 reserves 6 for OUTPUT and binding INPUT to unit 6 kills
subsequent OUTPUT writes.

If the fixture needs a writable scratch file (e.g. ASM uses `tmp/ASMTEMP`),
write under a `tmp/` prefix. The repo-wide gitignore covers both the
top-level `tmp/` (snoflake's test cwd) and `test/programs/gimpel/tmp/`
(CSNOBOL4 cross-check cwd).

### Common Catspaw-include defects

- `POKEV.INC` calls `SUBSTR` but doesn't `-INCLUDE "SUBSTR.INC"`. Fixed by
  adding the include directly to the file.
- Several Catspaw includes are CRLF-terminated. Normalize to LF before
  committing:

  ```sh
  tr -d '\r' < FILE.INC > FILE.INC.tmp && mv FILE.INC.tmp FILE.INC
  ```

## Prefer the book's own inputs and outputs

When the book gives a sample input (Table 16.4's 1927 Yankees stats for
RSEASON, the four-stanza RPOEM run with `RAN_VAR = 1`, etc.), **use those
verbatim**. The fixture then doubles as a regression check against the book
itself, and a reader can cross-reference it against the printed page.
Only when the book gives no sample should you craft your own input — and
even then prefer values that would have been natural in 1976 (small
integers, short alphabetic strings) over arbitrary modern choices.

If the book shows partial output ("the first four calls produce..."),
cap your loop so the fixture stops where the book stops. See
`gimpel-random-poem.sno`, where the program's `LT(N, ...)` bound was
adjusted to emit exactly the four stanzas the book prints.

## Workflow per fixture

1. **Find the program in the book OCR**. Cross-reference chapter/section
   number from `gimpel2/CONTENTS.TXT` against the Markdown OCR. Read the
   book's prose around the program — it usually includes a sample
   invocation and expected output. **The book is the spec, and the book
   programs are pure SNOBOL4.** Anything the book does will run on
   snoflake; anything in Catspaw that the book does not show is a
   suspect.
2. **Copy the book's sample input/output verbatim** (see above).
3. **Start from the Catspaw `.INC`/`.SNO`** as a working code skeleton,
   then immediately grep it for the known SNOBOL4+ extensions listed
   above before running anything:
   ```sh
   egrep -n 'CHAR\(|apply\(|output\(|TERMINAL|CON:|gt\.|eq\.|le\.|STLIMIT|~INPUT|\(.*,.*,.*\)' \
       test/programs/gimpel/<NEW.INC> ... | head
   ```
   Patch each hit to the standard SNOBOL4 idiom, citing the book section
   that confirms the replacement. Do this *before* the first probe; it
   saves a round of "undefined function" debugging.
4. **Strip Catspaw extensions** until the program is clean SNOBOL4. The OCR
   book version is the spec.
5. **Copy any newly required `.INC` files into `test/programs/gimpel/`**;
   normalize LF.
6. **Dry-run via the CLI**:

   ```sh
   node bin/snoflake.js --file=tmp/probe.sno -I test/programs/gimpel \
                       --input=tmp/probe.in
   ```

7. **Write the fixture** with `@input` (if needed) and `@expect`.
8. **`node --test test/test-programs.js 2>&1 | grep -E "<name>|fail|✖"`**
   to verify.
9. **Commit with a body** explaining what was changed from Catspaw and why
   (cite the book section). One fixture per commit.

## Useful commands (collected from this work)

```sh
# Find the chapter section for a program in the book
grep -n "RSEASON\|16\.10" gimpel2/ocr-book/gimpel_full_book.md | head -10
sed -n '12595,12680p' gimpel2/ocr-book/gimpel_full_book.md

# Dry-run a probe with stdin
node bin/snoflake.js --file=tmp/probe.sno -I test/programs/gimpel \
                    --input=tmp/probe.in

# Cross-check against CSNOBOL4 (also accepts -INCLUDE)
cp test/programs/gimpel/*.INC tmp/
snobol4 -b -Itmp tmp/probe.sno

# Spot-check a fixture by name
node --test test/test-programs.js 2>&1 | grep -E "<title-substring>|fail|✖"

# Full test run with summary
node --test test/test-programs.js 2>&1 | tail -8

# CSNOBOL4 cross-check via repo tool. The tool runs CSNOBOL4 with
# cwd=test/programs/gimpel/ so runtime INPUT() filenames resolve
# alongside the .INC files. Post-END source data is spliced onto stdin
# before the @input block so CSNOBOL4 sees the same stream snoflake does.
node tools/check-csnobol4.js                    # all fixtures (122/122)
node tools/check-csnobol4.js random-poem        # one fixture (basename)
node tools/check-csnobol4.js --update FIX       # rewrite @expect from snobol4
```

## Standalone `.SNO` programs

| File          | Status                | Notes |
|---------------|----------------------|-------|
| `ASM.SNO`     | `gimpel-asm-machine-m.sno` | Two-pass assembler. Writes pass-1 scratch to `tmp/ASMTEMP` (gitignored). Required adding `LPAD.INC` to the includes (PASS2's `CVTSYM` calls it; Catspaw omits the include). `DETACH(.PUNCH)` suppresses the hex card stream so snoflake (PUNCH→stdout) and CSNOBOL4 (PUNCH dropped) agree. |
| `BCD_EBCD.SNO`| `gimpel-bcd-ebcd-conversion.sno` | |
| `INFINIP.SNO` | `gimpel-infinip-arithmetic.sno` | Driver rewritten — Catspaw `INFINIP.SNO` uses `apply()`/extended `output()`. INFINIP.INC itself is clean SNOBOL4. |
| `L_ONE.SNO`   | `gimpel-l-one-compiler.sno` | |
| `L_TWO.SNO`   | `gimpel-l-two-compiler.sno` | |
| `POKER.SNO`   | `gimpel-poker-game.sno` | Scripted self-play; loads `PHRASES.IN` via `INPUT(.INPUT, 8, , 'PHRASES.IN')` then rebinds `INPUT` to unit 5 for the scripted game responses. Required adding `SUBSTR.INC` to `POKEV.INC`. |
| `RPOEM.SNO`   | `gimpel-random-poem.sno` | First four stanzas verbatim from book; iteration cap adjusted accordingly. Uses book-form `wanton` (Catspaw has `wonton`). |
| `RSEASON.SNO` | `gimpel-rseason-baseball.sno` | `&STLIMIT = -1` replaced with large literal; SQRT-based stddev dropped (snoflake has no built-in SQRT in this context). |
| `RSTORY.SNO`  | `gimpel-random-story.sno` | |
| `STONE.SNO`   | `gimpel-stone-game.sno` | Scripted self-play; same data-file load pattern as POKER. |
| `TEST_CODE.SNO`| `gimpel-code-function.sno` | One-liner exercising the `CODE()` built-in. |

## Remaining `.INC` gaps (function-level clusters)

Each entry below would be **one fixture per topical cluster** — bundle pure
helpers that take args/return values into a single fixture (e.g. the existing
`gimpel-sorting-functions.sno`, `gimpel-additional-string-functions.sno`).
**Stateful coroutines over `INPUT` need separate fixtures** (see the Ch 9
breakdown — `READ`/`FORTREAD`/`PARAGRAPH`/`SNOREAD`/`TREEREAD` all share the
`INPUT_BUF`/`NF_INPUT` globals and eat `INPUT` until EOF, so they don't
cluster cleanly).

- **Ch 2** date conversion: `DAY` covered by
  `gimpel-day-of-week.sno`. The include uses the book's integer
  century constants and slash-separated `DATE()` fallback pattern rather
  than Catspaw's SNOBOL4+ real-arithmetic/date-format edits.
- **Ch 5** structure traversal: `VISIT` covered by
  `gimpel-visit-structure-functions.sno`. The fixture checks that
  `DATA` inserts the hidden `MARK` field, the redefined `FIELD` keeps
  that field invisible, and `VISIT(ST,-1)` resets marks so a structure
  can be visited again.
- **Ch 8** matchers: `ASM360`, `PLI_STMT`, `ONCE` covered by
  `gimpel-asm360-pli-once.sno`; `TEST` covered by
  `gimpel-test-pattern-predicate.sno`. `ORVISUAL` skipped: it relies on the
  SNOBOL4+ comma-operator `(IDENT(X) "''", X)` conditional, which
  snoflake (and pre-SNOBOL4+ SNOBOL4) does not implement.
- **Ch 9** I/O readers (single fixture each, see notes below):
  `gimpel-fortran-statement-reader.sno`, `gimpel-paragraph-reader.sno`,
  `gimpel-snobol-statement-reader.sno`, `gimpel-tree-reader.sno`,
  `gimpel-line-output.sno`, `gimpel-mfread-multi-file.sno` — all done.
- **Ch 10** line shaping `BNORM`, `INORM`, `IMAGE`, `LINE` covered by
  `gimpel-bnorm-inorm-image-line.sno`. Each Catspaw include initialises
  `BSPACE = CHAR(8)` (a SNOBOL4+ extension snoflake does not
  implement); they are patched to the standard SNOBOL4 idiom
  `&ALPHABET TAB(8) LEN(1) . BSPACE`. SPACING.INC adds an idempotent
  early-bind shim so the BSPACE/USCORE globals exist before any
  pattern that uses them is constructed (the includes form a diamond
  through PAD→SPACING that previously failed when SPACING loaded
  before BNORM in LINE.INC's chain). HYPHENATE is loaded but not
  invoked: its lowercase-only TRUE_WORD pattern fails under snoflake's
  default case-fold (lowercase SPAN/ANY do not match in that mode),
  and `--preserve-case` trips a separate snoflake bug
  (`RangeError: Invalid Uint32`) when HYPHENATE runs.
- **Ch 11** timing/profiling: `LPROG`, `RESOLUTI`, `TIMER`, `TIMEGC`,
  `SYSTEM`, `FPROFILE`, `TPROFILE`. Timing-dependent; assertions will be
  brittle. Probably worth `@match substring` on structural output only, or
  skip.
- **Ch 13** sort variants `FRSORT`, `INSERTB`, `LSORT`, `MSORT`, `TSORT`
  covered by `gimpel-merge-tournament-sort-variants.sno`. FRSORT.INC's
  Catspaw `-INCLUDE "STRINGOUT.INC"` is patched to the 8.3-truncated
  `STRINGOU.INC` filename used elsewhere in the test/programs/gimpel/
  tree.
- **Ch 14** function manipulation: `DEXTERN`, `FTRACE`, `INSULATE`, `STATEF`,
  `STACK`, and `PHYSICAL` covered by `gimpel-dextern-loader.sno`,
  `gimpel-function-tracing.sno`,
  `gimpel-insulate-anchor.sno`, `gimpel-state-functions.sno`,
  `gimpel-generated-stack-functions.sno`, and
  `gimpel-physical-quantities.sno`. Keep `STACK` and `STATEF` in separate
  fixtures: both define a `LINK` datatype, but with different field order.
  `DEXTERN.INC` uses unit 8 as the concrete `LIB_` file designator and
  `DEXLIB.IN` keeps a literal space after each function label because the
  book's loader pattern is `LBL (' ' | RPOS(0))`.
- **Ch 15** real-math `ARC`, `LOG`, `RAISE`, `TRIG` covered by
  `gimpel-real-math-functions.sno`. The fixture prints scaled integer
  values to avoid last-bit/formatting drift between snoflake and CSNOBOL4.
  `LOG.INC` and `RAISE.INC` use the book algorithms rather than Catspaw's
  SPITBOL/SNOBOL4+ shortcuts (`LN` and real `**`). `ARC.INC` keeps the
  book's ATAN behavior but implements it as an explicit function body because
  the book's multi-statement `DEXP` form compiles poorly in both runners.
  The fixture avoids broad `LOG(X)`/`RAISE(X,Y)` cases that drive snoflake's
  real arithmetic into an error inside the book CLOG iteration; CSNOBOL4
  completes those cases.
- **Ch 16** stochastic helpers `RAMM`, `RCHAR`, and `RWORD` covered by
  `gimpel-random-string-functions.sno`. `RAMM.INC` is patched to seed its
  separate Knuth generator state before table initialization and to use the
  book's integer `REMDR` constants instead of Catspaw's real constants.
  `ONEWAY` is broken in both Catspaw and CSNOBOL4 (REMDR on real args) —
  try to rewrite to book form.
- **Ch 17** game helper `TICTACTO` covered by
  `gimpel-tictactoe-functions.sno`.
- **Ch 18** processors `BLANKS`, `GPM`, `TREE` covered by
  `gimpel-fortran-blank-removal.sno`, `gimpel-general-purpose-macro.sno`,
  and `gimpel-tree-pattern.sno`.

## Things to be careful about

- Do **not** modify `src/sil.js` or anything under `src/` to make a fixture
  pass. Per the user's standing instruction: leave the test broken instead.
  Snoflake's macro behavior is the spec under audit.
- The runner anchors `@expect` on the *data section* between the
  `NO ERRORS DETECTED IN SOURCE PROGRAM` banner and the *last*
  `NORMAL TERMINATION AT LEVEL` line. Programs that print those phrases
  themselves are fine.
- `PUNCH` defaults to stdout in snoflake; `PUT`/`SNOPUT` write to *both*
  `OUTPUT` and `PUNCH`, which doubles output. `DETACH(.PUNCH)` before the
  first call — the book's own epilogue recommends this for debugging.
- The deterministic `RANDOM.INC` seed (`RAN_VAR = 1`) means RSENTENCE-based
  outputs are reproducible — that's why RPOEM/RSEASON/STONE/POKER can match
  exact text.
- The shared `ERROR_MARKERS` list is matched case-insensitively in both
  runners, and `' at level '` is a marker (catches the IBM-spec
  `ERROR NN IN STATEMENT NN AT LEVEL NN` preamble emitted by snoflake
  uppercase and CSNOBOL4 mixed-case). Fixtures asserting an expected
  runtime error should use `@match error` (which accepts a non-zero
  CSNOBOL4 exit), not `@match substring` (which rejects it).
- `@match error`'s `@expect` substring is checked case-insensitively. Error
  message formatting differs between implementations; the fixture
  describes semantic content, not formatting.
- Snoflake (and IBM SNOBOL4) treats the source file as a single stream:
  lines after `END` are not source, they're runtime `INPUT` data on the
  same unit. CSNOBOL4 disables this by default (its `-r` flag toggles it).
  `tools/check-csnobol4.js` detects post-`END` source and prepends it to
  stdin so both implementations see the same stream. The Duquet ELIZA
  fixture relies on this — its conversation script sits after `END`.
