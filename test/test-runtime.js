
import assert from 'node:assert';
import childProcess from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { VM, Descriptor, Specifier, File, assemble, constants, createVM, image, run, sil, str, stdinReader } from '../src/snobol.js';
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

    it( 'decode', function () {
        assert.deepEqual( str.decode( [ 2361, 2366, 2351 ] ), 'हाय' );
    } );

    it( 'decode preserves raw UTF-16 code units', function () {
        assert.equal( str.decode( [ 0xFEFF, 65 ] ), '\uFEFFA' );
        assert.equal( str.decode( [ 0xD800 ] ), '\uD800' );
    } );

    it( 'decode ignores descriptor padding without mutating input', function () {
        const encoded = [ 97, 98, 0 ];
        assert.equal( str.decode( encoded ), 'ab' );
        assert.deepEqual( encoded, [ 97, 98, 0 ] );
    } );
} );

describe( 'Typed Setters', function () {
    beforeEach( function () {
        this.vm = new VM();
    } );

    it( 'uint', function () {
        const vm = this.vm;
        assert.throws( function () {
            vm.setUint( 0, -4 );
        }, 'RangeError' );
    } );

    it( 'int', function () {
        const vm = this.vm;
        assert.throws( function () {
            vm.setUint( 0, 4.2 );
        }, 'RangeError' );
    } );

    it( 'real', function () {
        const vm = this.vm;
        assert.throws( function () {
            vm.setReal( 0, 10e100 );
        }, 'RangeError' );
    } );
} );

describe( 'Typed Getters', function () {
    beforeEach( function () {
        this.vm = new VM();
    } );

    it( 'uint', function () {
        this.vm.setUint( 0, 123 );
        assert.equal( this.vm.getUint(0), 123 );
    } );

    it( 'int', function () {
        this.vm.setInt( 0, -123 );
        assert.equal( this.vm.getInt(0), -123 );
    } );

    it( 'real', function () {
        this.vm.setReal( 0, Math.PI );
        assert.equal( Math.floor( this.vm.getReal(0) ), 3 );
    } );
} );

describe( 'Symbol Binding', function () {
    beforeEach( function () {
        this.vm = new VM();
    } );

    it( 'simple', function () {
        this.vm.define( 'answer', 42 );
        assert.equal( this.vm.resolve('answer'), 42 );
    } );

    it( 'missing', function () {
        const vm = this.vm;
        assert.throws( function () {
            vm.resolve( 'missing' );
        }, 'ReferenceError' );
    } );

} );

describe( 'Memory Management', function () {
    beforeEach( function () {
        this.vm = new VM();
    } );

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

    it( 'creates a VM with host file loading by default', function () {
        const root = path.join( __dirname, '..' ),
              programFile = path.join( root, 'tmp', 'test-create-vm-file.sno' ),
              stdout = captureWriter();

        fs.mkdirSync( path.dirname( programFile ), { recursive: true } );
        fs.writeFileSync( programFile, " OUTPUT = 'CREATE VM'\nEND\n" );

        const vm = createVM( {
            file: programFile,
            stdout
        } );

        vm.run( image );

        assert.equal( joinLines( stdout.lines ), 'CREATE VM\n' );
    } );

    it( 'resolves INCLUDE relative to the including file through createVM', function () {
        const root = path.join( __dirname, '..' ),
              dir = path.join( root, 'tmp', 'test-create-vm-include' ),
              libDir = path.join( dir, 'lib' ),
              mainFile = path.join( dir, 'main.sno' ),
              nestedFile = path.join( libDir, 'nested.sno' ),
              stdout = captureWriter();

        fs.mkdirSync( libDir, { recursive: true } );
        fs.writeFileSync( nestedFile, " OUTPUT = 'CREATE INCLUDE'\n" );
        fs.writeFileSync( mainFile, "-INCLUDE 'lib/nested.sno'\nEND\n" );

        const vm = createVM( {
            file: mainFile,
            stdout
        } );

        vm.run( image );

        assert.equal( joinLines( stdout.lines ), 'CREATE INCLUDE\n' );
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
        childProcess.execFileSync( process.execPath, [
            '--input-type=module',
            '-e',
            "globalThis.process.getBuiltinModule = undefined; await import('./src/snobol.js');"
        ], {
            cwd: path.join( __dirname, '..' ),
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
              libDir = path.join( dir, 'lib' ),
              mainFile = path.join( dir, 'main.sno' ),
              sharedFile = path.join( libDir, 'shared.sno' ),
              nestedFile = path.join( libDir, 'nested.sno' ),
              copyFile = path.join( dir, 'copy.sno' );

        fs.mkdirSync( libDir, { recursive: true } );
        fs.writeFileSync( sharedFile, " OUTPUT = 'SHARED'\n-INCLUDE 'nested.sno'\n" );
        fs.writeFileSync( nestedFile, " OUTPUT = 'NESTED'\n" );
        fs.writeFileSync( copyFile, " OUTPUT = 'COPY'\n" );
        fs.writeFileSync( mainFile, [
            "-INCLUDE 'lib/shared.sno'",
            '-COPY "copy.sno"',
            "-INCLUDE 'lib/shared.sno'",
            "-INCLUDE 'lib/shared.sno '",
            'END',
            ''
        ].join( '\n' ) );

        const output = childProcess.execFileSync( process.execPath, [
            'bin/snoflake.js',
            '--file=tmp/test-include/main.sno'
        ], {
            cwd: root,
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
        assert.deepEqual( vm.openUnit( 5 ).readRecord( 80 ), {
            eof: true,
            text: '',
            padded: false,
        } );
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
              file = vm.openUnit( 5 );

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
              file = vm.openUnit( constants.UNITI );

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
        assert.deepEqual( file.readRecord( 8 ), {
            eof: true,
            text: '',
            padded: false,
        } );
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
        drained = false;
    return {
        readLine() {
            if ( drained || pos >= lines.length ) return null;
            return new TextEncoder().encode( lines[ pos++ ] );
        },
        drain() { drained = true; },
    };
}

describe( 'Descriptor Datatype', function () {
    beforeEach( function () {
        this.vm = new VM();
    } );

    it( 'enumerables', function () {
        const d = this.vm.d(),
              fields = [ 'ptr', 'vm' ],
              keys = [];
        for ( const key in d ) {
            keys.push( key );
        }
        assert.deepEqual( keys.sort(), fields );
    } );

    it( 'init', function () {
        const orig = this.vm.d(),
              copy = this.vm.d( orig.ptr );
        orig.addr = 90210;
        assert.equal( copy.addr, 90210 );
    } );

    it( 'width', function () {
        const d = this.vm.d();
        assert.equal( d.width, 3 );
    } );

    it( 'getters_setters', function () {
        const d = this.vm.d();
        d.addr = -123;
        assert.equal( d.addr, -123 );
        d.raddr = 6.1;
        assert.equal( Math.floor( d.raddr ), 6 );
        d.flags = 666;
        assert.equal( d.flags, 666 );
        d.value = 777;
        assert.equal( d.value, 777 );
    } );

    it( 'not_specifier', function () {
        const d = this.vm.d();
        assert( !d.length );
    } );

    it( 'raw', function () {
        const d = this.vm.d();
        d.addr = 6;
        d.flags = 7;
        d.value = 8;
        assert.deepEqual( d.raw(), [ 6, 7, 8 ] );
    } );

    it( 'read', function () {
        const src = this.vm.d(), dst = this.vm.d();
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
    beforeEach( function () {
        this.vm = new VM();
    } );

    it( 'enumerables', function () {
        const fields = [ 'ptr', 'vm' ],
              s = new Specifier( this.vm ),
              keys = [];
        for ( const key in s ) {
            keys.push( key );
        }
        assert.deepEqual( keys.sort(), fields );
    } );

    it( 'init', function () {
        const orig = new Specifier( this.vm ),
              copy = new Specifier( this.vm, orig.ptr );
        orig.offset = 90210;
        assert.equal( copy.offset, 90210 );
    } );

    it( 'width', function () {
        const s = new Specifier( this.vm );
        assert.equal( s.width, 6 );
    } );

    it( 'getters_setters', function () {
        const s = new Specifier( this.vm );
        s.offset = 123;
        assert.equal( s.offset, 123 );
        s.length = 456;
        assert.equal( s.length, 456 );
    } );

    it( 'raw', function () {
        const s = new Specifier( this.vm );
        s.addr = 6;
        s.flags = 7;
        s.value = 8;
        s.offset = 9;
        s.length = 10;
        assert.deepEqual( s.raw(), [ 6, 7, 8, 9, 10 ] );
    } );

    it( 'read', function () {
        const src = new Specifier( this.vm ),
              dst = new Specifier( this.vm );
        src.update( 6, 7, 8, 9, 10 );
        dst.read( src );
        assert.deepEqual( dst.raw(), src.raw() );
    } );

    it( 'update', function () {
        const s = new Specifier( this.vm );
        s.update( 6, 7, 8, 9, 10 );
        assert.deepEqual( s.raw(), [ 6, 7, 8, 9, 10 ] );
    } );

    it( 'eq', function () {
        const s1 = new Specifier( this.vm ),
              s2 = new Specifier( this.vm );

        s1.update( 6, 7, 8, 9, 10 );
        s2.update( 6, 7, 8, 9, 10 );
        assert( s1.isEqualTo( s2 ) );

        s2.update( 1, 2, 3, 4, 5 );
        assert( !s1.isEqualTo( s2 ) );
    } );

    it( 'specified', function () {
        const s = this.vm.s( sil.STRING.call( this.vm, '안녕' ) );
        assert.equal( s.specified, '안녕' ); 
    } );
} );

describe( 'Miscellaneous Shortcuts', function () {
    beforeEach( function () {
        this.vm = new VM();
    } );

    it( 'd', function () {
        const d = this.vm.d( 6 );
        assert( d instanceof Descriptor );
        assert.equal( d.ptr, 6 );
    } );

    it( 's', function () {
        const s = this.vm.s( 6 );
        assert( s instanceof Specifier );
        assert.equal( s.ptr, 6 );
    } );
} );


describe( 'Program Execution', function () {
    beforeEach( function () {
        this.vm = new VM();
    } );

    it( 'jmp', function () {
        this.vm.jmp( 4 );
        assert.equal( this.vm.instructionPointer, 4 );
    } );

    it( 'run', function () {
        this.vm.run( assemble( [
            { label: 'A',  macro: 'EQU', operands: [ 11 ] },
            { label: 'B',  macro: 'EQU', operands: [ 17 ] },
            { label: null, macro: 'END', operands: [] },
        ] ) );
        assert.equal( this.vm.resolve( 'A' ), 11 );
        assert.equal( this.vm.resolve( 'B' ), 17 );
    } );

    it( 'honors an explicit branch to the current instruction', function () {
        const previous = sil.TEST_SELF_BRANCH;

        sil.TEST_SELF_BRANCH = function () {
            this.selfBranchCount = ( this.selfBranchCount || 0 ) + 1;
            this.jmp( this.selfBranchCount < 3 ? 0 : 1 );
        };

        try {
            this.vm.run( {
                symbols: {},
                memory: new Uint32Array( 0 ),
                instructions: [
                    [ null, 'TEST_SELF_BRANCH', [] ],
                    [ null, 'END', [] ],
                ],
            } );
        } finally {
            if ( previous === undefined ) {
                delete sil.TEST_SELF_BRANCH;
            } else {
                sil.TEST_SELF_BRANCH = previous;
            }
        }

        assert.equal( this.vm.selfBranchCount, 3 );
    } );

    it( 'loads the image memory snapshot directly into VM memory', function () {
        // The image carries memory as a byte snapshot. vm.run copies it.
        // it does not re-run the assembler. Stash a single descriptor
        // (31, 7, 9) at offset 0 and bind 'DS' to it.
        const image = {
            symbols: { DS: 0 },
            memory: new Uint32Array( [ 31, 7, 9 ] ),
            instructions: [
                [ null, 'END', [] ]
            ]
        };

        this.vm.run( image );

        assert.equal( this.vm.d( 'DS' ).addr, 31 );
        assert.equal( this.vm.d( 'DS' ).flags, 7 );
        assert.equal( this.vm.d( 'DS' ).value, 9 );
    } );
} );
