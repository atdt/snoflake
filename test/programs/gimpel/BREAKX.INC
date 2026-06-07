* BREAKX.inc - BREAKX(S) will return a pattern that will
*	       extend itself to include characters from S
*	       if required by a rematch attempt.
*	       
*  Built-in function in SNOBOL4+ and SPITBOL.
*
	DEFINE('BREAKX(S)')             :(BREAKX_END)
BREAKX	BREAKX = BREAK(S) ARBNO(LEN(1) BREAK(S))
	                                :(RETURN)
BREAKX_END

