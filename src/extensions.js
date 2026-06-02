// JS-implemented CSNOBOL4 primitive functions.
//
// Each key is a function prototype, 'NAME(TYPES)RESULT', and each value is the
// implementation. Argument and result types are INTEGER, REAL, or STRING.
// RESULT may be omitted for functions that do not return a value.
//
// The implementation can return or throw the FAIL sentinel to signal SNOBOL
// failure. FAIL is available in scope.
//
// Users can supply their own extensions through `new VM({ extensions: ... })`.
// They merge over this registry.
export const FAIL = Symbol( 'FAIL' );

export const extensions = {
    // CHAR(N): the one-byte string whose code is N.
    'CHAR(INTEGER)STRING': ( n ) => String.fromCharCode( n ),

    // ORD(S): the code of the first byte of S. The null string has no first
    // byte, so it fails rather than yielding a non-numeric code.
    'ORD(STRING)INTEGER': ( s ) => ( s.length ? s.charCodeAt( 0 ) : FAIL ),

    // REVERSE(S): S with its characters in reverse order.
    'REVERSE(STRING)STRING': ( s ) => [ ...s ].reverse().join( '' ),

    // SUBSTR(S, POS, LEN): the LEN-long substring of S at one-based POS.
    // LEN zero (or omitted) takes the rest. A position or length that
    // runs outside S fails.
    'SUBSTR(STRING,INTEGER,INTEGER)STRING': ( s, pos, len ) => {
        if ( pos < 1 || pos > s.length ) return FAIL;
        const start = pos - 1;
        const n = len === 0 ? s.length - start : len;
        if ( n < 0 || start + n > s.length ) return FAIL;
        return s.slice( start, start + n );
    },

    // LPAD(S, N, C): S padded on the left to width N with C (default
    // space), or S unchanged when already that wide.
    'LPAD(STRING,INTEGER,STRING)STRING': ( s, n, c ) =>
        s.padStart( n, c ? c[0] : ' ' ),

    // RPAD(S, N, C): LPAD on the right.
    'RPAD(STRING,INTEGER,STRING)STRING': ( s, n, c ) =>
        s.padEnd( n, c ? c[0] : ' ' ),

    // SQRT(X): the square root of X, failing on a negative argument.
    'SQRT(REAL)REAL': ( x ) => ( x < 0 ? FAIL : Math.sqrt( x ) ),

    // EXP(X): e raised to the power X.
    'EXP(REAL)REAL': ( x ) => Math.exp( x ),

    // LOG(X), and its LN alias: the natural logarithm of X.
    'LOG(REAL)REAL': ( x ) => Math.log( x ),
    'LN(REAL)REAL': ( x ) => Math.log( x ),

    // SIN(X), COS(X), TAN(X): the trigonometric functions of X radians.
    'SIN(REAL)REAL': ( x ) => Math.sin( x ),
    'COS(REAL)REAL': ( x ) => Math.cos( x ),
    'TAN(REAL)REAL': ( x ) => Math.tan( x ),

    // ATAN(X): the arc tangent of X, in radians.
    'ATAN(REAL)REAL': ( x ) => Math.atan( x ),

    // CHOP(X): X with its fractional part dropped, toward zero.
    'CHOP(REAL)REAL': ( x ) => Math.trunc( x ),

    // The lexical comparison predicates return the null string when the
    // relation holds and fail otherwise. JS string order matches byte
    // order over SNOBOL's single-byte alphabet.
    'LLT(STRING,STRING)': ( a, b ) => ( a < b ? undefined : FAIL ),
    'LLE(STRING,STRING)': ( a, b ) => ( a <= b ? undefined : FAIL ),
    'LEQ(STRING,STRING)': ( a, b ) => ( a === b ? undefined : FAIL ),
    'LNE(STRING,STRING)': ( a, b ) => ( a !== b ? undefined : FAIL ),
    'LGT(STRING,STRING)': ( a, b ) => ( a > b ? undefined : FAIL ),
    'LGE(STRING,STRING)': ( a, b ) => ( a >= b ? undefined : FAIL ),
};

// Parse a function prototype into a [ name, descriptor ] pair. Whitespace
// around any token is optional.
const PROTOTYPE = /^([a-z][\w.]*)\s*\(([\w,\s]*)\)\s*(\w*)\s*$/i;
const TYPES = [ 'INTEGER', 'REAL', 'STRING' ];

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
        const type = t.toUpperCase();
        if ( !TYPES.includes( type ) ) fail( `unknown arg type "${t}"` );
        return type;
    } );

    const entry = { args, impl };
    if ( resultName ) {
        const result = resultName.toUpperCase();
        if ( !TYPES.includes( result ) ) {
            fail( `unknown result type "${resultName}"` );
        }
        entry.result = result;
    }

    return [ name.toUpperCase(), entry ];
}

// The inverse of parsePrototype: a descriptor's prototype string for LOAD.
export function formatPrototype( name, { args, result } ) {
    return `${name}(${args.join( ',' )})${result ?? ''}`;
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
