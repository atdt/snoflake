* SNOPUT.inc - SNOPUT(S) will output SNOBOL4 statement S.  It will
*	       handle automatically: labeling, numbering, writing,
*	       and if necessary for long lines, continuation.
*
-INCLUDE "PUT.INC"
-INCLUDE "PEEL.INC"
	DEFINE('SNOPUT(S)')             :(SNOPUT_END)
SNOPUT	PUT(PEEL(.S,72))                :F(ERROR)
SNOPUT_1	IDENT(S,NULL)           :S(RETURN)
	PUT('+' PEEL(.S,71))            :F(ERROR)S(SNOPUT_1)
SNOPUT_END
