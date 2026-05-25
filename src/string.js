// Small string utilities shared across the runtime.

export const str = {
    // Write s's char codes directly into dst starting at offset.
    // dst is expected to be a Uint32Array view of VM memory.
    encodeInto( s, dst, offset ) {
        const len = s.length;
        for ( let i = 0; i < len; i++ ) {
            dst[ offset + i ] = s.charCodeAt( i );
        }
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
