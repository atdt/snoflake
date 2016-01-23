var SNOBOL = require( './base' );

var DATA_MACROS = [ 'EQU', 'LHERE', 'ARRAY', 'BUFFER', 'DESCR', 'FORMAT', 'SPEC', 'STRING' ];

SNOBOL.D = 3;

SNOBOL.VM.prototype.exec = function ( label, opCode, deferred ) {
    this.recent = [];

    var currentInstruction = this.instructionPointer,
        args = deferred.call( this ),
        returnValue;
        // returnValue = SNOBOL.sil[ opCode ].apply( this, args );

    if ( SNOBOL.DEBUG && DATA_MACROS.indexOf( opCode ) === -1 ) {
        var symbols = {};
        var that=this;
        this.recent.forEach( function ( sym ) {
            symbols[sym] = that.resolve( sym );
        } );
        var prettyOpCode = '\x1b[36m' + opCode + '\x1b[0m';
        var prettyLabel = SNOBOL.str.pad( label || '', 6, 'left' );
        var prettyCur = SNOBOL.str.pad( currentInstruction.toString(), 4 );
        this.log( '[%s] [%s] %s(%s)', prettyCur, prettyLabel, prettyOpCode, JSON.stringify( symbols, null, 2 ).slice( 1, -1 ).replace( /"/g, '' ) );
    }

    try {
        returnValue = SNOBOL.sil[ opCode ].apply( this, args );
    } catch ( e ) {
        // console.log( JSON.stringify( this.symbols ) );
        throw e;
    }

    if ( typeof returnValue === 'number' && returnValue < 0 ) {
        return returnValue++;
    }

    if ( label !== null ) {
        if ( returnValue !== undefined ) {
            this.assign( label, returnValue );
        } else {
            this.assign( label, currentInstruction );
        }
    }
};


SNOBOL.VM.prototype.jmp = function ( loc ) {
    // `loc` will be undefined when a procedure takes an optional
    // location argument which the caller ommitted. In such cases
    // execution should fall through to the next instruction.
    if ( loc !== undefined && loc !== null ) {
        this.instructionPointer = this.resolve( loc );
    }
};

SNOBOL.VM.prototype.run = function ( program ) {
    var args, status, loc, stmt;

    for ( var i = 0; i < program.length; i++ ) {
        if ( program[ i ][ 0 ] !== null ) {
            this.assign( program[ i ][ 0 ], i );
        }
    }

    for (
        this.instructionPointer = 0;
        this.instructionPointer < program.length;
        this.instructionPointer++
    ) {
        stmt = program[ this.instructionPointer ];
        if ( DATA_MACROS.indexOf( stmt[ 1 ] ) !== -1 ) {
            this.exec.apply( this, stmt );
        }
    }

    this.instructionPointer = 0;

    while ( this.instructionPointer < program.length ) {
        loc = this.instructionPointer;
        args = program[ loc ];
        status = this.exec.apply( this, args );
        if ( status !== undefined ) {
            console.log( '### TERMINATED (%s) ###', status );
            return status;
        }

        // If the procedure did not update the instruction pointer,
        // fall through to the next instruction.
        if ( this.instructionPointer === loc ) {
            this.instructionPointer++;
        }
    }
};

SNOBOL.VM.prototype.d = function ( ptr ) {
    return ptr instanceof SNOBOL.Descriptor
        ? ptr
        : new SNOBOL.Descriptor( this, ptr );
};

SNOBOL.VM.prototype.s = function ( ptr ) {
    return ptr instanceof SNOBOL.Specifier
        ? ptr
        : new SNOBOL.Specifier( this, ptr );
};

SNOBOL.VM.prototype.log = function ( msg ) {
    if ( !SNOBOL.DEBUG ) return;
    var whitespace = Array( this.indent + 1 ).join( '  ' ),
        args = Array.prototype.slice.call( arguments, 1 );
    args.unshift( whitespace + msg );
    console.log.apply( console.log, args );
};
