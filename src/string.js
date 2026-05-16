function pad( str, width, align, padChar = ' ' ) {
    if ( str.length >= width ) return str;
    return align === 'left'
        ? str.padEnd( width, padChar )
        : str.padStart( width, padChar );
}

export const str = {

    pad: pad,

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
