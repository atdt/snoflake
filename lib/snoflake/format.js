(function () {
    'use strict';

    var re = /{(\d+)(?:\.(\d+))?}/g;

    function formatter( raw, n, width ) {
        var item = this[ n ];

        if ( item === null || item === undefined ) {
            return raw;
        }
        if ( width !== undefined ) {
            return Number( item ).toFixed( width );
        }
        return item;
    }

    Object.defineProperty( String.prototype, 'format', {
        value: function () {
            return this.replace( re, formatter.bind( arguments ) );
        },
    } );

    if ( module !== undefined && module.exports ) {
        module.exports.format = String.prototype.format;
    }

}());
