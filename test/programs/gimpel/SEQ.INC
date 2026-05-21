* SEQ.inc - SEQ(ARG_S,ARG_NAME) will sequence through a set of
*	    statements until failure is detected.  The indexing
*	    variable is given by the name ARG_NAME.  Can be
*	    profitably used to index the entries of an array.
*
*	Sample usage:
*
*	SEQ(" A<K> = INPUT ", .K)
*
	DEFINE('SEQ(ARG_S,ARG_NAME)')		:(SEQ_END)
SEQ	$ARG_NAME  =  0
	ARG_S  =  CODE(ARG_S  ' :S(SEQ_1)F(SEQ_2)')
+						:F(ERROR)
SEQ_1	$ARG_NAME  =  $ARG_NAME + 1		:<ARG_S>
SEQ_2	EQ($ARG_NAME,1)				:S(FRETURN)F(RETURN)
SEQ_END
