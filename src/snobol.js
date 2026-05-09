import SNOBOL from './SNOBOL/base.js';

import './SNOBOL/string.js';
import './SNOBOL/mem.js';
import './SNOBOL/syntax.js';
import './SNOBOL/datatypes.js';
import './SNOBOL/io.js';
import './SNOBOL/file.js';
import './SNOBOL/vm.js';
import './SNOBOL/sil.js';
import './SNOBOL/assemble.js';
import defaultImage from './SNOBOL/snobol.sil.js';

SNOBOL.defaultImage = defaultImage;

export { defaultImage };
export default SNOBOL;
