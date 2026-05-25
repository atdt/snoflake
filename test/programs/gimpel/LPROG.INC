* LPROG.inc - LPROG() will return the length (i.e., the number
*	      of statements) in the SNOBOL4 program in which
*	      it is called.
*
	DEFINE('LPROG()')			:(LPROG_END)
LPROG		:<CODE(' LPROG = &STNO :(RETURN)')>
LPROG_END
