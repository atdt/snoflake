# Snoflake User Guide

This guide covers running Snoflake from the shell, calling it from a
script, embedding it in a web page, and extending it with your own
functions. It assumes you know SNOBOL4 and the command line. It does not
assume you have written modern JavaScript or used npm.

If you have never touched the JavaScript ecosystem, read the next section
once and then skip back to it only when a term puzzles you.


## A five-minute orientation for the JavaScript-averse

Snoflake is written in JavaScript and runs on top of a *JavaScript
runtime* -- a program that executes `.js` files the way `perl` executes
`.pl` files. Two runtimes matter here:

- **Node.js** (`node`) is the long-standing one. Install it from
  <https://nodejs.org/> or your package manager (`brew install node`,
  `apt install nodejs`, etc.). It ships with **npm**, the command that
  fetches and installs libraries: `npm install foo` downloads `foo` and
  whatever it depends on from a central registry and drops it in a local
  directory.

- **Deno** (`deno`) is a newer alternative. Snoflake runs under it too.
  Where the instructions differ, both are shown.

A few terms you will meet:

- **package** -- a named, versioned bundle of code you can install.
  Snoflake's package is named `@ath0/snoflake`. The leading `@ath0/` is
  just a namespace prefix. It groups packages under one owner and is part
  of the name.

- **ES module** -- the modern file format for JavaScript libraries. You
  pull a named function out of one with an `import` statement, naming the
  function you want and the module to take it from. Snoflake is published
  as an ES module.

- **CDN** -- a web server that hosts packages so a browser can fetch them
  directly over HTTPS, with no install step. We use one (esm.sh) for the
  zero-setup browser recipe below.

That is the whole vocabulary. Everything past here is concrete.


# 1. Command-line use

## Installing

With Node:

    npm install -g @ath0/snoflake

The `-g` flag installs *globally*, putting a `snoflake` command on your
`PATH` instead of dropping files in the current directory. Confirm it:

    snoflake --help        # prints a usage summary

`snoflake --version` reports the installed version.

If you would rather not install anything, run the latest published
version on demand:

    npx @ath0/snoflake hello.sno          # Node
    deno run -A npm:@ath0/snoflake hello.sno   # Deno

`npx` downloads the package to a cache and runs it. The next invocation
is fast. Deno's `-A` grants the program full permissions (file and stdin
access), which Snoflake needs to read your source and any input.


## Running a program

A SNOBOL source file is the only required argument:

    snoflake hello.sno

The first positional argument is the source file. `--file=` names it
explicitly and behaves identically:

    snoflake --file=hello.sno

Whatever the program writes via `OUTPUT` goes to standard output. Error
output goes there too, in the historical SNOBOL4 style.


## Options

All options are long-form `--name` or `--name=value`. A few also have a
single-letter alias. They may appear in any order, before or after the
source file.

    --file=PATH
        The SNOBOL source to run. Equivalent to giving PATH as the first
        positional argument.

    --input=PATH
        A finite input file. The program's runtime INPUT reads consume
        this file line by line. When it is exhausted, further reads fail
        (return EOF) unless --interactive is also set. Use this to feed a
        batch program its data without a pipe.

    -i, --interactive
        After the source and any --input file are exhausted, continue
        satisfying INPUT reads from the terminal (standard input). This is
        what you want for a conversational program such as an ELIZA
        clone. Without it, an interactive program sees immediate EOF.

    --case=false
        Preserve the source's original letter case. By default Snoflake
        folds identifiers to uppercase, matching historical SNOBOL4, where
        FOO and foo name the same variable. Pass --case=false to keep case
        as written. (Any value other than the literal string "false"
        leaves folding on.)

    -b, --banner
        Print the SNOBOL4 startup banner and termination message.
        Suppressed by default.

    -s, --statistics
        Print the program-statistics summary at exit (statement counts,
        storage used, and so on). Suppressed by default.

    --list
        Print a listing of the source program as it compiles, in the
        classic SNOBOL4 listing format. Off by default.

    -I PATH, --snolib=PATH
        Add a directory to the search path for -INCLUDE files and for
        runtime INPUT(..., 'NAME') file lookups. Repeatable. Directories
        are searched in the order given, and a file found in the current
        directory wins over the search path for -INCLUDE. Analogous to
        cc's -I.


## Examples

    # Plain run.
    snoflake hello.sno

    # Filter a data file through a batch program.
    snoflake --file=filter.sno --input=data.txt

    # A conversational program reading from the keyboard.
    snoflake --file=eliza.sno --interactive

    # Preserve case, show the listing and exit statistics, and add two
    # include directories.
    snoflake prog.sno --case=false --list -s -I lib -I /usr/share/snolib

The shell exit status is 0 on a clean run and non-zero if the program
terminated abnormally, so Snoflake composes with `&&`, `||`, and `make`.


# 2. Calling Snoflake from a script

Snoflake is also a JavaScript library. A script that drives it is itself
a `.js` file run by `node` (or `deno`). This is the path to take when you
want to capture a program's output, run several programs in a loop, or
wire SNOBOL into a larger tool.

Create a directory, install Snoflake locally (no `-g` this time), and
write a script:

    mkdir myproj && cd myproj
    npm install @ath0/snoflake

Save this as `drive.js`:

    // Pull the run() function out of the Snoflake package.
    import { run } from '@ath0/snoflake';

    // run() compiles and executes a program, returning a result object.
    // Here we hand it inline source via the `source` option.
    const result = run( {
        source: " OUTPUT = 'HELLO FROM SNOBOL'\nEND\n",
    } );

    // result.exitCode mirrors the CLI's process exit status.
    process.exit( result.exitCode );

Run it:

    node drive.js          # Node
    deno run -A drive.js   # Deno

Note the leading spaces inside the `source` string. SNOBOL4 is
column-sensitive: a statement label starts in column 1, so ordinary
statements must be indented by at least one space. The `\n` sequences are
newlines. Every line, including `END`, needs one.

`run( options )` accepts the same source, input, case, banner,
statistics, and list options as the CLI, plus a few that only make sense
in a host program. It returns `{ vm, exitCode }` -- `exitCode` as above,
and `vm`, the underlying machine, for callers that want to inspect final
state.

The options:

    source        Inline SNOBOL source as a string. Mutually exclusive
                  with `file`. When given, `file` is treated as a label
                  for diagnostics rather than a path to read.
    file          Path to a source file, read through the loader (below).
    sourcePath    The name to report in diagnostics when using `source`.
                  Defaults to "source.sno".
    input         Path to a finite input file, read through the loader.
    interactive   If true, read further INPUT from stdinReader after input
                  is exhausted. Requires `stdinReader`. For interactive
                  programs, createSession (below) is usually easier.
    case          false to preserve source case; default true (uppercase).
    banner        true to print the startup/termination banner.
    statistics    true to print the exit statistics summary.
    list          true to print the compile-time source listing.
    stlimit       Initial &STLIMIT, the statement-execution limit. -1
                  (the default) means unlimited.
    stdout        A writer object capturing program output (see below).
    stderr        A writer object for error output.
    loader        An object that reads files on the program's behalf.
    stdinReader   A factory returning a line reader for interactive input.
    extensions    Host functions callable from SNOBOL (see section 4).

The Node CLI is itself a thin script built on `run()`. Reading
`bin/snoflake.js` shows the whole pattern.


## Capturing output instead of printing it

By default program output goes to the console. To capture it, pass a
**writer** -- any object with a `write(line)` method (and an optional
`close()`). Snoflake calls `write` once per output line, without the
trailing newline:

    import { run } from '@ath0/snoflake';

    const lines = [];
    const out = { write: ( line ) => lines.push( line ) };

    run( {
        source: " OUTPUT = 'ONE'\n OUTPUT = 'TWO'\nEND\n",
        stdout: out,
    } );

    console.log( lines );   // [ 'ONE', 'TWO' ]

The same shape works for `stderr`.


## Reading files from a script

When a program reads files -- via `-INCLUDE`, or runtime
`INPUT(..., 'NAME')` -- Snoflake asks a **loader** for the bytes. The CLI
installs one that reads the real filesystem. In your own script you can
do the same, or supply an in-memory loader so the program sees a virtual
filesystem you control:

    import { run } from '@ath0/snoflake';

    // Map filenames to their contents. A loader needs a load(path)
    // method returning a string or byte array.
    const files = new Map( [ [ 'data.txt', 'LINE ONE\nLINE TWO\n' ] ] );
    const loader = {
        load( path ) {
            if ( !files.has( path ) ) {
                throw new Error( 'no such file: ' + path );
            }
            return files.get( path );
        },
    };

    run( {
        file:   'prog.sno',
        input:  'data.txt',
        loader,
    } );

This in-memory technique is exactly how the browser demo runs without a
filesystem. See `demo/lib/runner.js`.


## Driving an interactive program

A program that reads from the terminal -- an ELIZA clone, a REPL -- calls
SNOBOL's `INPUT` over and over and expects each read to be answered with a
line. The catch is that SNOBOL's read is *synchronous*: it happens deep
inside the interpreter's dispatch loop, which cannot pause to await a line
that has not arrived yet. But the lines you type arrive only when you type
them, which may be long after a read needs one.

`createSession` bridges the two. Instead of running the program straight
through, it runs until a read finds no waiting line, *suspends* there, and
resumes where it left off when you hand it the next line. You drive it
with three methods, and receive output through callbacks:

    import { createSession } from '@ath0/snoflake';

    const session = createSession( {
        source:   elizaSource,                 // or file: + loader:
        onOutput: ( line ) => console.log( line ),
        onError:  ( line ) => console.error( line ),
        onDone:   ( code ) => console.log( '[exited ' + code + ']' ),
    } );

    session.start();          // run until the first read blocks
    session.send( 'HELLO' );  // answer that read, run to the next block
    session.send( 'I FEEL FINE' );
    session.end();            // signal end-of-input (the terminal's Ctrl-D)

`start()` compiles and runs the program until it blocks for input or
finishes. Each `send(line)` supplies one line and runs on until the next
block or the end. `end()` reports end-of-input, so a read that has no more
lines *fails* -- which is how a SNOBOL loop usually detects EOF and stops.
`onDone` fires once, with the exit code, when the program finishes (and
`session.done` and `session.exitCode` record the same). A program that
never reads input simply runs to completion on `start()`.

`createSession` accepts the same options as `run()` -- `source`, `file`,
`loader`, `extensions`, `case`, and so on -- plus the three callbacks.

This single-threaded approach works well for a Node REPL or for scripting
an interactive program with canned replies, as above. The work between
reads runs on the calling thread, so for short turnarounds it stays
responsive.

In the browser it is the same `createSession`, with `onOutput` appending
to the page instead of the console: a button's click handler calls
`send` with the contents of an input field, and the program's replies
land in an output element. The demo's `demo/examples/interactive-io.js`
wires up exactly this -- an ELIZA chat running on the page's own thread --
and is the recommended starting point for an interactive page.

Running on the main thread is fine as long as the program does little
work between reads, which is the common case for a conversational
program. If a program instead grinds for a noticeable stretch between
reads, that work would freeze the page. Move the session into a Web
Worker so it does not. The worker then holds the session and becomes a
thin bridge: it forwards the page's lines to `send`/`end` and posts the
`onOutput` lines back for the page to display. The demo's
`demo/workers/shape-worker.js` shows the worker mechanics -- running a
program off the main thread and messaging results back -- for a
non-interactive program. The interactive case adds only the `send`/`end`
forwarding.


# 3. Embedding Snoflake in a web page

Snoflake runs unmodified in the browser. There is no server component and
no compilation: a browser loads the same ES module that Node does and
executes SNOBOL entirely on the client.

## The smallest possible page, no install required

Save this as `snobol.html` and open it in a browser. It imports Snoflake
straight from the esm.sh CDN, so nothing is installed locally:

    <!doctype html>
    <meta charset="utf-8">
    <title>Snoflake</title>

    <script type="module">
      // The CDN serves the published package over HTTPS. The browser
      // fetches it on load. There is no build step.
      import { run } from 'https://esm.sh/@ath0/snoflake';

      run( { source: " OUTPUT = 'HELLO, WORLD'\nEND\n" } );
      // Output goes to the JavaScript console by default. Open the
      // browser's developer tools to see it.
    </script>

`type="module"` is required: it tells the browser this script may use
`import`. Without it, the import line is a syntax error.


## Source in one element, output in another

A useful page reads SNOBOL from a `<textarea>` and writes results into a
`<pre>`. The key is to route output through a writer that appends to the
output element, exactly as the script recipe captured output into an
array.

    <!doctype html>
    <meta charset="utf-8">
    <title>Snoflake</title>

    <!-- Where the user types SNOBOL. -->
    <textarea id="src" rows="6" cols="60">
     OUTPUT = 'HELLO, WORLD'
    END
    </textarea>
    <button id="run">Run</button>

    <!-- Where output appears. -->
    <pre id="out"></pre>

    <script type="module">
      import { run } from 'https://esm.sh/@ath0/snoflake';

      const src = document.querySelector( '#src' );
      const out = document.querySelector( '#out' );

      document.querySelector( '#run' ).addEventListener( 'click', () => {
          out.textContent = '';                       // clear previous run

          // A writer that appends each output line to the <pre>.
          const writer = {
              write( line ) { out.textContent += line + '\n'; },
          };

          run( {
              source: src.value,
              stdout: writer,   // program OUTPUT -> the <pre>
              stderr: writer,   // errors land there too
          } );
      } );
    </script>

That is the entire mechanism: read source from one element's value, pass
a writer whose `write` appends to another element. Everything in the
hosted demo is an elaboration of this -- syntax-highlighted editors,
multiple examples, canvas graphics -- but the core wiring is these few
lines.


## Loading from your own checkout instead of a CDN

The CDN is convenient but fetches code over the network. To serve
Snoflake from your own copy, point the import at the package's main
module, `src/snobol.js`:

    import { run } from './path/to/snoflake/src/snobol.js';

Browsers refuse module imports loaded over `file://`, so you must serve
the page over HTTP. Any static server works, and the repository ships
one:

    npm run demo

It prints a URL. Open it to see the full demo. The demo source under
`demo/` is the most complete worked example of embedding Snoflake.

For heavier programs, run Snoflake in a Web Worker so the UI stays
responsive while SNOBOL executes. The demo does this for its
shape-grammar example. See `demo/workers/shape-worker.js`.


## Web options

In the browser you use the same `run()` (or, for repeated runs, construct
a `VM` once and call its `run` method). The options that matter on a page
are `source`, `stdout`, `stderr`, and `extensions`. The `case`, `banner`,
`statistics`, and `list` options behave as on the command line. `file`,
`input`, `loader`, and `stdinReader` work too, but only if you supply an
in-memory loader and reader, since a browser has no filesystem or
terminal.


# 4. The extension API

Extensions let a SNOBOL program call functions you write in JavaScript as
if they were ordinary built-ins. This is how a SNOBOL program in the
browser draws to a canvas, reads the clock, or reaches anything outside
the language. The two default extensions, `CHAR` and `ORD`, are
themselves defined this way.

You register extensions through the `extensions` option. The simplest
form encodes the function's name and types in the key and gives the
implementation as the value:

    import { run } from '@ath0/snoflake';

    run( {
        source: " OUTPUT = RHALF(3.5)\nEND\n",
        extensions: {
            // NAME :: (argtypes) => resulttype
            'RHALF :: (real) => real':     ( x ) => x / 2,
            'NOTE  :: (string) => void':   ( s ) => console.log( s ),
            'NOW   :: () => int':          () => Date.now(),
        },
    } );

The signature reads left to right: the SNOBOL-visible name, `::`, a
parenthesized list of argument types, `=>`, and the result type. The
parentheses are required even when there are no arguments (`'NOW :: ()
=> int'`).

Type kinds:

    Argument types:  int, real, string
    Result types:    int, real, string, void

Snoflake coerces each argument from the SNOBOL value to the declared kind
before calling your function, and converts the return value back. `void`
means the function returns nothing useful, so SNOBOL receives the null
string.

There is an equivalent **object form**, useful when you would rather not
pack everything into a string. The key is the bare name, and the value
spells out the parts:

    extensions: {
        RHALF: { args: [ 'real' ], result: 'real', impl: ( x ) => x / 2 },
    }

The two forms may be mixed freely in one registry.


## Signalling failure

A SNOBOL function can *fail* -- the language's distinct notion, separate
from returning a value. To make a call fail, import the `FAIL` sentinel
and either return it or throw it:

    import { run, FAIL } from '@ath0/snoflake';

    run( {
        source: " OUTPUT = LOOKUP('cat')\nEND\n",
        extensions: {
            'LOOKUP :: (string) => string': ( key ) => {
                const table = { cat: 'FELINE' };
                // A missing key makes the SNOBOL call fail, so the
                // program can branch on :F(...) as usual.
                return key in table ? table[ key ] : FAIL;
            },
        },
    } );

Returning or throwing `FAIL` produces SNOBOL failure. Throwing anything
else is a genuine error and propagates out to your host program, where
you can catch it like any JavaScript exception.


## How the defaults combine

Your extensions merge *over* the built-in defaults, so `CHAR` and `ORD`
remain available unless you override them. To start from a bare runtime
with no defaults at all -- rarely needed outside tests -- pass
`extensions: null`.


## A complete browser example

Putting it together: a page where the SNOBOL program asks the host for
the current year and prints a message. This is the whole pattern an
embedder needs.

    <!doctype html>
    <meta charset="utf-8">
    <title>Snoflake</title>
    <pre id="out"></pre>

    <script type="module">
      import { run } from 'https://esm.sh/@ath0/snoflake';

      const out = document.querySelector( '#out' );
      const writer = { write( line ) { out.textContent += line + '\n'; } };

      run( {
          source:
              " YEAR = THISYEAR()\n" +
              " OUTPUT = 'THE YEAR IS ' YEAR\n" +
              "END\n",
          stdout: writer,
          extensions: {
              'THISYEAR :: () => int': () => new Date().getFullYear(),
          },
      } );
    </script>


# Further reading

- `README.md` -- project overview and history.
- `demo/` -- the live demo's source, and the most complete embedding
  example, including canvas graphics and Web Worker usage.
- `bin/snoflake.js` -- the entire command-line front end, built on
  `run()`.
- `src/extensions.js` -- the `CHAR` and `ORD` defaults, in both the code
  and its comments.
