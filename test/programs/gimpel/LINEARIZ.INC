* LINEARIZE.inc - LINEARIZE(T) will linearize a binary tree of
*		  the kind used in INSERT.  The tree will be
*		  strung via its right sons.  The value returned
*		  will be the first node of the tree.  If T is
*		  null, LINEARIZE will fail.
*
	DEFINE('LINEARIZE(T)')			:(LINEARIZE_END)
LINEARIZE	IDENT(T)			:S(FRETURN)

	LINEARIZE = IDENT(LSON(T))  T		:S(LIN_1)
	LINEARIZE  =  LINEARIZE(LSON(T))
	$LAST_NAME  =  T
LIN_1	RSON(T)  =  LINEARIZE(RSON(T))		:S(RETURN)
	LAST_NAME  =  .RSON(T)			:(RETURN)
LINEARIZE_END
