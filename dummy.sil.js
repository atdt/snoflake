module.exports = {
    EQU: function ( val ) {
        return val;
    },
    SUM: function ( a, b ) {
        return a + b;
    },
    LHERE: function () {
        return;
    },
    CMPN: function ( a, n, loc ) {
        if ( a < n ) {
            this.jump( loc );
        }
    },
    LOG: function ( s ) {
        console.log( s );
    }
};
