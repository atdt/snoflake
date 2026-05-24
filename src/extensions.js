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

// Recursive-descent parser for signature-form keys.
// Grammar:  NAME :: ( type, ... ) => result
class SignatureParser {
    static ARGS = [ 'int', 'real', 'string' ];
    static RESULTS = [ ...SignatureParser.ARGS, 'void' ];

    constructor( input ) {
        this.input = input;
        this.tokens = input.match( /::|=>|\w+|[(),]/g ) || [];
        this.offset = 0;
    }

    at() { return this.tokens[ this.offset ]; }

    eat( want ) {
        const token = this.tokens[ this.offset++ ];
        if ( !want.includes( token ) ) {
            throw new SyntaxError(
                `Invalid signature "${ this.input }" near "${ token ?? 'end' }"`
            );
        }
        return token;
    }

    parse( impl ) {
        const name = this.tokens[ this.offset++ ];
        this.eat( '::' );
        this.eat( '(' );
        const args = [];
        while ( this.at() !== ')' ) {
            if ( args.length ) this.eat( ',' );
            args.push( this.eat( SignatureParser.ARGS ) );
        }
        this.eat( ')' );
        this.eat( '=>' );
        const result = this.eat( SignatureParser.RESULTS );
        if ( this.at() !== undefined ) {
            throw new SyntaxError(
                `Invalid signature "${ this.input }" near "${ this.at() }"`
            );
        }
        return [ name, { args, result, impl } ];
    }
}

export function parseSignature( key, impl ) {
    return new SignatureParser( key ).parse( impl );
}
