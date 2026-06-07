* RPERMUTE.inc - RPERMUTE(S) will return a random permutation
*		 of the string S.
*
-INCLUDE "RANDOM.INC"
	DEFINE('RPERMUTE(S)T')          :(RPERMUTE_END)
RPERMUTE	S LEN(1) . T =          :F(RETURN)
	RPERMUTE POS(RANDOM(SIZE(RPERMUTE) + 1) - 1)
+	= T                             :(RPERMUTE)
RPERMUTE_END
