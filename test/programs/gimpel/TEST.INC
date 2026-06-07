* TEST.inc - TEST(ARG) accepts an unevaluated expression and
*	     returns a pattern that succeeds or fails with that expression
*	     while matching the null string on success.
*
	DEFINE('TEST(ARG)NAME')                     :(TEST_END)
TEST	IDENT(DATATYPE(ARG),'EXPRESSION')           :F(TEST_1)
	NAME = 'TEST_' &STCOUNT
	$NAME = ARG
	TEST = EVAL("NULL $ *TEST('" NAME "')")     :(RETURN)
TEST_1	TEST = ?EVAL($ARG) .TEST_                   :S(NRETURN)F(FRETURN)
TEST_END
