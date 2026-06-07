* LPAD.inc - LPAD(S,N,C) will pad string S on the left with
*	     character C until the string is N characters long.
*	     S is returned if it is >= N characters long.  C
*	     is taken to be ' ' if unspecified.
*
	DEFINE('LPAD(S,N,C)')           :(LPAD_END)
LPAD	LPAD = GE(SIZE(S),N) S          :S(RETURN)
	C = IDENT(C) ' '
	LPAD = DUPL(C, N - SIZE(S)) S   :(RETURN)
LPAD_END
