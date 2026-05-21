* READRL.inc - READRL(P) will read a list in reverse.  That is,
*	       the head of the returned list will contain the
*	       last string read.  P is a pattern to indicate
*	       the end of list.  If P is null, the list is read
*	       in until an end-of-file condition is encountered.
*
	DEFINE('READRL(P)')
	DATA('LIST(NEXT,VALUE)')		:(READRL_END)
READRL	P  =  IDENT(P)  ABORT
READRL_1	S  =  INPUT			:F(RETURN)
	S   P					:S(RETURN)
	READRL  =  LINK(READRL, S)		:(READRL_1)
READRL_END
