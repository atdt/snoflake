* FIND.inc - FIND(A,PRED) will search array A for an extreme
*	     element.  The type of extreme element will be
*	     determined by the predicate PRED.
*
*	     Examples:  FIND(A,'GE')
*			FIND(A,'~LGT')
*
	DEFINE('FIND(A,PRED)EX,I,MAX,TEST')	:(FIND_END)
FIND
	EX  =  CONVERT(PRED '(MAX,TEST)' , 'EXPRESSION')
	FIND  =  1
	MAX  =  A<FIND>
	I  =  1
FIND_1	I  =  I + 1
	TEST  =  A<I>				:F(RETURN)
	EVAL(EX)				:S(FIND_1)
	MAX  =  TEST
	FIND  =  I				:(FIND_1)
FIND_END
