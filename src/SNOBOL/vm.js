"use strict";

import SNOBOL from './base.js';

const IMAGE_MEMORY = Symbol( 'SNOBOL.image.memory' );

function getArgs( f ) {
    if ( typeof f === 'function' ) {
        return f
            .toString()
            .replace( /([\s\S]+return \[|\];[\s\S]+)/g, '' )
            .replace( /(vm\.\$\("|"\))/g, '' );
    }
    return JSON.stringify( f );
}

function execArgs( vm, args ) {
    return typeof args === 'function' ? args.call( vm ) : args;
}

SNOBOL.D = 3;

SNOBOL.VM.prototype.exec = function ( label, macro, argsCallback, comment, implementation ) {

    if ( this.debug ) {
        comment = comment ? '// ' + comment : '';
        const code = ( macro + '(' + getArgs( argsCallback ) + ')' ).padEnd( 70, ' ' );
        console.log( '[%s] [%s] %s %s',
            SNOBOL.str.pad( '' + this.instructionPointer, 4 ),
            SNOBOL.str.pad( label || '', 6 ),
            code,
            comment
        );
    }

    const args = execArgs( this, argsCallback );

    this.currentLabel = label;
    const macroImplementation = implementation === undefined
        ? SNOBOL.sil[ macro ]
        : implementation;
    const returnValue = macroImplementation.call( this, ...args );

    const watch = this.options.watch;
    if ( watch && watch.length > 0 ) {
        watch.forEach( function ( variable ) {
            let value;

            if ( variable === 'CSTACK' || variable === 'OSTACK' ) {
                value = this[ variable ].addr;
            } else {
                value = Object.hasOwn( this.symbols, variable ) ? this.symbols[ variable ] : 'UNDEF';
            }
            console.log(
                '→ %s: %s',
                SNOBOL.str.pad( variable, 6, 'left' ),
                value
            );
        }, this );
    }

    if ( typeof returnValue === 'boolean' ) {
        // Normalize boolean to exit code and do not terminate the process abruptly
        this.exitCode = returnValue ? 0 : 1;
        return returnValue;
    }

    return returnValue;
};


SNOBOL.VM.prototype.log = function ( ...args ) {
    if ( this.debug ) {
        console.log( ...args );
    }
};

SNOBOL.VM.prototype.jmp = function ( loc ) {
    // Omitted optional branch operands arrive as undefined. SIL specifies
    // fall-through in that case.
    //
    // A few hand-written macro helpers still branch to fixed system labels
    // by name. Translated SIL operands are already resolved.
    if ( typeof loc === 'string' ) {
        loc = this.resolve( loc );
    }
    if ( typeof loc === 'number' ) {
        this.instructionPointer = loc;
        this.instructionPointerChanged = true;
    }
};

// Host options override a few assembled SIL switches after data initialization.
// This keeps the historical SIL constants intact while giving the JS host
// control over banner, listing, and statistics output.
function applyHostOutputOptions( vm ) {
    if ( Object.hasOwn( vm.symbols, 'LISTCL' ) ) {
        vm.d( 'LISTCL' ).addr = vm.options.listing ? 1 : 0;
    }
    if ( Object.hasOwn( vm.symbols, 'BANRCL' ) ) {
        vm.d( 'BANRCL' ).addr = vm.options.banner ? 1 : 0;
    }
    if ( Object.hasOwn( vm.symbols, 'STATCL' ) ) {
        vm.d( 'STATCL' ).addr = vm.options.statistics ? 1 : 0;
    }
}

// Branching macros update instructionPointer themselves. Everything else
// falls through to the next compact instruction.
function interpret( vm, instructions ) {
    while ( vm.instructionPointer >= 0 && vm.instructionPointer < instructions.length ) {
        const loc = vm.instructionPointer;
        vm.instructionPointerChanged = false;
        vm.exec( ...instructions[ loc ] );
        if ( !vm.instructionPointerChanged && vm.instructionPointer === loc ) {
            vm.instructionPointer++;
        }
    }
}

function isImage( program ) {
    return program && Array.isArray( program.instructions );
}

function bindInstruction( instruction ) {
    return instruction.concat( SNOBOL.sil[ instruction[ 1 ] ] );
}

function imageMemory( image ) {
    if ( image[ IMAGE_MEMORY ] !== undefined ) {
        return image[ IMAGE_MEMORY ];
    }
    if ( !Array.isArray( image.memInit ) ) {
        throw new Error( 'Malformed SNOBOL image' );
    }

    const memory = new Uint32Array( image.memPtr );
    for ( const [ ptr, value ] of image.memInit ) {
        memory[ ptr ] = value;
    }

    image[ IMAGE_MEMORY ] = memory;
    return memory;
}

SNOBOL.VM.prototype.seedHostSymbols = function () {
    for ( const sym in SNOBOL.programSymbols ) {
        if ( !Object.hasOwn( this.symbols, sym ) ) {
            this.define( sym, SNOBOL.programSymbols[ sym ] );
        }
    }
    SNOBOL.tableNames.forEach( ( table, idx ) => {
        if ( !Object.hasOwn( this.symbols, table ) ) {
            this.define( table, idx );
        }
    } );
};

SNOBOL.VM.prototype.loadImage = function ( image ) {
    const memory = imageMemory( image );
    this.symbols = { ...image.symbols };
    this.memPtr = image.memPtr;
    if ( memory.length > this.mem.length ) {
        this.grow( memory.length );
    }
    this.mem.set( memory, 0 );

    // The image is sparse on disk; each imported image caches one dense memory
    // template. Instruction binding still happens on the per-VM stream.
    return image.instructions.map( bindInstruction );
};

SNOBOL.VM.prototype.run = function ( program = SNOBOL.image ) {
    let instructions;

    if ( isImage( program ) ) {
        this.reset();
        instructions = this.loadImage( program );
    } else {
        instructions = SNOBOL.assemble( this, program ).instructions.map( bindInstruction );
    }

    this.instructionPointer = 0;
    this.instructionPointerChanged = false;
    applyHostOutputOptions( this );
    interpret( this, instructions );

    return !( this.instructionPointer < 0 );
};

// Stack pointer pseudo-descriptor: lets `vm.d('CSTACK')` and `vm.d('OSTACK')`
// be used wherever a Descriptor is expected, while delegating addr reads/writes
// to the live stack object. Other slots are inert.
class RegisterDescriptor {
    constructor( vm, name ) {
        this.name = name;
        this.width = 3;
        this._target = name === 'CSTACK' ? vm.CSTACK : vm.OSTACK;
    }

    get addr()     { return this._target.addr; }
    set addr( v )  { this._target.addr = v; }
    get flags()    { return 0; }
    set flags( v ) { /* ignore */ }
    get value()    { return 0; }
    set value( v ) { /* ignore */ }

    toString() {
        return '<' + this.name + ' A=' + this._target.addr + '>';
    }
}

SNOBOL.VM.prototype.d = function ( ptr ) {
    if ( ptr instanceof SNOBOL.Descriptor ) {
        return ptr;
    }
    if ( ptr === 'CSTACK' ) {
        return this.CSTACK_DESCRIPTOR;
    }
    if ( ptr === 'OSTACK' ) {
        return this.OSTACK_DESCRIPTOR;
    }
    return new SNOBOL.Descriptor( this, ptr );
};

SNOBOL.VM.prototype.s = function ( ptr ) {
    return ptr instanceof SNOBOL.Specifier
        ? ptr
        : new SNOBOL.Specifier( this, ptr );
};

SNOBOL.VM.prototype.reset = function () {
    this.instructionPointer = null;
    this.symbols = {};
    this.resetMemory();
    this.callbacks = [];
    this.units = {};
    this.INTSPC_BUFFER = null;
    // Keep stack pointers as VM registers, not memory-backed descriptors,
    // to avoid accidental overwrites by program macros.
    this.CSTACK = { addr: 0 };
    this.OSTACK = { addr: 0 };
    this.CSTACK_DESCRIPTOR = new RegisterDescriptor( this, 'CSTACK' );
    this.OSTACK_DESCRIPTOR = new RegisterDescriptor( this, 'OSTACK' );
};
