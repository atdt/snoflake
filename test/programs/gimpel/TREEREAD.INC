* TREEREAD.inc - TREEREAD(LEVEL) will read a tree beginning at the given
*		 level.  It will fail if this level is not found on the
*		 input.
*
-INCLUDE "READ.INC"
	DEFINE('TREEREAD(LEVEL)SONS,N')
	TR_BC = ','
	LEVEL.TREEREAD = POS(0) (SPAN(' ') | NULL) *LEVEL
+	SPAN(' ') REM . TREEREAD
	                                :(TREEREAD_END)
TREEREAD	READ(LEVEL.TREEREAD)    :F(FRETURN)
	TREEREAD = TRIM(TREEREAD) TR_BC
TREEREAD_1	SONS = SONS TREEREAD(LEVEL + 1)
+                                       :F(TREEREAD_2)
	N = N + 1                       :(TREEREAD_1)
TREEREAD_2	TREEREAD = TREEREAD N TR_BC SONS
	                                :(RETURN)
TREEREAD_END
