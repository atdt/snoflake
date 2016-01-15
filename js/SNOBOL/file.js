"use strict";

var SNOBOL = require( './base' ),
    fs = require( 'fs' ),
    buf = fs.readFileSync( '/Users/ori/git/snoflake/hello.sno' );

SNOBOL.File = function ( vm, unitNum ) {
    if ( vm.units[unitNum] !== undefined ) {
        return vm.units[ unitNum ];
    } else {
        this.vm = vm;
        this.unitNum = unitNum;
        this.pos = 0;
        this.fd = null;
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
    var slice = buf.slice( this.pos, this.pos + length );
    this.pos += length;

    // console.log( 'read: "%s"', slice.toString('utf8') );
    return slice;
};

SNOBOL.File.prototype.write = function ( a /* ... */ ) {
    console.log( a );
    // console.log( 'File.write() called: %s', JSON.stringify( arguments ) );
};
