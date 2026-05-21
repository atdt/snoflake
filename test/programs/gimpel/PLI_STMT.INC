* PLI_STMT.inc - This pattern is intended to match a PL/I statement
*		 (assigning to STMT the string matched) and to fail
*		 if none exists.
*
	Q  =  "'"
	QLIT  =  Q  FENCE  BREAK(Q)  Q
	CMNT  =  '/*'  FENCE  ARB  '*/'
	ELEM  =  QLIT | CMNT | LEN(1) BREAK('/;' Q)
	PLI.STMT  =  POS(0)  (ARBNO(ELEM FENCE) ';') . STMT
