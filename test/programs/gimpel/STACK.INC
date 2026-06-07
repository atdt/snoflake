* STACK.inc - STACK(SUF) will create unique stack functions
*	      with the given suffix.  STACK('A') will
*	      create functions PUSHA(V), POPA(), and TOPA().
*
-INCLUDE "REPL.INC"
	DEFINE('STACK(SUF)S')
	DATA('LINK(VALUE,NEXT)')        :(STACK_END)
STACK	S =
+	'PUSHSUF    STACK_SUF = LINK(V,STACK_SUF)           ;'
+	'           PUSHSUF = .VALUE(STACK_SUF)	:(NRETURN);'
+	'POPSUF     IDENT(STACK_SUF)		:S(FRETURN);'
+	'           POPSUF = VALUE(STACK_SUF)               ;'
+	'           STACK_SUF = NEXT(STACK_SUF)	:(RETURN);'
+	'TOPSUF     IDENT(STACK_SUF)		:S(FRETURN);'
+	'           TOPSUF = .VALUE(STACK_SUF)	:(NRETURN);'
	CODE(REPL(S,'SUF',SUF))
	DEFINE('PUSH' SUF '(V)')
	DEFINE('POP' SUF '()' )
	DEFINE('TOP' SUF '()' )         :(RETURN)
STACK_END
