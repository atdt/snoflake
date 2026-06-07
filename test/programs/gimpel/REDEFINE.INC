* REDEFINE.inc - REDEFINE(OP,DEF,LBL) will redefine the built-in
*	         operator OP to the name of the function given
*		 with prototype DEF and entry label LBL.  The
*		 old definition of the operator is preserved in
*		 the function name with appended period.
*
* CAUTION - This cannot be used with SPITBOL, which does not
*	    permit the redefition of built-in operators.
*
	DEFINE('REDEFINE(OP,DEF,LBL)NAME,N,FLAG')
	                                :(REDEFINE_END)
REDEFINE	DEF BREAK('(') . NAME '(' BREAK('),') LEN(1) . FLAG
	N = 1
	N = IDENT(FLAG, ',') 2
	N = IDENT(OP)
	OP = IDENT(OP) NAME
	OPSYN(NAME '.', OP, N)
	DEFINE(DEF, LBL)
	OPSYN(OP, NAME, N)              :(RETURN)
REDEFINE_END
