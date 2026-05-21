* ROTATER.inc - ROTATER(S,N) will rotate the string S right by N
*		characters.  If N is negative, rotation is to the
*		left.
*
	DEFINE('ROTATER(S,N)S1')		:(ROTATER_END)
ROTATER	IDENT(S)				:S(RETURN)
	N  =  REMDR(N, SIZE(S))
	N  =  LT(N,0)  SIZE(S) - N
	S    RTAB(N) . S  REM . S1  =  S1  S
	ROTATER  =  S				:(RETURN)
ROTATER_END
