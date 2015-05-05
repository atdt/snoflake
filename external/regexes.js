var is = {
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
    EOS          : /;/,
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
};

for ( var k in is ) if ( is.hasOwnProperty( k ) ) {
    is[k] = RegExp.prototype.test.bind( is[k] );
}

module.exports = is;
