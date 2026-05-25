// Public entry point.

import { VM } from './vm.js';
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
export { snobolImage as image };

const DEFAULT_SOURCE_PATH = 'source.sno';

export function createVM( options = {} ) {
    const opts = { ...options };
    // The inline-source shortcut: bytes flow through options.source; we
    // synthesize a file path so vm.options.file stays meaningful for
    // diagnostics, and we drop sourcePath which UnitTable doesn't know.
    // The synthetic path replaces any explicit file: when source is supplied,
    // the file argument is treated as a label rather than a path to read.
    if ( Object.hasOwn( opts, 'source' ) ) {
        opts.file = opts.sourcePath || DEFAULT_SOURCE_PATH;
        delete opts.sourcePath;
    }
    return new VM( opts );
}

export function run( options = {} ) {
    const vm = createVM( options );
    vm.run( snobolImage );
    return { vm, exitCode: vm.exitCode };
}
