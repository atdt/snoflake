var SNOBOL = require( './base' );

SNOBOL.VM.prototype.exec = function ( label, opCode, deferred ) {
    var currentInstruction = this.instructionPointer,
        args = deferred.call(),
        returnValue = opCode.apply( this, args );

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
    for ( var i = 0; i < program.length; i++ ) {
        if ( program[ i ][ 0 ] !== null ) {
            this.assign( program[ i ][ 0 ], i );
        }
    }

    this.instructionPointer = 0;

    while ( this.instructionPointer !== program.length ) {
        this.exec.apply( this, program[ this.instructionPointer ] );
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
