* LEXGT.inc - LEXGT(S1,S2) will determine whether S1 is lexicallly
*	      greater than S2 according to a user-supplied
*	      transliteration table in LEX_TT.
*
*	MaxSPITBOL users should consider using the &COMPARE keyword.
*
	DEFINE('LEXGT(S1,S2)')
	UPPERS_ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	LOWERS_ = 'abcdefghijklmnopqrstuvwxyz'
	ALPHA  =  BLEND(LOWERS_,UPPERS_)
+	DIFF(&ALPHABET, LOWERS_ UPPERS_)
	LEX_TT  =  REPLACE(&ALPHABET, ALPHA, &ALPHABET)
						:(LEXGT_END)
LEXGT	LGT( REPLACE(S1, &ALPHABET, LEX_TT),
+	REPLACE(S2, &ALPHABET, LEX_TT))		:S(RETURN)F(FRETURN)
LEXGT_END
