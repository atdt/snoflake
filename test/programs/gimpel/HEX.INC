* HEX.inc - HEX(S) will return the hexadecimal (internal)
*	    representation of the string S.
*
-INCLUDE "BLEND.INC"
	DEFINE('HEX(S)')
	H = '0123456789ABCDEF'
	HEX_2ND = DUPL(H,16)
HEX_1	H LEN(1) . T =                      :F(HEX_END)
	HEX_1ST = HEX_1ST DUPL(T,16)        :(HEX_1)
HEX	HEX = BLEND(REPLACE(S, &ALPHABET, HEX_1ST),
+	REPLACE(S, &ALPHABET, HEX_2ND))     :(RETURN)
HEX_END
