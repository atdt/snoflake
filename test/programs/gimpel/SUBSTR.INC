* SUBSTR.inc - Extract substring
*
	DEFINE('SUBSTR(S,I,L)')             :(SUBSTR_END)
SUBSTR	S LEN(*(I - 1)) LEN(*L) . SUBSTR    :S(RETURN)F(FRETURN)
SUBSTR_END
