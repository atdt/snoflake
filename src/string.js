// Small string utilities shared across the runtime.

const encoder = new TextEncoder();
let scratch = new Uint8Array( 256 );

// dst is expected to be a Float64Array view of VM memory.
//
// For an ASCII string the UTF-8 bytes are the char codes, so two native
// calls do all the work: encode into a byte buffer, then copy in with
// set(). Other strings take the per-character loop.
export function writeString( s, dst, offset ) {
    const len = s.length;
    if ( scratch.length < len ) {
        scratch = new Uint8Array( len );
    }
    const { read, written } = encoder.encodeInto( s, scratch );
    if ( read === len && written === len ) {
        dst.set( scratch.subarray( 0, len ), offset );
        return;
    }
    for ( let i = 0; i < len; i++ ) {
        dst[offset + i] = s.charCodeAt( i );
    }
}

export function decodeString( encoded, start, length ) {
    let decoded = '';
    const end = start + length;
    for ( let i = start; i < end; i++ ) {
        decoded += String.fromCharCode( encoded[i] );
    }
    return decoded;
}

// A minimal printf. Each placeholder consumes the next value: %d inserts
// a number and %f a number with two decimal places. The result is split
// into lines at literal \n.
export function formatLines( template, values ) {
    let next = 0;
    return template
        .replace( /%([df])/g, ( _, conv ) => {
            const value = values[next++];
            return conv === 'f' ? value.toFixed( 2 ) : String( value );
        } )
        .split( '\\n' );
}

// ASCII lowercase (a-z) folded to uppercase (A-Z); other bytes unchanged.
export function foldAsciiUpperByte( c ) {
    return ( c >= 97 && c <= 122 ) ? c - 32 : c;
}

// An implementation of Jenkins's one-at-a-time hash
// <http://en.wikipedia.org/wiki/Jenkins_hash_function>
export function hashString( key ) {
    let hash = 0, i = key.length;
    while ( i-- ) {
        hash += key.charCodeAt( i );
        hash += hash << 10;
        hash ^= hash >> 6;
    }
    hash += hash << 3;
    hash ^= hash >> 11;
    hash += hash << 15;
    return hash;
}
