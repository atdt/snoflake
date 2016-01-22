
var buster = require( 'buster' ),
    assert = buster.assert,
    refute = buster.refute,
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

buster.testCase( 'String Encoding', {
    encode: function () {
        assert.equals( SNOBOL.str.encode( 'हाय' ), [ 2361, 2366, 2351 ] );
    },
    decode: function () {
        assert.equals( SNOBOL.str.decode( [ 2361, 2366, 2351 ] ), 'हाय' );
    }
} );

buster.testCase( 'Typed Setters', {
    setUp: function () {
        this.vm = new SNOBOL.VM();
    },
    uint: function () {
        var vm = this.vm;
        assert.exception( function () {
            vm.setUint( 0, -4 );
        }, 'RangeError' );
    },
    int: function () {
        var vm = this.vm;
        assert.exception( function () {
            vm.setUint( 0, 4.2 );
        }, 'RangeError' );
    },
    real: function () {
        var vm = this.vm;
        assert.exception( function () {
            vm.setReal( 0, 10e100 );
        }, 'RangeError' );
    }
} );

buster.testCase( 'Typed Getters', {
    setUp: function () {
        this.vm = new SNOBOL.VM();
    },
    uint: function () {
        this.vm.setUint( 0, 123 );
        assert.equals( this.vm.getUint(0), 123 );
    },
    int: function () {
        this.vm.setInt( 0, -123 );
        assert.equals( this.vm.getInt(0), -123 );
    },
    real: function () {
        this.vm.setReal( 0, Math.PI );
        assert.equals( Math.floor( this.vm.getReal(0) ), 3 );
    }
} );

buster.testCase( 'Name Assignment and Resolution', {
    setUp: function () {
        this.vm = new SNOBOL.VM();
    },
    single: function () {
        this.vm.assign( 'answer', 42 );
        assert.equals( this.vm.resolve('answer'), 42 );
    },
    multi: function () {
        var len = Object.keys( this.vm.symbols ).length;
        this.vm.assign( { e: Math.E, pi: Math.PI } );
        assert.equals( Object.keys( this.vm.symbols ).length, len + 2 );
        assert.equals( this.vm.resolve('e'), Math.E );
        assert.equals( this.vm.resolve('pi'), Math.PI );
    },
    missing: function () {
        var vm = this.vm;
        assert.exception( function () {
            vm.resolve( 'missing' );
        }, 'ReferenceError' );
    },
    reset: function () {
        this.vm.assign( { e: Math.E, pi: Math.PI } );
        this.vm.reset();
        // Resetting should clear all keys
        assert.equals( Object.keys( this.vm.symbols ).length, 0 );
    }

} );

buster.testCase( 'Memory Management', {
    setUp: function () {
        this.vm = new SNOBOL.VM();
    },
    alloc: function () {
        var vm = new SNOBOL.VM(), 
            ptr = vm.alloc( 3 );
        assert.equals( vm.mem.length, ptr + 3 );
        assert.equals( vm.mem.slice(-3), [ 0, 0, 0 ] );
    },
    puts: function () {
        var spec = this.vm.puts( 'こんにちは' );
        assert.equals( spec.specified, 'こんにちは' );
    },
    sizlim: function () {
        var SIZLIM = this.vm.$( 'SIZLIM' ),
            DESCR = this.vm.d();

        DESCR.value = SIZLIM;
        assert.equals( DESCR.value, SIZLIM );
        DESCR.value++;
    }
} );

buster.testCase( 'Descriptor Datatype', {
    setUp: function () {
        this.vm = new SNOBOL.VM();
    },
    enumerables: function () {
        var d = this.vm.d(),
            fields = [ 'addr', 'flags', 'raddr', 'value' ],
            keys = [];
        for ( var key in d ) {
            keys.push( key );
        }
        assert.equals( keys.sort(), fields );
    },
    frozen: function () {
        var d = this.vm.d();
        assert( Object.isFrozen(d) );
    },
    next: function () {
        var desc = this.vm.d(),
            next = this.vm.d();
        assert.equals( next.ptr, desc.next().ptr );
    },
    init: function () {
        var orig = this.vm.d(),
            copy = this.vm.d( orig.ptr );
        orig.addr = 90210;
        assert.equals( copy.addr, 90210 );
    },
    width: function () {
        var d = this.vm.d();
        assert.equals( d.width, 3 );
    },
    getters_setters: function () {
        var d = this.vm.d();
        d.addr = -123;
        assert.equals( d.addr, -123 );
        d.raddr = 6.1;
        assert.equals( Math.floor(d.raddr), 6 );
        d.flags = 666;
        assert.equals( d.flags, 666 );
        d.value = 777;
        assert.equals( d.value, 777 );
    },
    not_specifier: function () {
        var d = this.vm.d();
        refute( d.length );
    },
    raw: function () {
        var d = this.vm.d();
        d.addr = 6;
        d.flags = 7;
        d.value = 8;
        assert.equals( d.raw(), [ 6, 7, 8 ] );
    },
    read: function () {
        var src = this.vm.d(), dst = this.vm.d();
        src.update( 6, 7, 8 );
        dst.read( src );
        assert.equals( dst.raw(), src.raw() );
    },
    update: function () {
        var vm = new SNOBOL.VM(),
            d = new SNOBOL.Descriptor( vm );
        d.update( 6, 7, 8 );
        assert.equals( d.raw(), [ 6, 7, 8 ] );
    },
    eq: function () {
        var vm = new SNOBOL.VM(),
            d1 = new SNOBOL.Descriptor( vm ),
            d2 = new SNOBOL.Descriptor( vm );

        d1.update( 6, 7, 8 );
        d2.update( 6, 7, 8 );
        assert( d1.isEqualTo( d2 ) );

        d2.update( 9, 10, 11 );
        refute( d1.isEqualTo( d2 ) );
    }
} );

buster.testCase( 'Specifier Datatype', {
    setUp: function () {
        this.vm = new SNOBOL.VM();
    },
    enumerables: function () {
        var fields = [ 'addr', 'flags', 'length', 'offset', 'raddr', 'value' ],
            s = new SNOBOL.Specifier( this.vm ),
            keys = [];
        for ( var key in s ) {
            keys.push( key );
        }
        assert.equals( keys.sort(), fields );
    },
    frozen: function () {
        var s = new SNOBOL.Specifier( this.vm );
        assert( Object.isFrozen(s) );
    },
    next: function () {
        var spec = new SNOBOL.Specifier( this.vm ),
            next = new SNOBOL.Specifier( this.vm );
        assert.equals( next.ptr, spec.next().ptr );
    },
    init: function () {
        var orig = new SNOBOL.Specifier( this.vm ),
            copy = new SNOBOL.Specifier( this.vm, orig.ptr );
        orig.offset = 90210;
        assert.equals( copy.offset, 90210 );
    },
    width: function () {
        var s = new SNOBOL.Specifier( this.vm );
        assert.equals( s.width, 6 );
    },
    getters_setters: function () {
        var s = new SNOBOL.Specifier( this.vm );
        s.offset = 123;
        assert.equals( s.offset, 123 );
        s.length = 456;
        assert.equals( s.length, 456 );
    },
    raw: function () {
        var s = new SNOBOL.Specifier( this.vm );
        s.addr = 6;
        s.flags = 7;
        s.value = 8;
        s.offset = 9;
        s.length = 10;
        assert.equals( s.raw(), [ 6, 7, 8, 9, 10, 0 ] );
    },
    read: function () {
        var src = new SNOBOL.Specifier( this.vm ),
            dst = new SNOBOL.Specifier( this.vm );
        src.update( 6, 7, 8, 9, 10 );
        dst.read( src );
        assert.equals( dst.raw(), src.raw() );
    },
    update: function () {
        var s = new SNOBOL.Specifier( this.vm );
        s.update( 6, 7, 8, 9, 10 );
        assert.equals( s.raw(), [ 6, 7, 8, 9, 10, 0 ] );
    },
    eq: function () {
        var s1 = new SNOBOL.Specifier( this.vm ),
            s2 = new SNOBOL.Specifier( this.vm );

        s1.update( 6, 7, 8, 9, 10 );
        s2.update( 6, 7, 8, 9, 10 );
        assert( s1.isEqualTo( s2 ) );

        s2.update( 1, 2, 3, 4, 5 );
        refute( s1.isEqualTo( s2 ) );
    },
    specified: function () {
        var spc = new SNOBOL.Specifier( this.vm );
        spc.specified = '안녕';
        assert.equals( spc.specified, '안녕' ); 
    }
} );

buster.testCase( 'Miscellaneous Shortcuts', {
    setUp: function () {
        this.vm = new SNOBOL.VM();
    },
    d: function () {
        var d = this.vm.d( 6 );
        assert( d instanceof SNOBOL.Descriptor );
        assert.equals( d.ptr, 6 );
    },
    s: function () {
        var s = this.vm.s( 6 );
        assert( s instanceof SNOBOL.Specifier );
        assert.equals( s.ptr, 6 );
    }
} );


buster.testCase( 'Execution Environment', {
    setUp: function () {
        this.vm = new SNOBOL.VM();
        SNOBOL._sil = SNOBOL.sil;
        SNOBOL.sil = {
            SUM: function ( a, b ) { return a + b; },
            MUL: function ( a, b ) { return a * b; },
            EQU: function ( v )    { return v; },
        };
    },
    tearDown: function () {
        SNOBOL.sil = SNOBOL._sil;
    },
    jmp: function () {
        this.vm.jmp( 4 );
        assert.equals( this.vm.instructionPointer, 4 );
    },
    exec: function () {
        this.vm.assign( { a: 5, b: 8 } );
        this.vm.exec( 'result', 'SUM', mkargs( this.vm, 'a', 'b' ) );
        assert.equals( this.vm.resolve('result'), 13 );
    },
    run: function () {
        this.vm.run( [
            [ 'a', 'EQU', mkargs( this.vm, 11 ) ],
            [ 'b', 'EQU', mkargs( this.vm, 17 ) ],
            [ 'c', 'MUL', mkargs( this.vm, 'a', 'b' ) ]
        ] );
        assert.equals( this.vm.resolve('c'), 187 );
    }
} );
