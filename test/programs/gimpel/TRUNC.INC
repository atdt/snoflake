* TRUNC.inc - TRUNC(A,L,H) will return the truncation of the
*	      singly-dimensioned array A.  That is, a new array
*	      will be created and returned consisting of the
*	      elements A<L>, A<L+1>, ..., A<H>.
*
-INCLUDE "SEQ.INC"
	DEFINE('TRUNC(A,L,H)')          :(TRUNC_END)
TRUNC	TRUNC = ARRAY(H - L + 1)
	L = L - 1
	SEQ('  TRUNC<I>  =  A<L + I> ',.I)
	                                :(RETURN)
TRUNC_END
