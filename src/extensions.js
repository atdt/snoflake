// JS-implemented CSNOBOL4 primitive functions.
//
// The VM merges this registry with any extensions a host passes through
// `new VM({ extensions: ... })`. Two registration forms are accepted:
//
//   Object form     -- key is the name, value is { args, result, impl }
//   Prototype form  -- key is 'NAME(TYPES)RESULT', value is the impl. This
//                      is the same external-function prototype LOAD uses.
//
//   args   -- per-arg kind: 'integer', 'real', or 'string'. LNKFNC coerces
//             the ARGVAL-evaluated descriptors before LINK runs.
//   result -- 'integer', 'real', or 'string'. Omit it for a function with
//             no result, which hands SNOBOL the null string.
//   impl   -- the JS function, called with coerced native values.
//             Return or throw the FAIL sentinel to signal SNOBOL failure.
export const FAIL = Symbol( 'FAIL' );

export const extensions = {
    // CHAR(N): the one-byte string whose code is N.
    CHAR: {
        args: [ 'integer' ],
        result: 'string',
        impl: ( n ) => String.fromCharCode( n ),
    },

    // ORD(S): the code of the first byte of S.
    ORD: {
        args: [ 'string' ],
        result: 'integer',
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
        args: [ 'string', 'integer', 'integer' ],
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
        args: [ 'string', 'integer', 'string' ],
        result: 'string',
        impl: ( s, n, c ) => s.padStart( n, c ? c[0] : ' ' ),
    },

    // RPAD(S, N, C): LPAD on the right.
    RPAD: {
        args: [ 'string', 'integer', 'string' ],
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
        impl: ( a, b ) => ( a < b ? undefined : FAIL ),
    },
    LLE: {
        args: [ 'string', 'string' ],
        impl: ( a, b ) => ( a <= b ? undefined : FAIL ),
    },
    LEQ: {
        args: [ 'string', 'string' ],
        impl: ( a, b ) => ( a === b ? undefined : FAIL ),
    },
    LNE: {
        args: [ 'string', 'string' ],
        impl: ( a, b ) => ( a !== b ? undefined : FAIL ),
    },
    LGT: {
        args: [ 'string', 'string' ],
        impl: ( a, b ) => ( a > b ? undefined : FAIL ),
    },
    LGE: {
        args: [ 'string', 'string' ],
        impl: ( a, b ) => ( a >= b ? undefined : FAIL ),
    },
};

// Parse a prototype-form key, the external-function prototype LOAD uses.
// Grammar:  NAME(TYPE, ...)RESULT
//   types  in { INTEGER, REAL, STRING }
//   RESULT is one of those names, or omitted for a function with no result.
// Type names are case-insensitive. Whitespace around any token is optional.
const PROTOTYPE = /^(\w+)\s*\(([\w,\s]*)\)\s*(\w*)\s*$/;
const TYPES = [ 'integer', 'real', 'string' ];

export function parsePrototype( key, impl ) {
    const fail = ( reason ) => {
        throw new SyntaxError( `Invalid prototype "${key}": ${reason}` );
    };

    const match = PROTOTYPE.exec( key );
    if ( !match ) fail( 'expected NAME(TYPE, ...)RESULT' );

    const [ , name, argSource, resultName ] = match;
    const argNames = argSource.trim()
        ? argSource.split( ',' ).map( ( t ) => t.trim() )
        : [];

    const args = argNames.map( ( t ) => {
        const kind = t.toLowerCase();
        if ( !TYPES.includes( kind ) ) fail( `unknown arg type "${t}"` );
        return kind;
    } );

    const entry = { args, impl };
    if ( resultName ) {
        const result = resultName.toLowerCase();
        if ( !TYPES.includes( result ) ) {
            fail( `unknown result type "${resultName}"` );
        }
        entry.result = result;
    }

    return [ name, entry ];
}

// The inverse of parsePrototype: a descriptor's prototype string for LOAD.
export function formatPrototype( name, { args, result } ) {
    const argTypes = args.map( ( k ) => k.toUpperCase() ).join( ',' );
    const resultType = result ? result.toUpperCase() : '';
    return `${name}(${argTypes})${resultType}`;
}

// An inline LOAD library is JavaScript source for a function expression.
// Evaluate it with FAIL in scope so the implementation can signal failure
// with it.
export function compileExtension( name, source, args, result ) {
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

    return result ? { args, result, impl } : { args, impl };
}
