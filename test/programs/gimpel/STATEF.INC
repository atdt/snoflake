* STATEF.inc - STATEF(PROTO,LBL) will define a state function
*	       with the given prototype and initial entry label.
*	       State functions return by executing
*			:(RET(label)) instead of :(RETURN)
*	       where label is the statement where execution
*	       begins the next time the state function is called.
*
-INCLUDE "PUSH.INC"
	DEFINE('STATEF(PROTO,LBL)NEWL')
	DEFINE('RET(NEXT)NAME')         :(STATEF_END)
STATEF	PROTO IDENT(LBL) BREAK('(') . LBL
	NLBL = LBL '_ENTRY'
	DEFINE(PROTO, NLBL)
	CODE(NLBL " PUSH('" NLBL "')		:($" NLBL ")" )
	$NLBL = LBL                     :(RETURN)
RET	NAME = POP()
	$NAME = NEXT
	RET = .RETURN                   :(NRETURN)
STATEF_END
