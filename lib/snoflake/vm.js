var Snoflake = require( './base' );

Snoflake.VM.prototype.exec = function ( label, opCode, deferred ) {
    var currentInstruction = this.instructionPointer,
        args = deferred.call(),
        returnValue = opCode.apply( null, args );

    if ( label !== null ) {
        if ( returnValue !== undefined ) {
            this.assign( label, returnValue );
        } else {
            this.assign( label, currentInstruction );
        }
    }
};

Snoflake.VM.prototype.jmp = function ( ptr ) {
    if ( ptr !== undefined ) {
        this.instructionPointer = this.resolve( ptr ) - 1;
    }
};

Snoflake.VM.prototype.run = function ( program ) {
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
