// Syntax tables, host strings, and the machine-parameter constants the
// SIL translator hands to the assembled image.

import { D } from './datatypes.js';
import { str } from './string.js';

// &ALPHABET holds every byte value of the host character set, matching
// CSNOBOL4 and the original IBM/360 ALPHSZ = 256.
const BYTE_VALUES = 256;
let ALPHA = '';

for ( let i = 0; i < BYTE_VALUES; i++ ) {
    ALPHA += String.fromCharCode( i );
}

export const hostStrings = {
    ALPHA   : ALPHA,
    AMPST   : '&',
    COLSTR  : ': ',
    QTSTR   : "'",
};

// Machine parameters: PARMS-style names whose values are fixed by the host.
// Macros may import these directly. The assembler also seeds them into its
// scratch symbol table so SIL operands like `TTL+STTL` resolve.
export const constants = {
    ALPHSZ  : ALPHA.length,
    CPA     : 1,
    DESCR   : D,
    SPEC    : 2 * D,
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
};

// Defaults for symbols the SIL program assigns itself: stack base, variable
// bin count, and stack size. The assembled image carries the program's chosen
// values. These defaults are only visible in tests that drive macros directly.
export const defaults = {
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

// STREAM asks this matcher about every scanned character, so compile the
// documented regular-expression classes into byte lookup tables once.
const characterClassBitsets = {};
for ( const name in characterClasses ) {
    if ( name === 'ELSE' ) {
        continue;
    }

    const bitset = new Uint8Array( BYTE_VALUES ),
          pattern = characterClasses[ name ];

    for ( let code = 0; code < bitset.length; code++ ) {
        bitset[ code ] = pattern.test( String.fromCharCode( code ) ) ? 1 : 0;
    }

    characterClassBitsets[ name ] = bitset;
}

export function match( characterClass, char ) {
    if ( characterClass === 'ELSE' ) return true;
    const code = typeof char === 'number' ? char : char.charCodeAt( 0 );
    return characterClassBitsets[ characterClass ][ code ] === 1;
}

export const Action = {
    CONTIN: 0,
    STOPSH: 1,
    STOP:   2,
    ERROR:  3,
    RUNOUT: 4,
    GOTO:   5,
};

// Reserved keywords that the assembler hands to STREAM/CLERTB/PLUGTB by
// name. They appear in operand position in the SIL listing but they are not
// symbols. The macros interpret them as tags.
export const streamActions = [ 'CONTIN', 'ERROR', 'STOP', 'STOPSH' ];

// Tables whose scanned tokens get uppercased in place when caseFold is on
// (they consume identifiers: labels and variable names).
const FOLDABLE_TABLES = [ 'LBLTB', 'LBLXTB', 'VARTB', 'VARATB', 'VARBTB' ];

export function normalizeLookupByte( ch, caseFold ) {
    return caseFold ? str.foldAsciiUpperByte( ch ) : ch;
}

export function normalizeToken( table, mem, start, length, caseFold ) {
    if ( caseFold && table.foldable ) {
        str.foldAsciiUpperInPlace( mem, start, length );
    }
}

// Bound tables have one row for each byte value, plus an ELSE row for wider
// JavaScript code units.
function emptyEntry() {
    return { put: 0, action: Action.RUNOUT, next: null };
}

function emptyTable( foldable ) {
    return {
        puts:     new Int32Array( BYTE_VALUES ),
        actions:  new Uint8Array( BYTE_VALUES ).fill( Action.RUNOUT ),
        next:     Array.from( { length: BYTE_VALUES }, () => null ),
        fallback: emptyEntry(),
        foldable,
    };
}

// CLERTB rewrites byte rows. Wider host code units remain a miss.
export function clearTable( table, key ) {
    table.puts.fill( 0 );
    table.actions.fill( Action[ key ] );
    table.next.fill( null );
    table.fallback = emptyEntry();
}

const tableDefinitions = {
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

export const syntaxTables = {};
for ( const name in tableDefinitions ) {
    syntaxTables[ name ] = emptyTable( FOLDABLE_TABLES.includes( name ) );
}

// Resolve symbolic PUT and GOTO operands after the image symbols are loaded.
export function bindSyntaxTables( resolveSymbol ) {
    for ( const name in tableDefinitions ) {
        bindTable( syntaxTables[ name ], tableDefinitions[ name ], resolveSymbol );
    }
}

function bindTable( table, rows, resolveSymbol ) {
    table.puts.fill( 0 );
    table.actions.fill( Action.RUNOUT );
    table.next.fill( null );
    table.fallback = emptyEntry();

    function bindEntry( row ) {
        if ( !row ) {
            return emptyEntry();
        }

        const [ , putName, actionName ] = row;
        const put = putName === null ? 0 : resolveSymbol( putName );

        if ( Object.hasOwn( Action, actionName ) ) {
            return { put, action: Action[ actionName ], next: null };
        }

        return { put, action: Action.GOTO, next: syntaxTables[ actionName ] };
    }

    for ( let code = 0; code < BYTE_VALUES; code++ ) {
        const entry = bindEntry( rows.find( ( r ) => match( r[ 0 ], code ) ) );
        table.puts[ code ] = entry.put;
        table.actions[ code ] = entry.action;
        table.next[ code ] = entry.next;
    }

    table.fallback = bindEntry( rows.find( ( r ) => r[ 0 ] === 'ELSE' ) );
}
