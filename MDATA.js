/* MDATA */

// Constructs a string representing all code points in UTF-16
function getCharacterSet() {
    var charset = [];
    for (var i = 0x0; i < 0x10000; i++)
        charset.push(String.fromCharCode(i));
    return charset.join('');
}

var ALPHA = getCharacterSet(),
    AMPST = '&',
    COLSTR = ': ',
    QTSTR = "'";

/* PARMS */

var ALPHASZ = ALPHA.length,
    CPA = 1,
    DESCR = 64,
    SIZLIM = Number.MAX_VALUE,
    SPEC = 64,

    FNC = 0x1,
    MARK = 0x2,
    PTR = 0x4,
    STTL = 0x8,
    TTL = 0x10,

    UNITI = 5,
    UNITO = 6,
    UNITP = 7;
