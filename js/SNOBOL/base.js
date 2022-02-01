"use strict";

var SNOBOL = {
    options: {
        debug: false,
        watch: []
    },
    log: function () {
        if ( SNOBOL.options.debug ) {
            console.log.apply( console, arguments );
        }
    },
    VM: function ( options ) {
        // XXX: Make this local to the VM instance.
        SNOBOL.options = { ...SNOBOL.options, ...options };
        SNOBOL.DEBUG = !!SNOBOL.options.debug;
        this.reset();
    },
};

module.exports = SNOBOL;
