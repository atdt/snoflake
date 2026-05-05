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

### Library

Snoflake is a standard ES module:

```js
import SNOBOL from 'snoflake';

const vm = new SNOBOL.VM( { file: 'hello.sno' } );
vm.reset();
vm.run( SNOBOL.interp( vm ) );
```

The `VM` constructor accepts options for selecting the source file, input
file, output streams, and a custom `loader` for resolving file reads. See
[`bin/snoflake.js`](bin/snoflake.js) for the CLI's use of the API and
[`demo/run-snoflake.js`](demo/run-snoflake.js) for an in-memory example.

### Browser

Snoflake runs unmodified in the browser. The bundled demo loads
`src/snobol.js` directly as an ES module and captures output through custom
writers. To try it locally:

```
npm run demo
```

Then open the URL it prints. The demo source under [`demo/`](demo/) is the
shortest path to embedding Snoflake in a web page.

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
