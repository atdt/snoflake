* LAST.inc - LAST(L) will return (by name) the name of the
*	     last NEXT field of a list.  Thus, if L1 and L2
*	     are lists, LAST(L1) = L2 will concatenate the
*	     two lists.  LAST(L) = L creates a circular list.

	DEFINE('LAST(L)')			:(LAST_END)
LAST	IDENT(L)				:S(FRETURN)
LAST_1	L  =  DIFFER(NEXT(L))  NEXT(L)		:S(LAST_1)
	LAST  =  .NEXT(L)			:(NRETURN)
LAST_END
