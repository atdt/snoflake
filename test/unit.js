/*jslint node: true, white: true, sloppy: true */
/*global assert */

var buster = require( 'buster' ),
    testCase = buster.testCase,
    Snoflake = require( '../lib/snoflake' ),
    haya = [ -16777473, 154795775, 154077502 ]; // हाय

with ( Snoflake ) {

    testCase( 'Strings', {
        encode: function () {
            assert.equals( str.encode('हाय'), haya );
        },
        decode: function () {
            assert.equals( str.decode(haya), 'हाय' );
        },
        invertible: function () {
            var hi = 'こんにちは';
            assert.equals( str.decode( str.encode(hi) ), hi );
        }
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
        single: function () {
            assign( 'answer', 42 );
            assert.equals( resolve('answer'), 42 );
        },
        multi: function () {
            assign( {
                e  : Math.E,
                pi : Math.PI
            } );
            assert.equals( resolve('e'), Math.E );
            assert.equals( resolve('pi'), Math.PI );
        }
    } );

}
