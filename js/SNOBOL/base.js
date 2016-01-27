"use strict";

var SNOBOL = {
    extend: function ( dst, src ) {
        for ( var attr in src ) {
            if ( src.hasOwnProperty( attr ) ) {
                dst[ attr ] = src[ attr ];
            }
        }
        return dst;
    },
    config: { debug: false },
    log: function () {
        if ( SNOBOL.config.debug ) {
            console.log.apply( console, arguments );
        }
    },
    VM: function () {
        this.reset();
    },
};

module.exports = SNOBOL;
