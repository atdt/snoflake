# Snoflake

**Snoflake** is a BSD-licensed JavaScript implementation of [SNOBOL4][0]
(_StriNg Oriented and symBOlic Language_), the string-processing language
developed between 1962 and 1967 at AT&T Bell Laboratories by David J. Farber,
Ralph E. Griswold, and Ivan P. Polonsky.

SNOBOL4 is unlike most languages that followed it. Its patterns are first-class
values, can be built dynamically, can be recursive, and carry success and
failure directly into program control flow. That makes it a compact and
expressive language for text problems, and a artifact of programming language
history.

Snoflake is a port of the macro implementation of SNOBOL4. It tracks the SNOBOL4
version 3.11 SIL source, runs as a command-line interpreter, embeds as a
standard ES module, and runs unmodified in the browser.

> **Try it now:** [atdt.github.io/snoflake/demo/][3] lets you run SNOBOL4 in the
> browser, no install required.

> **User Guide:** [`docs/manual.md`](docs/manual.md) is the hands-on manual for
> command-line use, scripting, browser embedding, host extensions, and inline
> JavaScript helpers.

## What is here

Snoflake started as a proof of concept and has grown into a practical, tested
runtime for people who want to use, study, or extend SNOBOL4 in a modern
environment.

- The runtime is dependency-free JavaScript and is tested under Node, Deno, and
  Bun.
- The test suite includes the code from James F. Gimpel's _Algorithms in
  SNOBOL4_: compilers, macro processors, list and tree utilities, sorting,
  pattern examples, games, simulations, and more.
- SNOBOL programs can call host JavaScript functions through an extension API.
  In the browser, that means canvas, WebGL, fetch, crypto, and other web APIs.
  On the command line, it means the Node and Deno standard libraries and the
  broader JavaScript package ecosystem.
- Snoflake includes a small set of modern conveniences, including multi-line
  backtick strings, `-INCLUDE` and `-COPY` source loading, and host file
  bindings for runtime `INPUT` and `OUTPUT`.
- Releases include self-contained binaries for Linux, macOS, and Windows, for
  users who do not want to install a JavaScript runtime.

The project is still meant to feel close to the original system. The generated
image comes from the SNOBOL4 SIL source, and the JavaScript runtime is organized
so the macro implementation remains visible rather than buried.

## Usage

Snoflake can be used three ways: as a command-line interpreter, as a JavaScript
library, and in the browser.

### Command line

Install from npm and run a SNOBOL program:

```sh
npm install -g snoflake
snoflake hello.sno
```

You can also run the current npm release without installing it globally:

```sh
npx snoflake hello.sno
deno run -A npm:snoflake hello.sno
```

The CLI takes the source file as its first argument:

```sh
snoflake hello.sno
snoflake filter.sno --input=data.txt
snoflake eliza.sno --interactive
```

`--input` supplies a finite runtime input file. `--interactive` (or `-i`)
continues runtime `INPUT` reads from standard input after the source and any
`--input` file have been exhausted.

Pre-built single-file binaries are attached to the [GitHub releases][5].

### Library

Snoflake is a standard ES module:

```js
import { run } from 'snoflake';

const result = run( { file: 'hello.sno', interactive: true } );
process.exitCode = result.exitCode;
```

For advanced embedding, `createVM(options)` returns a configured VM while
`new VM(options)` remains the low-level, host-neutral machine. Options select
the source file, source text, input file, interactive stdin, output streams,
custom loaders, and host extensions. See
[`demo/lib/runner.js`](demo/lib/runner.js) for an in-memory browser example.

### JavaScript interop

The extension API lets SNOBOL call JavaScript functions as ordinary SNOBOL
functions. Extension signatures declare the SNOBOL-visible name, argument types,
and result type. JavaScript functions can return ordinary values or signal
SNOBOL failure with the exported `FAIL` sentinel.

```js
import * as SNOBOL from 'snoflake';

SNOBOL.run( {
    extensions: {
        'JSONGET(STRING,STRING)STRING': function ( text, key ) {
            const data = JSON.parse( text );
            return Object.hasOwn( data, key )
                ? String( data[key] )
                : SNOBOL.FAIL;
        },
    },

    source: `
        DATA = '{"name":"Snoflake","host":"JavaScript"}'
        OUTPUT = JSONGET(DATA, 'name')
        OUTPUT = JSONGET(DATA, 'host')
        OUTPUT = JSONGET(DATA, 'missing')          :F(NOPE)
NOPE    OUTPUT = 'missing key failed as SNOBOL failure'
END
`,
} );

// Output:
// Snoflake
// JavaScript
// missing key failed as SNOBOL failure
```

SNOBOL programs can also define JavaScript helpers inline with `LOAD`. Combined
with multi-line backtick strings, this makes natural bridges into host APIs:

```snobol
        LOAD('WORDS(STRING)STRING',`
            function (s) {
                var out = [];
                for (var p of new Intl.Segmenter("en",
                    { granularity: "word" }).segment(s))
                    if (p.isWordLike) out.push(p.segment);
                return out.join("|");
            }`)

        OUTPUT = WORDS("Hello world! こんにちは世界。 สวัสดีชาวโลก!")
END
```

```text
Hello|world|こんにちは|世界|สวัสดี|ชาว|โลก
```

That is SNOBOL calling `Intl.Segmenter` for Unicode word segmentation, including
text in Japanese and Thai where spaces do not define word boundaries.

### Browser

Snoflake runs unmodified in the browser. A hosted build of the demo is live at
[atdt.github.io/snoflake/demo/][3]. The demo loads `src/snobol.js` directly as
an ES module and captures output through custom writers.

With no build step or install, import it straight from a CDN such as
[esm.sh][4]:

```html
<!DOCTYPE html>
<meta charset="utf-8">
<title>Snoflake</title>
<pre id="out"></pre>

<script type="module">
    import * as SNOBOL from 'https://esm.sh/snoflake';

    const out = document.querySelector( '#out' );

    SNOBOL.run( {
        stdout: { write: ( line ) => out.textContent += line + '\n' },
        source: `
        WORD = 'SNOBOL'
        WORD LEN(3) . HEAD REM . TAIL
        OUTPUT = TAIL HEAD
END
`,
    } );
</script>
```

For the same idea with a tiny CodeMirror editor and a run button, see
[`demo/cdn-editor.html`](demo/cdn-editor.html).

To run the same demo against your local checkout:

```sh
npm run demo
```

Then open the URL it prints. The demo source under [`demo/`](demo/) is the
shortest path to embedding Snoflake in a web page.

## About

The goal of the project is to preserve, make accessible, and pay homage to a
chapter of computing history while keeping the system useful enough to explore.
It is meant to be pleasant to read, instructive to modify, and small enough to
understand.

The first large stretch of this project was done by hand, mostly in 2012 with
brief bursts of activity in the decade that followed, and got as far as having
SNOBOL4 crash early during initialization. The next stretch consisted of
debugging, tests, documentation, and cleanups, completed with the assistance of
agentic coding tools in April-May 2026.

## Dedication

This project is dedicated to my dad, Meir Livneh.

## License

Copyright (c) 2012-2026 [Ori Livneh][1]

Snoflake is distributed under the BSD 2-Clause License. See [LICENSE](LICENSE)
for the full text.

## Acknowledgments

This project incorporates several surgical bug fixes from [CSNOBOL4][2], Phil
Budne's free port of the original SNOBOL4 macro implementation to C. We are
deeply grateful to Phil Budne for his extensive work in maintaining and
improving the SNOBOL4 SIL source over several decades. The ported changes are
tagged inline with their original `[PLBnn]` revision markers. See
[LICENSE-CSNOBOL4](LICENSE-CSNOBOL4) for CSNOBOL4's BSD 2-Clause license.

[0]: http://en.wikipedia.org/wiki/SNOBOL
[1]: mailto:ori.livneh@gmail.com
[2]: https://github.com/philbudne/csnobol4
[3]: https://atdt.github.io/snoflake/demo/
[4]: https://esm.sh/
[5]: https://github.com/atdt/snoflake/releases
