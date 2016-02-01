"use strict";

var SNOBOL = require( './base' ),
    assert = require( 'assert' );

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
            SNOBOL.str.pad( '' + this.ip, 4 ),
            SNOBOL.str.pad( label || '', 6 ),
            macro,
            getArgs( argsCallback )
        );
    }

    var currentInstruction = this.ip,
        args = argsCallback.call( this ),
        returnValue = SNOBOL.sil[ macro ].apply( this, args );

    ( SNOBOL.options.watch || [] ).forEach( function ( variable ) {
        var value = this.mem[ this.symbols[ variable ] ];
        var ref = ' ';
        if ( value !== undefined ) {
            if ( /PTR$/.test( variable ) ) {
                value = this.d( value ).addr;
                ref = '*';
            }
            if ( /SP/.test( variable ) ) {
                value = ref + this.s( value ).toString()
            } else {
                value = ref + this.d( value ).toString()
            }

            console.log(
                '→ %s: %s',
                SNOBOL.str.pad( variable, 6, 'left' ),
                value
            );
        }
    }, this );

    if ( typeof returnValue === 'boolean' ) {
        process.exit( returnValue );
    }

    if ( label !== null ) {
        assert( this.symbols[ label ] !== undefined );
        if ( returnValue === undefined ) {
            returnValue = currentInstruction;
        }
        var ptr = this.symbols[ label ];
        this.mem[ ptr ] = returnValue;
    }
};


SNOBOL.VM.prototype.jmp = function ( loc ) {
    // `loc` will be undefined when a procedure takes an optional
    // location argument which the caller ommitted. In such cases
    // execution should fall through to the next instruction.
    if ( typeof loc === 'number' ) {
        this.ip = loc;
    }
};

SNOBOL.VM.prototype.run = function ( program ) {
    var args, status, loc, stmt, label;

    var sym;
    var i;

    for ( sym in SNOBOL.programSymbols ) {
        this.define( sym, SNOBOL.programSymbols[sym] );
    }

    for ( i = 0; i < program.length; i++ ) {
        sym = program[ i ][ 0 ];
        if ( sym !== null ) {
            this.define( sym, i );
        }
    }

    for (
        this.ip = 0;
        this.ip < program.length;
        this.ip++
    ) {
        stmt = program[ this.ip ];
        if ( DATA_ASSEMBLY_MACROS.indexOf( stmt[ 1 ] ) !== -1 ) {
            this.exec.apply( this, stmt );
        }
    }

    this.ip = 0;

    while ( this.ip >= 0 && this.ip < program.length ) {
        loc = this.ip;
        args = program[ loc ];
        status = this.exec.apply( this, args );

        // If the procedure did not update the instruction pointer,
        // fall through to the next instruction.
        if ( this.ip === loc ) {
            this.ip++;
        }
    }

    return !( this.ip < 0 );
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
