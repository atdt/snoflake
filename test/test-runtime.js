/*jslint node: true, white: true, sloppy: true, forin: true */
/*global assert, mem, refute, alloc, resolve, assign, defineValues, Descriptor, Specifier, gets, puts, getd, getspc, symbols, reset, str, setUint, getUint, setInt, getInt, setReal, getReal, run, exec, ip, jmp */

var buster = require( 'buster' );

buster.extend( global, require( '../lib/snoflake' ) );


// 
// Scaffolds
//

var silly = {
    SUM: function ( a, b ) { return a + b; },
    MUL: function ( a, b ) { return a * b; },
    EQU: function ( v )    { return v; },
};

function mkargs() {
    // Construct a deferred operands object
    var args = [].slice.call( arguments );
    return function () {
        return args.map( resolve );
    };
}


//
// Test Cases
//

buster.testCase( 'Miscellaneous Utilities', {
    defineValues: function () {
        "use strict";  // fail loudly
        var o = defineValues( {}, { num: 12 } );
        assert.equals( Object.keys(o), [] );
        assert.exception( function () {
            o.num = 42;
        }, 'TypeError' );
    }
} );

buster.testCase( 'String Encoding', {
    encode: function () {
        assert.equals( str.encode('हाय'), [ -16777473, 154795775, 154077502 ] );
    },
    decode: function () {
        assert.equals( str.decode( [ -16777473, 154795775, 154077502 ] ), 'हाय' );
    }
} );

buster.testCase( 'Typed Setters', {
    uint: function () {
        assert.exception( function () {
            setUint( 0, -4 );
        }, 'RangeError' );
    },
    int: function () {
        assert.exception( function () {
            setUint( 0, 4.2 );
        }, 'RangeError' );
    },
    real: function () {
        assert.exception( function () {
            setReal( 0, 10e100 );
        }, 'RangeError' );
    }
} );

buster.testCase( 'Typed Getters', {
    uint: function () {
        setUint( 0, 123 );
        assert.equals( getUint(0), 123 );
    },
    int: function () {
        setInt( 0, -123 );
        assert.equals( getInt(0), -123 );
    },
    real: function () {
        setReal( 0, Math.PI );
        assert.equals( Math.floor( getReal(0) ), 3 );
    }
} );

buster.testCase( 'Name Assignment and Resolution', {
    setUp: reset,
    single: function () {
        assign( 'answer', 42 );
        assert.equals( resolve('answer'), 42 );
    },
    multi: function () {
        var len = Object.keys( symbols ).length;
        assign( { e: Math.E, pi: Math.PI } );
        assert.equals( Object.keys( symbols ).length, len + 2 );
        assert.equals( resolve('e'), Math.E );
        assert.equals( resolve('pi'), Math.PI );
    },
    missing: function () {
        assert.exception( function () {
            resolve( 'missing' );
        }, 'ReferenceError' );
    },
    reset: function () {
        assign( { e: Math.E, pi: Math.PI } );
        reset();
        // Resetting should clear all but two keys: CSTACK and OSTACK.
        assert.equals( Object.keys( symbols ).length, 2 );
    }

} );

buster.testCase( 'Memory Management', {
    setUp: reset,
    alloc: function () {
        var ptr = alloc( 3 );
        assert.equals( mem.length, ptr + 3 );
        assert.equals( mem.slice(-3), [ 0, 0, 0 ] );
    },
    gets: function () {
        var slice = puts( 'こんにちは' );
        assert.equals( gets( slice.start ), 'こんにちは' );
    }
} );

buster.testCase( 'Descriptor Datatype', {
    setUp: reset,
    enumerables: function () {
        var fields = [ 'addr', 'flags', 'raddr', 'value' ],
            d = new Descriptor(),
            keys = [];
        for ( var key in d ) {
            keys.push( key );
        }
        assert.equals( keys.sort(), fields );
    },
    frozen: function () {
        var d = new Descriptor();
        assert( Object.isFrozen(d) );
    },
    next: function () {
        var desc = new Descriptor(),
            next = new Descriptor();
        assert.equals( next.ptr, desc.next().ptr );
    },
    init: function () {
        var orig = new Descriptor(),
            copy = new Descriptor( orig.ptr );
        orig.addr = 90210;
        assert.equals( copy.addr, 90210 );
    },
    width: function () {
        var d = new Descriptor();
        assert.equals( d.width, 3 );
    },
    getters_setters: function () {
        var d = new Descriptor();
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
        var d = new Descriptor();
        refute( d.length );
    },
    raw: function () {
        var d = new Descriptor();
        d.addr = 6;
        d.flags = 7;
        d.value = 8;
        assert.equals( d.raw(), [ 6, 7, 8 ] );
    },
    read: function () {
        var src = new Descriptor(),
            dst = new Descriptor();
        src.update( 6, 7, 8 );
        dst.read( src );
        assert.equals( dst.raw(), src.raw() );
    },
    update: function () {
        var d = new Descriptor();
        d.update( 6, 7, 8 );
        assert.equals( d.raw(), [ 6, 7, 8 ] );
    },
    eq: function () {
        var d1 = new Descriptor(),
            d2 = new Descriptor();

        d1.update( 6, 7, 8 );
        d2.update( 6, 7, 8 );
        assert( d1.eq( d2 ) );

        d2.update( 9, 10, 11 );
        refute( d1.eq( d2 ) );
    }
} );

buster.testCase( 'Specifier Datatype', {
    setUp: reset,
    enumerables: function () {
        var fields = [ 'addr', 'flags', 'length', 'offset', 'raddr', 'value' ],
            s = new Specifier(),
            keys = [];
        for ( var key in s ) {
            keys.push( key );
        }
        assert.equals( keys.sort(), fields );
    },
    frozen: function () {
        var d = new Specifier();
        assert( Object.isFrozen(d) );
    },
    next: function () {
        var spec = new Specifier(),
            next = new Specifier();
        assert.equals( next.ptr, spec.next().ptr );
    },
    init: function () {
        var orig = new Specifier(),
            copy = new Specifier( orig.ptr );
        orig.offset = 90210;
        assert.equals( copy.offset, 90210 );
    },
    width: function () {
        var s = new Specifier();
        assert.equals( s.width, 6 );
    },
    getters_setters: function () {
        var s = new Specifier();
        s.offset = 123;
        assert.equals( s.offset, 123 );
        s.length = 456;
        assert.equals( s.length, 456 );
    },
    raw: function () {
        var s = new Specifier();
        s.addr = 6;
        s.flags = 7;
        s.value = 8;
        s.offset = 9;
        s.length = 10;
        assert.equals( s.raw(), [ 6, 7, 8, 9, 10, 0 ] );
    },
    read: function () {
        var src = new Specifier(),
            dst = new Specifier();
        src.update( 6, 7, 8, 9, 10 );
        dst.read( src );
        assert.equals( dst.raw(), src.raw() );
    },
    update: function () {
        var s = new Specifier();
        s.update( 6, 7, 8, 9, 10 );
        assert.equals( s.raw(), [ 6, 7, 8, 9, 10, 0 ] );
    },
    eq: function () {
        var s1 = new Specifier(),
            s2 = new Specifier();

        s1.update( 6, 7, 8, 9, 10 );
        s2.update( 6, 7, 8, 9, 10 );
        assert( s1.eq( s2 ) );

        s2.update( 1, 2, 3, 4, 5 );
        refute( s1.eq( s2 ) );
    },
    specified: function () {
        var spc = getspc();
        spc.specified = '안녕';
        assert.equals( spc.specified, '안녕' ); 
    }
} );

buster.testCase( 'Stack Manipulation', {
    setUp: function () {
        stack.size = 4; 
        reset();
    },
    tearDown: function () {
        stack.size = 1024;
        reset();
    },
    getters: function () {
        assign( 'OSTACK', 5 );
        assert.equals( stack.old, 5 );
        assign( 'CSTACK', 7 );
        assert.equals( stack.ptr, 7 );
    },
    setters: function () {
        stack.old = 12;
        assert.equals( resolve('OSTACK'), 12 );
        stack.ptr = 42;
        assert.equals( resolve('CSTACK'), 42 );
    },
    push: function () {
        stack.push( [ 1, 2 ] );
        assert.equals( stack.trace(), [ 1, 2, 0, 0 ] );
        stack.push( [ 3, 4 ] );
        assert.equals( stack.trace(), [ 1, 2, 3, 4 ] );
    },
    overflow: function () {
        assert.exception( function () {
            stack.push( [ 1, 1, 1, 1, 1 ] );
        }, 'RangeError' );
    },
    pop: function () {
        stack.push( [ 'a', 'b', 'c', 'd' ] );
        assert.equals( stack.pop(), [ 'd' ] );
        assert.equals( stack.pop(3), [ 'a', 'b', 'c' ] );
    },
    underflow: function () {
        stack.push( [ 'a', 'b', 'c' ] );
        assert.exception( function () {
            stack.pop(4);
        }, 'RangeError' );
    },
    oldptr: function () {
        stack.push( [ 'a', 'b', 'c' ] );
        assert.equals( stack.ptr, 3 );
        assert.equals( stack.old, 0 );
        stack.pop(2);
        assert.equals( stack.ptr, 1 );
        assert.equals( stack.old, 3 );
    }
} );

buster.testCase( 'Miscellaneous Shortcuts', {
    setUp: reset,
    getd: function () {
        var d = getd( 6 );
        assert( d instanceof Descriptor );
        assert.equals( d.ptr, 6 );
    },
    getspc: function () {
        var s = getspc( 6 );
        assert ( s instanceof Specifier );
        assert.equals( s.ptr, 6 );
    }
} );

buster.testCase( 'Execution Environment', {
    setUp: function () {
        reset();
        global.ip = 0;
    },
    jmp: function () {
        jmp(4);
        assert.equals( ip, 3 );
    },
    exec: function () {
        assign( { a: 5, b: 8 } );
        exec( 'result', silly.SUM, mkargs( 'a', 'b' ) );
        assert.equals( resolve('result'), 13 );
    },
    run: function () {
        var args = silly.args;
        run( [
            [ 'a', silly.EQU, mkargs( 11 ) ],
            [ 'b', silly.EQU, mkargs( 17 ) ],
            [ 'c', silly.MUL, mkargs( 'a', 'b' ) ]
        ] );
        assert.equals( resolve('c'), 187 );
    }
} );
