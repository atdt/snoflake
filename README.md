Snoflake
==========
**Snoflake** is a GPL-licensed JavaScript runtime for the [SNOBOL][0] (_StriNg
Oriented and symBOlic Language_) programming language, developed between 1962
and 1967 at AT&T Bell Laboratories by David J. Farber, Ralph E. Griswold and
Ivan P. Polonsky.

SNOBOL is highly distinct and excels at string manipulation and
pattern-matching. SNOBOL patterns may be recursive and are available as a
first-class data type.

To aid porting, an implementation of SNOBOL4 was provided in assembler code for
a virtual machine that was designed expressly for that purpose (a first, as far
as I know). 

**Snoflake** is a port of the macro implementation of SNOBOL4. It is
currently only about 75% complete and is not yet usable.

Compatibility
-------------
**Snoflake** is designed to run in both browser and standalone environments.

Status
------
It doesn't completely work yet, but getting close.

License
-------
Copyright (C) 2012-2022 [Ori Livneh][1]

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE.  See the [GNU General Public License][2] for more details.

[0]: http://en.wikipedia.org/wiki/SNOBOL
[1]: mailto:ori.livneh@gmail.com
[2]: http://www.gnu.org/licenses/gpl-2.0.html
