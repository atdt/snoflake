* BNORM - BNORM(S) will return the blank-normalization of the
*	  string S.  Blanks will be prepended to S if it is not
*	  balanced on the left.
*
-INCLUDE "REVERSE.INC"
	DEFINE('BNORM(S)B,S1,S2,X,Y,P')
	&ALPHABET TAB(8) LEN(1) . BSPACE; USCORE = '_'
	ONE_POS = NOTANY(BSPACE)
+	| DUPL(BSPACE,5) FENCE *FIVE_POS *ONE_POS
+	| BSPACE *ONE_POS *ONE_POS
	FIVE_POS = ONE_POS ONE_POS ONE_POS ONE_POS ONE_POS
	IF_BSPACE = BREAK(BSPACE)
	                                        :(BNORM_END)
BNORM	S IF_BSPACE                             :S(BNORM_1)
	BNORM = S                               :(RETURN)
BNORM_1	S BREAK(USCORE) . S1 USCORE REM . S2    :F(BNORM_B)
	BNORM = BNORM(S1) USCORE BNORM(S2)      :(RETURN)
BNORM_B	S = REVERSE(S)
	B = BSPACE
	P = NOTANY(B) . X B B ONE_POS . Y
BNORM_2	S P = B Y X B                           :S(BNORM_2)
	S POS(0) SPAN(B) =
	S B B                                   :S(BNORM_UNB)
	BNORM = REVERSE(S)
	BNORM POS(0) B                          :F(RETURN)
BNORM_UNB	S = S ' '                       :(BNORM_2)
BNORM_END
