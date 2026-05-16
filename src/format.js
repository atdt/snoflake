import { str } from './string.js';

// Minimal FORTRAN IV "undigested" format processor for OUTPUT and STPRNT.
// `data` is either a string for A fields or descriptors for I/F fields.
export function formatRecord( template, data ) {
    if ( !template ) return '';

    // Strip the outermost parentheses if present.
    const start = template.indexOf( '(' ),
          end = template.lastIndexOf( ')' );
    if ( start !== -1 && end > start ) {
        template = template.slice( start + 1, end );
    }

    let strData = '',
        descrData = null,
        descrIdx = 0;
    if ( typeof data === 'string' ) {
        strData = data;
    } else if ( Array.isArray( data ) ) {
        descrData = data;
    } else if ( data && typeof data === 'object' ) {
        descrData = [ data ];
    }

    let pos = 0,
        out = '',
        i = 0;

    function take( n ) {
        const s = strData.slice( pos, pos + n );
        pos += n;
        return s;
    }

    function nextDescr() {
        return descrData && descrIdx < descrData.length ? descrData[ descrIdx++ ] : null;
    }

    function skipSpaces() {
        while ( i < template.length && /[\s,]/.test( template[ i ] ) ) i++;
    }

    function parseDigits() {
        const m = /^(\d+)/.exec( template.slice( i ) );
        if ( !m ) return 0;
        i += m[ 1 ].length;
        return parseInt( m[ 1 ], 10 );
    }

    function readQuotedLiteral( quote ) {
        let literal = '';
        while ( i < template.length ) {
            const ch = template[ i++ ];
            if ( ch === quote ) {
                if ( template[ i ] === quote ) {
                    literal += quote;
                    i++;
                    continue;
                }
                break;
            }
            literal += ch;
        }
        return literal;
    }

    function skipPauseQuoteMarks() {
        for ( ;; ) {
            while ( i < template.length && /\s/.test( template[ i ] ) ) i++;
            const mark = template[ i ];
            if ( mark !== '"' && mark !== "'" ) return;
            const saved = i;
            i++;
            const literal = readQuotedLiteral( mark );
            if ( literal !== "'" ) {
                i = saved;
                return;
            }
        }
    }

    while ( i < template.length ) {
        skipSpaces();
        if ( i >= template.length ) break;

        if ( template[ i ] === '/' ) {
            out += '\n';
            i++;
            continue;
        }

        const rep = parseDigits() || 1;
        const code = template[ i++ ];

        if ( code === '"' || code === "'" ) {
            // FORTRAN doubles the quote mark inside quoted literals.
            out += readQuotedLiteral( code ).repeat( rep );
        } else if ( code === 'H' ) {
            // Hollerith literal: rep is the character count.
            out += template.slice( i, i + rep );
            i += rep;
        } else if ( code === 'X' ) {
            out += str.pad( '', rep, 'left', ' ' );
        } else if ( code === 'A' ) {
            const aw = parseDigits();
            for ( let r = 0; r < rep; r++ ) {
                out += aw ? take( aw ) : strData.slice( pos );
            }
        } else if ( code === 'I' ) {
            const iw = parseDigits();
            const descr = nextDescr();
            const val = descr ? descr.addr : ( parseInt( strData.slice( pos ), 10 ) || 0 );
            out += str.pad( String( val ), iw );
        } else if ( code === 'F' ) {
            const fw = parseDigits();
            let fd = 0;
            if ( template[ i ] === '.' ) {
                i++;
                fd = parseDigits();
            }
            const descr = nextDescr();
            const fval = descr ? descr.raddr : ( parseFloat( strData.slice( pos ) ) || 0 );
            const ftxt = fd ? fval.toFixed( fd ) : String( fval );
            out += str.pad( ftxt, fw );
        } else if ( /[A-Za-z]/.test( code ) ) {
            // Unsupported control words are skipped as whole words. That
            // keeps the A in PAUSE from being treated as an A field.
            let word = code;
            while ( i < template.length && /[A-Za-z0-9.]/.test( template[ i ] ) ) {
                word += template[ i ];
                i++;
            }
            if ( word === 'PAUSE' ) {
                // PAUSE may be followed by a quoted apostrophe marker.
                skipPauseQuoteMarks();
            }
        }
    }

    return out;
}

// True when the template begins with a token that contributes a literal
// first character to the record: a Hollerith block, blank padding, or a
// quoted literal. The first character of such a record is FORTRAN-style
// carriage control. The line printer interprets and strips it.
export function formatHasLeadingCarriageControl( template ) {
    return /^\(?[\s,]*\d*([HX"'])/.test( template || '' );
}

// Render a formatted record as the array of lines a line printer would
// emit. When stripCarriageControl is true, a leading FORTRAN carriage-control
// character ('1', '0', '+', or space) is stripped. Other leading characters
// are kept. NUL padding from str.encode's descriptor alignment is always
// stripped because it must never reach the printer.
export function printerLines( template, data, { stripCarriageControl } ) {
    return formatRecord( template, data ).split( '\n' ).map( line => {
        if ( stripCarriageControl && /^[10+ ]/.test( line ) ) line = line.slice( 1 );
        return line.replace( /\u0000+/g, '' );
    } );
}
