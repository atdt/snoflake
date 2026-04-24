"use strict";

var SNOBOL = {
    options: {
        debug: false,
        watch: [],
        // Execution guards (configurable via CLI):
        // Stop after this many macro steps (0/undefined to disable)
        maxSteps: 0,
        // Stop after this many milliseconds (0/undefined to disable)
        maxMillis: 0,
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
