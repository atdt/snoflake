"use strict";

import SNOBOL from './base.js';
import fs from 'node:fs';

SNOBOL.File = class File {
    constructor( vm, unitNum, role = 'source' ) {
        const key = role + ':' + unitNum;

        if ( vm.units[ key ] !== undefined ) {
            return vm.units[ key ];
        }

        this.vm = vm;
        this.unitNum = unitNum;
        this.role = role;
        this.path = role === 'input' ?
            SNOBOL.options.input :
            SNOBOL.options.file;
        this.pos = 0;
        this.fd = null;
        this.buf = null;
        vm.units[ key ] = this;
    }

    close() {
        this.pos = 0;
    }

    seek( pos ) {
        this.pos = pos;
    }

    readRecord( length ) {
        let end, next;

        if ( this.buf === null ) {
            if ( !this.path && this.role === 'input' ) {
                this.buf = Buffer.alloc( 0 );
            } else if ( this.path ) {
                this.buf = fs.readFileSync( this.path );
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

        const str = record.toString( 'utf-8' );
        if ( str.length > length ) {
            return { eof: false, text: str.slice( 0, length ) };
        }

        if ( this.role === 'input' ) {
            return { eof: false, text: str };
        }

        return { eof: false, text: SNOBOL.str.pad( str, length, 'left' ) };
    }

    read( length ) {
        return this.readRecord( length ).text;
    }

    write( a /* ... */ ) {
        console.log( a );
    }
};
