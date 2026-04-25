
var assert = require( 'assert' ),
    childProcess = require( 'child_process' ),
    fs = require( 'fs' ),
    path = require( 'path' ),
    SNOBOL = require( '../js/SNOBOL' );

Object.keys( SNOBOL ).forEach( function ( k ) {
    global[k] = SNOBOL[k];
} );


// 
// Scaffolds
//


function mkargs( vm ) {
    // Construct a deferred operands object
    var args = [].slice.call( arguments, 1 );

    return function () { // stub
        return args.map( function ( arg ) {
            return typeof arg === 'number' ? arg : vm.resolve( arg );
        } );
    };
}


//
// Test Cases
//

describe( 'String Encoding', function () {
    it( 'encode', function () {
        assert.deepEqual( SNOBOL.str.encode( 'हाय' ), [ 2361, 2366, 2351 ] );
    } );

    it( 'decode', function () {
        assert.deepEqual( SNOBOL.str.decode( [ 2361, 2366, 2351 ] ), 'हाय' );
    } );
} );

describe( 'Typed Setters', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'uint', function () {
        var vm = this.vm;
        assert.throws( function () {
            vm.setUint( 0, -4 );
        }, 'RangeError' );
    } );

    it( 'int', function () {
        var vm = this.vm;
        assert.throws( function () {
            vm.setUint( 0, 4.2 );
        }, 'RangeError' );
    } );

    it( 'real', function () {
        var vm = this.vm;
        assert.throws( function () {
            vm.setReal( 0, 10e100 );
        }, 'RangeError' );
    } );
} );

describe( 'Typed Getters', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
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
        this.vm = new SNOBOL.VM();
    } );

    it( 'simple', function () {
        this.vm.define( 'answer', 42 );
        assert.equal( this.vm.resolve('answer'), 42 );
    } );

    it( 'missing', function () {
        var vm = this.vm;
        assert.throws( function () {
            vm.resolve( 'missing' );
        }, 'ReferenceError' );
    } );

} );

describe( 'Memory Management', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'alloc', function () {
        var vm = new SNOBOL.VM(), 
            ptr = vm.alloc( 3 );
        assert.deepEqual( vm.mem.length, ptr + 3 );
        assert.deepEqual( vm.mem.slice(-3), [ 0, 0, 0 ] );
    } );
} );

describe( 'SNOBOL Program Execution', function () {
    it( 'prints assigned OUTPUT values', function () {
        var root = path.join( __dirname, '..' ),
            file = path.join( root, 'tmp', 'test-min-output.sno' ),
            output;

        fs.mkdirSync( path.dirname( file ), { recursive: true } );
        fs.writeFileSync( file, " OUTPUT = 'HELLO, WORLD'\nEND\n" );

        output = childProcess.execFileSync( process.execPath, [
            'run.js',
            '--file=tmp/test-min-output.sno',
            '--maxSteps=100000',
            '--maxMillis=1000'
        ], {
            cwd: root,
            encoding: 'utf8'
        } );

        assert( output.includes( '\nHELLO, WORLD\n' ) );
        assert( !output.includes( 'ERROR IN SNOBOL4 SYSTEM' ) );
    } );

    it( 'continues through multiple literal OUTPUT statements', function () {
        var root = path.join( __dirname, '..' ),
            file = path.join( root, 'tmp', 'test-two-output.sno' ),
            output;

        fs.mkdirSync( path.dirname( file ), { recursive: true } );
        fs.writeFileSync( file, " OUTPUT = 'HELLO, WORLD'\n OUTPUT = 'SECOND LINE'\nEND\n" );

        output = childProcess.execFileSync( process.execPath, [
            'run.js',
            '--file=tmp/test-two-output.sno',
            '--maxSteps=100000',
            '--maxMillis=1000'
        ], {
            cwd: root,
            encoding: 'utf8'
        } );

        assert( output.includes( '\nHELLO, WORLD\nSECOND LINE\n' ) );
        assert( !output.includes( 'ERROR IN SNOBOL4 SYSTEM' ) );
    } );

    it( 'prints a variable after literal assignment', function () {
        var root = path.join( __dirname, '..' ),
            file = path.join( root, 'tmp', 'test-var-output.sno' ),
            output;

        fs.mkdirSync( path.dirname( file ), { recursive: true } );
        fs.writeFileSync( file, " X = 'HELLO, WORLD'\n OUTPUT = X\nEND\n" );

        output = childProcess.execFileSync( process.execPath, [
            'run.js',
            '--file=tmp/test-var-output.sno',
            '--maxSteps=100000',
            '--maxMillis=1000'
        ], {
            cwd: root,
            encoding: 'utf8'
        } );

        assert( output.includes( '\nHELLO, WORLD\n' ) );
        assert( !output.includes( 'ERROR IN SNOBOL4 SYSTEM' ) );
    } );

    it( 'prints a concatenated variable and literal expression', function () {
        var root = path.join( __dirname, '..' ),
            file = path.join( root, 'tmp', 'test-concat-output.sno' ),
            output;

        fs.mkdirSync( path.dirname( file ), { recursive: true } );
        fs.writeFileSync( file, " X = 'HELLO'\n OUTPUT = X ' WORLD'\nEND\n" );

        output = childProcess.execFileSync( process.execPath, [
            'run.js',
            '--file=tmp/test-concat-output.sno',
            '--maxSteps=100000',
            '--maxMillis=1000'
        ], {
            cwd: root,
            encoding: 'utf8'
        } );

        assert( output.includes( '\nHELLO WORLD\n' ) );
        assert( !output.includes( 'ERROR IN SNOBOL4 SYSTEM' ) );
    } );

    it( 'prints a variable after pattern replacement', function () {
        var root = path.join( __dirname, '..' ),
            file = path.join( root, 'tmp', 'test-pattern-replace-output.sno' ),
            output;

        fs.mkdirSync( path.dirname( file ), { recursive: true } );
        fs.writeFileSync( file, " X = 'HELLO'\n X 'H' OUTPUT = 'MATCHED'\n OUTPUT = X\nEND\n" );

        output = childProcess.execFileSync( process.execPath, [
            'run.js',
            '--file=tmp/test-pattern-replace-output.sno',
            '--maxSteps=100000',
            '--maxMillis=1000'
        ], {
            cwd: root,
            encoding: 'utf8'
        } );

        assert( output.includes( '\nMATCHEDELLO\n' ) );
        assert( !output.includes( 'ERROR IN SNOBOL4 SYSTEM' ) );
    } );

    it( 'branches on pattern match failure', function () {
        var root = path.join( __dirname, '..' ),
            file = path.join( root, 'tmp', 'test-pattern-failure-goto.sno' ),
            output;

        fs.mkdirSync( path.dirname( file ), { recursive: true } );
        fs.writeFileSync( file, " X = 'HELLO'\n X 'Z' :F(SKIP)\n OUTPUT = 'BAD'\nSKIP OUTPUT = 'GOOD'\nEND\n" );

        output = childProcess.execFileSync( process.execPath, [
            'run.js',
            '--file=tmp/test-pattern-failure-goto.sno',
            '--maxSteps=100000',
            '--maxMillis=1000'
        ], {
            cwd: root,
            encoding: 'utf8'
        } );

        assert( output.includes( '\nGOOD\n' ) );
        assert( !output.includes( '\nBAD\n' ) );
        assert( !output.includes( 'ERROR IN SNOBOL4 SYSTEM' ) );
    } );

    it( 'branches on combined pattern match success and failure gotos', function () {
        var root = path.join( __dirname, '..' ),
            successFile = path.join( root, 'tmp', 'test-pattern-branch-success.sno' ),
            failureFile = path.join( root, 'tmp', 'test-pattern-branch-failure.sno' ),
            successOutput,
            failureOutput;

        fs.mkdirSync( path.dirname( successFile ), { recursive: true } );
        fs.writeFileSync( successFile, " X = 'HELLO'\n X 'H' :S(MATCH)F(DONE)\nMATCH OUTPUT = 'MATCHED'\nDONE\nEND\n" );
        fs.writeFileSync( failureFile, " X = 'HELLO'\n X 'Z' :S(MATCH)F(DONE)\nMATCH OUTPUT = 'MATCHED'\nDONE\nEND\n" );

        successOutput = childProcess.execFileSync( process.execPath, [
            'run.js',
            '--file=tmp/test-pattern-branch-success.sno',
            '--maxSteps=100000',
            '--maxMillis=1000'
        ], {
            cwd: root,
            encoding: 'utf8'
        } );
        failureOutput = childProcess.execFileSync( process.execPath, [
            'run.js',
            '--file=tmp/test-pattern-branch-failure.sno',
            '--maxSteps=100000',
            '--maxMillis=1000'
        ], {
            cwd: root,
            encoding: 'utf8'
        } );

        assert( successOutput.includes( '\nMATCHED\n' ) );
        assert( !successOutput.includes( 'ERROR IN SNOBOL4 SYSTEM' ) );
        assert( !failureOutput.includes( '\nMATCHED\n' ) );
        assert( !failureOutput.includes( 'ERROR IN SNOBOL4 SYSTEM' ) );
    } );

    it( 'branches on failed pattern replacement without changing subject', function () {
        var root = path.join( __dirname, '..' ),
            file = path.join( root, 'tmp', 'test-pattern-replace-failure-branch.sno' ),
            output;

        fs.mkdirSync( path.dirname( file ), { recursive: true } );
        fs.writeFileSync( file, " X = 'HELLO'\n X 'Z' = 'MATCHED' :F(FAIL)\n OUTPUT = 'BAD'\nFAIL OUTPUT = X\nEND\n" );

        output = childProcess.execFileSync( process.execPath, [
            'run.js',
            '--file=tmp/test-pattern-replace-failure-branch.sno',
            '--maxSteps=100000',
            '--maxMillis=1000'
        ], {
            cwd: root,
            encoding: 'utf8'
        } );

        assert( output.includes( '\nHELLO\n' ) );
        assert( !output.includes( '\nBAD\n' ) );
        assert( !output.includes( 'ERROR IN SNOBOL4 SYSTEM' ) );
    } );

    it( 'branches on successful pattern replacement after changing subject', function () {
        var root = path.join( __dirname, '..' ),
            file = path.join( root, 'tmp', 'test-pattern-replace-success-branch.sno' ),
            output;

        fs.mkdirSync( path.dirname( file ), { recursive: true } );
        fs.writeFileSync( file, " X = 'HELLO'\n X 'H' = 'MATCHED' :S(SUCCESS)F(FAIL)\nFAIL OUTPUT = 'BAD'\nSUCCESS OUTPUT = X\nEND\n" );

        output = childProcess.execFileSync( process.execPath, [
            'run.js',
            '--file=tmp/test-pattern-replace-success-branch.sno',
            '--maxSteps=100000',
            '--maxMillis=1000'
        ], {
            cwd: root,
            encoding: 'utf8'
        } );

        assert( output.includes( '\nMATCHEDELLO\n' ) );
        assert( !output.includes( '\nBAD\n' ) );
        assert( !output.includes( 'ERROR IN SNOBOL4 SYSTEM' ) );
    } );

    it( 'branches on assignment object failure', function () {
        var root = path.join( __dirname, '..' ),
            file = path.join( root, 'tmp', 'test-assignment-object-failure.sno' ),
            output;

        fs.mkdirSync( path.dirname( file ), { recursive: true } );
        fs.writeFileSync( file, " X = 0\n X = GT(X,0) :S(OK)F(BAD)\nOK OUTPUT = 'OK'\nBAD OUTPUT = 'BAD'\nEND\n" );

        output = childProcess.execFileSync( process.execPath, [
            'run.js',
            '--file=tmp/test-assignment-object-failure.sno',
            '--maxSteps=100000',
            '--maxMillis=1000'
        ], {
            cwd: root,
            encoding: 'utf8'
        } );

        assert( output.includes( '\nBAD\n' ) );
        assert( !output.includes( '\nOK\n' ) );
        assert( !output.includes( 'ERROR IN SNOBOL4 SYSTEM' ) );
    } );

    it( 'runs the guarded standard-SNOBOL beer countdown loop', function () {
        var root = path.join( __dirname, '..' ),
            file = path.join( root, 'tmp', 'test-beer-countdown-loop.sno' ),
            output;

        fs.mkdirSync( path.dirname( file ), { recursive: true } );
        fs.writeFileSync( file, " X = 99\nAGAIN OUTPUT = X \" bottles of beer on the wall\"\n OUTPUT = X \" bottles of beer\"\n OUTPUT = \"Take one down, pass it around\"\n X = GT(X,0) X - 1 :S(AGAIN)F(ZERO)\nZERO OUTPUT = \"Go to store, get some more\"\n OUTPUT = \"99 bottles of beer on the wall\"\nEND\n" );

        output = childProcess.execFileSync( process.execPath, [
            'run.js',
            '--file=tmp/test-beer-countdown-loop.sno',
            '--maxSteps=100000',
            '--maxMillis=1000'
        ], {
            cwd: root,
            encoding: 'utf8'
        } );

        assert( output.includes( '\n99 bottles of beer on the wall\n99 bottles of beer\nTake one down, pass it around\n98 bottles of beer on the wall\n' ) );
        assert( output.includes( '\n10 bottles of beer on the wall\n10 bottles of beer\nTake one down, pass it around\n9 bottles of beer on the wall\n' ) );
        assert( output.includes( '\n0 bottles of beer on the wall\n0 bottles of beer\nTake one down, pass it around\nGo to store, get some more\n99 bottles of beer on the wall\n' ) );
        assert( !output.includes( 'Aborting: exceeded maxSteps' ) );
        assert( !output.includes( 'ERROR IN SNOBOL4 SYSTEM' ) );
    } );
} );

describe( 'Descriptor Datatype', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'enumerables', function () {
        var d = this.vm.d(),
            fields = [ 'addr', 'flags', 'raddr', 'value' ],
            keys = [];
        for ( var key in d ) {
            keys.push( key );
        }
        assert.deepEqual( keys.sort(), fields );
    } );

    it( 'frozen', function () {
        var d = this.vm.d();
        assert( Object.isFrozen(d) );
    } );

    it( 'next', function () {
        var desc = this.vm.d(),
            next = this.vm.d();
        assert.equal( next.ptr, desc.next().ptr );
    } );

    it( 'init', function () {
        var orig = this.vm.d(),
            copy = this.vm.d( orig.ptr );
        orig.addr = 90210;
        assert.equal( copy.addr, 90210 );
    } );

    it( 'width', function () {
        var d = this.vm.d();
        assert.equal( d.width, 3 );
    } );

    it( 'getters_setters', function () {
        var d = this.vm.d();
        d.addr = -123;
        assert.equal( d.addr, -123 );
        d.raddr = 6.1;
        assert.equal( Math.floor(d.raddr), 6 );
        d.flags = 666;
        assert.equal( d.flags, 666 );
        d.value = 777;
        assert.equal( d.value, 777 );
    } );

    it( 'not_specifier', function () {
        var d = this.vm.d();
        assert( !d.length );
    } );

    it( 'raw', function () {
        var d = this.vm.d();
        d.addr = 6;
        d.flags = 7;
        d.value = 8;
        assert.deepEqual( d.raw(), [ 6, 7, 8 ] );
    } );

    it( 'read', function () {
        var src = this.vm.d(), dst = this.vm.d();
        src.update( 6, 7, 8 );
        dst.read( src );
        assert.deepEqual( dst.raw(), src.raw() );
    } );

    it( 'update', function () {
        var vm = new SNOBOL.VM(),
            d = new SNOBOL.Descriptor( vm );
        d.update( 6, 7, 8 );
        assert.deepEqual( d.raw(), [ 6, 7, 8 ] );
    } );

    it( 'eq', function () {
        var vm = new SNOBOL.VM(),
            d1 = new SNOBOL.Descriptor( vm ),
            d2 = new SNOBOL.Descriptor( vm );

        d1.update( 6, 7, 8 );
        d2.update( 6, 7, 8 );
        assert( d1.isEqualTo( d2 ) );

        d2.update( 9, 10, 11 );
        assert( !d1.isEqualTo( d2 ) );
    } );
} );

describe( 'Specifier Datatype', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'enumerables', function () {
        var fields = [ 'addr', 'flags', 'length', 'offset', 'raddr', 'value' ],
            s = new SNOBOL.Specifier( this.vm ),
            keys = [];
        for ( var key in s ) {
            keys.push( key );
        }
        assert.deepEqual( keys.sort(), fields );
    } );

    it( 'frozen', function () {
        var s = new SNOBOL.Specifier( this.vm );
        assert( Object.isFrozen(s) );
    } );

    it( 'next', function () {
        var spec = new SNOBOL.Specifier( this.vm ),
            next = new SNOBOL.Specifier( this.vm );
        assert.equal( next.ptr, spec.next().ptr );
    } );

    it( 'init', function () {
        var orig = new SNOBOL.Specifier( this.vm ),
            copy = new SNOBOL.Specifier( this.vm, orig.ptr );
        orig.offset = 90210;
        assert.equal( copy.offset, 90210 );
    } );

    it( 'width', function () {
        var s = new SNOBOL.Specifier( this.vm );
        assert.equal( s.width, 6 );
    } );

    it( 'getters_setters', function () {
        var s = new SNOBOL.Specifier( this.vm );
        s.offset = 123;
        assert.equal( s.offset, 123 );
        s.length = 456;
        assert.equal( s.length, 456 );
    } );

    it( 'raw', function () {
        var s = new SNOBOL.Specifier( this.vm );
        s.addr = 6;
        s.flags = 7;
        s.value = 8;
        s.offset = 9;
        s.length = 10;
        assert.deepEqual( s.raw(), [ 6, 7, 8, 9, 10 ] );
    } );

    it( 'read', function () {
        var src = new SNOBOL.Specifier( this.vm ),
            dst = new SNOBOL.Specifier( this.vm );
        src.update( 6, 7, 8, 9, 10 );
        dst.read( src );
        assert.deepEqual( dst.raw(), src.raw() );
    } );

    it( 'update', function () {
        var s = new SNOBOL.Specifier( this.vm );
        s.update( 6, 7, 8, 9, 10 );
        assert.deepEqual( s.raw(), [ 6, 7, 8, 9, 10 ] );
    } );

    it( 'eq', function () {
        var s1 = new SNOBOL.Specifier( this.vm ),
            s2 = new SNOBOL.Specifier( this.vm );

        s1.update( 6, 7, 8, 9, 10 );
        s2.update( 6, 7, 8, 9, 10 );
        assert( s1.isEqualTo( s2 ) );

        s2.update( 1, 2, 3, 4, 5 );
        assert( !s1.isEqualTo( s2 ) );
    } );

    it( 'specified', function () {
        var s = this.vm.s( SNOBOL.sil.STRING.call( this.vm, '안녕' ) );
        assert.equal( s.specified, '안녕' ); 
    } );
} );

describe( 'Miscellaneous Shortcuts', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'd', function () {
        var d = this.vm.d( 6 );
        assert( d instanceof SNOBOL.Descriptor );
        assert.equal( d.ptr, 6 );
    } );

    it( 's', function () {
        var s = this.vm.s( 6 );
        assert( s instanceof SNOBOL.Specifier );
        assert.equal( s.ptr, 6 );
    } );
} );


describe( 'Program Execution', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'jmp', function () {
        var ptr = this.vm.alloc( 1 );
        this.vm.mem[ ptr ] = 4;
        this.vm.jmp( ptr );
        assert.equal( this.vm.instructionPointer, 4 );
    } );

    it( 'run', function () {
        this.vm.run( [
            [ 'A',  'EQU', mkargs( this.vm, 11 ) ],
            [ 'B',  'EQU', mkargs( this.vm, 17 ) ],
            [ null, 'END', mkargs( this.vm ) ],
        ] );
        assert.equal( this.vm.resolve( 'A' ), 11 );
        assert.equal( this.vm.resolve( 'B' ), 17 );
    } );
} );
