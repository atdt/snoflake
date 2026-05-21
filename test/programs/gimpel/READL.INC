* READL.inc - READL(P) will read in a sequence of items, placing
*	      them in a list, and return the head of a list.  P is
*	      a pattern to indicate the end of the list.
*
*	Example: READL(POS(0) 'STOP') will read a sequence of
*	strings up to but not including the first string having
*	'STOP' in column 1.
*
	DEFINE('READL(P)N,S')
	DATA('LINK(NEXT,VALUE)')		:(READL_END)
READL	P  =  IDENT(P)  ABORT
	N  =  .READL
READL_1	S  =  INPUT				:F(RETURN)
	S   P					:S(RETURN)
	$N  =  LINK( ,S)
	N  =  .NEXT($N)				:(READL_1)
READL_END
