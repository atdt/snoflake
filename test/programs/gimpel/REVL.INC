* REVL.inc - REVL(L) will reverse a list L.
*
	DEFINE('REVL(L)T')
	DATA('LINK(NEXT,VALUE)')		:(REVL_END)
REVL	REVL  =  L
	IDENT(DATATYPE(L), 'LINK')		:F(RETURN)
	L  =  NEXT(REVL)
	NEXT(REVL)  =
REVL_1	IDENT(L)				:S(RETURN)
	T  =  NEXT(L)
	NEXT(L)  =  REVL
	REVL  =  L
	L  =  T					:(REVL_1)
REVL_END
