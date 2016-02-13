"use strict";

var assert = require('assert');
var SNOBOL = require( './base' ),
    fs = require( 'fs' ),
    buf = fs.readFileSync( '/Users/ori/git/snoflake/tmp/hello.sno' );


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

function last( ar ) {


}
SNOBOL.File.prototype.read = function ( length ) { 
    var encodedBuf = SNOBOL.str.encode( buf ),
        retBuf = [], ch;

    while ( encodedBuf.slice( encodedBuf.length - 1 ) === 0 ) {
        encodedBuf.pop();
    }

    if ( length > 3 && length % 3 ) {
        length = length - ( length % 3 );
    }

    while ( retBuf.length < length && this.pos < encodedBuf.length ) {
        ch = encodedBuf[ this.pos++ ];
        retBuf.push( ch );
        if ( ch === 10 ) {
            break;
        }
    }

    return retBuf;
};

SNOBOL.File.prototype.write = function ( a /* ... */ ) {
    console.log( a );
    // console.log( 'File.write() called: %s', JSON.stringify( arguments ) );
};
