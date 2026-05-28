Snoflake
==========
**Snoflake** is a BSD-licensed JavaScript implementation of [SNOBOL4][0]
(_StriNg Oriented and symBOlic Language_), the string-processing language
developed between 1962 and 1967 at AT&T Bell Laboratories by David J. Farber,
Ralph E. Griswold and Ivan P. Polonsky.

SNOBOL is highly distinct and excels at string manipulation and
pattern-matching. SNOBOL patterns may be recursive and are available as a
first-class data type.

Snoflake is a port of the macro implementation of SNOBOL4. It tracks the
SNOBOL4 version 3.11 SIL source and is a working, usable implementation of
the language.

> **Try it now:** [atdt.github.io/snoflake/demo/][3] — Snoflake runs in
> your browser, no install required.

> **📖 User Guide:** [`docs/manual.md`](docs/manual.md) — a complete,
> hands-on manual for running Snoflake from the shell, scripting it,
> embedding it in a web page, and extending it. Start here.

Usage
-----
Snoflake can be used three ways: as a command-line interpreter, as a
JavaScript library, and in the browser.

### Command line

Install from npm and run a SNOBOL program:

```
npm install -g snoflake
snoflake hello.sno
```

The CLI also accepts explicit source and input options:

```
snoflake --file=hello.sno
snoflake --file=filter.sno --input=data.txt
snoflake --file=eliza.sno --interactive
```

`--input` supplies a finite runtime input file. `--interactive` (or `-i`)
continues runtime `INPUT` reads from standard input after the source and any
`--input` file have been exhausted.

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
and custom loaders. See [`demo/lib/runner.js`](demo/lib/runner.js) for an
in-memory browser example.

### Browser

Snoflake runs unmodified in the browser. A hosted build of the demo is
live at [atdt.github.io/snoflake/demo/][3]; the demo loads `src/snobol.js`
directly as an ES module and captures output through custom writers.

With no build step or install, import it straight from a CDN such as
[esm.sh][4]:

```html
<script type="module">
  import { run } from 'https://esm.sh/snoflake';
  run( { source: " OUTPUT = 'HELLO, WORLD'\nEND\n" } );
</script>
```

To run the same demo against your local checkout:

```
npm run demo
```

Then open the URL it prints. The demo source under [`demo/`](demo/) is the
shortest path to embedding Snoflake in a web page.

About
-----
The goal of the project is to preserve, make accessible, and pay homage to a
chapter of computing history; to be pleasurable and instructive to read and
use; and to provide a hackable basis for experimentation. It is not the
runtime you should use for serious work, but it is a runtime you _could_ use
for _silly_ work. :o)

The first 90% of this project was done by hand, mostly in 2012 with brief
bursts of activity in the decade that followed, and got as far as having
SNOBOL4 crash early during initialization. The next 90% consisted of debugging
and clean-ups, completed with the assistance of agentic coding tools in a
flurry of activity in April-May 2026.

Dedication
----------
This project is dedicated to my dad, Meir Livneh.

License
-------
Copyright (c) 2012-2026 [Ori Livneh][1]

Snoflake is distributed under the BSD 2-Clause License; see [LICENSE](LICENSE)
for the full text.

Acknowledgments
---------------
This project incorporates several surgical bug fixes from [CSNOBOL4][2], Phil
Budne's free port of the original SNOBOL4 macro implementation to C. We are
deeply grateful to Phil Budne for his extensive work in maintaining and
improving the SNOBOL4 SIL source over several decades. The ported changes are
tagged inline with their original `[PLBnn]` revision markers; see
[LICENSE-CSNOBOL4](LICENSE-CSNOBOL4) for CSNOBOL4's BSD 2-Clause license.

[0]: http://en.wikipedia.org/wiki/SNOBOL
[1]: mailto:ori.livneh@gmail.com
[2]: https://github.com/philbudne/csnobol4
[3]: https://atdt.github.io/snoflake/demo/
[4]: https://esm.sh/
