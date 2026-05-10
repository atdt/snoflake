"use strict";

import { nodeStdout, nodeStderr, nodeLoader } from './io.js';

const DEFAULT_OPTIONS = {
    // Fold SNOBOL source names and labels to uppercase during compilation.
    caseFold: true,
    // Snoflake suppresses the SNOBOL4 startup banner, success/termination
    // messages, and statistics summary by default. Toggle via -b / -s.
    banner: false,
    statistics: false,
};

// `reset` and the rest of the prototype are installed by ./mem.js and
// ./vm.js as side effects, so the orchestrator (src/snobol.js) must import
// those before constructing a VM.
export function VM( options ) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    // I/O adapters: defaults target Node (console + node:fs) but a host
    // may inject its own writers and loader to redirect program output
    // or supply pre-loaded sources. See ./io.js.
    this.stdout = this.options.stdout || nodeStdout;
    this.stderr = this.options.stderr || nodeStderr;
    this.loader = this.options.loader || nodeLoader;
    this.exitCode = 0;
    this.reset();
}
