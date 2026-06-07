* PUT.inc - PUT(L) will output L.  It will label the OUTPUTted
*	    line starting in column 73.  The user may specify
*	    a label by assigning a string to the variable
*	    PUT_LABEL.  The lines will be numbered in increments
*	    of 1; the increment can be changed by assigning
*	    an appropriate value to PUT_INC.
*
-INCLUDE "LPAD.INC"
-INCLUDE "RPAD.INC"
	DEFINE('PUT(L)')
	PUT_INC = 1
	                                :(PUT_END)
PUT	PUT_N = PUT_N + PUT_INC
	OUTPUT = RPAD(L,72) PUT_LABEL
+	LPAD(PUT_N, 8 - SIZE(PUT_LABEL))
	PUNCH = OUTPUT                  :(RETURN)
PUT_END
