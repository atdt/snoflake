* BASE10 - BASE10(N,B) will convert the string N assumed
*	   to be a numeral expressed in base B arithmetic
*	   to decimal (base 10).
*
*	   Digits beyond 0-9 are from the set A-Z.
*
	DEFINE('BASE10(N,B)T')
	BASEB_ALPHA  =  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
						:(BASE10_END)
BASE10	N   LEN(1) . T  =			:F(RETURN)
	BASEB_ALPHA    BREAK(*T)  @T		:F(ERROR)
	BASE10  =  (BASE10 * B) + T		:(BASE10)
BASE10_END
