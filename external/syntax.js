var is = require('./regexes.js');
var tables = {
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
}

function Stream( str, tableName ) {
    var ch, pattern, put, pos, i, newStr = '', table = tables[tableName];
    for ( pos = 0; pos < str.length; pos++ ) {
        ch = str[pos];
        for ( i = 0; i < table.length; i++ ) {
            pattern = table[i][0];
            if ( is[pattern]( ch ) ) {
                console.log( '%s matches %s', ch, pattern );
                put = table[i][1];
                op = table[i][2];
                break;
            }
        }
        if ( put ) {
            console.log( 'put(%s)', put );
        }
        switch ( op ) {
        case 'CONTIN':
            console.log('CONTIN');
            newStr = newStr + ch;
            continue;
        case 'STOPSH':
            console.log('STOPSH');
            break;
        case 'STOP':
            console.log('STOP');
            newStr = newStr + ch;
            break;
        case 'ERROR':
            console.log('ERROR');
            return;
        default:
            console.log('GOTO(%s)', op);
            newStr = newStr + ch;
            table = tables[op];
        }
    }
    console.log('DONE: "%s"', newStr);
}

Stream( '1.3', 'INTGTB' );
