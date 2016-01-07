/*jslint white:true, plusplus:true */
/*globals assign, resolve, ip: true */

"use strict";

var Snoflake = require( './base' );

Snoflake.VM.prototype.exec = function ( label, op, deferred ) {
    var loc = this.ip, ret = op.apply( null, deferred.call() );
    if ( label ) {
        this.assign( label, ret === undefined ? loc : ret );
    }
};

Snoflake.VM.prototype.jmp = function ( loc ) {
    if ( loc !== undefined ) {
        this.ip = this.resolve( loc ) - 1;
    }
};

Snoflake.VM.prototype.load = function ( program ) {
    for ( var i = 0; i < program.length; i++ ) {
        if ( program[ i ][ 0 ] !== null ) {
            this.assign( program[ i ][ 0 ], i );
        }
    }
};

Snoflake.VM.prototype.run = function ( program ) {
    this.load( program );

    for ( this.ip = 0; this.ip !== program.length; this.ip++ ) {
        exec.apply( null, program[ this.ip ] );
    }
};
