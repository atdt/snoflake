/*jslint passfail: false, indent: 4, undef:true, white:true, plusplus:true, vars:true */
/*globals mem, alloc, assign, resolve, getInt, setInt, getReal, setReal, getUint, setUint */

"use strict";

var Snoflake = require( './base' ),
    fs = require( 'fs' ),
    units = [];

function File( unitNum ) {
    if ( unitNum !== undefined ) {
        return units[ unitNum ];
    } else {
        this.unitNum = units.length;
        this.pos = 0;
        this.fd = null;
        units.push( this );
    }
}

File.prototype.open = function ( path ) {
    this.fd = fs.openSync( this.path, 'r+' );
    this.pos = 0;
};

File.prototype.close = function () {
    if ( this.fd !== null ) {
        fs.closeSync( this.fd );
    }
    this.fd = null;
    this.pos = 0;
};

File.prototype.seek = function ( pos ) {
    this.pos = pos;
};

File.prototype.read = function ( position, length ) { 
    var buf = new Buffer( length );
    fs.readSync( this.fd, buf, 0, length, position );
    return buf.toString( 'utf8' );
};

File.prototype.write = function ( /* ... */ ) {
    console.log( 'File.write() called.' );
};

Snoflake.File = File;
