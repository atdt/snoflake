* LPERM.inc - LPERM(S) returns the next reordering in lexico-
*	      graphic order of the string S.
*
-INCLUDE "REVERSE.INC"
	DEFINE('LPERM(S)P,T,X,R,Y,HIGHS')
	&ALPHABET RTAB(1) LEN(1) . HIGH_CHAR
	                                    :(LPERM_END)
LPERM	S = REVERSE(S) HIGH_CHAR
	S LEN(1) $ T LEN(1) $ P *LGT(T,P)   :F(FRETURN)
	&ALPHABET BREAK(P) LEN(1) REM . HIGHS
	S BREAK(HIGHS) . X LEN(1) . R BREAK(P) . Y LEN(1)
+	= REVERSE(X P Y) R
	LPERM = REVERSE(S)
	LPERM HIGH_CHAR =                   :(RETURN)
LPERM_END
