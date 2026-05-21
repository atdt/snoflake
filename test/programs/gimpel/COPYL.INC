* COPYL.inc - COPYL(L) will copy a list of LINKs.  The
*	      configuration may have loops.
*
	DEFINE('COPYL(L)T')
	DATA('LINK(NEXT,VALUE)')
						:(COPYL_END)
COPYL	DEFINE('COPYL(L)', 'COPYL_1')
	T  =  TABLE(100)
	COPYL  =  COPYL(L)
	DEFINE('COPYL(L)T')			:(RETURN)
COPYL_1	COPYL  =  L
	IDENT(DATATYPE(L), 'LINK')		:F(RETURN)
	COPYL  =  T<L>
	DIFFER(COPYL, NULL)			:S(RETURN)
	COPYL  =  COPY(L)
	T<L>  =  COPYL
	VALUE(COPYL)  =  COPYL(VALUE(L))
	NEXT(COPYL)  =  COPYL(NEXT(L))		:(RETURN)
COPYL_END
