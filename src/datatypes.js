// Core SIL data types: descriptors and specifiers, plus predicates for the
// value domains of descriptor fields.

import { decodeString } from './string.js';

// SIL descriptors are three words.
export const D = 3;

// Integers are exact only up to +/-(2^53 - 1) in a Float64 cell, so that
// bound is the word's integer range.
export function isUint( value ) {
    return Number.isSafeInteger( value ) && value >= 0;
}

export function isInt( value ) {
    return Number.isSafeInteger( value );
}

export function isReal( value ) {
    return Number.isFinite( value );
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
// In this port each field is one 64-bit cell of the VM's backing buffer,
// a Float64 holding the field's value as a number. Reals are host
// doubles, and integers are exact up to +/-(2^53 - 1).
export class Descriptor {
    // A descriptor is a typed view over `width` cells at `ptr`. It does
    // not own that storage: callers allocate it (`vm.alloc`) or resolve
    // it (`vm.$`) and hand the pointer in. See `vm.d`/`vm.s`.
    constructor( vm, ptr ) {
        this.vm = vm;
        this.ptr = ptr;
    }

    get width() {
        return D;
    }

    get addr() {
        return this.vm.mem[this.ptr];
    }

    set addr( n ) {
        this.vm.setInt( this.ptr, n );
    }

    get raddr() {
        return this.vm.mem[this.ptr];
    }

    set raddr( n ) {
        this.vm.setReal( this.ptr, n );
    }

    get flags() {
        return this.vm.mem[this.ptr + 1];
    }

    set flags( n ) {
        this.vm.setUint( this.ptr + 1, n );
    }

    get value() {
        return this.vm.mem[this.ptr + 2];
    }

    set value( n ) {
        this.vm.setUint( this.ptr + 2, n );
    }

    set( addr = 0, flags = 0, value = 0 ) {
        this.addr = addr;
        this.flags = flags;
        this.value = value;
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
        return this.vm.mem[this.ptr + 3];
    }

    set offset( n ) {
        this.vm.setUint( this.ptr + 3, n );
    }

    get length() {
        return this.vm.mem[this.ptr + 5];
    }

    set length( n ) {
        this.vm.setUint( this.ptr + 5, n );
    }

    // The named string occupies the half-open range [start, end).
    get start() {
        return this.addr + this.offset;
    }

    get end() {
        return this.addr + this.offset + this.length;
    }

    get specified() {
        return decodeString( this.vm.mem, this.start, this.length );
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
