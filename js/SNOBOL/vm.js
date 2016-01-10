var SNOBOL = require( './base' );

SNOBOL.D = 3;
SNOBOL.$OSTACK = 0 * SNOBOL.D;  // ptr to OSTACK descriptor
SNOBOL.$CSTACK = 1 * SNOBOL.D;  // ptr to CSTACK descriptor
SNOBOL.STACK   = 2 * SNOBOL.D;  // pos of first slot in stack

SNOBOL.VM.prototype.exec = function ( label, opCode, deferred ) {
    var currentInstruction = this.instructionPointer,
        args = deferred.call(),
        returnValue = SNOBOL.sil[ opCode ].apply( this, args );

    console.log( '[%s] [%s] %s(%s)', currentInstruction, label || '-', opCode, JSON.stringify( args ).slice( 1, -1 ) );

    if ( returnValue < 0 ) {
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

SNOBOL.VM.prototype.jmp = function ( ptr ) {
    if ( ptr !== undefined ) {
        this.instructionPointer = this.resolve( ptr ) - 1;
    }
};

SNOBOL.VM.prototype.run = function ( program ) {
    var args, status;

    for ( var i = 0; i < program.length; i++ ) {
        if ( program[ i ][ 0 ] !== null ) {
            this.assign( program[ i ][ 0 ], i );
        }
    }

    this.instructionPointer = 0;

    while ( this.instructionPointer !== program.length ) {
        args = program[ this.instructionPointer ];
        status = this.exec.apply( this, args );
        if ( status !== undefined ) {
            console.log( '### TERMINATED (%s) ###', status );
            return status;
        }
        this.instructionPointer++;
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
