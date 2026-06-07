* INSERTB.inc - INSERT(T,S) will insert the string S into the
*		backward-growing binary tree T.  The root of the
*		returned tree will contain S.
*
	DEFINE('INSERTB(T,S)V')
	DATA('BTNODE(VALUE,NO,LSON,RSON)')
	                                :(INSERTB_END)
INSERTB	INSERTB = IDENT(T) BTNODE(S,1)  :S(RETURN)
	V = VALUE(T)
	NO(T) = IDENT(S,V) NO(T) + 1    :S(RETURN)
	LGT(S,V)                        :F(INSERTB_L)
	INSERTB = INSERTB(RSON(T), S)
	RSON(T) = LSON(INSERTB)
	LSON(INSERTB) = T               :(RETURN)
INSERTB_L	INSERTB = INSERTB(LSON(T), S)
	LSON(T) = RSON(INSERTB)
	RSON(INSERTB) = T               :(RETURN)
INSERTB_END
