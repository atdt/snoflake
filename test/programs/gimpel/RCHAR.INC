* RCHAR.inc - RCHAR(CONTEXT) will a random character following
*	      the CONTEXT given as an argument.  If none such
*	      exists, RCHAR will fail.
*
*	      RCHAR will read a text corpus from INPUT to
*	      develop a body of text to supply statistics.
*	      The corpus is retained in the global R_CORPUS.
*
*	      Example, with an English corpus, RCHAR('BR')
*	      will return 'A' much more frequently than, say,
*	     'B' because 'A' is much more likely to follow the
*	      characters 'BR'.
*
-INCLUDE "RANDOM.INC"
-INCLUDE "BREAKX.INC"
	DEFINE('RCHAR(CONTEXT)BX,C,P,N,RC1')
RCHAR_1	X = TRIM(INPUT)                 :F(RCHAR_END)
	IDENT(X, 'END')                 :S(RCHAR_END)
	R_CORPUS = R_CORPUS X ' '       :(RCHAR_1)
RCHAR	CONTEXT LEN(1) . C              :F(RCHAR_2)
	BX = BREAKX(C)
RCHAR_2	P = POS(0) TAB(*N) BX CONTEXT LEN(1) . RCHAR
	N = RANDOM(SIZE(R_CORPUS)) - 1
	R_CORPUS P                      :S(RCHAR_3)
	N = 0
	R_CORPUS P                      :F(FRETURN)
RCHAR_3	N = N + 1
	RC1 = RCHAR
	R_CORPUS P                      :S(RCHAR_4)
	N = 0
	R_CORPUS P
RCHAR_4	RCHAR = EQ(RANDOM(2),1) RC1     :(RETURN)
RCHAR_END
