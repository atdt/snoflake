// JS-implemented CSNOBOL4 primitive functions.
//
// The VM merges this registry with any extensions a host passes through
// `new VM({ extensions: ... })`.
//
// Signature:
//   args   -- per-arg kind: 'int', 'real', or 'string'. LNKFNC coerces
//             the ARGVAL-evaluated descriptors before LINK runs.
//   result -- 'int', 'real', or 'string'. LINK wraps the return value in
//             the appropriate descriptor type.
//   impl   -- the JS function, called with coerced native values. Return
//             `undefined` to signal SNOBOL FAIL.
export const extensions = {
    // CHAR(N): the one-byte string whose code is N.
    CHAR: {
        args:   [ 'int' ],
        result: 'string',
        impl:   ( n ) => String.fromCharCode( n ),
    },

    // ORD(S): the code of the first byte of S.
    ORD: {
        args:   [ 'string' ],
        result: 'int',
        impl:   ( s ) => s.charCodeAt( 0 ),
    },
};
