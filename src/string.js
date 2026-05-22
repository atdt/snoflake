// Small string utilities shared across the runtime.

export const str = {
    pad( text, width, align, padChar = ' ' ) {
        if ( text.length >= width ) return text;
        return align === 'left'
            ? text.padEnd( width, padChar )
            : text.padStart( width, padChar );
    },

    encode( s ) {
        const text = s.toString();
        const len = text.length;
        const paddedLen = len + ( len % 3 === 0 ? 0 : 3 - ( len % 3 ) );
        const encoded = new Uint32Array( paddedLen );

        for ( let i = 0; i < len; i++ ) {
            encoded[ i ] = text.charCodeAt( i );
        }

        return encoded;
    },

    decode( encoded, start, length ) {
        let decoded = '';
        const end = start + length;
        for ( let i = start; i < end; i++ ) {
            decoded += String.fromCharCode( encoded[ i ] );
        }
        return decoded;
    },

    foldAsciiUpperByte( c ) {
        return ( c >= 97 && c <= 122 ) ? c - 32 : c;
    },

    foldAsciiUpperInPlace( buf, start, length ) {
        const end = start + length;
        for ( let p = start; p < end; p++ ) {
            buf[ p ] = str.foldAsciiUpperByte( buf[ p ] );
        }
    },

    // An implementation of Jenkins's one-at-a-time hash
    // <http://en.wikipedia.org/wiki/Jenkins_hash_function>
    hash( key ) {
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
    },
};
