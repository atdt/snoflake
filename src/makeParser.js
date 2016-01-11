var PEG = require( 'pegjs' ),
    fs = require( 'fs' ),
    ug = require( 'uglify-js' ).uglify,
    grammar = fs.readFileSync( __dirname + '/sil.peg' ).toString( 'utf-8' ),
    snobol = fs.readFileSync( __dirname + '/../external/v311.sil' ).toString( 'utf-8' ),
    parser = PEG.buildParser( grammar ),
    ast = parser.parse( snobol ),
    prolog = "var SNOBOL = require( './base' ); SNOBOL.interp = ";
    code = prolog + ug.gen_code( ast, {
        beautify     : true,
        indent_level : 2,
        space_colon  : true
    } ).replace( /function\(/g, 'function (' ) + ';';  // pet peeve

console.log( code );
