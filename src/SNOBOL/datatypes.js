"use strict";

import { str } from './string.js';

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
    get width()     { return 3; }
    get rawLength() { return 3; }

    get addr()    { return this.vm.getInt( this.ptr + 0 ); }
    set addr( n ) { this.vm.setInt( this.ptr + 0, n ); }

    get raddr()    { return this.vm.getReal( this.ptr + 0 ); }
    set raddr( n ) { this.vm.setReal( this.ptr + 0, n ); }

    get flags()    { return this.vm.getUint( this.ptr + 1 ); }
    set flags( n ) { this.vm.setUint( this.ptr + 1, n ); }

    get value()    { return this.vm.getUint( this.ptr + 2 ); }
    set value( n ) { this.vm.setUint( this.ptr + 2, n ); }

    update( addr = 0, flags = 0, value = 0 ) {
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

    // Copy another instance's storage over our own. copyWithin handles
    // overlap correctly per the typed-array spec.
    read( src ) {
        this.vm.mem.copyWithin( this.ptr, src.ptr, src.ptr + this.width );
    }

    raw() {
        return Array.from( this.vm.mem.subarray( this.ptr, this.ptr + this.rawLength ) );
    }

    toString() {
        const fields = [];
        const props = {
            A: this.addr,
            F: this.flags,
            V: this.value
        };
        if ( this.width === 6 ) {
            props.O = this.offset;
            props.L = this.length;
        }

        [ 'A', 'F', 'V', 'O', 'L' ].forEach( function ( k ) {
            if ( k in props ) {
                fields.push( k + '=' + props[k] );
            }
        } );

        return [
            '<', this.name, '@', this.ptr, ' ',
                fields.join( ', ' ), '>'
        ].join( '' );
    }
}

export class Specifier extends Descriptor {
    get name()      { return 'Specifier'; }
    get width()     { return 6; }
    get rawLength() { return 5; }

    get offset()    { return this.vm.getUint( this.ptr + 3 ); }
    set offset( n ) { this.vm.setUint( this.ptr + 3, n ); }

    get length()    { return this.vm.getUint( this.ptr + 4 ); }
    set length( n ) { this.vm.setUint( this.ptr + 4, n ); }

    get specified() {
        const start = this.addr + this.offset,
              end = start + this.length;

        return str.decode( this.vm.mem.slice( start, end ) );
    }

    update( addr = 0, flags = 0, value = 0, offset = 0, length = 0 ) {
        super.update( addr, flags, value );
        this.offset = offset;
        this.length = length;
        return this;
    }
}

