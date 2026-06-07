* FORTPUT.inc - FORTPUT(S) will output a FORTRAN statement S.
*		The statement will be output, labeled, numbered,
*		and continued if necessary.
*
-INCLUDE "PUT.INC"
	DEFINE('FORTPUT(S)T')           :(FORTPUT_END)
FORTPUT	S (LEN(72) | REM) . T =
	PUT(T)
	IDENT(S,NULL)                   :S(RETURN)
	S = DUPL(' ',5) '1' S           :(FORTPUT)
FORTPUT_END
