var snobol = require('./snomachine.js'),
    vm = new snobol.SnoMachine( 'sum.sil' ),
    sil = require('./dummy.sil.js');

console.log( vm );
// vm.run();
