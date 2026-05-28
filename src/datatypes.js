// Core SIL data types: descriptors and specifiers, plus predicates for the
// value domains of descriptor fields.

import { decodeString } from './string.js';

// SIL descriptors are three words.
export const D = 3;

export function isUint32( value ) {
    return ( value >>> 0 ) === value;
}

export function isInt32( value ) {
    return ( value | 0 ) === value;
}

export function isFloat32( value ) {
    return Number.isFinite( Math.fround( value ) );
}

// Descriptors are the SNOBOL4 runtime's basic datatype. Every value
// (integer, real, string, pattern, array, ...) lives in a descriptor or
// in a small structure made of them. A descriptor has three fields,
// named A, F, and V:
//
//   +-------+-------+-------+
//   |   A       F       V   |
//   +-----------------------+
//
//   A - address: a pointer into memory, or a signed int for arithmetic.
//   F - flags: packed bits such as the type code and GC marks.
//   V - value: an unsigned datum, often a count or a secondary pointer.
//
// The same three slots also carry the runtime's internal bookkeeping,
// so what any given field holds depends on the macro that consumes it.
//
// In this port each field is one 32-bit cell of the VM's backing buffer,
// readable as int, uint, or real via overlapping typed-array views.
export class Descriptor {
    constructor( vm, ptr ) {
        this.vm = vm;

        if ( ptr === undefined ) {
            ptr = vm.alloc( this.width );
        } else if ( typeof ptr === 'string' ) {
            ptr = vm.$( ptr );
        }
        this.ptr = ptr;
    }

    get width() {
        return D;
    }

    get addr() {
        return this.vm.getInt( this.ptr );
    }

    set addr( n ) {
        this.vm.setInt( this.ptr, n );
    }

    get raddr() {
        return this.vm.getReal( this.ptr );
    }

    set raddr( n ) {
        this.vm.setReal( this.ptr, n );
    }

    get flags() {
        return this.vm.getUint( this.ptr + 1 );
    }

    set flags( n ) {
        this.vm.setUint( this.ptr + 1, n );
    }

    get value() {
        return this.vm.getUint( this.ptr + 2 );
    }

    set value( n ) {
        this.vm.setUint( this.ptr + 2, n );
    }

    set( addr = 0, flags = 0, value = 0 ) {
        this.addr = addr;
        this.flags = flags;
        this.value = value;
    }

    isEqualTo( other ) {
        if ( this.width !== other.width ) {
            return false;
        }
        const mem = this.vm.mem;
        for ( let i = 0; i < this.width; i++ ) {
            if ( mem[this.ptr + i] !== mem[other.ptr + i] ) {
                return false;
            }
        }
        return true;
    }

    copyFrom( src ) {
        this.vm.mem.copyWithin( this.ptr, src.ptr, src.ptr + this.width );
    }

    cells() {
        return Array.from(
            this.vm.mem.subarray( this.ptr, this.ptr + this.width ),
        );
    }

    toString() {
        const fields = [
            `A=${this.addr}`,
            `F=${this.flags}`,
            `V=${this.value}`,
        ];
        return `<Descriptor@${this.ptr} ${fields.join( ', ' )}>`;
    }
}

// A specifier names a string in SNOBOL. It is a pair of descriptors
// that together pick out a range of characters in memory:
//
//   +-------+-------+-------+-------+-------+-------+
//   |   A       F       V   |   O       -       L   |
//   +-----------------------+-----------------------+
//
// The first descriptor is an ordinary A/F/V record whose A field points
// at the string's storage. The second descriptor borrows its A and V
// slots for O (offset) and L (length); its F slot is unused.
//
// The named string starts at A+O and runs for L characters.
export class Specifier extends Descriptor {
    get width() {
        return 2 * D;
    }

    get offset() {
        return this.vm.getUint( this.ptr + 3 );
    }

    set offset( n ) {
        this.vm.setUint( this.ptr + 3, n );
    }

    get length() {
        return this.vm.getUint( this.ptr + 5 );
    }

    set length( n ) {
        this.vm.setUint( this.ptr + 5, n );
    }

    get specified() {
        const start = this.addr + this.offset;
        return decodeString( this.vm.mem, start, this.length );
    }

    set( addr = 0, flags = 0, value = 0, offset = 0, length = 0 ) {
        super.set( addr, flags, value );
        this.offset = offset;
        this.length = length;
        return this;
    }

    toString() {
        const fields = [
            `A=${this.addr}`,
            `F=${this.flags}`,
            `V=${this.value}`,
            `O=${this.offset}`,
            `L=${this.length}`,
        ];
        return `<Specifier@${this.ptr} ${fields.join( ', ' )}>`;
    }
}
