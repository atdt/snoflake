// Public entry point. Imports below are ordered so that the side-effect
// modules (mem, vm) finish patching VM.prototype before any caller
// constructs a VM.
import { VM } from './SNOBOL/base.js';
import './SNOBOL/mem.js';
import './SNOBOL/vm.js';

import * as io from './SNOBOL/io.js';
import { Descriptor, Specifier } from './SNOBOL/datatypes.js';
import { File } from './SNOBOL/file.js';
import { constants, hostStrings, match, syntaxTables, tableNames } from './SNOBOL/syntax.js';
import { str } from './SNOBOL/string.js';
import { sil } from './SNOBOL/sil.js';
import { assemble } from './SNOBOL/assemble.js';
import { isInt32, isFloat32 } from './SNOBOL/mem.js';
import image from './SNOBOL/snobol.sil.js';

const D = 3;

const SNOBOL = {
    VM,
    Descriptor, Specifier, File,
    constants, hostStrings, match, syntaxTables, tableNames,
    str, sil, assemble,
    isInt32, isFloat32,
    io, image, D,
};

export {
    VM,
    Descriptor, Specifier, File,
    constants, hostStrings, match, syntaxTables, tableNames,
    str, sil, assemble,
    isInt32, isFloat32,
    io, image, D,
};
export default SNOBOL;
