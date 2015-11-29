var Snoflake = {
    config: { debug: false },
    log: function () {
        if ( Snoflake.config.debug ) {
            console.log.apply( console, arguments );
        }
    }
};

module.exports = Snoflake;
