* INORM.inc - INORM(S) will return the image normalization
*	      of the string S.
*
-INCLUDE "BNORM.INC"
-INCLUDE "ORDER.INC"
-INCLUDE "BLEND.INC"
-INCLUDE "DIFF.INC"
	DEFINE('INORM(S)C,CC,S1,K')
	&ALPHABET TAB(8) LEN(1) . BSPACE
	IF_BSPACE = BREAK(BSPACE)
	PR_POS = POS(0) ARB . S1 (LEN(1) BSPACE LEN(1)
+	ARBNO(BSPACE LEN(1))) . CC (NOTANY(BSPACE) | RPOS(0)) . C
	                                :(INORM_END)
INORM	S IF_BSPACE                     :F(INORM_RET)
	S = BNORM(S)
INORM_LOOP
	S PR_POS = C                    :F(INORM_RET)
	CC = DIFF(CC,BSPACE ' ')
	CC = IDENT(CC,NULL) ' '
	CC = BLEND( ORDER(CC), DUPL(BSPACE, SIZE(CC) - 1) )
	INORM = INORM S1 CC             :(INORM_LOOP)
INORM_RET	INORM = INORM S         :(RETURN)
INORM_END
