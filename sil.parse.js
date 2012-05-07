"use strict";

var fs = require( 'fs' ),
    read = fs.readFileSync;

function get_parser () {
    var peg = require( 'pegjs' ),
        grammar = read( 'sil.peg', 'utf-8' );
    return peg.buildParser( grammar );
}

function get_generator () {
    var lib = require( 'uglify-js' ),
        uglify = lib.uglify;
    return uglify.gen_code.bind( uglify );
}

var parser = get_parser(),
    generate = get_generator();

var sil_parser = {
    translate: function ( source ) {
        var ast = parser.parse( source ),
            code = generate( ast, {
                beautify     : true,
                indent_level : 2,
                space_colon  : true
            } );
        return code;
    },

    compile: function( infile ) {
        var source = read( infile, 'utf-8' ),
            js = this.translate( source );
        return eval( ['(', js, ')'].join('') );
    }
}

if ( typeof module !== 'undefined' && module.exports ) {
    module.exports = sil_parser;
}
