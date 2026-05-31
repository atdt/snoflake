// Snoflake-only source preprocessing.
//
// Standard SNOBOL4 literals are bounded to a single card -- the SIL lexer
// in `STREAM XSP,TEXTSP,ELEMTB,...` (v311-snoflake.sil:1165) scans one
// TEXTSP at a time. To make multi-line strings convenient without
// touching that scanner, snoflake expands a backtick raw-string literal
// to an equivalent SNOBOL concatenation before the lexer ever sees it.
//
// A backtick range opens at any `\`` outside a '...' or "..." literal
// and outside *-comment or -control lines, and closes at the next
// `\``. Content is captured verbatim. Each source line in the range
// becomes one continuation card (`+` in column 1) carrying that line's
// portion of the content as a SNOBOL string expression, joined to its
// neighbors by ` CHAR(10)`. The opener's line keeps its prefix and the
// closer's line keeps its suffix, so a backtick that straddles a
// function call (`foo(\`...\`)`) still parses as one statement and
// every source line maps one-to-one to an output line.
//
// Backtick was never legal anywhere in SNOBOL4 syntax, so a program
// that doesn't use one round-trips byte for byte.

const textDecoder = new TextDecoder();

export function expandMultilineStrings( source ) {
    const text = typeof source === 'string'
        ? source
        : textDecoder.decode( source );

    let out = '';
    let i = 0;

    while ( i < text.length ) {
        const opener = findNextBacktick( text, i );
        if ( opener === -1 ) {
            out += text.slice( i );
            break;
        }

        const closer = text.indexOf( '`', opener + 1 );
        if ( closer === -1 ) {
            throw new SyntaxError(
                `Unclosed backtick-delimited string at offset ${opener}`,
            );
        }

        out += text.slice( i, opener );
        out += expandRange( text.slice( opener + 1, closer ) );
        i = closer + 1;
    }

    return out;
}

// Render one backtick range. The opener's place keeps the first
// segment; each `\n` becomes a real newline followed by `+` so the
// next segment is a continuation card.
function expandRange( content ) {
    const segments = content.split( '\n' );
    const last = segments.length - 1;
    const out = [];
    for ( let s = 0; s <= last; s++ ) {
        const expr = literal( segments[s] );
        const prefix = s === 0 ? '' : '\n+';
        const joiner = s === last ? '' : ( expr ? ' CHAR(10)' : 'CHAR(10)' );
        out.push( prefix + expr + joiner );
    }
    return out.join( '' );
}

// Find the next backtick outside any '...' or "..." literal and outside
// *-comment or -control lines.
function findNextBacktick( text, from ) {
    let pos = from;
    let atLineStart = pos === 0 || text[pos - 1] === '\n';

    while ( pos < text.length ) {
        const c = text[pos];

        if ( atLineStart && ( c === '*' || c === '-' ) ) {
            const nl = text.indexOf( '\n', pos );
            if ( nl === -1 ) return -1;
            pos = nl + 1;
            atLineStart = true;
            continue;
        }

        if ( c === '\n' ) {
            pos++;
            atLineStart = true;
            continue;
        }
        atLineStart = false;

        if ( c === '`' ) return pos;

        if ( c === "'" || c === '"' ) {
            // SNOBOL literals stop at end-of-line. If the closing quote
            // doesn't show up before then, advance to the line break and
            // let the SNOBOL tokenizer report the unclosed literal.
            const close = text.indexOf( c, pos + 1 );
            const eol = text.indexOf( '\n', pos + 1 );
            pos = ( close !== -1 && ( eol === -1 || close < eol ) )
                ? close + 1
                : ( eol === -1 ? text.length : eol );
            continue;
        }

        pos++;
    }
    return -1;
}

// Render one newline-free segment as a SNOBOL string expression. Each
// chunk lands inside whichever quote it doesn't contain; a conflict
// triggers a flush and a delimiter switch, so adjacent chunks reassemble
// via implicit concatenation.
function literal( segment ) {
    if ( segment === '' ) return '';
    const parts = [];
    let chunk = '';
    let delim = "'";

    const flush = () => {
        if ( chunk.length > 0 ) {
            parts.push( delim + chunk + delim );
            chunk = '';
        }
    };

    for ( const ch of segment ) {
        if ( ch === delim ) {
            flush();
            delim = delim === "'" ? '"' : "'";
            chunk = ch;
        } else {
            chunk += ch;
        }
    }
    flush();
    return parts.join( ' ' );
}
