* CRACK.inc - CRACK(S,B) will convert from string to array
*	      breaking at the character B.
*
-INCLUDE "COUNT.INC"
	DEFINE('CRACK(S,B)I,PAT')       :(CRACK_END)
CRACK	IDENT(B,NULL)                   :S(CRACK_1)
	S RTAB(1) B ABORT | REM . S = S B
	CRACK = ARRAY(COUNT(S,B))
	PAT = BREAK(B) . *CRACK<I> LEN(1)
CRACK_2	I = I + 1
	S PAT =                         :S(CRACK_2)F(RETURN)
CRACK_1	CRACK = ARRAY(SIZE(S))
	PAT = LEN(1) . *CRACK<I>        :(CRACK_2)
CRACK_END
