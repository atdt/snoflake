var SNOBOL = require( './base' );

var DATA_MACROS = [ 'EQU', 'LHERE', 'ARRAY', 'BUFFER', 'DESCR', 'FORMAT', 'SPEC', 'STRING' ];

SNOBOL.D = 3;
SNOBOL.$OSTACK = 0 * SNOBOL.D;  // ptr to OSTACK descriptor
SNOBOL.$CSTACK = 1 * SNOBOL.D;  // ptr to CSTACK descriptor
SNOBOL.STACK   = 2 * SNOBOL.D;  // pos of first slot in stack

SNOBOL.VM.prototype.exec = function ( label, opCode, deferred ) {
    var currentInstruction = this.instructionPointer,
        args = deferred.call( this ),
        returnValue;
        // returnValue = SNOBOL.sil[ opCode ].apply( this, args );

    // console.log( '[%s] [%s] %s(%s)', currentInstruction, label || '-', opCode, JSON.stringify( args ).slice( 1, -1 ) );
    returnValue = SNOBOL.sil[ opCode ].apply( this, args );

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
