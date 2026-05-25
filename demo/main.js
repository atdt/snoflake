// Entry point: each example owns one <section> of the page and wires up
// its own controls. Initialising them is all the page needs to do.

import { init as initBatchIo } from './examples/batch-io.js';
import { init as initInteractiveIo } from './examples/interactive-io.js';
import { init as initLsystem } from './examples/lsystem.js';
import { init as initCellularAutomata } from './examples/cellular-automata.js';
import { init as initShapeGrammar } from './examples/shape-grammar.js';

initBatchIo();
initInteractiveIo();
initLsystem();
initCellularAutomata();
initShapeGrammar();
