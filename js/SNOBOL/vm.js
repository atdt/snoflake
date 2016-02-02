"use strict";

var SNOBOL = require( './base' ),
    assert = require( 'assert' );

var DATA_ASSEMBLY_MACROS = [
    'ARRAY', 'BUFFER', 'DESCR',
    'EQU',   'FORMAT', 'REAL',  'SPEC',   'STRING',
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
    var symbol, tbd, loc, statement, label, macro, argsCb;

    this.program = program;

    for ( symbol in SNOBOL.programSymbols ) {
        this.symbols[ symbol ] = SNOBOL.programSymbols[ symbol ];
    }

    tbd = [];
    for ( this.ip = 0; this.ip < program.length; this.ip++ ) {
        statement = program[ this.ip ];
        label     = statement[ 0 ];
        macro     = statement[ 1 ];
        if ( isDataAssemblyMacro( macro ) ) {
            tbd.push( this.ip );
        } else if ( label !== null ) {
            this.symbols[ label ] = this.ip;
        }
    }

    do {
        if ( tbd.length === 4 ) {
            for ( var i = 0; i < tbd.length; i++ ) {
                console.log( this.program[ tbd[i] ].map( function ( x ) { return x.toString() } ) );
            }
            process.exit();
        }
        console.log( tbd.length );
        tbd = tbd.filter( function ( i ) {
            var statement = this.program[ i ],
                label     = statement[ 0 ],
                macro     = statement[ 1 ],
                argsCb    = statement[ 2 ],
                args, rv;

            this.symbols[ label ] = this.mem.length;

            try {
                args = argsCb.call( this );
            } catch ( e ) {
                // We'll need to try again.
                delete this.symbols[ label ];
                return true;
            }
            rv = SNOBOL.sil[ macro ].apply( this, args );
            if ( label !== null ) {
                this.symbols[ label ] = rv;
            }
            return false;
        }, this );
    } while ( tbd.length > 0 );

    this.ip = 0;
    while ( this.ip >= 0 && this.ip < program.length ) {
        loc       = this.ip;
        statement = program[ loc ];
        label     = statement[ 0 ];
        macro     = statement[ 1 ];
        argsCb    = statement[ 2 ];
        if ( !isDataAssemblyMacro( macro ) ) {
            SNOBOL.sil[ macro ].apply( this, argsCb.call( this ) );
        }

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
