* BRKREM - BRKREM(S) returns a pattern that will behave
*	   like BREAK(S) if that pattern would succeed and
*	   will match the remainder of the subject otherwise.
*
-INCLUDE "DIFF.INC"
	DEFINE('BRKREM(S)CS')           :(BRKREM_END)
BRKREM	BRKREM = IDENT(S) REM           :S(RETURN)
	CS = DIFF(&ALPHABET, S)
	IDENT(CS)                       :S(RETURN)
	BRKREM = RPOS(0) | SPAN(CS) RPOS(0) | BREAK(S)
	                                :(RETURN)
BRKREM_END
