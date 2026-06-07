* COUNT.inc - COUNT(S1,S2) counts the number of occurrences
*	      of string S2 in string S1.
*
-INCLUDE "BREAKX.INC"
	DEFINE('COUNT(S1,S2)FIRST,REST,P')
	                                :(COUNT_END)
COUNT	S2 LEN(1) . FIRST REM . REST    :F(RETURN)
	P = POS(0) BREAKX(FIRST) S2
COUNT_1	S1 P = REST                     :F(RETURN)
	COUNT = COUNT + 1               :(COUNT_1)
COUNT_END
