* FRSORT.inc - FRSORT(S) will do a frequency sort on the characters
*	       of the string S.  The most frequent character will
*	       appear first in the string returned.
*
-INCLUDE "SKIM.INC"
-INCLUDE "COUNT.INC"
-INCLUDE "AI.INC"
-INCLUDE "MSORT.INC"
-INCLUDE "STRINGOU.INC"
-INCLUDE "CRACK.INC"
-INCLUDE "SEQ.INC"
	DEFINE('FRSORT(S)SC,C,N,I')                 :(FRSORT_END)
FRSORT	C = CRACK(SKIM(S))
	N = ARRAY(PROTOTYPE(C))
	SEQ('  N<I>  =  COUNT(S,C<I>) ' , .I)
	FRSORT = STRINGOUT(AI(C,MSORT(N,'LT')))     :(RETURN)
FRSORT_END
