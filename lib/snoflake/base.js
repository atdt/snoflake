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
    extend: function ( dst, src ) {
        for ( var attr in src ) {
            if ( src.hasOwnProperty( attr ) ) {
                dst[ attr ] = src[ attr ];
            }
        }
        return dst;
    }
};

module.exports = Snoflake;
