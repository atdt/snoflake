Object.defineProperty( Object.prototype, 'extend', {
    enumerable: false,
    value: function ( from ) {
        var self = this;
        Object.getOwnPropertyNames( from ).filter( function ( a ) {
            return !( a in self );
        } ).forEach( function ( a ) {
            var descriptor = Object.getOwnPropertyDescriptor( from, a );
            Object.defineProperty( self, a, descriptor );
        } );
        return self;
    }
} );

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
