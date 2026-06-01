// JS-implemented CSNOBOL4 primitive functions.
//
// The VM merges this registry with any extensions a host passes through
// `new VM({ extensions: ... })`. Two registration forms are accepted:
//
//   Object form    -- key is the name, value is { args, result, impl }
//   Signature form -- key is 'NAME :: (types) => type', value is the impl
//
//   args   -- per-arg kind: 'int', 'real', or 'string'. LNKFNC coerces
//             the ARGVAL-evaluated descriptors before LINK runs.
//   result -- 'int', 'real', 'string', or 'void'.
//   impl   -- the JS function, called with coerced native values.
//             Return or throw the FAIL sentinel to signal SNOBOL failure.
export const FAIL = Symbol( 'FAIL' );

export const extensions = {
    // CHAR(N): the one-byte string whose code is N.
    CHAR: {
        args: [ 'int' ],
        result: 'string',
        impl: ( n ) => String.fromCharCode( n ),
    },

    // ORD(S): the code of the first byte of S.
    ORD: {
        args: [ 'string' ],
        result: 'int',
        impl: ( s ) => s.charCodeAt( 0 ),
    },

    // REVERSE(S): S with its characters in reverse order.
    REVERSE: {
        args: [ 'string' ],
        result: 'string',
        impl: ( s ) => [ ...s ].reverse().join( '' ),
    },

    // SUBSTR(S, POS, LEN): the LEN-long substring of S at one-based POS.
    // LEN zero (or omitted) takes the rest. A position or length that
    // runs outside S fails.
    SUBSTR: {
        args: [ 'string', 'int', 'int' ],
        result: 'string',
        impl: ( s, pos, len ) => {
            if ( pos < 1 || pos > s.length ) return FAIL;
            const start = pos - 1;
            const n = len === 0 ? s.length - start : len;
            if ( n < 0 || start + n > s.length ) return FAIL;
            return s.slice( start, start + n );
        },
    },

    // LPAD(S, N, C): S padded on the left to width N with C (default
    // space), or S unchanged when already that wide.
    LPAD: {
        args: [ 'string', 'int', 'string' ],
        result: 'string',
        impl: ( s, n, c ) => s.padStart( n, c ? c[0] : ' ' ),
    },

    // RPAD(S, N, C): LPAD on the right.
    RPAD: {
        args: [ 'string', 'int', 'string' ],
        result: 'string',
        impl: ( s, n, c ) => s.padEnd( n, c ? c[0] : ' ' ),
    },

    // SQRT(X): the square root of X, failing on a negative argument.
    SQRT: {
        args: [ 'real' ],
        result: 'real',
        impl: ( x ) => ( x < 0 ? FAIL : Math.sqrt( x ) ),
    },

    // EXP(X): e raised to the power X.
    EXP: {
        args: [ 'real' ],
        result: 'real',
        impl: ( x ) => Math.exp( x ),
    },

    // LOG(X), and its LN alias: the natural logarithm of X.
    LOG: {
        args: [ 'real' ],
        result: 'real',
        impl: ( x ) => Math.log( x ),
    },
    LN: {
        args: [ 'real' ],
        result: 'real',
        impl: ( x ) => Math.log( x ),
    },

    // SIN(X), COS(X), TAN(X): the trigonometric functions of X radians.
    SIN: {
        args: [ 'real' ],
        result: 'real',
        impl: ( x ) => Math.sin( x ),
    },
    COS: {
        args: [ 'real' ],
        result: 'real',
        impl: ( x ) => Math.cos( x ),
    },
    TAN: {
        args: [ 'real' ],
        result: 'real',
        impl: ( x ) => Math.tan( x ),
    },

    // ATAN(X): the arc tangent of X, in radians.
    ATAN: {
        args: [ 'real' ],
        result: 'real',
        impl: ( x ) => Math.atan( x ),
    },

    // CHOP(X): X with its fractional part dropped, toward zero.
    CHOP: {
        args: [ 'real' ],
        result: 'real',
        impl: ( x ) => Math.trunc( x ),
    },

    // The lexical comparison predicates return the null string when the
    // relation holds and fail otherwise. JS string order matches byte
    // order over SNOBOL's single-byte alphabet.
    LLT: {
        args: [ 'string', 'string' ],
        result: 'void',
        impl: ( a, b ) => ( a < b ? undefined : FAIL ),
    },
    LLE: {
        args: [ 'string', 'string' ],
        result: 'void',
        impl: ( a, b ) => ( a <= b ? undefined : FAIL ),
    },
    LEQ: {
        args: [ 'string', 'string' ],
        result: 'void',
        impl: ( a, b ) => ( a === b ? undefined : FAIL ),
    },
    LNE: {
        args: [ 'string', 'string' ],
        result: 'void',
        impl: ( a, b ) => ( a !== b ? undefined : FAIL ),
    },
    LGT: {
        args: [ 'string', 'string' ],
        result: 'void',
        impl: ( a, b ) => ( a > b ? undefined : FAIL ),
    },
    LGE: {
        args: [ 'string', 'string' ],
        result: 'void',
        impl: ( a, b ) => ( a >= b ? undefined : FAIL ),
    },
};

// Parse a signature-form key. Grammar:  NAME :: (type, ...) => result
//   args   in { int, real, string }
//   result in { int, real, string, void }
// Whitespace around any token is optional.
const SIGNATURE = /^(\w+)\s*::\s*\(([\w,\s]*)\)\s*=>\s*(\w+)\s*$/;
const ARG_TYPES = [ 'int', 'real', 'string' ];
const RESULT_TYPES = [ ...ARG_TYPES, 'void' ];

export function parseSignature( key, impl ) {
    const fail = ( reason ) => {
        throw new SyntaxError( `Invalid signature "${key}": ${reason}` );
    };

    const match = SIGNATURE.exec( key );
    if ( !match ) fail( 'expected NAME :: (type, ...) => result' );

    const [ , name, argSource, result ] = match;
    const args = argSource.trim()
        ? argSource.split( ',' ).map( ( t ) => t.trim() )
        : [];

    for ( const arg of args ) {
        if ( !ARG_TYPES.includes( arg ) ) fail( `unknown arg type "${arg}"` );
    }
    if ( !RESULT_TYPES.includes( result ) ) {
        fail( `unknown result type "${result}"` );
    }

    return [ name, { args, result, impl } ];
}

export function compileJavaScriptExtension( name, source, args, result ) {
    let impl;
    try {
        impl = Function(
            'FAIL',
            `"use strict"; return (${source});`,
        )( FAIL );
    } catch ( e ) {
        throw new SyntaxError(
            `Invalid JavaScript extension for ${name}: ${e.message}`,
        );
    }

    if ( typeof impl !== 'function' ) {
        throw new TypeError(
            `Invalid JavaScript extension for ${name}: ` +
                'source did not evaluate to a function',
        );
    }

    return { args, result, impl };
}
