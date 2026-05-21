*  BASEB(N,B) will convert the integer N to its base B representation.
*
*  B may be any positive integer <=36.
*
	DEFINE('BASEB(N,B)R,C')
	BASEB_ALPHA  =  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
						:(BASEB_END)
BASEB	EQ(N,0)					:S(RETURN)
	R  =  REMDR(N,B)
	BASEB_ALPHA  TAB(*R)   LEN(1) . C	:F(ERROR)
	BASEB  =  C BASEB
	N  =  N / B				:(BASEB)
BASEB_END
