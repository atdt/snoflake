"use strict";

var SNOBOL = require( './base' ),
    fs = require( 'fs' );

SNOBOL.File = function ( vm, unitNum ) {
    if ( vm.units[unitNum] !== undefined ) {
        return vm.units[ unitNum ];
    } else {
        this.vm = vm;
        this.unitNum = unitNum;
        this.pos = 0;
        this.fd = null;
        this.buf = null;
        this.vm.units[ unitNum ] = this;
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
        this.buf = fs.readFileSync( SNOBOL.options.file );
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
