* ORSORT.inc - ORSORT(LIST) is intended to be a front-end to the OR
*	   function.  OR(LIST) can provide better factorization if
*	   the argument LIST is sorted.  For example,
*		OR(",LISO,LIST,ABC,LISTER")
*	   is equivalent to
*		("LIS" ("O" | "T")) | "ABC" | "LISTER"
*	   whereas
*		ORSORT(",LISO,LIST,LISTER,ABC")
*	   is equivalent to
*		"ABC" | ("LIS" ("O" | "T" | "TER"))
*
*	   The first character of LIST is used as the delimiter
*	   character between substrings.
*
*    Note: When LIST contains many thousands of alternatives, it is
*	   very inefficient to concatenate other patterns (such as POS(0)
*	   or RPOS(0)) with the large pattern tree returned by OR.
*	   Use a variable to hold the pattern result of OR, and then use
*	   *variable deferred evaluation to concatenate other patterns to it.
*	   This form of concatenation is very efficient, because it only
*	   is done to the top-level "*" node:
*
*	      LIST_P = OR(LIST)		 ;* assume LIST is very large
*	      P = POS(0) *LIST_P RPOS(0) ;* fast pattern concatenation
*
-INCLUDE "OR.INC"
	DEFINE('ORSORT(LIST)BC,ANCSEIZE,WORD,SORTED,SCAN,INSERTED'
+	',CURRENT')                                 :(ORSORT_END)
ORSORT	LIST LEN(1) . BC                            :F(FRETURN)
	ANCSEIZE = POS(0) BC (BREAK(BC) | REM) . WORD
ORS_0	LIST ANCSEIZE =                             :F(ORS_1)
	SORTED (BC WORD) (BC | RPOS(0))             :S(ORS_0)
	SCAN = SORTED
	SORTED =
	INSERTED =
ORS_2	SCAN LEN(1) (BREAK(BC) | REM) . CURRENT =   :F(ORS_4)
	DIFFER(INSERTED)                            :S(ORS_3)
	LGT(CURRENT,WORD)                           :F(ORS_3)
	SORTED = SORTED BC WORD
	INSERTED = 1
ORS_3	SORTED = SORTED BC CURRENT                  :(ORS_2)
ORS_4	DIFFER(INSERTED)                            :S(ORS_0)
	SORTED = SORTED BC WORD                     :(ORS_0)
ORS_1	ORSORT = OR(SORTED)                         :S(RETURN)F(FRETURN)
ORSORT_END
