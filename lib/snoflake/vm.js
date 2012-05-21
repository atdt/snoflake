/*jslint white:true, plusplus:true */
/*globals assign, resolve, ip: true */

"use strict";

var Snoflake = require( './base' );

global.ip = 0;

function exec( label, op, deferred ) {
    var ret = op.apply( null, deferred.call() );
    if ( label ) {
        assign( label, ret === undefined ? ip : ret );
    }
}

function jmp( loc ) {
    if ( loc !== undefined ) {
        ip = resolve( loc ) - 1;
    }
}

function run( program ) {
    for ( ip = 0; ip !== program.length; ip++ ) {
        exec.apply( null, program[ ip ] );
    }
}

Snoflake.extend( {
    exec : exec,
    ip   : ip,
    jmp  : jmp,
    run  : run
} );
