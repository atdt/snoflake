* BLANKS - BLANKS(S) will return the result of removing blanks from
*	   a Fortran statement provided in S.  BLANKS(S) will
*	   operate  correctly for OS/360 Fortran.  The statement is
*	   presumed to have had its label removed by previous
*	   processing.
*
-INCLUDE "DIFF.INC"
	DEFINE('BLANKS(S)IF,KW,STMT,IO')
	Q = "'"
	ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	NUM = '0123456789'
	BLINT = ANY(NUM) (SPAN(NUM ' ') | NULL)
	F.LIT = BLINT $ N 'H' LEN(*DIFF(N,' ')) . LIT
+	| Q BREAK(Q) . LIT Q
	ITEM1 = F.LIT | SPAN(' ') | SPAN(ALPHA NUM ' ')
+	| LEN(1)
	SEARCH.LIT = POS(0) ARBNO(ITEM1 FENCE) . TEMP F.LIT
	ITEM2 = '(' *FBAL ')' | ITEM1
	FBAL = ARBNO(ITEM2 FENCE)
	DEFINE('BL(S)LIT,TEMP')                     :(BL_END)
BL	S SEARCH.LIT =                              :F(BL_1)
	BL = BL DIFF(TEMP,' ') "'" LIT "'"          :(BL)
BL_1	BL = BL DIFF(S,' ')                         :(RETURN)
BL_END
	KWORD.KW = POS(0) SPAN(ALPHA ' (') . KW
	IF.STMT = POS(0) ('IF(' FBAL ')') . IF REM . STMT
	IO.STMT = POS(0) (('READ' | 'WRITE') '('
+	BREAK(ALPHA NUM) SPAN(ALPHA NUM ' ')) . IO Q REM . STMT
	                                            :(BLANKS_END)
BLANKS	S KWORD.KW = DIFF(KW,' ')
	BLANKS = S
	BLANKS IF.STMT = BL(IF) BLANKS(STMT)        :S(RETURN)
	BLANKS IO.STMT = DIFF(IO,' ') "'" BL(STMT)  :S(RETURN)
	BLANKS = BL(S)                              :(RETURN)
BLANKS_END
