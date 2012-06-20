var SyntaxTable = {

    BIOPTB: {
        PLUS    : [ 'ADDFN', 'TBLKTB' ],
        MINUS   : [ 'SUBFN', 'TBLKTB' ],
        DOT     : [ 'NAMFN', 'TBLKTB' ],
        DOLLAR  : [ 'DOLFN', 'TBLKTB' ],
        STAR    : [ 'MPYFN', 'STARTB' ],
        SLASH   : [ 'DIVFN', 'TBLKTB' ],
        AT      : [ 'BIATFN', 'TBLKTB' ],
        POUND   : [ 'BIPDFN', 'TBLKTB' ],
        PERCENT : [ 'BIPRFN', 'TBLKTB' ],
        RAISE   : [ 'EXPFN', 'TBLKTB' ],
        ORSYM   : [ 'ORFN', 'TBLKTB' ],
        KEYSYM  : [ 'BIAMFN', 'TBLKTB' ],
        NOTSYM  : [ 'BINGFN', 'TBLKTB' ],
        QUESYM  : [ 'BIQSFN', 'TBLKTB' ],
        ELSE    : [ 'ERROR' ],
    },

    CARDTB: {
        CMT  : [ 'CMTTYP', 'STOPSH' ],
        CTL  : [ 'CTLTYP', 'STOPSH' ],
        CNT  : [ 'CNTTYP', 'STOPSH' ],
        ELSE : [ 'NEWTYP', 'STOPSH' ],
    },

    DQLITB: {
        DQUOTE : [ 'STOP' ],
        ELSE   : [ 'CONTIN' ],
    },

    ELEMTB: {
        NUMBER    : [ 'ILITYP', 'INTGTB' ],
        LETTER    : [ 'VARTYP', 'VARTB' ],
        SQUOTE    : [ 'QLITYP', 'SQLITB' ],
        DQUOTE    : [ 'QLITYP', 'DQLITB' ],
        LEFTPAREN : [ 'NSTTYP', 'STOP' ],
        ELSE      : [ 'ERROR' ],
    },

    EOSTB: {
        EOS  : [ 'STOP' ],
        ELSE : [ 'CONTIN' ],
    },

    FLITB: {
        NUMBER     : [ 'CONTIN' ],
        TERMINATOR : [ 'STOPSH' ],
        ELSE       : [ 'ERROR' ],
    },

    FRWDTB: {
        BLANK      : [ 'CONTIN' ],
        EQUAL      : [ 'EQTYP', 'STOP' ],
        RIGHTPAREN : [ 'RPTYP', 'STOP' ],
        RIGHTBR    : [ 'RBTYP', 'STOP' ],
        COMMA      : [ 'CMATYP', 'STOP' ],
        COLON      : [ 'CLNTYP', 'STOP' ],
        EOS        : [ 'EOSTYP', 'STOP' ],
        ELSE       : [ 'NBTYP', 'STOPSH' ],
    },

    GOTFTB: {
        LEFTPAREN : [ 'FGOTYP', 'STOP' ],
        LEFTBR    : [ 'FTOTYP', 'STOP' ],
        ELSE      : [ 'ERROR' ],
    },

    GOTOTB: {
        SGOSYM    : [ 'GOTSTB' ],
        FGOSYM    : [ 'GOTFTB' ],
        LEFTPAREN : [ 'UGOTYP', 'STOP' ],
        LEFTBR    : [ 'UTOTYP', 'STOP' ],
        ELSE      : [ 'ERROR' ],
    },

    GOTSTB: {
        LEFTPAREN : [ 'SGOTYP', 'STOP' ],
        LEFTBR    : [ 'STOTYP', 'STOP' ],
        ELSE      : [ 'ERROR' ],
    },

    IBLKTB: {
        BLANK : [ 'FRWDTB' ],
        EOS   : [ 'EOSTYP', 'STOP' ],
        ELSE  : [ 'ERROR' ],
    },

    INTGTB: {
        NUMBER     : [ 'CONTIN' ],
        TERMINATOR : [ 'ILITYP', 'STOPSH' ],
        DOT        : [ 'FLITYP', 'FLITB' ],
        ELSE       : [ 'ERROR' ],
    },

    LBLTB: {
        ALPHANUMERIC : [ 'LBLXTB' ],
        BLANK        : [ 'STOPSH' ],
        EOS          : [ 'STOPSH' ],
        ELSE         : [ 'ERROR' ],
    },

    LBLXTB: {
        BLANK : [ 'STOPSH' ],
        EOS   : [ 'STOPSH' ],
        ELSE  : [ 'CONTIN' ],
    },

    NBLKTB: {
        TERMINATOR : [ 'ERROR' ],
        ELSE       : [ 'STOPSH' ],
    },

    NUMBTB: {
        NUMBER : [ 'NUMCTB' ],
        PLUS   : [ 'NUMCTB' ],
        MINUS  : [ 'NUMCTB' ],
        COMMA  : [ 'CMATYP', 'STOPSH' ],
        COLON  : [ 'DIMTYP', 'STOPSH' ],
        ELSE   : [ 'ERROR' ],
    },

    NUMCTB: {
        NUMBER : [ 'CONTIN' ],
        COMMA  : [ 'CMATYP', 'STOPSH' ],
        COLON  : [ 'DIMTYP', 'STOPSH' ],
        ELSE   : [ 'ERROR' ],
    },

    SNABTB: {
        FGOSYM : [ 'STOP' ],
        SGOSYM : [ 'STOPSH' ],
        ELSE   : [ 'ERROR' ],
    },

    SQLITB: {
        SQUOTE : [ 'STOP' ],
        ELSE   : [ 'CONTIN' ],
    },

    STARTB: {
        BLANK : [ 'STOP' ],
        STAR  : [ 'EXPFN', 'TBLKTB' ],
        ELSE  : [ 'ERROR' ],
    },

    TBLKTB: {
        BLANK : [ 'STOP' ],
        ELSE  : [ 'ERROR' ],
    },

    UNOPTB: {
        PLUS    : [ 'PLSFN', 'NBLKTB' ],
        MINUS   : [ 'MNSFN', 'NBLKTB' ],
        DOT     : [ 'DOTFN', 'NBLKTB' ],
        DOLLAR  : [ 'INDFN', 'NBLKTB' ],
        STAR    : [ 'STRFN', 'NBLKTB' ],
        SLASH   : [ 'SLHFN', 'NBLKTB' ],
        PERCENT : [ 'PRFN', 'NBLKTB' ],
        AT      : [ 'ATFN', 'NBLKTB' ],
        POUND   : [ 'PDFN', 'NBLKTB' ],
        KEYSYM  : [ 'KEYFN', 'NBLKTB' ],
        NOTSYM  : [ 'NEGFN', 'NBLKTB' ],
        ORSYM   : [ 'BARFN', 'NBLKTB' ],
        QUESYM  : [ 'QUESFN', 'NBLKTB' ],
        RAISE   : [ 'AROWFN', 'NBLKTB' ],
        ELSE    : [ 'ERROR' ],
    },

    VARATB: {
        LETTER     : [ 'VARBTB' ],
        COMMA      : [ 'CMATYP', 'STOPSH' ],
        RIGHTPAREN : [ 'RPTYP', 'STOPSH' ],
        ELSE       : [ 'ERROR' ],
    },

    VARBTB: {
        ALPHANUMERIC : [ 'CONTIN' ],
        BREAK        : [ 'CONTIN' ],
        LEFTPAREN    : [ 'LPTYP', 'STOPSH' ],
        COMMA        : [ 'CMATYP', 'STOPSH' ],
        RIGHTPAREN   : [ 'RPTYP', 'STOPSH' ],
        ELSE         : [ 'ERROR' ],
    },

    VARTB: {
        ALPHANUMERIC : [ 'CONTIN' ],
        BREAK        : [ 'CONTIN' ],
        TERMINATOR   : [ 'VARTYP', 'STOPSH' ],
        LEFTPAREN    : [ 'FNCTYP', 'STOP' ],
        LEFTBR       : [ 'ARYTYP', 'STOP' ],
        ELSE         : [ 'ERROR' ],
    }

};
