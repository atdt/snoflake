* ORDER.inc - ORDER(S) will put the characters of its argument into
*	      alphabetic order.
*
	DEFINE('ORDER(S)T,HIGHS,S1')
						:(ORDER_END)
ORDER	S    LEN(1) . T  =			:F(RETURN)
	&ALPHABET  BREAK(T)  REM . HIGHS
	ORDER   (BREAK(HIGHS) | REM) . S1 = S1 T  :(ORDER)
ORDER_END
