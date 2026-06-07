* RWORD.inc - RWORD(K) will return a random word with
*	      characteristics similar to other words in
*	      a given corpus.  K is a whole number indicating
*	      the extent to which context is used in forming
*	      the result.  That is, the next character chosen
*	      depends on at most the last K characters already
*	      chosen.
*
*  Variable INPUT must be attached to the given corpus file
*  prior to including RWORD.inc.
*
-INCLUDE "RCHAR.INC"
	DEFINE('RWORD(K)CONTEXT')       :(RWORD_END)
RWORD	RWORD = ' '
RWORD_1	CONTEXT = RWORD
	RWORD RTAB(K) REM . CONTEXT
	C = RCHAR(CONTEXT)              :F(RETURN)
	RWORD = DIFFER(C,' ') RWORD C   :S(RWORD_1)
	RWORD ' ' =
	IDENT(RWORD)                    :S(RWORD)F(RETURN)
RWORD_END
