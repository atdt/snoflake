/*jslint node: true, white: true, sloppy: true */
/*global assert */

var buster = require( 'buster' );
    SnoMachine = require( '../lib/snomachine' );
    string = SnoMachine.string,
    haya = [ -16777473, 154795775, 154077502 ]; // हाय

buster.testCase( 'Strings', {

    encode: function () {
        assert.equals( string.encode('हाय'), haya );
    },

    decode: function () {
        assert.equals( string.decode(haya), 'हाय' );
    },

    invertible: function () {
        var hi = 'こんにちは';
        assert.equals( string.decode( string.encode( hi ) ), hi );
    }

});
