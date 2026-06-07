* REVERSE.inc - REVERSE(S) returns an end-for-end reversal
*		of its argument string.
*
	DEFINE('REVERSE(S)A1,A2,L')
	TEMP = &ALPHABET
REV_1	TEMP LEN(1) . T =                   :F(REVERSE_END)
	REV_ALPHA = T REV_ALPHA             :(REV_1)
REVERSE	L = SIZE(S)
	GT(L,256)                           :S(REVERSE_1)
	LE(L,0)                             :S(RETURN)
	&ALPHABET TAB(*L) . A1
	REV_ALPHA RTAB(*L) REM . A2
	REVERSE = REPLACE(A2,A1,S)          :(RETURN)
REVERSE_1	S LEN(256) . A1 REM . A2
	REVERSE = REVERSE(A2) REVERSE(A1)   :(RETURN)
REVERSE_END
