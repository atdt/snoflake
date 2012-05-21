/*jslint node: true, white: true, sloppy: true */
/*global assert */

var buster = require( 'buster' ),
    testCase = buster.testCase,
    Snoflake = require( '../lib/snoflake' ),
    haya = [ -16777473, 154795775, 154077502 ]; // हाय

for ( attr in Snoflake ) {
    global[ attr ] = Snoflake[ attr ];
}

testCase( 'Strings', {
    encode: function () {
        assert.equals( str.encode('हाय'), haya );
    },
    decode: function () {
        assert.equals( str.decode(haya), 'हाय' );
    },
} );

testCase( 'Typed Setters', {
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

testCase( 'Typed Getters', {
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

testCase( 'Symbols', {
    setUp: reset,
    single: function () {
        assign( 'answer', 42 );
        assert.equals( resolve('answer'), 42 );
    },
    multi: function () {
        assign( { e: Math.E, pi: Math.PI } );
        assert.equals( Object.keys( symbols ).length, 2 );
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
        assert.equals( Object.keys( symbols ).length, 0 );
    }

} );

testCase( 'Memory', {
    setUp: reset,
    alloc: function () {
        var ptr = alloc( 3 );
        assert.equals( mem.length, ptr + 3 );
        assert.equals( mem.slice(-3), [ 0, 0, 0 ] );
    },
    gets: function () {
        var ptr = puts( 'こんにちは' );
        assert.equals( gets(ptr), 'こんにちは' );
    }
} );

testCase( 'Descriptor', {
    // setUp: reset,
    init: function () {
        var orig = new Descriptor(),
            copy = new Descriptor( orig.ptr );
        orig.update( 6, 7, 8 );
        assert.equals( orig.raw(), [ 6, 7, 8 ] );
    },
    update: function () {
        var d = new Descriptor();
        d.update( 6, 7, 8 );
        assert.equals( d.raw(), [ 6, 7, 8 ] );
    },
    eq: function () {
        var d1 = new Descriptor();
            d2 = new Descriptor();

        d1.update( 6, 7, 8 );
        d2.update( 6, 7, 8 );
        assert( d1.eq( d2 ) );

        d2.update( 9, 10, 11 );
        refute( d1.eq( d2 ) );
    }
} );
