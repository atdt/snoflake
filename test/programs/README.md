# Program-level test convention

`test/programs/` holds end-to-end SNOBOL test programs. Each `*.sno` file is a
single test case: a runnable SNOBOL program with an embedded header that
declares the test's title, runtime options, optional stdin, expected output,
and match mode. The mocha runner at `test/test-programs.js` enumerates the
directory and emits one `it(...)` per file.

These tests complement the focused unit tests in `test/test-*.js`. Use a
program-level test when the behavior under test is observable only by running
a full SNOBOL program through `snoflake`; use a focused unit test when the
behavior can be exercised at a single macro or helper.

## File format

Each `.sno` file starts with a header consisting of contiguous SNOBOL comment
lines (`*` in column 1). The header ends at the first non-comment line.
Everything below is the SNOBOL program and runs unmodified under
`node bin/snoflake.js --file=test/programs/<name>.sno`.

Header lines take one of two forms.

**Single-line directive.** The value is the rest of the line, trimmed.

```
* @key value
```

**Multi-line block.** Each line inside the block is `* ` followed by payload;
the runner strips the leading `* ` (or bare `*` for an empty payload line) and
preserves the rest verbatim.

```
* @key >>>
*   payload line 1
*   payload line 2
* <<<
```

An unrecognized `@key` is a parse error, so typos surface early instead of
silently dropping expectations.

## Directives

| Directive  | Form       | Required                          | Purpose                                                   |
|------------|------------|-----------------------------------|-----------------------------------------------------------|
| `@title`   | single     | yes                               | Used as the mocha test name.                              |
| `@options` | single     | no                                | JSON object merged into `snoflake`'s options.               |
| `@input`   | multi-line | no                                | Lines written to a tmp file; runner wires up `input` opt. |
| `@expect`  | either     | yes for `exact`/`substring`, no for `error` | Expected output.                                          |
| `@match`   | single     | no                                | `exact` (default), `substring`, or `error`.               |
| `@attribution` | single | no                                | Free-text credit for where the program came from. Informational only. |

### `@options`

JSON object. As a matter of convention, keep this on one line.

Validation enforced by the runner:

- Must parse as a JSON object. Arrays, strings, numbers, booleans, and
  `null` are rejected.
- `file` is reserved for the runner (which sets it to the fixture path) and
  is rejected if present in `@options`.
- `input` is rejected in `@options`. Inline `@input` blocks are the only
  supported way to feed runtime `INPUT(...)` reads, which keeps tests
  hermetic.

Other recognized keys (`caseFold`, …) are passed through to
`SNOBOL.VM(options)` exactly as `snoflake` does today.

### `@input`

The inline `@input` block is the only supported way to feed runtime
`INPUT(...)` reads. If present, the block payload is written to a tmp file
and the runner sets `"input": "<path>"` in the merged options object. Tests
without an `@input` block should not reference `INPUT`. The runner rejects
`input` in `@options` (see above), so `@input` and `@options.input` cannot
coexist.

### `@expect` block contents

Each line inside the block contributes one logical line of expected output.
The runner strips the leading `* ` (or bare `*` for an empty payload line)
and joins the payloads with `\n`, then appends a single trailing `\n`. So:

```
* @expect >>>
* A
* <<<
```

means `"A\n"`. To express a trailing blank line, include an explicit empty
payload:

```
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

### `@match`

Match modes:

- **`exact`** (default): the `@expect` block must equal the *data section* of
  `snoflake`'s stdout. The data section runs from the line after the
  `NO ERRORS DETECTED IN SOURCE PROGRAM` banner up to the line before the
  `NORMAL TERMINATION AT LEVEL` epilogue. The runner anchors on the *last*
  `NORMAL TERMINATION AT LEVEL` occurrence after the success banner so a
  program that prints the phrase itself does not truncate the data section.
  Interior blank lines are preserved; only the final trailing newline of the
  captured section is normalized before comparison.

  In this mode the runner also asserts that none of the recognized error
  markers appear anywhere in stdout.

- **`substring`**: the `@expect` block must appear as a contiguous substring
  anywhere in `snoflake`'s full stdout. Useful when banner extraction is
  brittle or the test is intentionally loose. The same error-marker check
  applies as in `exact`.

- **`error`**: assert the run *did* produce one of the recognized error
  markers. If `@expect` is present, it is matched as a substring against the
  captured stdout/stderr.

#### Recognized error markers

The same fixed list is used for both the negative check in `exact`/`substring`
and the positive check in `error`:

- `ERROR IN SNOBOL4 SYSTEM`
- `Compilation error`
- `Execution error`

Adding a new marker is a deliberate change to the runner, not something
tests can introduce ad hoc.

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
* @options {"caseFold": false}
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

## Adding fixtures

Use descriptive file names and titles that identify the behavior under test,
not just the chapter or page number. Prefer names like
`recursive-binary-conversion.sno` or `fullscan-combinations.sno`. Include an
`@attribution` tag when the program comes from a book, paper, historical
source, or local reduction of such an example.

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
Each `.sno` file becomes one mocha `it(...)` named by its `@title`.

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
`@options` runtime flags (`caseFold`, …) are not translated to
CSNOBOL4 invocation flags — fixtures that set them get a `WARN` line so
disagreements are not mis-attributed. Mismatched runs are dumped to
`tmp/check-csnobol4/<name>.actual`. Override the binary with `SNOBOL4=<path>`.
