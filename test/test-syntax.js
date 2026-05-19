// Test that each character class matches only the characters it is supposed to
// match. Tests auto-generated from the table in section 4.1 of S4D58.

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { match } from '../src/snobol.js';

describe( 'Character Classes', function () {
    it( 'ALPHANUMERIC (digit and letter)', function () {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'ALPHANUMERIC', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'AT (operator)', function () {
        const characters = '@';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'AT', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'BLANK (separator and operator)', function () {
        const characters = ' \t';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'BLANK', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'BREAK (dot and underscore)', function () {
        const characters = '._';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'BREAK', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'CMT (comment card)', function () {
        const characters = '*';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'CMT', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'CNT (continue card)', function () {
        const characters = '+.';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'CNT', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'COLON (goto designator and dimension separator)', function () {
        const characters = ':';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'COLON', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'COMMA (argument separator)', function () {
        const characters = ',';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'COMMA', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'CTL (control card)', function () {
        const characters = '-';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'CTL', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'DOLLAR (operator)', function () {
        const characters = '$';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'DOLLAR', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'DOT (operator)', function () {
        const characters = '.';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'DOT', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'DQUOTE (literal delimiter)', function () {
        const characters = '"';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'DQUOTE', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'EOS (statement terminator)', function () {
        const characters = ';';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'EOS', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'EQUAL (assignment)', function () {
        const characters = '=';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'EQUAL', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'FGOSYM (failure goto designator)', function () {
        const characters = 'F';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'FGOSYM', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'KEYSYM (operator)', function () {
        const characters = '&';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'KEYSYM', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'LEFTBR (reference and goto delimiter)', function () {
        const characters = '<[';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'LEFTBR', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'LEFTPAREN (expression delimiter)', function () {
        const characters = '(';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'LEFTPAREN', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'LETTER (letter)', function () {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'LETTER', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'MINUS (operator)', function () {
        const characters = '-';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'MINUS', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'NOTSYM (operator)', function () {
        const characters = '~';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'NOTSYM', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'NUMBER (digit)', function () {
        const characters = '0123456789';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'NUMBER', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'ORSYM (operator)', function () {
        const characters = '|';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'ORSYM', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'PERCENT (operator)', function () {
        const characters = '%';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'PERCENT', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'PLUS (operator)', function () {
        const characters = '+';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'PLUS', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'POUND (operator)', function () {
        const characters = '#';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'POUND', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'QUESYM (operator)', function () {
        const characters = '?';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'QUESYM', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'RAISE (operator)', function () {
        const characters = '^';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'RAISE', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'RIGHTBR (reference and goto delimiter)', function () {
        const characters = '>]';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'RIGHTBR', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'RIGHTPAREN (expression delimiter)', function () {
        const characters = ')';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'RIGHTPAREN', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'SGOSYM (success goto designator)', function () {
        const characters = 'S';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'SGOSYM', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'SLASH (operator)', function () {
        const characters = '/';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'SLASH', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'SQUOTE (literal delimiter)', function () {
        const characters = "'";
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'SQUOTE', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'STAR (operator)', function () {
        const characters = '*';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'STAR', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'TERMINATOR (expression terminator)', function () {
        const characters = ';)>,] \t';
        for ( let ch = 0; ch <= 0x7F; ch++ ) {
            const char = String.fromCharCode( ch );
            assert.equal(
                match( 'TERMINATOR', char ),
                characters.includes( char )
            );
        }
    } );

    it( 'accepts numeric character codes', function () {
        assert.equal( match( 'LETTER', 'A'.charCodeAt( 0 ) ), true );
        assert.equal( match( 'LETTER', '1'.charCodeAt( 0 ) ), false );
    } );
} );
