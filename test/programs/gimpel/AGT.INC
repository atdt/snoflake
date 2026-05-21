* AGT - Alphabetic comparison with upper and lower case letters
*       treated as equal.
*
* Note: Using MaxSPITBOL, it will be more efficient to set
*	&COMPARE = 1, and use the regular LGT operator.
*
	DEFINE('AGT(S1,S2)')
	UPPERS_ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	LOWERS_ = 'abcdefghijklmnopqrstuvwxyz'
	AGT_TT  =  REPLACE(&ALPHABET, UPPERS_, LOWERS_)
						:(AGT_END)
AGT	LGT( REPLACE(S1, &ALPHABET, AGT_TT),
+	REPLACE(S2, &ALPHABET, AGT_TT))		:S(RETURN)F(FRETURN)
AGT_END
