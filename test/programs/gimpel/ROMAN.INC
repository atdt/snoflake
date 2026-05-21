* ROMAN.inc - ROMAN(N) will return the roman numeral representation
*	      of the integer N.  0 < N < 4000.
*
	DEFINE('ROMAN(N)T')			:(ROMAN_END)
ROMAN	N   RPOS(1)  LEN(1) . T  =		:F(RETURN)
	'0,1I,2II,3III,4IV,5V,6VI,7VII,8VIII,9IX,'
+	T   BREAK(',') . T			:F(FRETURN)
	ROMAN = REPLACE(ROMAN(N), 'IVXLCDM', 'XLCDM**') T
+						:S(RETURN)F(FRETURN)
ROMAN_END
