"use strict";

var SNOBOL = require( './base' ),
    fs = require( 'fs' );

SNOBOL.File = function ( vm, unitNum, role ) {
    var key;

    role = role || 'source';
    key = role + ':' + unitNum;

    if ( vm.units[ key ] !== undefined ) {
        return vm.units[ key ];
    } else {
        this.vm = vm;
        this.unitNum = unitNum;
        this.role = role;
        this.path = role === 'input' ?
            SNOBOL.options.input :
            SNOBOL.options.file;
        this.pos = 0;
        this.fd = null;
        this.buf = null;
        this.vm.units[ key ] = this;
    }
};

SNOBOL.File.prototype.close = function () {
    this.pos = 0;
};

SNOBOL.File.prototype.seek = function ( pos ) {
    this.pos = pos;
};

SNOBOL.File.prototype.read = function ( length ) {
    var end, record, next, str;

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
        return '';
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

    record = this.buf.slice( this.pos, end );
    this.pos = next;

    str = record.toString( 'utf-8' );
    if ( str.length > length ) {
        return str.slice( 0, length );
    }

    return SNOBOL.str.pad( str, length, 'left' );
};

SNOBOL.File.prototype.write = function ( a /* ... */ ) {
    console.log( a );
    // console.log( 'File.write() called: %s', JSON.stringify( arguments ) );
};
