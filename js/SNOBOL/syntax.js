"use strict";

var SNOBOL = require( './base' );

// 0x7F is just the ASCII range; it should really be
// 0x10000, but we get crashes.
var CHAR_MAX = 0x7F,
    ALPHA = '',
    D = 3;

for ( var i = 1; i <= CHAR_MAX; i++ ) {
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

    FNC     : 1 << 1,
    MARK    : 1 << 2,
    PTR     : 1 << 3,
    STTL    : 1 << 4, 
    TTL     : 1 << 5,

    UNITI   : 5,
    UNITO   : 6,
    UNITP   : 7,

    MLINK   : 1,
    PARMS   : 1,

    // Misc
    // OSTACK  : 2000 * D,
    // CSTACK  : 2001 * D,
    // STACK   : 2002 * D,
    // OBSIZ   : 256,    // Needed for bootstrapping tests, but actually defined in SIL
    // STSIZE  : 1000,   // ditto

    STNOSZ       : 8,     // Length of statement number field
    OBSIZ        : 256,   // Number of bin headers
    SPDLSZ       : 1000,  // Descriptors of pattern stack
    STSIZE       : 1000,  // Descriptors of interpreter stack
    ARRLEN       : 20,    // Limit on length of array print image
    CARDSZ       : 1024,    // Width of compiler input
    SEQSIZ       : 8,     // Width of sequence field
    DSTSZ        : 16,    // Space for left and right numbering
};

// See section 4.1 (Characters) in S4D58
var characterClasses = {
    ALPHANUMERIC : /[a-z0-9]/i,
    AT           : /@/,
    BLANK        : /\s/,
    BREAK        : /[._]/,
    CMT          : /\*/,
    CNT          : /[+.]/,
    COLON        : /:/,
    COMMA        : /,/,
    CTL          : /-/,
    DOLLAR       : /\$/,
    DOT          : /\./,
    DQUOTE       : /"/,
    EOS          : /\n/,
    EQUAL        : /=/,
    FGOSYM       : /F/,
    KEYSYM       : /&/,
    LEFTBR       : /[[<]/,
    LEFTPAREN    : /\(/,
    LETTER       : /[a-z]/i,
    MINUS        : /-/,
    NOTSYM       : /˜/,
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
    TERMINATOR   : /[;)>,\]\s]/,
    ELSE         : /.*/,
};

SNOBOL.match = function ( characterClass, char ) {
    return characterClasses[ characterClass ].test( char );
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
        // [ 'COMMA', null, 'CONTIN' ],
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

Object.keys( SNOBOL.syntaxTables ).forEach( function ( tableName ) {
    SNOBOL.programSymbols[ tableName ] = SNOBOL.syntaxTables[ tableName ];
} );
