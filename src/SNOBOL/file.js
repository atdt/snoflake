"use strict";

import { str } from './string.js';

const textDecoder = new TextDecoder( 'utf-8' );

function emptyBytes() {
    return new Uint8Array( 0 );
}

function sourceBytes( content ) {
    if ( typeof content === 'string' ) {
        return new TextEncoder().encode( content );
    }

    if ( content instanceof Uint8Array ) {
        return content;
    }

    throw new TypeError( 'Loader must return a string or Uint8Array' );
}

function decodeBytes( bytes ) {
    return textDecoder.decode( bytes );
}

export class File {
    constructor( vm, unitNum, role = 'source' ) {
        const key = role + ':' + unitNum;

        if ( vm.units[ key ] !== undefined ) {
            return vm.units[ key ];
        }

        this.vm = vm;
        this.unitNum = unitNum;
        this.role = role;
        this.path = role === 'input' ?
            vm.options.input :
            vm.options.file;
        this.pos = 0;
        this.fd = null;
        this.buf = null;
        vm.units[ key ] = this;
    }

    close() {
        if ( this.buf === null ) {
            this.buf = emptyBytes();
        }
        this.pos = this.buf.length;
    }

    seek( pos ) {
        this.pos = pos;
    }

    readRecord( length ) {
        let end, next;

        if ( this.buf === null ) {
            if ( !this.path && this.role === 'input' ) {
                this.buf = emptyBytes();
            } else if ( this.path ) {
                this.buf = sourceBytes( this.vm.loader.load( this.path ) );
            } else {
                throw new Error( 'No source file configured' );
            }
        }

        if ( this.pos >= this.buf.length ) {
            return { eof: true, text: '' };
        }

        end = this.buf.indexOf( 10, this.pos );
        if ( end === -1 ) {
            end = this.buf.length;
            next = end;
        } else {
            next = end + 1;
        }

        if ( end > this.pos && this.buf[ end - 1 ] === 13 ) {
            end--;
        }

        const record = this.buf.slice( this.pos, end );
        this.pos = next;

        const text = decodeBytes( record );
        if ( text.length > length ) {
            return { eof: false, text: text.slice( 0, length ) };
        }

        if ( this.role === 'input' ) {
            return { eof: false, text };
        }

        return { eof: false, text: str.pad( text, length, 'left' ) };
    }

    read( length ) {
        return this.readRecord( length ).text;
    }

    write( a /* ... */ ) {
        this.vm.stdout.write( a );
    }
}
