* PUSH.inc - PUSH(X) will add X to the head of a stack pointed
*	     to by global PUSH_POP.  It returns by name, pointing
*	     to the VALUE cell of the LINK just allocated.
*
	DEFINE('PUSH(X)')
	DEFINE('POP()')
	DEFINE('TOP()')
	DATA('LINK(NEXT,VALUE)')
						:(PUSH_END)
PUSH	PUSH_POP  =  LINK(PUSH_POP,X)
	PUSH  =  .VALUE(PUSH_POP)		:(NRETURN)
POP	IDENT(PUSH_POP)				:S(FRETURN)
	POP  =  VALUE(PUSH_POP)
	PUSH_POP  =  NEXT(PUSH_POP)		:(RETURN)
TOP	IDENT(PUSH_POP)				:S(FRETURN)
	TOP  =  .VALUE(PUSH_POP)		:(NRETURN)
PUSH_END
