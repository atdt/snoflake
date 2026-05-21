* STRINGOUT.inc - STRINGOUT(A,SEP) will serve to convert from array
*		  to string.  SEP contains a separation string to be
*		  inserted between strings of the array A.
*
	DEFINE('STRINGOUT(A,SEP)I')		:(STRINGOUT_END)
STRINGOUT	I  =  1
	STRINGOUT  =  A<1>			:F(RETURN)
STRINGOUT_1	I  =  I + 1
	STRINGOUT  =  STRINGOUT  SEP  A<I>	:S(STRINGOUT_1)F(RETURN)
STRINGOUT_END
