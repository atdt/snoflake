* DECOMP.inc - DECOMP(S) returns the decimal number equivalent
*	       of the argument S regarded as a representation
*	       in the combinatorial number system.
*
-INCLUDE "COMB.INC"
	DEFINE('DECOMB(S)T')
	COMB_ALPHA = '0123456789ABCDEFGHIJKLMNOP'
	                                        :(DECOMB_END)
DECOMB	S LEN(1) . T =                          :F(RETURN)
	COMB_ALPHA @K T                         :F(FRETURN)
	DECOMB = DECOMB + COMB(K,SIZE(S) + 1)   :(DECOMB)
DECOMB_END
