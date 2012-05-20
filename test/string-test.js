/*jslint node: true, white: true, sloppy: true */
/*global assert */

var buster = require( 'buster' ),
    Snoflake = require( '../lib/snoflake' ),
    haya = [ -16777473, 154795775, 154077502 ]; // हाय

with ( Snoflake ) {

    buster.testCase( 'Strings', {
        encode: function () {
            assert.equals( str.encode('हाय'), haya );
        },
        decode: function () {
            assert.equals( str.decode(haya), 'हाय' );
        },
        invertible: function () {
            var hi = 'こんにちは';
            assert.equals( str.decode( str.encode( hi ) ), hi );
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
            setReal( 0, 3.14 );
            assert.equals( Math.floor( getReal(0) ), 3 );
        }
    } );
}

/*
    var setUint = Snoflake.setUint,
        setInt = Snoflake.setInt,

    buster.testCase( 'Typed Descriptors', 
    */
