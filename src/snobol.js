// Public entry point.

import { VM } from './vm.js';
import { Session } from './interactive.js';
import snobolImage from './generated-snobol-image.js';

export * from './io.js';
export * from './datatypes.js';
export * from './file.js';
export * from './syntax.js';
export * from './string.js';
export * from './format.js';
export * from './sil.js';
export * from './assemble.js';
export * from './vm.js';
export * from './extensions.js';
export * from './interactive.js';
export { snobolImage as image };

const DEFAULT_SOURCE_PATH = 'source.sno';

// When source is passed inline via options.source, the file argument is a
// label, not a path to read. Move sourcePath into file (UnitTable does not
// know sourcePath) so vm.options.file still names the source in diagnostics.
function normalizeOptions( options ) {
    const opts = { ...options };
    if ( Object.hasOwn( opts, 'source' ) ) {
        opts.file = opts.sourcePath || DEFAULT_SOURCE_PATH;
        delete opts.sourcePath;
    }
    return opts;
}

export function createVM( options = {} ) {
    return new VM( normalizeOptions( options ) );
}

export function run( options = {} ) {
    const vm = createVM( options );
    vm.run( snobolImage );
    return { vm, exitCode: vm.exitCode };
}

// A resumable run for programs that read input interactively. Accepts the
// same options as run(), plus onOutput/onError/onDone callbacks; returns a
// Session the host drives with start(), send(line), and end(). See
// src/interactive.js.
export function createSession( options = {} ) {
    return new Session( snobolImage, normalizeOptions( options ) );
}
