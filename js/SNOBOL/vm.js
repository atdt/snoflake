"use strict";

var SNOBOL = require( './base' );

var DATA_ASSEMBLY_MACROS = [
    'ARRAY', 'BUFFER', 'DESCR',
    'EQU',   'FORMAT', 'LHERE',
    'REAL',  'SPEC',   'STRING'
];

function isDataAssemblyMacro( macro ) {
    return DATA_ASSEMBLY_MACROS.indexOf( macro ) !== -1;
}

function getArgs( f ) {
    return f
        .toString()
        .replace( /([\s\S]+return \[|\];[\s\S]+)/g, '' )
        .replace( /(vm\.\$\("|"\))/g, '' );
}

SNOBOL.D = 3;

SNOBOL.VM.prototype.exec = function ( label, macro, argsCallback ) {

    if ( SNOBOL.DEBUG ) {
        console.log( '[%s] [%s] %s(%s)',
            SNOBOL.str.pad( '' + this.instructionPointer, 4 ),
            SNOBOL.str.pad( label || '', 6 ),
            macro,
            getArgs( argsCallback )
        );
    }

    var currentInstruction = this.instructionPointer,
        args = argsCallback.call( this ),
        returnValue = SNOBOL.sil[ macro ].apply( this, args );

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
    if ( typeof loc === 'number' ) {
        this.instructionPointer = loc;
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
        if ( DATA_ASSEMBLY_MACROS.indexOf( stmt[ 1 ] ) !== -1 ) {
            this.exec.apply( this, stmt );
        }
    }

    this.instructionPointer = 0;

    while ( this.instructionPointer >= 0 && this.instructionPointer < program.length ) {
        loc = this.instructionPointer;
        args = program[ loc ];
        status = this.exec.apply( this, args );

        // If the procedure did not update the instruction pointer,
        // fall through to the next instruction.
        if ( this.instructionPointer === loc ) {
            this.instructionPointer++;
        }
    }

    return !( this.instructionPointer < 0 );
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
