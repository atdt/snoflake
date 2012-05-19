var Snoflake = {
    extend: function ( o ) {
        for ( var attr in o ) {
            if ( o.hasOwnProperty( attr ) ) { 
                this[ attr ] = o[ attr ];
            }
        }
        return this;
    }
};

module.exports = Snoflake;
