"use strict";

var SNOBOL = require( './base' ),
    fs = require( 'fs' );

SNOBOL.File = function ( vm, unitNum ) {
    this.vm = vm;

    if ( unitNum !== undefined ) {
        return this.vm.units[ unitNum ];
    } else {
        this.unitNum = this.vm.units.length;
        this.pos = 0;
        this.fd = null;
        this.vm.units.push( this );
    }
};

SNOBOL.File.prototype.open = function ( path ) {
    console.log( 'path: %s', path );
    this.fd = fs.openSync( path, 'r+' );
    this.pos = 0;
};

SNOBOL.File.prototype.close = function () {
    if ( this.fd !== null ) {
        fs.closeSync( this.fd );
    }
    this.fd = null;
    this.pos = 0;
};

SNOBOL.File.prototype.seek = function ( pos ) {
    this.pos = pos;
};

SNOBOL.File.prototype.read = function ( position, length ) { 
    // XXX hack
    if ( !this.fd  ) {
        this.open( '/Users/ori/git/snoflake/hello.sno' );
    }
    var buf = new Buffer( length );
    fs.readSync( this.fd, buf, 0, length, position );
    return buf.toString( 'utf8' );
};

SNOBOL.File.prototype.write = function ( /* ... */ ) {
    console.log( 'File.write() called: %s', JSON.stringify( arguments ) );
};
