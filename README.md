Snoflake
==========

**Snoflake** is a JavaScript runtime for the [SNOBOL][0] (_StriNg Oriented and
symBOlic Language_) programming language, developed between 1962 and 1967 at
AT&T Bell Laboratories by David J. Farber, Ralph E. Griswold and Ivan P.
Polonsky.

SNOBOL is highly distinct and excels at string manipulation and
pattern-matching. SNOBOL patterns may be recursive and are available as a
first-class data type.

To aid porting, an implementation of SNOBOL4 was provided in assembler code for
a virtual machine that was designed expressly for that purpose (a first, as far
as I know). 

**Snoflake** is a port of the macro implementation of SNOBOL4. It is
currently only about 50-60% complete and is not yet usable, but the work is
moving at a rapid pace. A working implementation is expected by late summer.

Compatibility
-------------

**Snoflake** is designed to run in both browser and standalone environments.
The development setup requires Node.js >= 0.6. The code adheres to ES5's strict
mode.

Status
------

### Completed ###

 * SIL parser / translator
 * Data structures and memory allocation
 * Execution environment
 * 85 (of 131) SIL operations

### Todo ###

 * **Tests**
 * System stack manipulation
 * SNOBOL syntax tables
 * Better documentation

Contributing
------------

Documentation for contributors is forthcoming. In the meantime, if you are
interested in contributing, [e-mail me][1].

License
-------
Copyright (C) 2012 Ori Livneh

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE.  See the [GNU General Public License][2] for more details.

You should have received a copy of the GNU General Public License along with
this program; if not, write to the Free Software Foundation, Inc., 51 Franklin
Street, Fifth Floor, Boston, MA  02110-1301, USA.

[![Build Status][3]][4]

[0]: http://en.wikipedia.org/wiki/SNOBOL
[1]: mailto:ori.livneh@gmail.com
[2]: http://www.gnu.org/licenses/gpl-2.0.html
[3]: https://secure.travis-ci.org/atdt/sno-machine.png?branch=master
[4]: http://travis-ci.org/atdt/sno-machine
