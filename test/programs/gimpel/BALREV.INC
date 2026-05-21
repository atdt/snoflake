* BALREV - BALREV(S) returns the balanced reversal of the
*	   string S:  characters of S are reversed and
*	   parentheses are interchanged.
*	   BALREV('F(X)') returns '(X)F' instead of ')X(F'
*	   like a simple reversal.
*
*-INCLUDE "reverse.inc"
	DEFINE('BALREV(S)')			:(BALREV_END)
BALREV	BALREV  =  REPLACE(REVERSE(S), ')(', '()')
						:(RETURN)
BALREV_END
