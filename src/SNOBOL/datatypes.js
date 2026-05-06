"use strict";

import SNOBOL from './base.js';

class Descriptor {
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

    update( ...args ) {
        this.addr = args.length ? args.shift() : 0;
        this.flags = args.length ? args.shift() : 0;
        this.value = args.length ? args.shift() : 0;
        return this;
    }

    // Test two instances for equality
    isEqualTo( other ) {
        if ( this.width !== other.width ) {
            return false;
        }
        for ( let i = 0; i < this.width; i++ ) {
            if ( this.vm.mem[ this.ptr + i ] !== this.vm.mem[ other.ptr + i ] ) {
                return false;
            }
        }
        return true;
    }

    // Read (copy) the content of another instance into self
    read( src ) {
        for ( let i = 0; i < this.width; i++ ) {
            this.vm.mem[ this.ptr + i ] = this.vm.mem[ src.ptr + i ];
        }
    }

    raw() {
        const r = [];
        for ( let i = 0; i < this.rawLength; i++ ) {
            r.push( this.vm.mem[ this.ptr + i ] );
        }
        return r;
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

class Specifier extends Descriptor {
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

        return SNOBOL.str.decode( this.vm.mem.slice( start, end ) );
    }

    update( ...args ) {
        this.addr = args.length ? args.shift() : 0;
        this.flags = args.length ? args.shift() : 0;
        this.value = args.length ? args.shift() : 0;
        this.offset = args.length ? args.shift() : 0;
        this.length = args.length ? args.shift() : 0;
        return this;
    }
}

SNOBOL.Descriptor = Descriptor;
SNOBOL.Specifier = Specifier;
