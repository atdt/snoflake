SnoMachine
==========

**SnoMachine** is a JavaScript interpreter for the [SNOBOL][0] (_StriNg
Oriented and symBOlic Language_) programming language, developed between 1962
and 1967 at AT&T Bell Laboratories by David J. Farber, Ralph E. Griswold and
Ivan P. Polonsky.

SNOBOL is highly distinct and excels at string manipulation and
pattern-matching. SNOBOL patterns may be recursive and are available as a
first-class data type.

To aid porting, an implementation of SNOBOL4 was provided in assembler code for
a virtual machine that was designed expressly for that purpose (a first, as far
as I know). 

**SnoMachine** is a port of the macro implementation of SNOBOL4. It is
currently only about 50-60% complete and is not yet usable, but the work is
moving at a rapid pace. A working implementation is expected by late summer.

Compatibility
-------------

**SnoMachine** is designed to run in both browser and standalone environments.
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

[![Build Status][2]][3]

[0]: http://en.wikipedia.org/wiki/SNOBOL
[1]: mailto:ori.livneh@gmail.com
[2]: https://secure.travis-ci.org/atdt/sno-machine.png?branch=master
[3]: http://travis-ci.org/atdt/sno-machine
