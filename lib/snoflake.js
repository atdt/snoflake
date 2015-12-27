var Snoflake = require( './snoflake/base' );

module.exports = Snoflake;

require( './snoflake/string' );
require( './snoflake/sil.peg' );
require( './snoflake/parser' );
require( './snoflake/sil' );
require( './snoflake/mem' );
require( './snoflake/syntax' );
require( './snoflake/datatypes' );
require( './snoflake/file' );
require( './snoflake/vm' );
require( './snoflake/snobol.sil.js' );
