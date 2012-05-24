(function () {
    'use strict';

    var fix = Number.prototype.toFixed,
        re = /{(\d+)(?:\.(\d+))?}/g;

    function formatter( raw, n, width ) {
        var item = this[ n ];

        if ( item == null ) {
            return raw;
        }
        if ( width !== undefined ) {
            return fix.call( item + '', width );
        }
        return item;
    }

    function format() {
        return this.replace( re, formatter.bind(arguments) );
    }

    Object.defineProperty( String.prototype, 'format', { value: format } );

    if ( module !== undefined && module.exports ) {
        module.exports.format = format;
    }

}());
