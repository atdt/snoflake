
import assert from 'node:assert';
import childProcess from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { VM, Descriptor, Specifier, File, assemble, constants, createVM, image, run, sil, str, stdinReader } from '../src/snobol.js';
import { createHostLoader } from '../src/host.js';
import process from "node:process";

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );

//
// Test Cases
//

describe( 'String Encoding', function () {
    it( 'encode', function () {
        const encoded = str.encode( 'हाय' );
        assert( encoded instanceof Uint32Array );
        assert.deepEqual( Array.from( encoded ), [ 2361, 2366, 2351 ] );
    } );

    it( 'encode pads to descriptor boundaries', function () {
        assert.deepEqual( Array.from( str.encode( 'ab' ) ), [ 97, 98, 0 ] );
    } );

    it( 'decode reads the requested logical span', function () {
        assert.deepEqual( str.decode( [ 0, 2361, 2366, 2351, 0 ], 1, 3 ), 'हाय' );
    } );

    it( 'decode preserves raw UTF-16 code units', function () {
        assert.equal( str.decode( [ 0xFEFF, 65 ], 0, 2 ), '\uFEFFA' );
        assert.equal( str.decode( [ 0xD800 ], 0, 1 ), '\uD800' );
    } );

    it( 'decode preserves logical trailing zero bytes', function () {
        const encoded = [ 97, 98, 0 ];
        assert.equal( str.decode( encoded, 0, 3 ), 'ab\0' );
        assert.deepEqual( encoded, [ 97, 98, 0 ] );
    } );
} );

describe( 'Typed Setters', function () {
    it( 'uint', function () {
        const vm = new VM();
        assert.throws( function () {
            vm.setUint( 0, -4 );
        }, 'RangeError' );
    } );

    it( 'int', function () {
        const vm = new VM();
        assert.throws( function () {
            vm.setUint( 0, 4.2 );
        }, 'RangeError' );
    } );

    it( 'real', function () {
        const vm = new VM();
        assert.throws( function () {
            vm.setReal( 0, 10e100 );
        }, 'RangeError' );
    } );
} );

describe( 'Typed Getters', function () {
    it( 'uint', function () {
        const vm = new VM();
        vm.setUint( 0, 123 );
        assert.equal( vm.getUint( 0 ), 123 );
    } );

    it( 'int', function () {
        const vm = new VM();
        vm.setInt( 0, -123 );
        assert.equal( vm.getInt( 0 ), -123 );
    } );

    it( 'real', function () {
        const vm = new VM();
        vm.setReal( 0, Math.PI );
        assert.equal( Math.floor( vm.getReal( 0 ) ), 3 );
    } );
} );

describe( 'Symbol Binding', function () {
    it( 'simple', function () {
        const vm = new VM();
        vm.define( 'answer', 42 );
        assert.equal( vm.resolve( 'answer' ), 42 );
    } );

    it( 'missing', function () {
        const vm = new VM();
        assert.throws( function () {
            vm.resolve( 'missing' );
        }, 'ReferenceError' );
    } );

} );

describe( 'Memory Management', function () {
    it( 'alloc', function () {
        const vm = new VM(),
              ptr = vm.alloc( 3 );
        assert.deepEqual( vm.memPtr, ptr + 3 );
        assert.deepEqual( Array.from( vm.mem.slice( vm.memPtr - 3, vm.memPtr ) ), [ 0, 0, 0 ] );
    } );

    it( 'grows without losing allocated data', function () {
        const vm = new VM();
        vm.memPtr = vm.mem.length - 1;

        const first = vm.alloc( 1, 123 ),
              second = vm.alloc( 2, 7 );

        assert.equal( vm.mem[ first ], 123 );
        assert.deepEqual( Array.from( vm.mem.slice( second, second + 2 ) ), [ 7, 7 ] );
        assert.equal( vm.memPtr, second + 2 );
    } );
} );

describe( 'SNOBOL Program Execution', function () {
    it( 'runs source text through the public API', function () {
        const stdout = captureWriter(),
              result = run( {
                  source: " OUTPUT = 'SOURCE API'\nEND\n",
                  stdout
              } );

        assert.equal( joinLines( stdout.lines ), 'SOURCE API\n' );
        assert.equal( result.exitCode, 0 );
        assert( result.vm instanceof VM );
    } );

    it( 'prefers source text over file loading', function () {
        const stdout = captureWriter(),
              result = run( {
                  file: 'missing-file.sno',
                  source: " OUTPUT = 'SOURCE WINS'\nEND\n",
                  stdout
              } );

        assert.equal( joinLines( stdout.lines ), 'SOURCE WINS\n' );
        assert.equal( result.vm.options.file, 'source.sno' );
    } );

    it( 'preserves trailing NUL bytes in logical strings', function () {
        const stdout = captureWriter();

        run( {
            source: [
                ' &ALPHABET LEN(1) . T',
                ' OUTPUT = SIZE("A" T)',
                'END',
                ''
            ].join( '\n' ),
            stdout
        } );

        assert.equal( joinLines( stdout.lines ), '2\n' );
    } );

    it( 'creates a VM that loads a file through an explicit host loader', function () {
        const root = path.join( __dirname, '..' ),
              programFile = path.join( root, 'tmp', 'test-create-vm-file.sno' ),
              stdout = captureWriter();

        fs.mkdirSync( path.dirname( programFile ), { recursive: true } );
        fs.writeFileSync( programFile, " OUTPUT = 'CREATE VM'\nEND\n" );

        const vm = createVM( {
            file: programFile,
            loader: createHostLoader(),
            stdout
        } );

        vm.run( image );

        assert.equal( joinLines( stdout.lines ), 'CREATE VM\n' );
    } );

    it( 'resolves INCLUDE relative to the current working directory', function () {
        // CSNOBOL4 alignment: the first entry in the INCLUDE search list is
        // the process CWD, not the including file's directory.
        const root = path.join( __dirname, '..' ),
              dir = path.join( root, 'tmp', 'test-cwd-include' ),
              stdout = captureWriter();

        fs.mkdirSync( dir, { recursive: true } );
        fs.writeFileSync( path.join( dir, 'nested.sno' ), " OUTPUT = 'CWD INCLUDE'\n" );
        fs.writeFileSync( path.join( dir, 'main.sno' ), "-INCLUDE 'nested.sno'\nEND\n" );

        const orig = process.cwd();
        process.chdir( dir );
        try {
            const vm = createVM( { file: 'main.sno', loader: createHostLoader(), stdout } );
            vm.run( image );
        } finally {
            process.chdir( orig );
        }

        assert.equal( joinLines( stdout.lines ), 'CWD INCLUDE\n' );
    } );

    it( 'resolves INCLUDE files through SNOLIB', function () {
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
        fs.writeFileSync( firstFile, " OUTPUT = 'SNOLIB FIRST'\n-INCLUDE 'second.sno'\n" );
        fs.writeFileSync( secondFile, " OUTPUT = 'SNOLIB SECOND'\n" );

        const vm = createVM( {
            file: mainFile,
            loader: createHostLoader( { snolib: [ libDir, nestedLibDir ] } ),
            stdout
        } );

        vm.run( image );

        assert.equal( joinLines( stdout.lines ), 'SNOLIB FIRST\nSNOLIB SECOND\n' );
    } );

    it( 'keeps a custom loader authoritative', function () {
        const stdout = captureWriter(),
              vm = createVM( {
                  file: 'virtual.sno',
                  stdout,
                  loader: {
                      load( filePath ) {
                          assert.equal( filePath, 'virtual.sno' );
                          return " OUTPUT = 'CUSTOM LOADER'\nEND\n";
                      }
                  }
              } );

        vm.run( image );

        assert.equal( joinLines( stdout.lines ), 'CUSTOM LOADER\n' );
    } );

    it( 'imports the root module without eager Node builtin access', function () {
        const root = path.join( __dirname, '..' ),
              probe = path.join( root, 'tmp', 'test-no-eager-builtin.mjs' );

        fs.mkdirSync( path.dirname( probe ), { recursive: true } );
        fs.writeFileSync( probe,
            "globalThis.process.getBuiltinModule = undefined;\n"
            + "await import('../src/snobol.js');\n" );

        childProcess.execFileSync( process.execPath, [ probe ], {
            cwd: root,
            encoding: 'utf8'
        } );
    } );

    it( 'accepts a positional source file path', function () {
        const root = path.join( __dirname, '..' ),
              programFile = path.join( root, 'tmp', 'test-positional-source.sno' );

        fs.mkdirSync( path.dirname( programFile ), { recursive: true } );
        fs.writeFileSync( programFile, " OUTPUT = 'POSITIONAL'\nEND\n" );

        const output = childProcess.execFileSync( process.execPath, [
            'bin/snoflake.js',
            'tmp/test-positional-source.sno'
        ], {
            cwd: root,
            encoding: 'utf8'
        } );

        assert.equal( output, 'POSITIONAL\n' );
        assert( !output.includes( 'ERR_INVALID_ARG_TYPE' ) );
        assert( !output.includes( 'ERROR IN SNOBOL4 SYSTEM' ) );
    } );

    it( 'interpolates INCLUDE and COPY source files once', function () {
        const root = path.join( __dirname, '..' ),
              dir = path.join( root, 'tmp', 'test-include' ),
              mainFile = path.join( dir, 'main.sno' ),
              sharedFile = path.join( dir, 'shared.sno' ),
              nestedFile = path.join( dir, 'nested.sno' ),
              copyFile = path.join( dir, 'copy.sno' );

        fs.mkdirSync( dir, { recursive: true } );
        fs.writeFileSync( sharedFile, " OUTPUT = 'SHARED'\n-INCLUDE 'nested.sno'\n" );
        fs.writeFileSync( nestedFile, " OUTPUT = 'NESTED'\n" );
        fs.writeFileSync( copyFile, " OUTPUT = 'COPY'\n" );
        fs.writeFileSync( mainFile, [
            "-INCLUDE 'shared.sno'",
            '-COPY "copy.sno"',
            "-INCLUDE 'shared.sno'",
            "-INCLUDE 'shared.sno '",
            'END',
            ''
        ].join( '\n' ) );

        const output = childProcess.execFileSync( process.execPath, [
            path.join( root, 'bin/snoflake.js' ),
            '--file=main.sno'
        ], {
            cwd: dir,
            encoding: 'utf8'
        } );

        assert.equal( output, 'SHARED\nNESTED\nCOPY\n' );
    } );

    it( 'supports PLB4 filename arguments for INPUT and OUTPUT', function () {
        const dir = fs.mkdtempSync( path.join( os.tmpdir(), 'snoflake-plb4-' ) ),
              programFile = path.join( dir, 'program.sno' ),
              inputFile = path.join( dir, 'records.txt' ),
              outputFile = path.join( dir, 'records.out' ),
              stdout = captureWriter(),
              quote = s => "'" + s.replace( /'/g, "''" ) + "'";

        fs.writeFileSync( inputFile, 'ALPHA\nBETA\n' );
        fs.writeFileSync( programFile, [
            '          INPUT("INVAR", 7, 20, ' + quote( inputFile ) + ')',
            '          OUTPUT("LOG", 8, "(A)", ' + quote( outputFile ) + ')',
            'READ      CARD = INVAR :F(DONE)',
            '          OUTPUT = CARD',
            '          LOG = "FILE:" CARD :(READ)',
            'DONE      LOG = "EOF"',
            'END',
            ''
        ].join( '\n' ) );

        try {
            const vm = createVM( {
                file: programFile,
                loader: createHostLoader(),
                stdout,
            } );
            vm.run( image );

            assert.equal( joinLines( stdout.lines ), 'ALPHA\nBETA\n' );
            assert.equal( fs.readFileSync( outputFile, 'utf8' ), 'FILE:ALPHA\nFILE:BETA\nEOF\n' );
        } finally {
            fs.rmSync( dir, { recursive: true, force: true } );
        }
    } );

    it( 'returns EOF when no input streams are configured', function () {
        const vm = new VM();
        assert.deepEqual( vm.units.open( 5 ).readRecord( 80 ), { eof: true } );
    } );

    it( 'opens interactive UNITI with a stdin segment after source and runtime input', function () {
        const files = {
                  source: 'SOURCE\n',
                  input: 'INPUT\n',
              },
              vm = new VM( {
                  file: 'source',
                  input: 'input',
                  interactive: true,
                  loader: { load: path => files[ path ] },
                  stdinReader: () => bufferedLineReader( [ 'STDIN' ] ),
              } ),
              file = vm.units.open( 5 );

        assert.equal( file.segments.length, 3 );
        assert.deepEqual( file.segments.map( segment => segment.padReads ), [
            true,
            false,
            false,
        ] );
    } );

    it( 'reads source, then runtime input, then interactive stdin', function () {
        const files = {
                  source: 'SOURCE\n',
                  input: 'INPUT\n',
              },
              vm = new VM( {
                  file: 'source',
                  input: 'input',
                  interactive: true,
                  loader: { load: path => files[ path ] },
                  stdinReader: () => bufferedLineReader( [ 'STDIN' ] ),
              } ),
              file = vm.units.open( constants.UNITI );

        assert.deepEqual( file.readRecord( 8 ), {
            eof: false,
            text: 'SOURCE  ',
            padded: true,
        } );
        assert.deepEqual( file.readRecord( 8 ), {
            eof: false,
            text: 'INPUT',
            padded: false,
        } );
        assert.deepEqual( file.readRecord( 8 ), {
            eof: false,
            text: 'STDIN',
            padded: false,
        } );
        assert.deepEqual( file.readRecord( 8 ), { eof: true } );
    } );

    it( 'drains stdin without reading from fd 0 after close', function () {
        const reader = stdinReader(),
              file = new File( [ { reader, padReads: false } ] );

        file.close();
        assert.equal( reader.readLine(), null );
    } );
} );

function captureWriter() {
    return {
        lines: [],
        write( line ) { this.lines.push( line ); },
        close() {}
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
            return new TextEncoder().encode( lines[ pos++ ] );
        },
        close() { closed = true; },
    };
}

describe( 'Descriptor Datatype', function () {
    it( 'init', function () {
        const vm = new VM(),
              orig = vm.d(),
              copy = vm.d( orig.ptr );
        orig.addr = 90210;
        assert.equal( copy.addr, 90210 );
    } );

    it( 'raw', function () {
        const vm = new VM(),
              d = vm.d();
        d.addr = 6;
        d.flags = 7;
        d.value = 8;
        assert.deepEqual( d.raw(), [ 6, 7, 8 ] );
    } );

    it( 'read', function () {
        const vm = new VM(),
              src = vm.d(),
              dst = vm.d();
        src.update( 6, 7, 8 );
        dst.read( src );
        assert.deepEqual( dst.raw(), src.raw() );
    } );

    it( 'update', function () {
        const vm = new VM(),
              d = new Descriptor( vm );
        d.update( 6, 7, 8 );
        assert.deepEqual( d.raw(), [ 6, 7, 8 ] );
    } );

    it( 'eq', function () {
        const vm = new VM(),
              d1 = new Descriptor( vm ),
              d2 = new Descriptor( vm );

        d1.update( 6, 7, 8 );
        d2.update( 6, 7, 8 );
        assert( d1.isEqualTo( d2 ) );

        d2.update( 9, 10, 11 );
        assert( !d1.isEqualTo( d2 ) );
    } );
} );

describe( 'Specifier Datatype', function () {
    it( 'init', function () {
        const vm = new VM(),
              orig = new Specifier( vm ),
              copy = new Specifier( vm, orig.ptr );
        orig.offset = 90210;
        assert.equal( copy.offset, 90210 );
    } );

    it( 'raw', function () {
        const vm = new VM(),
              s = new Specifier( vm );
        s.addr = 6;
        s.flags = 7;
        s.value = 8;
        s.offset = 9;
        s.length = 10;
        assert.deepEqual( s.raw(), [ 6, 7, 8, 9, 10, 0 ] );
        assert.equal( vm.mem[ s.ptr + 4 ], 10 );
        assert.equal( vm.mem[ s.ptr + 5 ], 0 );
    } );

    it( 'read', function () {
        const vm = new VM(),
              src = new Specifier( vm ),
              dst = new Specifier( vm );
        src.update( 6, 7, 8, 9, 10 );
        dst.read( src );
        assert.deepEqual( dst.raw(), src.raw() );
    } );

    it( 'update', function () {
        const vm = new VM(),
              s = new Specifier( vm );
        s.update( 6, 7, 8, 9, 10 );
        assert.deepEqual( s.raw(), [ 6, 7, 8, 9, 10, 0 ] );
        assert.equal( vm.mem[ s.ptr + 4 ], 10 );
        assert.equal( vm.mem[ s.ptr + 5 ], 0 );
    } );

    it( 'eq', function () {
        const vm = new VM(),
              s1 = new Specifier( vm ),
              s2 = new Specifier( vm );

        s1.update( 6, 7, 8, 9, 10 );
        s2.update( 6, 7, 8, 9, 10 );
        assert( s1.isEqualTo( s2 ) );

        s2.update( 1, 2, 3, 4, 5 );
        assert( !s1.isEqualTo( s2 ) );
    } );

    it( 'specified', function () {
        const vm = new VM(),
              s = vm.s( sil.STRING.call( vm, '안녕' ) );
        assert.equal( s.specified, '안녕' ); 
    } );
} );

describe( 'Program Execution', function () {
    it( 'run', function () {
        const vm = new VM();
        vm.run( assemble( [
            { label: 'A',  macro: 'EQU', operands: [ 11 ] },
            { label: 'B',  macro: 'EQU', operands: [ 17 ] },
            { label: null, macro: 'END', operands: [] },
        ] ) );
        assert.equal( vm.resolve( 'A' ), 11 );
        assert.equal( vm.resolve( 'B' ), 17 );
    } );

    it( 'honors an explicit branch to the current instruction', function () {
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
                    [ null, 'TEST_SELF_BRANCH', [] ],
                    [ null, 'END', [] ],
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
    } );

} );
