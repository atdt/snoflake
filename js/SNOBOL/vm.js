var SNOBOL = require( './base' );

SNOBOL.VM.prototype.exec = function ( label, opCode, deferred ) {
    var currentInstruction = this.instructionPointer,
        args = deferred.call(),
        returnValue = SNOBOL.sil[ opCode ].apply( this, args );

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
    var args;

    for ( var i = 0; i < program.length; i++ ) {
        if ( program[ i ][ 0 ] !== null ) {
            console.log( program[ i ][ 0 ] );
            this.assign( program[ i ][ 0 ], i );
        }
    }

    this.instructionPointer = 0;

    while ( this.instructionPointer !== program.length ) {
        args = program[ this.instructionPointer ];
        this.exec.apply( this, args );
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
