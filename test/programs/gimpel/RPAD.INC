* RPAD.inc - RPAD(S,N,C) will pad string S on the right with
*	     character C until the string is N characters long.
*	     S is returned if it is >= N characters long.  C
*	     is taken to be ' ' if unspecified.
*
	DEFINE('RPAD(S,N,C)')           :(RPAD_END)
RPAD	RPAD = GE(SIZE(S), N) S         :S(RETURN)
	C = IDENT(C) ' '
	RPAD = S DUPL(C, N - SIZE(S))   :(RETURN)
RPAD_END
