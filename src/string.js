export const str = {

    pad: function ( str, width, align, padChar = ' ' ) {
        if ( str.length >= width ) return str;
        return align === 'left'
            ? str.padEnd( width, padChar )
            : str.padStart( width, padChar );
    },

    encode: function ( s ) {
        const str = s.toString();
        const len = str.length;
        const paddedLen = len + ( len % 3 === 0 ? 0 : 3 - ( len % 3 ) );
        const encoded = new Uint32Array( paddedLen );

        for ( let i = 0; i < len; i++ ) {
            encoded[ i ] = str.charCodeAt( i );
        }

        return encoded;
    },

    decode: function ( encoded ) {
        let end = encoded.length;
        while ( end > 0 && encoded[ end - 1 ] === 0 ) {
            end--;
        }

        let decoded = '';
        for ( let i = 0; i < end; i++ ) {
            decoded += String.fromCharCode( encoded[ i ] );
        }
        return decoded;
    },

    // ASCII-only uppercase fold. Matches the SNOBOL4 source-fold rule: lower
    // a-z map to upper, every other byte passes through unchanged.
    foldAsciiUpper: function ( s ) {
        return s.replace( /[a-z]/g, function ( ch ) {
            return String.fromCharCode( ch.charCodeAt( 0 ) - 32 );
        } );
    },

    // Same fold as foldAsciiUpper, applied in place to a slice of a buffer.
    foldAsciiUpperInPlace: function ( buf, start, length ) {
        const end = start + length;
        for ( let p = start; p < end; p++ ) {
            const c = buf[ p ];
            if ( c >= 97 && c <= 122 ) {
                buf[ p ] = c - 32;
            }
        }
    },

    // An implementation of Jenkins's one-at-a-time hash
    // <http://en.wikipedia.org/wiki/Jenkins_hash_function>
    hash: function ( key ) {
        let hash = 0, i = key.length;
        while ( i-- ) {
            hash += key.charCodeAt( i );
            hash += ( hash << 10 );
            hash ^= ( hash >> 6 );
        }
        hash += ( hash << 3 );
        hash ^= ( hash >> 11 );
        hash += ( hash << 15 );
        return hash;
    }
};
