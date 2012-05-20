var config = module.exports;

config[ 'sno-machine' ] = {
    rootPath    : '../',
    environment : 'node',
    sources     : [ 'lib/snoflake.js' ],
    tests       : [ 'test/unit.js' ]
};
