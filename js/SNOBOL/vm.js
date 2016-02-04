"use strict";

var SNOBOL = require( './base' ),
    assert = require( 'assert' );

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

SNOBOL.ExitSignal = function ( code ) {
    this.code = code;
};

SNOBOL.ExitSignal.prototype.toString = function () {
    return 'SNOBOL.ExitSignal(' + this.code + ')';
};


SNOBOL.VM.prototype.jmp = function ( loc ) {
    // `loc` will be undefined when a procedure takes an optional
    // location argument which the caller ommitted. In such cases
    // execution should fall through to the next instruction.
    if ( typeof loc === 'string' ) {
        loc = this.$( loc );
    }
    if ( typeof loc === 'number' ) {
        this.ip = this.locations[ loc ];
    }
};

SNOBOL.VM.prototype.run = function ( program ) {
    var symbol, tbd, loc, statement, label, macro, argsCb, N, val, args, ptr;

    this.program = program;

    Object.keys( SNOBOL.programSymbols ).forEach( function ( symbol ) {
        this.symbols[ symbol ] = SNOBOL.programSymbols[ symbol ];
    }, this );

    var enc;
    for ( this.ip = 0; this.ip < program.length; this.ip++ ) {
        statement = program[ this.ip ];
        label     = statement[ 0 ];
        macro     = statement[ 1 ];
        argsCb    = statement[ 2 ];

        switch ( macro ) {
        case 'DESCR':
            val = this.d();
            if ( label ) {
                this.symbols[ label ] = val.ptr;
                this.locations[ val.ptr ] = this.ip;
            }
            break;
        case 'SPEC':
            val = this.s();
            if ( label ) {
                this.symbols[ label ] = val.ptr;
                this.locations[ val.ptr ] = this.ip;
            }
            break;
        case 'FORMAT':
        case 'STRING':
            val = this.s();
            enc = SNOBOL.str.encode( argsCb.call( this ).pop() );
            val.addr = this.mem.length;
            val.length = enc.length;
            this.mem.push.apply( this.mem, enc );
            if ( label ) {
                this.symbols[ label ] = val.ptr;
                this.locations[ val.ptr ] = this.ip;
            }
            break;
        case 'ARRAY'  :
            N = argsCb.call( this ).pop();
            val = this.alloc( N );
            if ( label ) {
                this.symbols[ label ] = val;
                this.locations[ val ] = this.ip;
            }
            break;
        case 'BUFFER' :
            N = argsCb.call( this ).pop();
            val = SNOBOL.str.encode( SNOBOL.str.repeat( ' ', N ) );
            if ( label ) {
              this.symbols[ label ] = this.mem.length;
              this.locations[ this.mem.length ] = label;
            }
            this.mem.push.apply( this.mem, val );
            break;
        case 'LHERE':
            val = this.mem.length;
            this.mem.push( this.ip + 1 );
            this.locations[ val ] = this.ip + 1;
            this.symbols[ label ] = val;
        case 'PROC':
        default:
            if ( label && macro !== 'EQU' ) {
                val = this.mem.length;
                this.mem.push( this.ip );
                this.locations[ val ] = this.ip;
                this.symbols[ label ] = val;
            }
        }
    }
    console.log('ok1');

    for ( this.ip = 0; this.ip < program.length; this.ip++ ) {
        statement = program[ this.ip ];
        label     = statement[ 0 ];
        macro     = statement[ 1 ];
        argsCb    = statement[ 2 ];
        if ( macro === 'EQU' ) {
            this.symbols[ label ] = argsCb.call( this ).pop();
            this.locations[ this.symbols[ label ] ] = this.ip;  // XXX overwriting here?
        }
    }
    console.log('ok2');

    for ( this.ip = 0; this.ip < program.length; this.ip++ ) {
        statement = program[ this.ip ];
        label     = statement[ 0 ];
        macro     = statement[ 1 ];
        argsCb    = statement[ 2 ];
        switch ( macro ) {
        case 'DESCR':
            val = this.d( this.symbols[ label ] );
            val.update.apply( val, argsCb.call( this ) );
            break;
        case 'SPEC':
            val = this.s( this.symbols[ label ] );
            args = argsCb.call( this );
            if ( typeof args[0] === 'string' ) {
                ptr = this.mem.length;
                this.mem = this.mem.concat( SNOBOL.str.encode( args[0] ) );
                args[0] = ptr;
            }
            val.update.apply( val, args );
            break;
        }
    }
    console.log('ok3');

    /*
    for ( this.ip = 0; this.ip < program.length; this.ip++ ) {
        statement = program[ this.ip ];
        label     = statement[ 0 ];
        macro     = statement[ 1 ];
        argsCb    = statement[ 2 ];
        if ( [ 'COPY', 'DESCR', 'SPEC', 'EQU', 'BUFFER', 'ARRAY', 'FORMAT', 'STRING', 'LHERE', 'PROC' ].indexOf( macro ) === -1 ) {
            SNOBOL.sil[ macro ].apply( this, argsCb.call( this ) );
        }
    }
    console.log('ok4');
    */

    this.ip = 0;
    while ( this.ip >= 0 && this.ip < program.length ) {
        loc       = this.ip;
        statement = program[ loc ];
        label     = statement[ 0 ];
        macro     = statement[ 1 ];
        argsCb    = statement[ 2 ];
        if ( [
            'COPY',   'DESCR', 'SPEC', 'EQU',
            'BUFFER', 'ARRAY', 'FORMAT',
            'STRING', 'LHERE', 'PROC'
        ].indexOf( macro ) === -1 ) {
            if ( SNOBOL.DEBUG ) {
                console.log( '[%s] [%s] %s(%s)',
                    SNOBOL.str.pad( '' + this.ip, 4 ),
                    SNOBOL.str.pad( label || '', 6 ),
                    macro,
                    getArgs( argsCb )
                );
            }
            SNOBOL.sil[ macro ].apply( this, argsCb.call( this ) );
        }

        // If the procedure did not update the instruction pointer,
        // fall through to the next instruction.
        if ( this.ip === loc ) {
            this.ip++;
        }
    }
    console.log( 'ip: %s ; program length: %s', this.ip, program.length );
    console.log('ok5');

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
