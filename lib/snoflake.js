var Snoflake = require( './snoflake/base' );

module.exports = Snoflake;

require( './snoflake/string' );
require( './snoflake/sil.peg' );
require( './snoflake/parser' );
require( './snoflake/sil' );
require( './snoflake/mem' );
require( './snoflake/syntax' );
require( './snoflake/datatypes' );
require( './snoflake/vm' );
