* AI - Apply Index
*	AI(A,I) where A and I are arrays will regard I as
*	a set of indices to be applied to the array A.
*	The result is a new array of the selected elements.
*	If I is a scalar, the result is A<I>.
*
-INCLUDE "SEQ.INC"
	DEFINE('AI(A,I)J')              :(AI_END)
AI	IDENT(DATATYPE(I), 'ARRAY')     :F(AI_1)
	AI = ARRAY(PROTOTYPE(I))
	SEQ(' AI<J>  =  A<I<J>> ', .J)  :(RETURN)
AI_1	AI = A<I>                       :(RETURN)
AI_END
