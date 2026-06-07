* CATA.inc - CATA(A1,A2) will concatenate the two singly-dimensioned
*	     arrays A1 and A2.
*
-INCLUDE "SEQ.INC"
	DEFINE('CATA(A1,A2)I,N1')       :(CATA_END)

CATA	N1 = PROTOTYPE(A1)
	CATA = ARRAY(N1 + PROTOTYPE(A2))
	SEQ(' CATA<I>  =  A1<I> ', .I)
	SEQ(' CATA<N1 + I>  =  A2<I>' , .I)
	                                :(RETURN)
CATA_END
