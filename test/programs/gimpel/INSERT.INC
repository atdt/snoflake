* INSERT.inc - INSERT(T,S) will insert the string S into the tree T
*	       and return the modified tree.  If T is null, a root
*	       node is created and returned.
*
	DEFINE('INSERT(T,S)V')
	DATA('BTNODE(VALUE,NO,LSON,RSON)')	:(INSERT_END)
INSERT	INSERT  =  IDENT(T)  BTNODE(S,1)	:S(RETURN)
	INSERT  =  T
	V  =  VALUE(T)
	NO(T)  =  IDENT(S,V)  NO(T) + 1		:S(RETURN)
	RSON(T)  =  LGT(S,V)  INSERT(RSON(T),S)	:S(RETURN)
	LSON(T)  =  INSERT(LSON(T), S)		:(RETURN)
INSERT_END
