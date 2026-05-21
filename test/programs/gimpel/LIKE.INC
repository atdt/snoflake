* LIKE.inc - LIKE(S) returns a pattern that will match a
*	     string like the one passed as argument.  A like
*	     string is defined as one differing from the argument
*	     by a) a rearrangement of two characters,
*		b) the deletion of a character, or
*		c) the insertion of a character.
*
	DEFINE('LIKE(S)C,T1,T2,N')		:(LIKE_END)
LIKE	LIKE  =  S
LIKE_1	S   TAB(N) . T1  REM . T2		:F(RETURN)
	N  =  N + 1
	LIKE  =  LIKE | T1 LEN(1) T2
	T2   LEN(1) . C  =			:F(RETURN)
	LIKE  =  LIKE  |  T1  T2
	T2    POS(1)  =  C			:F(LIKE_1)
	LIKE  =  LIKE  |  T1 T2			:(LIKE_1)
LIKE_END
