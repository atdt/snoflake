* POL.inc - This is a compiler for the language L2 (Gimpel, p. 422).
*	    It produces Polish prefix using special semantic routines.
*
*	The code produces pattern STMT, which will be applied to
*	a statement of L2.  The result is on the stack, and may be
*	removed and displayed.  For example, given
*
*	"IF A(I) > 6 THEN I = 2" ? STMT
*	OUTPUT = POP()
*
*	the result displayed will be:
*
*	IFTHEN:2,>:2,REF:2,A,I,6,=:2,I,2
*
*	Program TR will translate this Polish (with "," appended)
*	to 4-tuples.
*	Program TUPLE translates 4-tuples into machine code.
*
* As given in Gimpel, the patterns TERM and E are left recursive,
* which is fine for SNOBOL4 with its one-character assumption and
* quickscan heuristics.  In SPITBOL, the left recursion immediately
* results in stack overflow.  Therefore, the patterns defining TERM
* and E have been modified to eliminate left recursion.  This has the
* side effect of making operators right-associative, so expressions
* such as A = B/C/D must be written as A = (B/C)/D.
*
* Sample input:
*   A = (B - C * D) / 10
-INCLUDE "DEXP.INC"
-INCLUDE "PUSH.INC"
	DEXP("POL(N) = SS('POL',N)")
	DEXP("CPUSH(ARG) = SS('CPUSH',ARG)")
	DEFINE('SS(NAME,ARG)')
	DEFINE('S_(NAME,ARG)T1,T2')                     :(S_END)
SS	SS = EVAL("NULL . *S_('" NAME "','" ARG "')")   :(RETURN)

S_	S_ = .DUMMY                                     :($('S_' NAME))
S_POL	T2 = POP()
	T1 = POP() ':' ARG ','
S_POL1	(EQ(ARG,1) PUSH(T1 T2))                         :S(NRETURN)
	ARG = ARG - 1
	T2 = POP() ',' T2                               :(S_POL1)

S_CPUSH	PUSH(ARG)                                       :(NRETURN)
S_END
	AL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
	NU = '0123456789'
	BL = SPAN(' ') | NULL
	IDEN = (ANY(AL) (SPAN(AL NU) | '')) . *PUSH() BL
	INTEGER = SPAN('0123456789') . *PUSH() BL
	ADDOP = ANY('+-') . *PUSH() BL
	MULOP = ANY('*/') . *PUSH() BL
	RELOP = (ANY('=<>') | ANY('~><') '=') . *PUSH() BL
	LP = '(' BL
	RP = ')' BL
	ELIST = *E (',' BL CPUSH('COMMA') *ELIST POL(2) | '')
	REF = IDEN LP CPUSH('REF') ELIST RP POL(2)
	PRIMARY = IDEN | INTEGER | LP *E RP | REF
	FACTOR = PRIMARY | '-' . *PUSH() BL PRIMARY POL(1)
* Catspaw Modification:  Eliminate left recursion in TERM and E.
*	TERM  =  *TERM MULOP FACTOR POL(2)  |  FACTOR
*	E  =  *E ADDOP TERM POL(2)  |  TERM
	TERM = FACTOR MULOP *TERM POL(2) | FACTOR
	E = TERM ADDOP *E POL(2) | TERM
	BOOL = *E RELOP *E POL(2)
	IFSTMT = ('IF' | 'if') BL BOOL ('THEN' | 'then') BL
+	(*STMT ('ELSE' | 'else') BL CPUSH('IFELSE') *STMT POL(3) |
+	CPUSH('IFTHEN') *STMT POL(2) )
	ASGNSTMT = (IDEN | REF) '=' . *PUSH() BL *E POL(2)
	STMT = IFSTMT | ASGNSTMT
