* HYPHENAT.inc - HYPHENATE(RWORD,MIN) will indicate where within
*		 the reversed word RWORD a hyphenation point can
*		 be found.  MIN indicates the number of characters
*		 by which the word must be diminished in order that
*		 the line  may include this word.  HYPHENATE will
*		 fail if no hyphenation point is found.
*
-INCLUDE "BALREV.INC"
-INCLUDE "OR.INC"
-INCLUDE "UPLO.INC"
-INCLUDE "DIFF.INC"
	DEFINE('HYPHENATE(RWORD,MIN)K,C,L')
	UPPERS_ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	LOWERS_ = 'abcdefghijklmnopqrstuvwxyz'
	INHIB_SUFF = OR(UPLO(BALREV('ED,(GLSV)E,(GQ)UE,ING,EST,')))
	NEUT_SUFF = OR(UPLO(BALREV( '(AI)BLE,LY,S,ES,' )))
+	| ANY('.;,:?)')
	HYPH_SUFF = OR(UPLO(BALREV(
+	'TURE,(CGST)IVE,(CDMNT)IAL,FUL,(CGST)IAN,'
+	'(CGST)ION,SHIP,(LN)ESS,(CGST)IOUS,(CDGLMNTV)ENT,' )))
	DIGRAMS =
+	'XA,~(@)B,~(@NS)C,~(@R)D,XE,~(@)F,~(@N)G,~(@CGPSTW)H,XI,'
+	'~(@)J,~(@CLNS)K,~(@BCFGPTY)L,~(@Y)M,~(@GKSY)N,(AX)O,'
+	'~(@SY)P,~(S)Q,(JKLMNRSVXZ)R,~(@KLNWY)S,~(@FHSY)T,XU,'
+	'~(@)V,~(@S)W,~(@)X,(QWXY)Y,~(@C)Z'
HYPH_D1	DIGRAMS '@' = 'AEIOU'                           :S(HYPH_D1)
HYPH_D2	DIGRAMS '~' BAL . T = '(' DIFF(UPPERS_,T) ')'   :S(HYPH_D2)
	DIGRAMS = BALREV(UPLO( DIGRAMS ))
	DIGRAM_TBL = TABLE(30)
HYPH_D3	DIGRAMS LEN(1) . C
+	('(' BREAK(')') . CC ')' | LEN(1) . CC)
+	(',' | RPOS(0)) =                               :F(HYPH_D4)
	DIGRAM_TBL<C> = ANY(CC)                         :(HYPH_D3)
HYPH_D4
	HYPH_PAT = HYPH_SUFF @K (*GT(K,MIN) | FENCE *HYPH_PAT)
+	| NEUT_SUFF FENCE *HYPH_PAT
+	| (INHIB_SUFF | NULL) FENCE ARB LEN(1) $ C @K
+	*GT(K,MIN) *DIGRAM_TBL<C>
	TRUE_WORD = POS(0) (ANY('.;),:?') | NULL)
+	SPAN(LOWERS_ '-') (ANY(UPPERS_ '(') | NULL) RPOS(0)
	FIRST_VOWEL = BREAK(UPLO( 'AEIOU' )) LEN(1) @L
	FOLLOWING_VOWEL = POS(0) TAB(*K) BREAK(UPLO('AEIOUY'))
	                                                :(HYPHENATE_END)
HYPHENATE
	RWORD TRUE_WORD                                 :F(FRETURN)
	RWORD '-'                                       :S(HYPH_1)
	RWORD FIRST_VOWEL                               :F(FRETURN)
	MIN = LT(MIN,L) L
	RWORD HYPH_PAT                                  :F(FRETURN)
	RWORD FOLLOWING_VOWEL                           :F(FRETURN)
	LE(SIZE(RWORD) - K,1)                           :S(FRETURN)
	HYPHENATE = K
	HYPHEN = '-'                                    :(RETURN)
HYPH_1	HYPHEN =
	RWORD '-' @K *GT(K,MIN)                         :F(FRETURN)
	HYPHENATE = K - 1                               :(RETURN)
HYPHENATE_END
