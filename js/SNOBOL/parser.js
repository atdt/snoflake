/*jslint white: true, node: true, vars: true, evil: true */

var SNOBOL = require( './base' ),
    fs = require( 'fs' );


function getGenerator() {
    var ug = require( 'uglify-js' ).uglify;
    return ug.gen_code.bind( ug );
}

var parser = SNOBOL.peg_parser,
    generate = getGenerator();

SNOBOL.parser = {
    parse: function ( source ) {
        var ast = parser.parse( source ),
            code = generate( ast, {
                beautify     : true,
                indent_level : 2,
                space_colon  : true
            } );
        return code;
    },
    compile: function( infile ) {
        var source = fs.readFileSync( infile, 'utf-8' ),
            js = this.parse( source );
        return eval( [ '(', js, ')' ].join('') );
    }
};
