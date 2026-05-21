* READ.inc - READ(P) will read in and return a line provided
*	     it is matched by the pattern P.  If there are no
*	     lines remaining or if the pattern fails, READ
*	     will fail.
*
	DEFINE('READ(P)')
						:(READ_END)
READ	LT(NF_INPUT, 0)				:S(FRETURN)
	IDENT(INPUT_BUF, NULL)			:F(READ_1)
	INPUT_BUF  =  INPUT			:F(READ_2)
READ_1
	INPUT_BUF    P				:F(FRETURN)
	READ  =  INPUT_BUF
	INPUT_BUF  =  NULL			:(RETURN)
READ_2	NF_INPUT  =  NF_INPUT - 1		:(READ)
READ_END
