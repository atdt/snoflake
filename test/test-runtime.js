import assert from 'node:assert';
import childProcess from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import {
    assemble,
    constants,
    createVM,
    decodeString,
    FAIL,
    File,
    image,
    run,
    sil,
    VM,
    writeString,
} from '../src/snobol.js';
import { stdinReader } from '../src/host.js';
import { createHostLoader } from '../src/host.js';
import process from 'node:process';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );

//
// Test Cases
//

describe('String Encoding', function () {
    it('writeString writes each code unit verbatim into the destination', function () {
        const dst = new Uint32Array( 5 );
        writeString( 'हाय', dst, 1 );
        assert.deepEqual( Array.from( dst ), [ 0, 2361, 2366, 2351, 0 ] );
    });

    it('decodeString reads the requested logical span', function () {
        assert.deepEqual(
            decodeString( [ 0, 2361, 2366, 2351, 0 ], 1, 3 ),
            'हाय',
        );
    });

    it('decodeString preserves raw UTF-16 code units', function () {
        assert.equal( decodeString( [ 0xFEFF, 65 ], 0, 2 ), '\uFEFFA' );
        assert.equal( decodeString( [ 0xD800 ], 0, 1 ), '\uD800' );
    });

    it('decodeString preserves logical trailing zero bytes', function () {
        const encoded = [ 97, 98, 0 ];
        assert.equal( decodeString( encoded, 0, 3 ), 'ab\0' );
        assert.deepEqual( encoded, [ 97, 98, 0 ] );
    });
});

describe('Typed Setters', function () {
    it('uint', function () {
        const vm = new VM();
        assert.throws( function () {
            vm.setUint( 0, -4 );
        }, 'RangeError' );
    });

    it('int', function () {
        const vm = new VM();
        assert.throws( function () {
            vm.setUint( 0, 4.2 );
        }, 'RangeError' );
    });

    it('real', function () {
        const vm = new VM();
        assert.throws( function () {
            vm.setReal( 0, 10e100 );
        }, 'RangeError' );
    });
});

describe('Typed Getters', function () {
    it('uint', function () {
        const vm = new VM();
        vm.setUint( 0, 123 );
        assert.equal( vm.getUint( 0 ), 123 );
    });

    it('int', function () {
        const vm = new VM();
        vm.setInt( 0, -123 );
        assert.equal( vm.getInt( 0 ), -123 );
    });

    it('real', function () {
        const vm = new VM();
        vm.setReal( 0, Math.PI );
        assert.equal( Math.floor( vm.getReal( 0 ) ), 3 );
    });
});

describe('Symbol Binding', function () {
    it('simple', function () {
        const vm = new VM();
        vm.define( 'answer', 42 );
        assert.equal( vm.$( 'answer' ), 42 );
    });

    it('missing', function () {
        const vm = new VM();
        assert.throws( function () {
            vm.$( 'missing' );
        }, 'ReferenceError' );
    });
});

describe('Memory Management', function () {
    it('alloc', function () {
        const vm = new VM(),
            ptr = vm.alloc( 3 );
        assert.deepEqual( vm.memPtr, ptr + 3 );
        assert.deepEqual(
            Array.from( vm.mem.slice( vm.memPtr - 3, vm.memPtr ) ),
            [ 0, 0, 0 ],
        );
    });

    it('grows without losing allocated data', function () {
        const vm = new VM();
        vm.memPtr = vm.mem.length - 1;

        const first = vm.alloc( 1, 123 ),
            second = vm.alloc( 2, 7 );

        assert.equal( vm.mem[first], 123 );
        assert.deepEqual( Array.from( vm.mem.slice( second, second + 2 ) ), [
            7,
            7,
        ] );
        assert.equal( vm.memPtr, second + 2 );
    });
});

describe('SNOBOL Program Execution', function () {
    it('runs source text through the public API', function () {
        const stdout = captureWriter(),
            result = run( {
                source: " OUTPUT = 'SOURCE API'\nEND\n",
                stdout,
            } );

        assert.equal( joinLines( stdout.lines ), 'SOURCE API\n' );
        assert.equal( result.exitCode, 0 );
        assert( result.vm instanceof VM );
    });

    it('prefers source text over file loading', function () {
        const stdout = captureWriter(),
            result = run( {
                file: 'missing-file.sno',
                source: " OUTPUT = 'SOURCE WINS'\nEND\n",
                stdout,
            } );

        assert.equal( joinLines( stdout.lines ), 'SOURCE WINS\n' );
        assert.equal( result.vm.options.file, 'source.sno' );
    });

    it('preserves trailing NUL bytes in logical strings', function () {
        const stdout = captureWriter();

        run( {
            source: [
                ' &ALPHABET LEN(1) . T',
                ' OUTPUT = SIZE("A" T)',
                'END',
                '',
            ].join( '\n' ),
            stdout,
        } );

        assert.equal( joinLines( stdout.lines ), '2\n' );
    });

    it('UNHIDE resumes listing after an invisible control card', function () {
        const stdout = captureWriter();

        run( {
            source: [
                '-LIST LEFT',
                '-HIDE',
                " OUTPUT = 'H' &STNO",
                '-UNHIDE',
                " OUTPUT = 'V' &STNO",
                'END',
                '',
            ].join( '\n' ),
            list: true,
            stdout,
        } );

        const output = joinLines( stdout.lines );
        assert.match( output, /^\s+-LIST LEFT/m );
        assert.doesNotMatch( output, /-HIDE|-UNHIDE|OUTPUT = 'H'/ );
        assert.match( output, /^1\s+OUTPUT = 'V' &STNO/m );
        assert.match( output, /^2\s+END/m );
        assert.match( output, /H0\nV1\n$/ );
    });

    it('UNHIDE preserves disabled listing across a hidden block', function () {
        const stdout = captureWriter();

        run( {
            source: [
                '-HIDE',
                " X = 'hidden'",
                '-UNHIDE',
                " Y = 'visible'",
                ' OUTPUT = Y',
                'END',
                '',
            ].join( '\n' ),
            list: false,
            stdout,
        } );

        assert.equal( joinLines( stdout.lines ), 'visible\n' );
    });

    it('registers REAL-typed extensions that round-trip through SNOBOL', function () {
        const stdout = captureWriter();

        run( {
            source: [
                ' OUTPUT = RHALF(3.5)',
                ' OUTPUT = RSTR(RHALF(10.0))',
                'END',
                '',
            ].join( '\n' ),
            extensions: {
                'RHALF(REAL)REAL': ( x ) => x / 2,
                'RSTR(REAL)STRING': ( x ) => 'r=' + x.toFixed( 2 ),
            },
            stdout,
        } );

        assert.equal( joinLines( stdout.lines ), '1.75\nr=5.00\n' );
    });

    it('extensions can signal SNOBOL FAIL by throwing FAIL', function () {
        const stdout = captureWriter();

        run( {
            source: [
                ' OUTPUT = POS(3)',
                ' POS(-1) :S(GOOD)F(BAD)',
                'GOOD     OUTPUT = "unreachable" :(END)',
                'BAD      OUTPUT = "failure routed"',
                'END',
                '',
            ].join( '\n' ),
            extensions: {
                'POS(INTEGER)INTEGER': ( n ) => {
                    if ( n <= 0 ) throw FAIL;
                    return n;
                },
            },
            stdout,
        } );

        assert.equal( joinLines( stdout.lines ), '3\nfailure routed\n' );
    });

    it('void extensions run for side effects and return the null string', function () {
        const stdout = captureWriter();
        const log = [];

        run( {
            source: [
                ' NOTE("first")',
                ' NOTE("second")',
                ' OUTPUT = "[" NOTE("third") "]"',
                'END',
                '',
            ].join( '\n' ),
            extensions: {
                'NOTE(STRING)': ( s ) => {
                    log.push( s );
                },
            },
            stdout,
        } );

        assert.deepEqual( log, [ 'first', 'second', 'third' ] );
        assert.equal( joinLines( stdout.lines ), '[]\n' );
    });

    it('host exceptions from extensions propagate, FAIL does not', function () {
        const boom = new Error( 'boom' );
        assert.throws( function () {
            run( {
                source: ' BOOM()\nEND\n',
                extensions: {
                    'BOOM()': () => {
                        throw boom;
                    },
                },
                stdout: captureWriter(),
            } );
        }, ( e ) => e === boom );
    });

    it('extensions accept higher arity with mixed argument types', function () {
        const stdout = captureWriter();

        run( {
            source: [
                ' OUTPUT = JOIN4(1, "two", 3.5, 4)',
                'END',
                '',
            ].join( '\n' ),
            extensions: {
                'JOIN4(INTEGER,STRING,REAL,INTEGER)STRING': ( a, b, c, d ) =>
                    `${a}|${b}|${c}|${d}`,
            },
            stdout,
        } );

        assert.equal( joinLines( stdout.lines ), '1|two|3.5|4\n' );
    });

    it('prototype form accepts nullary () and void result', function () {
        const stdout = captureWriter();
        const log = [];

        run( {
            source: [
                ' OUTPUT = NOW()',
                ' NOTE("hi")',
                'END',
                '',
            ].join( '\n' ),
            extensions: {
                'NOW()INTEGER': () => 42,
                'NOTE(STRING)': ( s ) => log.push( s ),
            },
            stdout,
        } );

        assert.deepEqual( log, [ 'hi' ] );
        assert.equal( joinLines( stdout.lines ), '42\n' );
    });

    it('binds an extension declared in the canonical uppercase form', function () {
        const stdout = captureWriter();

        run( {
            source: ' OUTPUT = FOO(4)\nEND\n',
            extensions: { 'FOO(INTEGER)STRING': ( n ) => '<' + n + '>' },
            stdout,
        } );

        assert.equal( joinLines( stdout.lines ), '<4>\n' );
    });

    it('accepts a prototype written in lower or mixed case', function () {
        const stdout = captureWriter();

        run( {
            source: ' OUTPUT = FOO(4)\nEND\n',
            extensions: { 'foo(INTEGER)string': ( n ) => '<' + n + '>' },
            stdout,
        } );

        assert.equal( joinLines( stdout.lines ), '<4>\n' );
    });

    it('resolves a call whose case differs from the declaration', function () {
        const stdout = captureWriter();

        run( {
            source: ' OUTPUT = foo(4)\nEND\n',
            extensions: { 'FOO(INTEGER)STRING': ( n ) => '<' + n + '>' },
            stdout,
        } );

        assert.equal( joinLines( stdout.lines ), '<4>\n' );
    });

    it('loads JavaScript helper source from SNOBOL LOAD', function () {
        const stdout = captureWriter();

        run( {
            source: [
                " LOAD('FROMC(INTEGER)STRING', 'n => String.fromCharCode(n)')",
                ' LOAD(\'JOINJS(INTEGER,REAL,STRING)STRING\', \'(n, r, s) => n + ":" + r.toFixed(1) + ":" + s\')',
                ' LOAD(\'CHAR(INTEGER)STRING\', \'n => "[" + n + "]"\')',
                ' OUTPUT = FROMC(65)',
                " OUTPUT = JOINJS('7', '3.5', 42)",
                ' OUTPUT = CHAR(65)',
                'END',
                '',
            ].join( '\n' ),
            stdout,
        } );

        assert.equal( joinLines( stdout.lines ), 'A\n7:3.5:42\n[65]\n' );
    });

    it('a SNOBOL LOAD prototype with no result type is void', function () {
        const stdout = captureWriter();

        // Void discards the implementation's return, handing SNOBOL the
        // null string, so the bracketed output is empty.
        run( {
            source: [
                " LOAD('SHOUT(STRING)', 's => s.toUpperCase()')",
                " OUTPUT = '[' SHOUT('hi') ']'",
                'END',
                '',
            ].join( '\n' ),
            stdout,
        } );

        assert.equal( joinLines( stdout.lines ), '[]\n' );
    });

    it('SNOBOL LOAD without a library argument binds a host extension', function () {
        const stdout = captureWriter();

        run( {
            source: [
                " LOAD('DOUBLE(INTEGER)INTEGER')",
                ' OUTPUT = DOUBLE(21)',
                'END',
                '',
            ].join( '\n' ),
            extensions: {
                'DOUBLE(INTEGER)INTEGER': ( n ) => n * 2,
            },
            stdout,
        } );

        assert.equal( joinLines( stdout.lines ), '42\n' );
    });

    it('SNOBOL-loaded JavaScript helpers can use Intl.Segmenter', function () {
        const stdout = captureWriter();

        run( {
            source: [
                ' LOAD(\'WORDS(STRING)STRING\', \'s => Array.from(new Intl.Segmenter("en", { granularity: "word" }).segment(s)).filter(x => x.isWordLike).map(x => x.segment).join("|")\')',
                " OUTPUT = WORDS('Hello, 世界. café naïve.')",
                'END',
                '',
            ].join( '\n' ),
            stdout,
        } );

        assert.equal( joinLines( stdout.lines ), 'Hello|世界|café|naïve\n' );
    });

    it('SNOBOL-loaded JavaScript helpers can use crypto.randomUUID', function () {
        const stdout = captureWriter();

        run( {
            source: [
                " LOAD('UUID()STRING', '() => crypto.randomUUID()')",
                ' OUTPUT = UUID()',
                'END',
                '',
            ].join( '\n' ),
            stdout,
        } );

        assert.match(
            joinLines( stdout.lines ),
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\n$/,
        );
    });

    it('SNOBOL-loaded JavaScript helpers can be nullary and signal FAIL', function () {
        const stdout = captureWriter();

        run( {
            source: [
                " LOAD('JSNOW()INTEGER', '() => 42')",
                " LOAD('POSJS(INTEGER)INTEGER', 'n => n > 0 ? n : FAIL')",
                ' OUTPUT = JSNOW()',
                ' POSJS(-1) :S(BAD)F(GOOD)',
                "BAD      OUTPUT = 'unreachable' :(END)",
                "GOOD     OUTPUT = 'failure routed'",
                'END',
                '',
            ].join( '\n' ),
            stdout,
        } );

        assert.equal( joinLines( stdout.lines ), '42\nfailure routed\n' );
    });

    it('rejects malformed JavaScript helper source in SNOBOL LOAD', function () {
        assert.throws(
            () =>
                run( {
                    source: " LOAD('BADJS(INTEGER)INTEGER', 'n =>')\nEND\n",
                    stdout: captureWriter(),
                } ),
            /Invalid JavaScript extension for BADJS/,
        );
    });

    it('rejects malformed prototype keys when value is a function', function () {
        const cases = [
            'BAD REAL', // missing parens
            'BAD(frob)INTEGER', // unknown arg type
            'BAD()frob', // unknown result type
            'BAD(INTEGER,)INTEGER', // trailing comma
            'BAD(INTEGER INTEGER)INTEGER', // missing comma
            '2BAD()STRING', // name does not start with a letter
        ];
        for ( const key of cases ) {
            assert.throws(
                () => new VM( { extensions: { [key]: () => 0 } } ),
                SyntaxError,
                `should reject: ${key}`,
            );
        }
    });

    it('creates a VM that loads a file through an explicit host loader', function () {
        const root = path.join( __dirname, '..' ),
            programFile = path.join( root, 'tmp', 'test-create-vm-file.sno' ),
            stdout = captureWriter();

        fs.mkdirSync( path.dirname( programFile ), { recursive: true } );
        fs.writeFileSync( programFile, " OUTPUT = 'CREATE VM'\nEND\n" );

        const vm = createVM( {
            file: programFile,
            loader: createHostLoader(),
            stdout,
        } );

        vm.run( image );

        assert.equal( joinLines( stdout.lines ), 'CREATE VM\n' );
    });

    it('resolves INCLUDE relative to the current working directory', function () {
        // CSNOBOL4 alignment: the first entry in the INCLUDE search list is
        // the process CWD, not the including file's directory.
        const root = path.join( __dirname, '..' ),
            dir = path.join( root, 'tmp', 'test-cwd-include' ),
            stdout = captureWriter();

        fs.mkdirSync( dir, { recursive: true } );
        fs.writeFileSync(
            path.join( dir, 'nested.sno' ),
            " OUTPUT = 'CWD INCLUDE'\n",
        );
        fs.writeFileSync(
            path.join( dir, 'main.sno' ),
            "-INCLUDE 'nested.sno'\nEND\n",
        );

        const orig = process.cwd();
        process.chdir( dir );
        try {
            const vm = createVM( {
                file: 'main.sno',
                loader: createHostLoader(),
                stdout,
            } );
            vm.run( image );
        } finally {
            process.chdir( orig );
        }

        assert.equal( joinLines( stdout.lines ), 'CWD INCLUDE\n' );
    });

    it('resolves INCLUDE files through SNOLIB', function () {
        const root = path.join( __dirname, '..' ),
            dir = path.join( root, 'tmp', 'test-snolib-include' ),
            libDir = path.join( dir, 'library' ),
            nestedLibDir = path.join( dir, 'nested-library' ),
            mainFile = path.join( dir, 'main.sno' ),
            firstFile = path.join( libDir, 'first.sno' ),
            secondFile = path.join( nestedLibDir, 'second.sno' ),
            stdout = captureWriter();

        fs.mkdirSync( libDir, { recursive: true } );
        fs.mkdirSync( nestedLibDir, { recursive: true } );
        fs.writeFileSync( mainFile, "-INCLUDE 'first.sno'\nEND\n" );
        fs.writeFileSync(
            firstFile,
            " OUTPUT = 'SNOLIB FIRST'\n-INCLUDE 'second.sno'\n",
        );
        fs.writeFileSync( secondFile, " OUTPUT = 'SNOLIB SECOND'\n" );

        const vm = createVM( {
            file: mainFile,
            loader: createHostLoader( { snolib: [ libDir, nestedLibDir ] } ),
            stdout,
        } );

        vm.run( image );

        assert.equal(
            joinLines( stdout.lines ),
            'SNOLIB FIRST\nSNOLIB SECOND\n',
        );
    });

    it('keeps a custom loader authoritative', function () {
        const stdout = captureWriter(),
            vm = createVM( {
                file: 'virtual.sno',
                stdout,
                loader: {
                    load( filePath ) {
                        assert.equal( filePath, 'virtual.sno' );
                        return " OUTPUT = 'CUSTOM LOADER'\nEND\n";
                    },
                },
            } );

        vm.run( image );

        assert.equal( joinLines( stdout.lines ), 'CUSTOM LOADER\n' );
    });

    it('imports the root module without eager Node builtin access', function () {
        const root = path.join( __dirname, '..' ),
            probe = path.join( root, 'tmp', 'test-no-eager-builtin.mjs' );

        fs.mkdirSync( path.dirname( probe ), { recursive: true } );
        fs.writeFileSync(
            probe,
            'globalThis.process.getBuiltinModule = undefined;\n' +
                "await import('../src/snobol.js');\n",
        );

        childProcess.execFileSync( process.execPath, [ probe ], {
            cwd: root,
            encoding: 'utf8',
        } );
    });

    it('accepts a positional source file path', function () {
        const root = path.join( __dirname, '..' ),
            programFile = path.join(
                root,
                'tmp',
                'test-positional-source.sno',
            );

        fs.mkdirSync( path.dirname( programFile ), { recursive: true } );
        fs.writeFileSync( programFile, " OUTPUT = 'POSITIONAL'\nEND\n" );

        const output = childProcess.execFileSync( process.execPath, [
            'bin/snoflake.js',
            'tmp/test-positional-source.sno',
        ], {
            cwd: root,
            encoding: 'utf8',
        } );

        assert.equal( output, 'POSITIONAL\n' );
        assert( !output.includes( 'ERR_INVALID_ARG_TYPE' ) );
        assert( !output.includes( 'ERROR IN SNOBOL4 SYSTEM' ) );
    });

    it('interpolates INCLUDE and COPY source files once', function () {
        const root = path.join( __dirname, '..' ),
            dir = path.join( root, 'tmp', 'test-include' ),
            mainFile = path.join( dir, 'main.sno' ),
            sharedFile = path.join( dir, 'shared.sno' ),
            nestedFile = path.join( dir, 'nested.sno' ),
            copyFile = path.join( dir, 'copy.sno' );

        fs.mkdirSync( dir, { recursive: true } );
        fs.writeFileSync(
            sharedFile,
            " OUTPUT = 'SHARED'\n-INCLUDE 'nested.sno'\n",
        );
        fs.writeFileSync( nestedFile, " OUTPUT = 'NESTED'\n" );
        fs.writeFileSync( copyFile, " OUTPUT = 'COPY'\n" );
        fs.writeFileSync(
            mainFile,
            [
                "-INCLUDE 'shared.sno'",
                '-COPY "copy.sno"',
                "-INCLUDE 'shared.sno'",
                "-INCLUDE 'shared.sno '",
                'END',
                '',
            ].join( '\n' ),
        );

        const output = childProcess.execFileSync( process.execPath, [
            path.join( root, 'bin/snoflake.js' ),
            'main.sno',
        ], {
            cwd: dir,
            encoding: 'utf8',
        } );

        assert.equal( output, 'SHARED\nNESTED\nCOPY\n' );
    });

    it('supports PLB4 filename arguments for INPUT and OUTPUT', function () {
        const dir = fs.mkdtempSync(
                path.join( os.tmpdir(), 'snoflake-plb4-' ),
            ),
            programFile = path.join( dir, 'program.sno' ),
            inputFile = path.join( dir, 'records.txt' ),
            outputFile = path.join( dir, 'records.out' ),
            stdout = captureWriter(),
            quote = ( s ) => "'" + s.replace( /'/g, "''" ) + "'";

        fs.writeFileSync( inputFile, 'ALPHA\nBETA\n' );
        fs.writeFileSync(
            programFile,
            [
                '          INPUT("INVAR", 7, 20, ' + quote( inputFile ) + ')',
                '          OUTPUT("LOG", 8, "(A)", ' + quote( outputFile ) +
                ')',
                'READ      CARD = INVAR :F(DONE)',
                '          OUTPUT = CARD',
                '          LOG = "FILE:" CARD :(READ)',
                'DONE      LOG = "EOF"',
                'END',
                '',
            ].join( '\n' ),
        );

        try {
            const vm = createVM( {
                file: programFile,
                loader: createHostLoader(),
                stdout,
            } );
            vm.run( image );

            assert.equal( joinLines( stdout.lines ), 'ALPHA\nBETA\n' );
            assert.equal(
                fs.readFileSync( outputFile, 'utf8' ),
                'FILE:ALPHA\nFILE:BETA\nEOF\n',
            );
        } finally {
            fs.rmSync( dir, { recursive: true, force: true } );
        }
    });

    it('returns EOF when no input streams are configured', function () {
        const vm = new VM( { extensions: null } );
        assert.deepEqual( vm.units.open( 5 ).readRecord( 80 ), { eof: true } );
    });

    it('opens interactive UNITI with a stdin segment after source and runtime input', function () {
        const files = {
                source: 'SOURCE\n',
                input: 'INPUT\n',
            },
            vm = new VM( {
                file: 'source',
                input: 'input',
                interactive: true,
                loader: { load: ( path ) => files[path] },
                stdinReader: () => bufferedLineReader( [ 'STDIN' ] ),
                extensions: null,
            } ),
            file = vm.units.open( 5 );

        assert.equal( file.segments.length, 3 );
    });

    it('reads source, then runtime input, then interactive stdin', function () {
        const files = {
                source: 'SOURCE\n',
                input: 'INPUT\n',
            },
            vm = new VM( {
                file: 'source',
                input: 'input',
                interactive: true,
                loader: { load: ( path ) => files[path] },
                stdinReader: () => bufferedLineReader( [ 'STDIN' ] ),
                extensions: null,
            } ),
            file = vm.units.open( constants.UNITI );

        // The compiler reads source as cards. INPUT keeps natural lengths.
        assert.deepEqual( file.readRecord( 8, true ), {
            eof: false,
            text: 'SOURCE  ',
            padded: true,
        } );
        assert.deepEqual( file.readRecord( 8, false ), {
            eof: false,
            text: 'INPUT',
            padded: false,
        } );
        assert.deepEqual( file.readRecord( 8, false ), {
            eof: false,
            text: 'STDIN',
            padded: false,
        } );
        assert.deepEqual( file.readRecord( 8, false ), { eof: true } );
    });

    it('drains stdin without reading from fd 0 after close', function () {
        const reader = stdinReader(),
            file = new File( [ { reader } ] );

        file.close();
        assert.equal( reader.readLine(), null );
    });
});

describe('Error Diagnostics', function () {
    it('reports the offending source line and path for runtime errors', function () {
        const stdout = captureWriter();
        run( {
            sourcePath: 'prog.sno',
            source: " X = 'A'\n Y = X + 'A'\nEND\n",
            stdout,
        } );
        const output = joinLines( stdout.lines );
        assert.match( output, /ERROR\s+1 IN STATEMENT\s+2/ );
        assert.match( output, /ILLEGAL DATA TYPE/ );
        assert.match( output, /at prog\.sno:2/ );
        assert.match( output, /Y = X \+ 'A'/ );
    });

    it('skips comment and blank lines when mapping statements', function () {
        const stdout = captureWriter();
        run( {
            sourcePath: 'prog.sno',
            source: "*a comment\n X = 'A'\n*another\n Y = X + 'A'\nEND\n",
            stdout,
        } );
        const output = joinLines( stdout.lines );
        assert.match( output, /at prog\.sno:4/ );
    });

    it('attributes multiple statements on one line to that line', function () {
        const stdout = captureWriter();
        run( {
            sourcePath: 'prog.sno',
            source: " X = 1 ; Y = X + 'A'\nEND\n",
            stdout,
        } );
        const output = joinLines( stdout.lines );
        assert.match( output, /at prog\.sno:1/ );
        assert.match( output, /X = 1 ; Y = X \+ 'A'/ );
    });

    it('summarises every compile error after the source pass', function () {
        const stdout = captureWriter();
        run( {
            sourcePath: 'bad.sno',
            source: " X = #\n Y = 'unclosed\nEND\n",
            stdout,
        } );
        const output = joinLines( stdout.lines );
        assert.match( output, /ERRORS DETECTED IN SOURCE PROGRAM/ );
        assert.match( output, /ILLEGAL CHARACTER IN ELEMENT.*bad\.sno:1/ );
        assert.match( output, /UNCLOSED LITERAL.*bad\.sno:2/ );
    });

    it('falls back to a synthetic path for inline source', function () {
        const stdout = captureWriter();
        run( { source: " X = X + 'A'\nEND\n", stdout } );
        const output = joinLines( stdout.lines );
        assert.match( output, /at source\.sno:1/ );
    });

    it('shows the offending line when a compile-time error fires before any statement runs', function () {
        const stdout = captureWriter();
        run( {
            sourcePath: 'prog.sno',
            source: " X = 'A'\n-INCLUDE 'does-not-exist.inc'\nEND\n",
            stdout,
        } );
        const output = joinLines( stdout.lines );
        assert.match( output, /STATEMENT\s+0/ );
        assert.match( output, /READING ERROR/ );
        assert.match( output, /at prog\.sno:2/ );
        assert.match( output, /-INCLUDE 'does-not-exist\.inc'/ );
    });
});

describe('Multi-line strings', function () {
    it('expands a backtick range across cards into one logical string', function () {
        const stdout = captureWriter();
        run( {
            source: ' X = `one\ntwo\nthree`\n OUTPUT = X\nEND\n',
            stdout,
        } );
        assert.equal( joinLines( stdout.lines ), 'one\ntwo\nthree\n' );
    });

    it('lets a backtick range carry both quote flavors verbatim', function () {
        const stdout = captureWriter();
        run( {
            source: ' X = `it\'s "ok"`\n OUTPUT = X\nEND\n',
            stdout,
        } );
        assert.equal( joinLines( stdout.lines ), 'it\'s "ok"\n' );
    });

    it("keeps the closer line's suffix on the same SNOBOL statement", function () {
        // The closing `)` sits after the closing backtick. Without
        // continuation cards the LOAD call would split across statements.
        const stdout = captureWriter();
        run( {
            source: " LOAD('ECHO(STRING)STRING',`\n   s => s + '!'`)\n" +
                " OUTPUT = ECHO('hi')\nEND\n",
            stdout,
        } );
        assert.equal( joinLines( stdout.lines ), 'hi!\n' );
    });

    it('opt-out leaves backtick as an illegal character', function () {
        const stdout = captureWriter();
        run( {
            sourcePath: 'prog.sno',
            source: ' X = `hello`\nEND\n',
            stdout,
            multilineStrings: false,
        } );
        assert.match( joinLines( stdout.lines ), /ILLEGAL CHARACTER/ );
    });

    it('preserves source line numbers when reporting later errors', function () {
        const stdout = captureWriter();
        run( {
            sourcePath: 'prog.sno',
            source: ' X = `one\ntwo\nthree`\n Y = $%\nEND\n',
            stdout,
        } );
        // The Y assignment is the fourth source line and must be reported
        // as such, even though three of those lines were absorbed by the
        // backtick range.
        assert.match( joinLines( stdout.lines ), /at prog\.sno:4/ );
    });

    it('leaves a backtick inside a SNOBOL literal untouched', function () {
        const stdout = captureWriter();
        run( {
            source: " X = 'has a ` inside'\n OUTPUT = X\nEND\n",
            stdout,
        } );
        assert.equal( joinLines( stdout.lines ), 'has a ` inside\n' );
    });

    it('leaves a backtick on a comment line untouched', function () {
        const stdout = captureWriter();
        run( {
            source: "* a ` in a comment\n OUTPUT = 'ok'\nEND\n",
            stdout,
        } );
        assert.equal( joinLines( stdout.lines ), 'ok\n' );
    });

    it('reports an unclosed backtick range as a compile error', function () {
        const stdout = captureWriter();
        run( {
            sourcePath: 'prog.sno',
            source: ' X = `oops\nEND\n',
            stdout,
        } );
        assert.match( joinLines( stdout.lines ), /UNCLOSED LITERAL/ );
        assert.match( joinLines( stdout.lines ), /at prog\.sno:1/ );
    });

    it('reports an unclosed multi-card backtick without a system error', function () {
        const stdout = captureWriter();
        run( {
            sourcePath: 'prog.sno',
            source: ' X = `one\ntwo\nEND\n',
            stdout,
        } );
        const output = joinLines( stdout.lines );
        assert.match( output, /UNCLOSED LITERAL/ );
        assert.match( output, /ERROR 28 IN STATEMENT\s+1/ );
        assert.doesNotMatch( output, /ERROR 17 IN STATEMENT\s+0/ );
        assert.doesNotMatch( output, /ERROR IN SNOBOL4 SYSTEM/ );
    });

    it('grows the raw literal buffer for large backtick strings', function () {
        const payload = Array.from(
            { length: 180 },
            ( _, i ) => `line-${String( i ).padStart( 3, '0' )}`,
        ).join( '\n' );
        const stdout = captureWriter();
        run( {
            source: ` X = \`${payload}\`\n OUTPUT = SIZE(X)\nEND\n`,
            stdout,
        } );
        assert.equal( joinLines( stdout.lines ), `${payload.length}\n` );
    });

    it('lists each card consumed by a multi-card backtick literal', function () {
        const stdout = captureWriter();
        run( {
            source: ' X = `one\ntwo\nthree`\n OUTPUT = X\nEND\n',
            stdout,
            list: true,
        } );
        const output = joinLines( stdout.lines );
        assert.match( output, /X = `one/ );
        assert.match( output, /two/ );
        assert.match( output, /three`/ );
        assert.match( output, /one\ntwo\nthree/ );
    });
});

function captureWriter() {
    return {
        lines: [],
        write( line ) {
            this.lines.push( line );
        },
        close() {},
    };
}

function joinLines( lines ) {
    return lines.length === 0 ? '' : lines.join( '\n' ) + '\n';
}

function bufferedLineReader( lines ) {
    let pos = 0,
        closed = false;
    return {
        readLine() {
            if ( closed || pos >= lines.length ) return null;
            return new TextEncoder().encode( lines[pos++] );
        },
        close() {
            closed = true;
        },
    };
}

describe('Descriptor Datatype', function () {
    it('init', function () {
        const vm = new VM(),
            orig = vm.d( sil.DESCR.call( vm ) ),
            copy = vm.d( orig.ptr );
        orig.addr = 90210;
        assert.equal( copy.addr, 90210 );
    });

    it('raw', function () {
        const vm = new VM(),
            d = vm.d( sil.DESCR.call( vm ) );
        d.addr = 6;
        d.flags = 7;
        d.value = 8;
        assert.deepEqual( d.cells(), [ 6, 7, 8 ] );
    });

    it('read', function () {
        const vm = new VM(),
            src = vm.d( sil.DESCR.call( vm ) ),
            dst = vm.d( sil.DESCR.call( vm ) );
        src.set( 6, 7, 8 );
        dst.copyFrom( src );
        assert.deepEqual( dst.cells(), src.cells() );
    });

    it('set', function () {
        const vm = new VM(),
            d = vm.d( sil.DESCR.call( vm ) );
        d.set( 6, 7, 8 );
        assert.deepEqual( d.cells(), [ 6, 7, 8 ] );
    });

    it('eq', function () {
        const vm = new VM(),
            d1 = vm.d( sil.DESCR.call( vm ) ),
            d2 = vm.d( sil.DESCR.call( vm ) );

        d1.set( 6, 7, 8 );
        d2.set( 6, 7, 8 );
        assert( d1.isEqualTo( d2 ) );

        d2.set( 9, 10, 11 );
        assert( !d1.isEqualTo( d2 ) );
    });
});

describe('Specifier Datatype', function () {
    it('init', function () {
        const vm = new VM(),
            orig = vm.s( sil.SPEC.call( vm ) ),
            copy = vm.s( orig.ptr );
        orig.offset = 90210;
        assert.equal( copy.offset, 90210 );
    });

    it('raw', function () {
        const vm = new VM(),
            s = vm.s( sil.SPEC.call( vm ) );
        s.addr = 6;
        s.flags = 7;
        s.value = 8;
        s.offset = 9;
        s.length = 10;
        assert.deepEqual( s.cells(), [ 6, 7, 8, 9, 0, 10 ] );
        assert.equal( vm.mem[s.ptr + 4], 0 );
        assert.equal( vm.mem[s.ptr + 5], 10 );
    });

    it('read', function () {
        const vm = new VM(),
            src = vm.s( sil.SPEC.call( vm ) ),
            dst = vm.s( sil.SPEC.call( vm ) );
        src.set( 6, 7, 8, 9, 10 );
        dst.copyFrom( src );
        assert.deepEqual( dst.cells(), src.cells() );
    });

    it('set', function () {
        const vm = new VM(),
            s = vm.s( sil.SPEC.call( vm ) );
        s.set( 6, 7, 8, 9, 10 );
        assert.deepEqual( s.cells(), [ 6, 7, 8, 9, 0, 10 ] );
        assert.equal( vm.mem[s.ptr + 4], 0 );
        assert.equal( vm.mem[s.ptr + 5], 10 );
    });

    it('eq', function () {
        const vm = new VM(),
            s1 = vm.s( sil.SPEC.call( vm ) ),
            s2 = vm.s( sil.SPEC.call( vm ) );

        s1.set( 6, 7, 8, 9, 10 );
        s2.set( 6, 7, 8, 9, 10 );
        assert( s1.isEqualTo( s2 ) );

        s2.set( 1, 2, 3, 4, 5 );
        assert( !s1.isEqualTo( s2 ) );
    });

    it('specified', function () {
        const vm = new VM(),
            s = vm.s( sil.STRING.call( vm, '안녕' ) );
        assert.equal( s.specified, '안녕' );
    });
});

describe('Program Execution', function () {
    it('run', function () {
        const vm = new VM();
        vm.run( assemble( [
            { label: 'A', macro: 'EQU', operands: [ 11 ] },
            { label: 'B', macro: 'EQU', operands: [ 17 ] },
            { label: null, macro: 'END', operands: [] },
        ] ) );
        assert.equal( vm.$( 'A' ), 11 );
        assert.equal( vm.$( 'B' ), 17 );
    });

    it('honors an explicit branch to the current instruction', function () {
        const previous = sil.TEST_SELF_BRANCH;

        sil.TEST_SELF_BRANCH = function () {
            this.selfBranchCount = ( this.selfBranchCount || 0 ) + 1;
            this.jmp( this.selfBranchCount < 3 ? 0 : 1 );
        };

        try {
            const vm = new VM();
            vm.run( {
                symbols: {},
                memory: new Uint32Array( 0 ),
                instructions: [
                    [ 'TEST_SELF_BRANCH', [] ],
                    [ 'END', [] ],
                ],
            } );
            assert.equal( vm.selfBranchCount, 3 );
        } finally {
            if ( previous === undefined ) {
                delete sil.TEST_SELF_BRANCH;
            } else {
                sil.TEST_SELF_BRANCH = previous;
            }
        }
    });
});
