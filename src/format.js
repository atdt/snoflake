// Minimal FORTRAN IV "undigested" format processor for OUTPUT and STPRNT.

// `data` accepts three shapes:
//   - a string, supplying characters for A fields,
//   - a single descriptor, used by an I or F field, or
//   - an array of descriptors, consumed in order by successive I/F fields.
export function formatRecord( template, data ) {
    template = stripOuterParens( template );
    if ( !template ) return '';

    const { strData, descrData } = normalizeData( data );
    let strPos = 0,
        descrIdx = 0,
        i = 0,
        out = '';

    function take( n ) {
        const s = strData.slice( strPos, strPos + n );
        strPos += n;
        return s;
    }

    function nextDescr() {
        return descrIdx < descrData.length ? descrData[descrIdx++] : null;
    }

    function skipSeparators() {
        // FORTRAN treats whitespace and ',' interchangeably between items.
        while ( i < template.length && /[\s,]/.test( template[i] ) ) i++;
    }

    function parseDigits() {
        const m = /^(\d+)/.exec( template.slice( i ) );
        if ( !m ) return 0;
        i += m[1].length;
        return parseInt( m[1], 10 );
    }

    // FORTRAN doubles the quote character to embed it in a quoted literal.
    function readQuotedLiteral( quote ) {
        let literal = '';
        while ( i < template.length ) {
            const ch = template[i++];
            if ( ch === quote ) {
                if ( template[i] === quote ) {
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

    // PAUSE in a FORMAT may be followed by a quoted lone apostrophe. Consume
    // those markers, leaving any other quote in place.
    function skipPauseQuoteMarks() {
        for ( ;; ) {
            while ( i < template.length && /\s/.test( template[i] ) ) i++;
            const mark = template[i];
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

    // Consume an unsupported control word so its letters don't get treated as
    // A-conversions. PAUSE may carry a quoted apostrophe marker.
    function skipControlWord( first ) {
        let word = first;
        while ( i < template.length && /[A-Za-z0-9.]/.test( template[i] ) ) {
            word += template[i++];
        }
        if ( word === 'PAUSE' ) skipPauseQuoteMarks();
    }

    while ( i < template.length ) {
        skipSeparators();
        if ( i >= template.length ) break;

        if ( template[i] === '/' ) {
            out += '\n';
            i++;
            continue;
        }

        const rep = parseDigits() || 1;
        const code = template[i++];

        switch ( code ) {
            case '"':
            case "'":
                out += readQuotedLiteral( code ).repeat( rep );
                break;

            case 'H':
                // Hollerith literal: rep is the character count.
                out += template.slice( i, i + rep );
                i += rep;
                break;

            case 'X':
                out += ' '.repeat( rep );
                break;

            case 'A': {
                const aw = parseDigits();
                for ( let r = 0; r < rep; r++ ) {
                    out += aw ? take( aw ) : strData.slice( strPos );
                }
                break;
            }

            case 'I': {
                const iw = parseDigits();
                const descr = nextDescr();
                const val = descr
                    ? descr.addr
                    : ( parseInt( strData.slice( strPos ), 10 ) || 0 );
                out += String( val ).padStart( iw );
                break;
            }

            case 'F': {
                const fw = parseDigits();
                let fd = 0;
                if ( template[i] === '.' ) {
                    i++;
                    fd = parseDigits();
                }
                const descr = nextDescr();
                const fval = descr
                    ? descr.addr
                    : ( parseFloat( strData.slice( strPos ) ) || 0 );
                const ftxt = fd ? fval.toFixed( fd ) : String( fval );
                out += ftxt.padStart( fw );
                break;
            }

            default:
                if ( /[A-Za-z]/.test( code ) ) skipControlWord( code );
        }
    }

    return out;
}

function stripOuterParens( template ) {
    if ( !template ) return template;
    const m = /^\s*\((.*)\)\s*$/.exec( template );
    return m ? m[1] : template;
}

function normalizeData( data ) {
    if ( typeof data === 'string' ) return { strData: data, descrData: [] };
    if ( Array.isArray( data ) ) return { strData: '', descrData: data };
    if ( data && typeof data === 'object' ) {
        return { strData: '', descrData: [ data ] };
    }
    return { strData: '', descrData: [] };
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
// are kept. Embedded NULs (from zero-filled buffer cells beyond a string's
// logical length) are stripped so they never reach the printer.
export function printerLines( template, data, { stripCarriageControl } ) {
    return formatRecord( template, data ).split( '\n' ).map( ( line ) => {
        if ( stripCarriageControl && /^[10+ ]/.test( line ) ) {
            line = line.slice( 1 );
        }
        return line.replaceAll( '\0', '' );
    } );
}
