
var assert = require( 'assert' ),
    SNOBOL = require( '../js/SNOBOL' );

Object.keys( SNOBOL ).forEach( function ( k ) {
    global[k] = SNOBOL[k];
} );


// 
// Scaffolds
//


function mkargs( vm ) {
    // Construct a deferred operands object
    var args = [].slice.call( arguments, 1 ),
        resolve = vm.resolve.bind( vm );
        
    return function () {
        return args.map( resolve );
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

describe( 'Name definement and Resolution', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'single', function () {
        this.vm.define( 'answer', 42 );
        assert.equal( this.vm.resolve('answer'), 42 );
    } );

    it( 'multi', function () {
        var len = Object.keys( this.vm.symbols ).length;
        this.vm.define( { e: Math.E, pi: Math.PI } );
        assert.equal( Object.keys( this.vm.symbols ).length, len + 2 );
        assert.equal( this.vm.resolve('e'), Math.E );
        assert.equal( this.vm.resolve('pi'), Math.PI );
    } );

    it( 'missing', function () {
        var vm = this.vm;
        assert.throws( function () {
            vm.resolve( 'missing' );
        }, 'ReferenceError' );
    } );

    it( 'reset', function () {
        this.vm.define( { e: Math.E, pi: Math.PI } );
        this.vm.reset();
        // Resetting should clear all keys
        assert.equal( Object.keys( this.vm.symbols ).length, 0 );
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

    it( 'sizlim', function () {
        var SIZLIM = this.vm.$( 'SIZLIM' ),
            DESCR = this.vm.d();

        DESCR.value = SIZLIM;
        assert.equal( DESCR.value, SIZLIM );
        DESCR.value++;
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
        assert.deepEqual( s.raw(), [ 6, 7, 8, 9, 10, 0 ] );
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
        assert.deepEqual( s.raw(), [ 6, 7, 8, 9, 10, 0 ] );
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


describe( 'Execution Environment', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
        SNOBOL._sil = SNOBOL.sil;
        SNOBOL.sil = {
            SUM: function ( a, b ) { return a + b; },
            MUL: function ( a, b ) { return a * b; },
            EQU: function ( v )    { return v; },
        };
    } );

    afterEach( function () {
        SNOBOL.sil = SNOBOL._sil;
    } );

    it( 'jmp', function () {
        this.vm.jmp( 4 );
        assert.equal( this.vm.instructionPointer, 4 );
    } );

    it( 'exec', function () {
        this.vm.define( { a: 5, b: 8 } );
        this.vm.exec( 'result', 'SUM', mkargs( this.vm, 'a', 'b' ) );
        assert.equal( this.vm.resolve('result'), 13 );
    } );

    it( 'run', function () {
        this.vm.run( [
            [ 'a', 'EQU', mkargs( this.vm, 11 ) ],
            [ 'b', 'EQU', mkargs( this.vm, 17 ) ],
            [ 'c', 'MUL', mkargs( this.vm, 'a', 'b' ) ]
        ] );
        assert.equal( this.vm.resolve('c'), 187 );
    } );
} );
