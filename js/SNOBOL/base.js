"use strict";

const SNOBOL = {
    options: {
        debug: false,
        watch: [],
        // Execution guards (configurable via CLI):
        // Stop after this many macro steps (0/undefined to disable)
        maxSteps: 0,
        // Stop after this many milliseconds (0/undefined to disable)
        maxMillis: 0,
        // Fold SNOBOL source names and labels to uppercase during compilation.
        caseFold: true,
    },
    log: function ( ...args ) {
        if ( SNOBOL.options.debug ) {
            console.log( ...args );
        }
    },
    VM: function ( options ) {
        // XXX: Make this local to the VM instance.
        SNOBOL.options = { ...SNOBOL.options, ...options };
        SNOBOL.DEBUG = !!SNOBOL.options.debug;
        // I/O adapters: defaults target Node (console + node:fs) but a host
        // may inject its own writers and loader to redirect program output
        // or supply pre-loaded sources. See js/SNOBOL/io.js.
        this.stdout = SNOBOL.options.stdout || SNOBOL.io.nodeStdout;
        this.stderr = SNOBOL.options.stderr || SNOBOL.io.nodeStderr;
        this.loader = SNOBOL.options.loader || SNOBOL.io.nodeLoader;
        this.exitCode = 0;
        this.reset();
    },
};

export default SNOBOL;
