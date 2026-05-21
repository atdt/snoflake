* REORDER.inc - REORDER(S,OS) will produce the next permutation
*		(with repetitions) of the string S.  OS is an
*		ordered version of the string S, produced by
*		ORDER().  S is the last value produced by REORDER,
*		or OS on the first call.
* 
	DEFINE('REORDER(S,ORDERED_S)C,FRONT,S1,LAST,D,OS')
						:(REORDER_END)
REORDER	ORDERED_S    RTAB(1)  LEN(1) . C	:F(FRETURN)
	S    (SPAN(C) | NULL) . FRONT  =
	S    ARB . S1  LEN(1) . D  C  =		:F(REORDER_1)
	REORDER  =  S1 FRONT C D S		:(RETURN)
REORDER_1	ORDERED_S  BREAK(C) . OS
	REORDER = REORDER(S,OS) FRONT		:S(RETURN)F(FRETURN)
REORDER_END
