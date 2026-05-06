"use strict";

import SNOBOL from './base.js';

// &ALPHABET holds every byte value of the host character set, matching
// CSNOBOL4 and the original IBM/360 ALPHSZ = 256.
const D = 3;
let ALPHA = '';

for ( let i = 0; i < 256; i++ ) {
    ALPHA += String.fromCharCode(i);
}

SNOBOL.programSymbols = {
    // MDATA
    ALPHA   : ALPHA,
    AMPST   : '&',
    COLSTR  : ': ',
    QTSTR   : "'",

    // PARMS
    ALPHSZ  : ALPHA.length,
    CPA     : 1,
    DESCR   : 3,
    SPEC    : 6,
    SIZLIM  : 0x7FFFFFFF,

    // Match CSNOBOL4's machine parameters in include/snotypes.h. Keeping PTR
    // out of the low bit positions prevents SPEC length fields from being
    // mistaken for pointer flags when resident static blocks are scanned.
    FNC     : 0o01,
    TTL     : 0o02,
    STTL    : 0o04,
    MARK    : 0o10,
    PTR     : 0o20,

    UNITI   : 5,
    UNITO   : 6,
    UNITP   : 7,

    MLINK   : -1,
    PARMS   : -1,
    MDATA   : -1,

    // Misc
    // The following provide sensible defaults for unit tests that
    // directly invoke macros (e.g., ISTACK) without running the
    // generated SIL program. At full runtime, values created by the
    // generated program should supersede these.
    STACK   : 2002 * D,
    OBSIZ   : 256,
    STSIZE  : 1000,
};

// See section 4.1 (Characters) in S4D58
const characterClasses = {
    ALPHANUMERIC : /[a-z0-9]/i,
    AT           : /@/,
    BLANK        : /[ \t]/,
    BREAK        : /[._]/,
    CMT          : /\*/,
    CNT          : /[+.]/,
    COLON        : /:/,
    COMMA        : /,/,
    CTL          : /-/,
    DOLLAR       : /\$/,
    DOT          : /\./,
    DQUOTE       : /"/,
    EOS          : /;/,
    EQUAL        : /=/,
    FGOSYM       : /F/,
    KEYSYM       : /&/,
    LEFTBR       : /[[<]/,
    LEFTPAREN    : /\(/,
    LETTER       : /[a-z]/i,
    MINUS        : /-/,
    NOTSYM       : /~/,
    NUMBER       : /\d/,
    ORSYM        : /\|/,
    PERCENT      : /%/,
    PLUS         : /\+/,
    POUND        : /#/,
    QUESYM       : /\?/,
    RAISE        : /\^/,
    RIGHTBR      : /[>\]]/,
    RIGHTPAREN   : /\)/,
    SGOSYM       : /S/,
    SLASH        : /\//,
    SQUOTE       : /'/,
    STAR         : /\*/,
    TERMINATOR   : /[;)>,\] \t]/,
    ELSE         : /.*/,
};

const characterClassBitsets = {};
for ( const name in characterClasses ) {
    if ( name === 'ELSE' ) {
        continue;
    }

    const bitset = new Uint8Array( 256 ),
          pattern = characterClasses[ name ];

    for ( let code = 0; code < bitset.length; code++ ) {
        bitset[ code ] = pattern.test( String.fromCharCode( code ) ) ? 1 : 0;
    }

    characterClassBitsets[ name ] = bitset;
}

SNOBOL.match = function ( characterClass, char ) {
    if ( characterClass === 'ELSE' ) {
        return true;
    }

    const code = typeof char === 'number' ? char : char.charCodeAt( 0 ),
          bitset = characterClassBitsets[ characterClass ];

    if ( bitset ) {
        return code >= 0 && code < bitset.length && bitset[ code ] === 1;
    }

    if ( typeof characterClass === 'number' ) {
        return characterClass === code;
    }

    return characterClass.length === 1
        ? characterClass.charCodeAt( 0 ) === code
        : characterClass === char;
};

SNOBOL.syntaxTables = {
    BIOPTB: [
        [ 'PLUS', 'ADDFN', 'TBLKTB' ],
        [ 'MINUS', 'SUBFN', 'TBLKTB' ],
        [ 'DOT', 'NAMFN', 'TBLKTB' ],
        [ 'DOLLAR', 'DOLFN', 'TBLKTB' ],
        [ 'STAR', 'MPYFN', 'STARTB' ],
        [ 'SLASH', 'DIVFN', 'TBLKTB' ],
        [ 'AT', 'BIATFN', 'TBLKTB' ],
        [ 'POUND', 'BIPDFN', 'TBLKTB' ],
        [ 'PERCENT', 'BIPRFN', 'TBLKTB' ],
        [ 'RAISE', 'EXPFN', 'TBLKTB' ],
        [ 'ORSYM', 'ORFN', 'TBLKTB' ],
        [ 'KEYSYM', 'BIAMFN', 'TBLKTB' ],
        [ 'NOTSYM', 'BINGFN', 'TBLKTB' ],
        [ 'QUESYM', 'BIQSFN', 'TBLKTB' ],
        [ 'ELSE', null, 'ERROR' ]
    ],

    CARDTB: [
        [ 'CMT', 'CMTTYP', 'STOPSH' ],
        [ 'CTL', 'CTLTYP', 'STOPSH' ],
        [ 'CNT', 'CNTTYP', 'STOPSH' ],
        [ 'ELSE', 'NEWTYP', 'STOPSH' ]
    ],

    DQLITB: [
        [ 'DQUOTE', null, 'STOP' ],
        [ 'ELSE', null, 'CONTIN' ]
    ],

    ELEMTB: [
        [ 'NUMBER', 'ILITYP', 'INTGTB' ],
        [ 'LETTER', 'VARTYP', 'VARTB' ],
        [ 'SQUOTE', 'QLITYP', 'SQLITB' ],
        [ 'DQUOTE', 'QLITYP', 'DQLITB' ],
        [ 'LEFTPAREN', 'NSTTYP', 'STOP' ],
        [ 'ELSE', null, 'ERROR' ]
    ],

    EOSTB: [
        [ 'EOS', null, 'STOP' ],
        [ 'ELSE', null, 'CONTIN' ]
    ],

    FLITB: [
        [ 'NUMBER', null, 'CONTIN' ],
        [ 'TERMINATOR', null, 'STOPSH' ],
        [ 'ELSE', null, 'ERROR' ]
    ],

    FRWDTB: [
        [ 'BLANK', null, 'CONTIN' ],
        [ 'EQUAL', 'EQTYP', 'STOP' ],
        [ 'RIGHTPAREN', 'RPTYP', 'STOP' ],
        [ 'RIGHTBR', 'RBTYP', 'STOP' ],
        [ 'COMMA', 'CMATYP', 'STOP' ],
        [ 'COLON', 'CLNTYP', 'STOP' ],
        [ 'EOS', 'EOSTYP', 'STOP' ],
        [ 'ELSE', 'NBTYP', 'STOPSH' ]
    ],

    GOTFTB: [
        [ 'LEFTPAREN', 'FGOTYP', 'STOP' ],
        [ 'LEFTBR', 'FTOTYP', 'STOP' ],
        [ 'ELSE', null, 'ERROR' ]
    ],

    GOTOTB: [
        [ 'SGOSYM', null, 'GOTSTB' ],
        [ 'FGOSYM', null, 'GOTFTB' ],
        [ 'LEFTPAREN', 'UGOTYP', 'STOP' ],
        [ 'LEFTBR', 'UTOTYP', 'STOP' ],
        [ 'ELSE', null, 'ERROR' ]
    ],

    GOTSTB: [
        [ 'LEFTPAREN', 'SGOTYP', 'STOP' ],
        [ 'LEFTBR', 'STOTYP', 'STOP' ],
        [ 'ELSE', null, 'ERROR' ]
    ],

    IBLKTB: [
        [ 'BLANK', null, 'FRWDTB' ],
        [ 'EOS', 'EOSTYP', 'STOP' ],
        [ 'ELSE', null, 'ERROR' ]
    ],

    INTGTB: [
        [ 'NUMBER', null, 'CONTIN' ],
        [ 'TERMINATOR', 'ILITYP', 'STOPSH' ],
        [ 'DOT', 'FLITYP', 'FLITB' ],
        [ 'ELSE', null, 'ERROR' ]
    ],

    LBLTB: [
        [ 'ALPHANUMERIC', null, 'LBLXTB' ],
        [ 'BLANK', null, 'STOPSH' ],
        [ 'EOS', null, 'STOPSH' ],
        [ 'ELSE', null, 'ERROR' ]
    ],

    LBLXTB: [
        [ 'BLANK', null, 'STOPSH' ],
        [ 'EOS', null, 'STOPSH' ],
        [ 'ELSE', null, 'CONTIN' ]
    ],

    NBLKTB: [
        [ 'TERMINATOR', null, 'ERROR' ],
        [ 'ELSE', null, 'STOPSH' ]
    ],

    NUMBTB: [
        [ 'NUMBER', null, 'NUMCTB' ],
        [ 'PLUS', null, 'NUMCTB' ],
        [ 'MINUS', null, 'NUMCTB' ],
        [ 'COMMA', 'CMATYP', 'STOPSH' ],
        [ 'COLON', 'DIMTYP', 'STOPSH' ],
        [ 'ELSE', null, 'ERROR' ],
    ],

    NUMCTB: [
        [ 'NUMBER', null, 'CONTIN' ],
        [ 'COMMA', 'CMATYP', 'STOPSH' ],
        [ 'COLON', 'DIMTYP', 'STOPSH' ],
        [ 'ELSE', null, 'ERROR' ]
    ],

    SNABTB: [
        [ 'FGOSYM', null, 'STOP' ],
        [ 'SGOSYM', null, 'STOPSH' ],
        [ 'ELSE', null, 'ERROR' ]
    ],

    SQLITB: [
        [ 'SQUOTE', null, 'STOP' ],
        [ 'ELSE', null, 'CONTIN' ]
    ],

    STARTB: [
        [ 'BLANK', null, 'STOP' ],
        [ 'STAR', 'EXPFN', 'TBLKTB' ],
        [ 'ELSE', null, 'ERROR' ]
    ],

    TBLKTB: [
        [ 'BLANK', null, 'STOP' ],
        [ 'ELSE', null, 'ERROR' ]
    ],

    UNOPTB: [
        [ 'PLUS', 'PLSFN', 'NBLKTB' ],
        [ 'MINUS', 'MNSFN', 'NBLKTB' ],
        [ 'DOT', 'DOTFN', 'NBLKTB' ],
        [ 'DOLLAR', 'INDFN', 'NBLKTB' ],
        [ 'STAR', 'STRFN', 'NBLKTB' ],
        [ 'SLASH', 'SLHFN', 'NBLKTB' ],
        [ 'PERCENT', 'PRFN', 'NBLKTB' ],
        [ 'AT', 'ATFN', 'NBLKTB' ],
        [ 'POUND', 'PDFN', 'NBLKTB' ],
        [ 'KEYSYM', 'KEYFN', 'NBLKTB' ],
        [ 'NOTSYM', 'NEGFN', 'NBLKTB' ],
        [ 'ORSYM', 'BARFN', 'NBLKTB' ],
        [ 'QUESYM', 'QUESFN', 'NBLKTB' ],
        [ 'RAISE', 'AROWFN', 'NBLKTB' ],
        [ 'ELSE', null, 'ERROR' ]
    ],

    VARATB: [
        [ 'LETTER', null, 'VARBTB' ],
        [ 'COMMA', 'CMATYP', 'STOPSH' ],
        [ 'RIGHTPAREN', 'RPTYP', 'STOPSH' ],
        [ 'ELSE', null, 'ERROR' ]
    ],

    VARBTB: [
        [ 'ALPHANUMERIC', null, 'CONTIN' ],
        [ 'BREAK', null, 'CONTIN' ],
        [ 'LEFTPAREN', 'LPTYP', 'STOPSH' ],
        [ 'COMMA', 'CMATYP', 'STOPSH' ],
        [ 'RIGHTPAREN', 'RPTYP', 'STOPSH' ],
        [ 'ELSE', null, 'ERROR' ]
    ],

    VARTB: [
        [ 'ALPHANUMERIC', null, 'CONTIN' ],
        [ 'BREAK', null, 'CONTIN' ],
        [ 'TERMINATOR', 'VARTYP', 'STOPSH' ],
        [ 'LEFTPAREN', 'FNCTYP', 'STOP' ],
        [ 'LEFTBR', 'ARYTYP', 'STOP' ],
        [ 'ELSE', null, 'ERROR' ]
    ]
};

SNOBOL.tableNames = Object.keys( SNOBOL.syntaxTables ).sort();
