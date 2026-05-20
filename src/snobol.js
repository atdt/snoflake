// Public entry point.

import { defaultLoader } from './io.js';
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
export { snobolImage as image };

const DEFAULT_SOURCE_PATH = 'source.sno';

function sourceLoader( source, sourcePath, baseLoader ) {
    return {
        load( filePath ) {
            if ( filePath === sourcePath ) return source;
            return baseLoader.load( filePath );
        },

        loadInclude( includePath ) {
            return baseLoader.loadInclude?.( includePath ) ?? null;
        }
    };
}

export function createVM( options = {} ) {
    const opts = { ...options };

    if ( Object.hasOwn( opts, 'source' ) ) {
        const source = opts.source,
              sourcePath = opts.sourcePath || DEFAULT_SOURCE_PATH,
              baseLoader = opts.loader || defaultLoader;

        delete opts.source;
        delete opts.sourcePath;
        opts.file = sourcePath;
        opts.loader = sourceLoader( source, sourcePath, baseLoader );
    } else if ( !opts.loader ) {
        opts.loader = defaultLoader;
    }

    return new VM( opts );
}

export function run( options = {} ) {
    const vm = createVM( options );
    vm.run( snobolImage );
    return {
        vm,
        exitCode: vm.exitCode,
    };
}
