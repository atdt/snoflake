"use strict";

const DEFAULT_OPTIONS = {
    debug: false,
    watch: [],
    // Fold SNOBOL source names and labels to uppercase during compilation.
    caseFold: true,
};

const SNOBOL = {
    VM: function ( options ) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
        this.debug = !!this.options.debug;
        // I/O adapters: defaults target Node (console + node:fs) but a host
        // may inject its own writers and loader to redirect program output
        // or supply pre-loaded sources. See src/SNOBOL/io.js.
        this.stdout = this.options.stdout || SNOBOL.io.nodeStdout;
        this.stderr = this.options.stderr || SNOBOL.io.nodeStderr;
        this.loader = this.options.loader || SNOBOL.io.nodeLoader;
        this.exitCode = 0;
        this.reset();
    },
};

export default SNOBOL;
