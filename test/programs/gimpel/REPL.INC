* REPL.inc - REPL(S1,S2,S3) will do a string-by-string replacement
*	     (as opposed to a character-by-character replacement
*	     ala REPLACE) on the string S1.  The string S1 is scanned
*	     for instances of the string S2  and each is replaced by
*	     S3.  Portions of S1 already scanned and the replaced
*	     string are not reexamined for instances of S2.
*
-INCLUDE "BREAKX.INC"
	DEFINE('REPL(S1,S2,S3)C,T,FINDC')   :(REPL_END)
REPL	S2 LEN(1) . C =                     :F(FRETURN)
	FINDC = BREAK(C) . T LEN(1)
	S2 = POS(0) S2
REPL_1	S1 FINDC =                          :F(REPL_2)
	S1 S2 =                             :F(REPL_3)
	REPL = REPL T S3                    :(REPL_1)
REPL_3	REPL = REPL T C                     :(REPL_1)
REPL_2	REPL = REPL S1                      :(RETURN)
REPL_END
