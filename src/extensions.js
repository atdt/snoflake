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
