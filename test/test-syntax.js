// Test that each character class matches only the characters it is supposed to
// match. Tests auto-generated from the table in section 4.1 of S4D58.

var assert = require('assert'),
    SNOBOL = require( '../js/SNOBOL' );

describe( 'Character Classes', function () {
    it( 'ALPHANUMERIC (digit and letter)', function () {
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'ALPHANUMERIC', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'AT (operator)', function () {
        var characters = '@';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'AT', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'BLANK (separator and operator)', function () {
        var characters = ' \t';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'BLANK', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'BREAK (dot and underscore)', function () {
        var characters = '._';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'BREAK', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'CMT (comment card)', function () {
        var characters = '*';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'CMT', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'CNT (continue card)', function () {
        var characters = '+.';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'CNT', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'COLON (goto designator and dimension separator)', function () {
        var characters = ':';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'COLON', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'COMMA (argument separator)', function () {
        var characters = ',';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'COMMA', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'CTL (control card)', function () {
        var characters = '-';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'CTL', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'DOLLAR (operator)', function () {
        var characters = '$';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'DOLLAR', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'DOT (operator)', function () {
        var characters = '.';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'DOT', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'DQUOTE (literal delimiter)', function () {
        var characters = '"';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'DQUOTE', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'EOS (statement terminator)', function () {
        var characters = ';';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'EOS', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'EQUAL (assignment)', function () {
        var characters = '=';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'EQUAL', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'FGOSYM (failure goto designator)', function () {
        var characters = 'F';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'FGOSYM', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'KEYSYM (operator)', function () {
        var characters = '&';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'KEYSYM', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'LEFTBR (reference and goto delimiter)', function () {
        var characters = '<[';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'LEFTBR', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'LEFTPAREN (expression delimiter)', function () {
        var characters = '(';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'LEFTPAREN', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'LETTER (letter)', function () {
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'LETTER', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'MINUS (operator)', function () {
        var characters = '-';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'MINUS', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'NOTSYM (operator)', function () {
        var characters = '˜';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'NOTSYM', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'NUMBER (digit)', function () {
        var characters = '0123456789';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'NUMBER', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'ORSYM (operator)', function () {
        var characters = '|';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'ORSYM', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'PERCENT (operator)', function () {
        var characters = '%';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'PERCENT', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'PLUS (operator)', function () {
        var characters = '+';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'PLUS', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'POUND (operator)', function () {
        var characters = '#';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'POUND', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'QUESYM (operator)', function () {
        var characters = '?';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'QUESYM', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'RAISE (operator)', function () {
        var characters = '^';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'RAISE', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'RIGHTBR (reference and goto delimiter)', function () {
        var characters = '>]';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'RIGHTBR', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'RIGHTPAREN (expression delimiter)', function () {
        var characters = ')';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'RIGHTPAREN', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'SGOSYM (success goto designator)', function () {
        var characters = 'S';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'SGOSYM', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'SLASH (operator)', function () {
        var characters = '/';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'SLASH', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'SQUOTE (literal delimiter)', function () {
        var characters = "'";
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'SQUOTE', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'STAR (operator)', function () {
        var characters = '*';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'STAR', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'TERMINATOR (expression terminator)', function () {
        var characters = ';)>,] \t';
        for ( var ch = 0; ch <= 0x7F; ch++ ) {
            var char = String.fromCharCode( ch );
            assert.equal(
                SNOBOL.match( 'TERMINATOR', char ),
                characters.includes( char )
            );
        }
    } );
} );
