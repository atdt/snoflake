var Snoflake = {
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
        if ( Snoflake.config.debug ) {
            console.log.apply( console, arguments );
        }
    },
    VM: function () {
        this.ip = null;
        this.mem = [];
    },
};

module.exports = Snoflake;
