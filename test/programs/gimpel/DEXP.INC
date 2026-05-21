* DEXP.inc - DEXP(PROTO) defines functions in terms of a
*	     simple, one-line expression, such as
*		DEXP('AVE(X,Y) = (X + Y) / 2.0')
*
	DEFINE('DEXP(PROTO)NAME,ARGS')		:(DEXP_END)
DEXP	PROTO   POS(0)  SPAN(' ')  =
	PROTO   BREAK('(') . NAME  BAL . ARGS  =  NAME
	CODE(NAME  ' '  PROTO  '		:S(RETURN)F(FRETURN)')
	DEFINE(NAME  ARGS)			:(RETURN)
DEXP_END
