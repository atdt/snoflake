* SNOREAD.inc - SNOREAD() will read in and return the next SNOBOL4
*		sstatement.  If no statements remain, it will fail.
*
-INCLUDE "READ.INC"
-INCLUDE "FASTBAL.INC"
	DEFINE('SNOREAD()S,LBL')
	ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	NUM = '0123456789'
	CONTINUE.S = POS(0) ANY('+.') REM . S
	SNO_STMTS = POS(0) ANY(ALPHA NUM ' ')
	SNO_STMT = (POS(0) BREAK(' ;')
+	FASTBAL( , '"' "'", ';') ';') . SNOREAD
	                                            :(SNOREAD_END)
SNOREAD	SNO_BUFFER SNO_STMT =                       :S(RETURN)
	IDENT(SNO_BUFFER)                           :F(ERROR)
SNOREAD_1	SNO_BUFFER = TRIM(READ(SNO_STMTS))  :S(SNOREAD_2)
	READ()                                      :F(FRETURN)S(SNOREAD_1)
SNOREAD_2	SNO_BUFFER = SNO_BUFFER ' ' ?READ(CONTINUE.S)
+	TRIM(S)                                     :S(SNOREAD_2)
	SNO_BUFFER = SNO_BUFFER ';'                 :(SNOREAD)
SNOREAD_END
