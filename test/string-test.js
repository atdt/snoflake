/*jslint node: true, white: true, sloppy: true */
/*global assert */

var buster = require( 'buster' );
    Snoflake = require( '../lib/snoflake' );
    str = Snoflake.str,
    haya = [ -16777473, 154795775, 154077502 ]; // हाय

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

});
