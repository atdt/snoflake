// Core SIL data types: descriptors and specifiers, plus predicates for the
// value domains of descriptor fields.

import { str } from './string.js';

// SIL descriptors are three words.
export const D = 3;

// Scratch one-word buffer viewed as uint, int, and float for range checks.
const probeBuf = new ArrayBuffer( 4 ),
      probeF32 = new Float32Array( probeBuf ),
      probeI32 = new Int32Array( probeBuf ),
      probeU32 = new Uint32Array( probeBuf );

// JS-native Float64 results lose precision on the way into a Float32 cell.
// Accept any value that round-trips within delta.
function nearlyEqual( a, b ) {
    return a === b || Math.abs( a - b ) < 0.001;
}

export function isUint32( value ) {
    probeU32[ 0 ] = value;
    return probeU32[ 0 ] === value;
}

export function isInt32( value ) {
    probeI32[ 0 ] = value;
    return probeI32[ 0 ] === value;
}

export function isFloat32( value ) {
    probeF32[ 0 ] = value;
    return nearlyEqual( probeF32[ 0 ], value );
}

export class Descriptor {
    constructor( vm, ptr ) {
        this.vm = vm;

        if ( ptr === undefined ) {
            ptr = vm.alloc( this.width );
        } else if ( typeof ptr === 'string' ) {
            ptr = vm.resolve( ptr );
        }
        this.ptr = ptr;
    }

    get name()      { return 'Descriptor'; }
    get width()     { return D; }

    get addr()    { return this.vm.getInt( this.ptr ); }
    set addr( n ) { this.vm.setInt( this.ptr, n ); }

    get raddr()    { return this.vm.getReal( this.ptr ); }
    set raddr( n ) { this.vm.setReal( this.ptr, n ); }

    get flags()    { return this.vm.getUint( this.ptr + 1 ); }
    set flags( n ) { this.vm.setUint( this.ptr + 1, n ); }

    get value()    { return this.vm.getUint( this.ptr + 2 ); }
    set value( n ) { this.vm.setUint( this.ptr + 2, n ); }

    set( addr = 0, flags = 0, value = 0 ) {
        this.addr = addr;
        this.flags = flags;
        this.value = value;
        return this;
    }

    isEqualTo( other ) {
        if ( this.width !== other.width ) {
            return false;
        }
        const mem = this.vm.mem;
        for ( let i = 0; i < this.width; i++ ) {
            if ( mem[ this.ptr + i ] !== mem[ other.ptr + i ] ) {
                return false;
            }
        }
        return true;
    }

    copyFrom( src ) {
        this.vm.mem.copyWithin( this.ptr, src.ptr, src.ptr + this.width );
    }

    raw() {
        return Array.from(
            this.vm.mem.subarray( this.ptr, this.ptr + this.width ),
        );
    }

    toString() {
        const fields = [];
        const props = {
            A: this.addr,
            F: this.flags,
            V: this.value,
        };
        if ( this.width === 6 ) {
            props.O = this.offset;
            props.L = this.length;
        }

        for ( const k of [ 'A', 'F', 'V', 'O', 'L' ] ) {
            if ( k in props ) {
                fields.push( `${k}=${props[ k ]}` );
            }
        }

        return `<${this.name}@${this.ptr} ${fields.join( ', ' )}>`;
    }
}

export class Specifier extends Descriptor {
    // Griswold §5.1.2 lays a qualifier out as two descriptors. The second
    // descriptor's V field is offset and its T field is length; F is unused.
    get name()      { return 'Specifier'; }
    get width()     { return 2 * D; }

    get offset()    { return this.vm.getUint( this.ptr + 3 ); }
    set offset( n ) { this.vm.setUint( this.ptr + 3, n ); }

    get length()    { return this.vm.getUint( this.ptr + 5 ); }
    set length( n ) { this.vm.setUint( this.ptr + 5, n ); }

    get specified() {
        const start = this.addr + this.offset;

        return str.decode( this.vm.mem, start, this.length );
    }

    set( addr = 0, flags = 0, value = 0, offset = 0, length = 0 ) {
        super.set( addr, flags, value );
        this.offset = offset;
        this.length = length;
        return this;
    }
}
