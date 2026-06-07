* RSELECT.inc - RSELECT(S) will make a random selection of one of
*		a sequence of strings passed to it as an argument.
*		The first character in S is taken to be a break
*		character separating strings in the sequence.
*
*	RSELECT('|A|BIG|CAT') will return either "A", "BIG", or
*	"CAT" with probability one-third.  An optional integer
*	weight enclosed in sharp signs (#) may be placed at the
*	beginning of any alternation.  Thus:
*
*	RSELECT('|A|#3#BIG|CAT') will return "BIG" 3 times out
*	of five.
*
-INCLUDE "QUOTE.INC"
-INCLUDE "RANDOM.INC"
	DEFINE('RSELECT(S)WT,WTS,ALT,CODE,I,CODE,SSAVED,BC')
	RSEL_TBL = TABLE()              :(RSELECT_END)
RSELECT	CODE = RSEL_TBL<S>
	DIFFER(CODE,NULL)               :S<CODE>
	SSAVED = S
	S LEN(1) . BC =                 :F(RETURN)
RSELECT_1
	WT = 1
	S POS(0) '#' BREAK('#') . WT '#' =
	S (BREAK(BC) | REM) . ALT =
	WTS = WTS + WT
	CODE = CODE ' ;  RSELECT = LE(I,' WTS ') '
+	QUOTE(ALT) '				:S(RETURN)'
	S BC =                          :S(RSELECT_1)
	CODE = '  I = RANDOM(' WTS ') ' CODE
	S = SSAVED
	RSEL_TBL<S> = CODE(CODE)        :S(RSELECT)F(ERROR)
RSELECT_END
