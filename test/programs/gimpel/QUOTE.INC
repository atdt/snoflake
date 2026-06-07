* QUOTE.inc - QUOTE(S) will convert its argument to a string
*	      which will resemble a SNOBOL4 expression which,
*	      when evaluated, will yield the original string S.
*
-INCLUDE "REPL.INC"
	DEFINE('QUOTE(S)S1,Q,QQ')                       :(QUOTE_END)
QUOTE	Q = "'" ; QQ = '"'
	QUOTE = Q REPL(S, Q, Q ' ' QQ Q QQ ' ' Q) Q     :(RETURN)
QUOTE_END

