* CH.inc - CH(HEX) will convert the sequence of hexidecimal
*	   digits into the corresponding character string.
*	   CH is the inverse of HEX.
*
-INCLUDE "BASE10.INC"
	DEFINE('CH(HEX)T,C,N')
	                                :(CH_END)
CH	HEX LEN(2) . T =                :F(RETURN)
	C = BASE10(T,16)
	&ALPHABET LEN(C) LEN(1) . C
	CH = CH C                       :(CH)
CH_END
