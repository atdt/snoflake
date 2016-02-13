"use strict";

var SNOBOL = {
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
