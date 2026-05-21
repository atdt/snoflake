* DIFF.inc - DIFF(S1,S2) will return the set difference, S1 - S2,
*	     which is a string containing all those characters that
*	     are in S1 and not S2.
*
	DEFINE('DIFF(S1,S2)')			:(DIFF_END)
DIFF	DIFF  =  S1
	IDENT(S2,NULL)				:S(RETURN)
	S2  =  SPAN(S2)
DIFF_1	DIFF    S2  =				:S(DIFF_1)F(RETURN)
DIFF_END
