var SNOBOL = {
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
        if ( SNOBOL.config.debug ) {
            console.log.apply( console, arguments );
        }
    },
    VM: function ( stackSize ) {
        this.instructionPointer = null;
        this.stackSize = stackSize || 1024;
        this.symbols = new SNOBOL.SymbolTable();
        this.mem = [];
        this.callbacks = [];
        this.units = {};
        this.indent = 0;
        this.CSTACK = this.d( SNOBOL.$CSTACK );
        this.OSTACK = this.d( SNOBOL.$OSTACK );
        this.reset();
    },
};

module.exports = SNOBOL;
