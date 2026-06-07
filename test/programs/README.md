# Program-level test convention

`test/programs/` holds end-to-end SNOBOL test programs. Each `*.sno` file is a
single test case: a runnable SNOBOL program with an embedded header that
declares the test's title, runtime options, optional stdin, expected output, and
match mode. The Node test runner at `test/test-programs.js` enumerates the
directory and emits one `it(...)` per file.

These tests complement the focused unit tests in `test/test-*.js`. Use a
program-level test when the behavior under test is observable only by running a
full SNOBOL program through `snoflake`; use a focused unit test when the
behavior can be exercised at a single macro or helper.

## File format

Each `.sno` file starts with a header consisting of contiguous SNOBOL comment
lines (`*` in column 1). The header ends at the first non-comment line.
Everything below is the SNOBOL program and runs unmodified under
`node bin/snoflake.js test/programs/<name>.sno`.

Header lines take one of two forms.

**Single-line directive.** The value is the rest of the line, trimmed.

```snobol
* @key value
```

**Multi-line block.** Each line inside the block is `*` followed by payload; the
runner strips the leading `*` (or bare `*` for an empty payload line) and
preserves the rest verbatim.

```snobol
* @key >>>
*   payload line 1
*   payload line 2
* <<<
```

An unrecognized `@key` is a parse error, so typos surface early instead of
silently dropping expectations.

## Directives

| Directive      | Form       | Required                                    | Purpose                                                                            |
| -------------- | ---------- | ------------------------------------------- | ---------------------------------------------------------------------------------- |
| `@title`       | single     | yes                                         | Used as the test name.                                                             |
| `@options`     | single     | no                                          | JSON object merged into `snoflake`'s options.                                      |
| `@input`       | multi-line | no                                          | Lines written to a tmp file; runner wires up `input` opt.                          |
| `@expect`      | either     | yes for `exact`/`substring`, no for `error` | Expected output.                                                                   |
| `@match`       | single     | no                                          | `exact` (default), `substring`, or `error`, with an optional `/i` modifier.        |
| `@attribution` | single     | no                                          | Free-text credit for where the program came from. Informational only.              |
| `@nonstandard` | single     | no                                          | Output is implementation-defined; reference cross-checks skip it. Optional reason. |

### `@options`

JSON object. As a matter of convention, keep this on one line.

Validation enforced by the runner:

- Must parse as a JSON object. Arrays, strings, numbers, booleans, and `null`
  are rejected.
- `file` is reserved for the runner (which sets it to the fixture path) and is
  rejected if present in `@options`.
- `input` is rejected in `@options`. Inline `@input` blocks are the only
  supported way to feed runtime `INPUT(...)` reads, which keeps tests hermetic.

Other recognized keys (`case`, `list`, ...) are passed through to
`createVM(options)` exactly as `snoflake` does today.

### `@input`

The inline `@input` block feeds the program's default `INPUT` stream (unit 5).
If present, the block payload is written to a tmp file and the runner sets
`"input": "<path>"` in the merged options object. The runner rejects `input` in
`@options` (see above), so `@input` and `@options.input` cannot coexist.

Fixtures that need to read additional named data files at runtime can open them
via SNOBOL's `INPUT(.VAR, U, , 'NAME')` association — see
[Loading shared data files](#loading-shared-data-files) below.

### `@expect` block contents

Each line inside the block contributes one logical line of expected output. The
runner strips the leading `*` (or bare `*` for an empty payload line) and joins
the payloads with `\n`, then appends a single trailing `\n`. So:

```snobol
* @expect >>>
* A
* <<<
```

means `"A\n"`. To express a trailing blank line, include an explicit empty
payload:

```snobol
* @expect >>>
* A
*
* <<<
```

means `"A\n\n"`. Interior blank lines are preserved verbatim; only the final
newline of the actual output is normalized when comparing.

### `@attribution`

Optional single-line free text crediting the source of the program (e.g.
`Griswold 1971, §3.4`). Informational; the runner does not act on it.

### `@nonstandard`

Marks output as implementation-defined: the runner still asserts `@expect`, but
reference cross-checks (`tools/check-csnobol4.js`) skip the fixture. Trailing
text is an optional reason.

### `@match`

Match modes:

- **`exact`** (default): the `@expect` block must equal `snoflake`'s output. The
  runner leaves the banner and termination epilogue suppressed (their default),
  so the output is exactly what the program writes. Interior blank lines are
  preserved; only the final trailing newline is normalized before comparison.

  In this mode the runner also asserts that none of the recognized error markers
  appear anywhere in stdout.

- **`substring`**: the `@expect` block must appear as a contiguous substring
  anywhere in `snoflake`'s output. Useful when the test is intentionally loose.
  The same error-marker check applies as in `exact`.

- **`error`**: assert the run _did_ produce one of the recognized error markers.
  If `@expect` is present, it is matched as a substring against the captured
  stdout/stderr.

Append `/i` to `exact` or `substring` (e.g. `@match substring/i`) to compare
case-insensitively, for output whose casing is implementation-formatted (`error`
already ignores case, so `/i` is rejected there).

#### Recognized error markers

The same fixed list is used for both the negative check in `exact`/`substring`
and the positive check in `error`. Matches are case-insensitive:

- `ERROR IN SNOBOL4 SYSTEM`
- `Compilation error`
- `Execution error`
- `at level` — catches the runtime-error preamble
  `Error NN in statement NN at level NN` emitted by both implementations

Adding a new marker is a deliberate change to the runner, not something tests
can introduce ad hoc.

In `error` mode, the `@expect` substring is also matched case-insensitively.
Error-message formatting differs between implementations (snoflake uppercase,
CSNOBOL4 mixed); the fixture describes semantic content, not formatting.

#### Picking between `substring` and `error`

For a fixture that asserts an expected runtime error (e.g. an explicit
`&STLIMIT` violation), use `@match error`. `@match substring` requires a clean
exit, which CSNOBOL4 does not produce on runtime errors — the cross- check
helper would reject it even though snoflake's in-process run accepts it.

On mismatch, the runner dumps full actual output to
`tmp/test-programs/<name>.actual` and references the path in the assertion
message.

## Examples

Simple case:

```snobol
* @title chapter 1 integer arithmetic precedence
* @expect >>>
* -1
* 28
* 1
* 243
* 256
* <<<
 OUTPUT = 3 - 6 + 2
 OUTPUT = 2 * (10 + 4)
 OUTPUT = 7 / 4
 OUTPUT = 3 ** 5
 OUTPUT = (2 ** 2) ** 3
END
```

Input plus runtime options:

```snobol
* @title chapter 3 input copy loop, no case folding
* @options {"case": false}
* @input >>>
* alpha
* Beta
* GAMMA
* <<<
* @expect >>>
* alpha
* Beta
* GAMMA
* <<<
LOOP    LINE = TRIM(INPUT)              :F(DONE)
        OUTPUT = LINE                   :(LOOP)
DONE
END
```

Error-path test:

```snobol
* @title undefined function call reports execution error
* @match error
* @expect ERROR IN SNOBOL4 SYSTEM
 OUTPUT = NOSUCH(1)
END
```

## Loading shared data files

A fixture can open named data files at runtime through the standard
`INPUT(.VAR, U, , 'NAME')` association. The loader resolves `'NAME'` against the
SNOLIB search path — the same lookup `-INCLUDE` uses — so a file committed under
`test/programs/gimpel/` (or wherever `gimpelLoader` points) is found by bare
name regardless of the test runner's cwd.

This is the right idiom when the program needs:

- a shared data file used by several fixtures (e.g. `PHRASES.IN`, `RSEASON.IN`),
- multiple distinct input streams interleaved (e.g. `MFREAD`),
- or a program written faithful to its historical original, which opens files by
  name rather than reading raw stdin.

### Switching `INPUT` back to the `@input` stream

To rebind the `INPUT` variable to the runtime stdin stream after consuming a
file, use the unit-rebind idiom:

```snobol
        INPUT(.INPUT, 8, , 'PHRASES.IN')   ; bind INPUT to unit 8 = file
-INCLUDE "PHRASE.INC"                       ; consumes phrases via INPUT
        INPUT(.INPUT, 5)                    ; rebind INPUT to unit 5 (stdin)
```

Unit 5 still holds the runtime-input segment carried over from compilation, so
the rebind is a pure INATL association change with no file open. Subsequent
reads of `INPUT` continue from the `@input` block.

Use unit 8 or higher (not 6 or 7) for the data file: CSNOBOL4 reserves unit 6
for `OUTPUT` and unit 7 for `PUNCH`, and rebinding either to an input file makes
subsequent writes to that stream fail.

### Writable scratch files

Programs that need a writable temporary file (e.g. the two-pass ASM fixture's
`tmp/ASMTEMP` scratch listing) should write under a `tmp/` prefix. The repo-wide
`tmp/` gitignore covers both the top-level `tmp/` (the snoflake test runner's
cwd) and `test/programs/gimpel/tmp/` (the CSNOBOL4 cross-check helper's cwd).
The cross-check helper pre-creates the latter so the fixture's first
`OUTPUT(...)` to a `tmp/`-prefixed path can open the file.

### Post-`END` source data

Historical SNOBOL4 (and snoflake) treats the source file as a single stream:
lines after the `END` statement are not source, they are runtime `INPUT` data
read off the same unit. CSNOBOL4 disables this by default (its `-r` flag toggles
it). The cross-check helper detects post-`END` source and prepends it to the
`@input` block when piping stdin to CSNOBOL4, so a fixture relying on this
layout (e.g. the original Duquet ELIZA distribution, whose conversation script
sits after `END`) runs under both implementations.

## Adding fixtures

Use descriptive file names and titles that identify the behavior under test, not
just the chapter or page number. Prefer names like
`recursive-binary-conversion.sno` or `fullscan-combinations.sno`. Include an
`@attribution` tag when the program comes from a book, paper, historical source,
or local reduction of such an example.

When transcribing historical examples, remember that OCR output is often wrong
in exactly the places SNOBOL cares about most: leading blanks, continuation
lines, quote characters, cursor-position operators, and array/name reference
brackets. Reconstruct the runnable program from the surrounding prose and the
book image when needed. For Griswold examples, OCR `aX` usually means the
cursor-position operator `@X`.

If the source does not provide reference input or output, the `snobol4`
executable in `PATH` is available as a CSNOBOL4 reference implementation. Keep
the probe in `tmp/` and run it with the startup banner disabled:

```sh
snobol4 -b tmp/probe.sno < tmp/probe.in > tmp/probe.out
```

For a self-contained quick check:

```sh
cat > tmp/probe.sno <<'EOF'
          OUTPUT = 'HELLO, WORLD'
END
EOF
snobol4 -b tmp/probe.sno
```

Treat CSNOBOL4 output as useful reference evidence, not as proof that Snoflake
is wrong. CSNOBOL4 includes extensions and implementation choices that may not
belong in this historical macro-port. It is still fine to add a fixture that
currently fails when the expected behavior is well-supported by the book or by
CSNOBOL4 and the fixture captures a real compatibility target.

For input-driven fixtures, put stdin in an `@input` block rather than in
`@options`. If the historical program assumes fixed-width card input, either
preserve the significant blanks in the `@input` block or make the program trim
only the display copy while matching against the fixed-width data. Be explicit
about blank output lines in `@expect`; a bare `*` line inside the block means an
expected empty line.

## Running

`npm test` picks up `test/test-programs.js` along with the rest of the suite.
Each `.sno` file becomes one `it(...)` named by its `@title`.

## CSNOBOL4 cross-check

`tools/check-csnobol4.js` runs fixtures through `snobol4 -b` and compares the
captured output against the parsed `@expect` / `@match` directives. Use it to
validate a new fixture's expected output against the reference implementation,
or to spot drift after editing `@expect`.

```sh
node tools/check-csnobol4.js                 # all fixtures
node tools/check-csnobol4.js basic-patterns  # one fixture (basename or path)
node tools/check-csnobol4.js --update FIX    # rewrite @expect with CSNOBOL4 stdout
```

`--update` only rewrites `@match exact` fixtures whose CSNOBOL4 run did not
error; `substring` and `error` fixtures are left untouched with a skip note.
`@options` runtime flags (`case`, …) are not translated to CSNOBOL4 invocation
flags — fixtures that set them get a `WARN` line so disagreements are not
mis-attributed. Mismatched runs are dumped to
`tmp/check-csnobol4/<name>.actual`. Override the binary with `SNOBOL4=<path>`.
