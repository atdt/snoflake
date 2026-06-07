* LINE.inc - LINE(CW) will return the next line of a paragraph
*	     passed to LINE_INIT().  The column width is CW
*	     characters.  LINE will fail when no more lines remain.
*	     If HYPHENATE is non-zero, words will be hyphenated.
*	     If JUSTIFY is nonzero, the lines will be right-
*	     justified (padded with blanks).
*
-INCLUDE "REVERSE.INC"
-INCLUDE "PAD.INC"
-INCLUDE "SUBSTR.INC"
-INCLUDE "MINP.INC"
-INCLUDE "BNORM.INC"
-INCLUDE "HYPHENAT.INC"
	DEFINE('LINE(CW)B,B2,TRY,X2,W,W2,T,RWORD,UF,UF1,'
+	'K,H,HYPHEN')
	HYPHENATE = 1
	JUSTIFY = 1

	&ALPHABET TAB(8) LEN(1) . BSPACE; USCORE = '_'
	IF_BSPACE = BREAK(BSPACE)

	DEFINE('LINE_INIT(P)T')
	&ALPHABET LEN(1) . HARD_BLANK
	                                            :(LINE_INIT_END)
LINE_INIT	P IF_BSPACE                         :F(LINE_I1)
	P = BNORM(P)
LINE_I2	P BSPACE ' ' =                              :S(LINE_I2)
LINE_I3	P ' ' BSPACE =                              :S(LINE_I3)
LINE_I1	P POS(0) SPAN(' ') @T = DUPL(HARD_BLANK,T)
	P_SAVED = P ' '
	U_SAVED =                                   :(RETURN)
LINE_INIT_END

	SUFFICIENT_CONTEXT.X2 = (LEN(*TRY) BREAK(' ')) . X2
+	@B2 SPAN(' ') @TRY
	FIND.RWORD.T = @T BREAK(' ') . RWORD SPAN(' ') @T
	EXTRACT.LINE = LEN(*B) . LINE (SPAN(' ') | NULL)
	IF_USCORE = BREAK(USCORE)
	                                            :(LINE_END)
LINE	TRY = CW - 1
LINE_1	P_SAVED SUFFICIENT_CONTEXT.X2               :F(LINE_SMALL)
	W2 = SPACING(X2)
	GE(W2, CW)                                  :F(LINE_1)
	B = EQ(W2,CW) B2                            :S(LINE_2)
	REVERSE(X2) FIND.RWORD.T
	B = B2 - T
	UF = CW - SPACING(SUBSTR(X2,1,B))
	K = 0
LINE_3	LE(MINP(X2) - K + SIZE(HYPHEN), CW)         :F(LINE_4)
	W = W2 - K + SIZE(HYPHEN)
	UF1 = CW - W
	UF1 = LT(UF1,0) -UF1
	UF1 = UF1 + SIZE(HYPHEN)
	GE(UF1,UF)                                  :S(LINE_4)
	B = B2 - K
	UF = UF1
	H = HYPHEN
LINE_4	K = NE(HYPHENATE,0) HYPHENATE(RWORD,K + 1)  :S(LINE_3)
LINE_2	P_SAVED EXTRACT.LINE =
	LINE = LINE H
	LINE = NE(JUSTIFY,0) PAD(LINE, CW)
LINE_USCORE
	LINE = U_SAVED LINE
	LINE IF_USCORE                              :F(RETURN)
	U_SAVED = DUPL(USCORE, REMDR(COUNT(LINE,USCORE),2) )
	LINE = LINE U_SAVED                         :(RETURN)
LINE_SMALL
	IDENT(P_SAVED, NULL)                        :S(FRETURN)
	LINE = TRIM(P_SAVED)
	P_SAVED =                                   :(LINE_USCORE)
LINE_END
