* ORBREAK.inc - ORBREAK(LIST) is intended to be an adjunct function to
*	   the OR or ORSORT functions.  ORBREAK returns a string that
*	   is suitable for use as an argument to BREAKX, consisting
*	   the first characters of all of the alternatives in LIST,
*	   and allowing for the OR convention that (abc) is equivalent
*	   to ANY('abc').
*
*	   It it designed to speed up the searching of OR or ORSORT.
*	   Typical usage:
*
*		LIST = ",LISO,LIST,ABC,LISTER"
*		LIST_P = ORSORT(LIST)
*		BREAKX(ORBREAK(LIST)) *LIST_P
*	   is equivalent to
*		BREAKX("AL") ("ABC" | ("LIS" ("O" | "T" | "TER")))
*
*	   Note the use of the extra variable LIST_P and the
*	   deferred evaluation *LIST_P used in pattern concatenation.
*	   When LIST contains many thousands of alternatives, it is
*	   very inefficient to concatenate other patterns with this large
*	   tree.  Using *LIST_P makes this concatenation very efficient,
*	   because it only is done to the top-level "*" node.
* 
	DEFINE('ORBREAK(LIST)BC,ANCSEIZE,TLIST,WORD,C') :(ORBREAK_END)
ORBREAK	LIST    LEN(1) . BC			:F(FRETURN)
	ANCSEIZE  =  POS(0) BC (BREAK(BC) | REM) . WORD
	TLIST = LIST
ORB_0	TLIST     ANCSEIZE =			:F(RETURN)
	WORD      POS(0) (NOTANY('(') . C) | ('(' BREAK(')') . C) :F(ORB_0)
	ORBREAK = ORBREAK C			:(ORB_0)
ORBREAK_END
