* ONEWAY.inc - ONEWAY(S) returns a deterministic one-way cipher
*	       for a string over the 32-character alphabet below.
*
-INCLUDE "LPAD.INC"
-INCLUDE "BASEB.INC"
-INCLUDE "RPERMUTE.INC"
-INCLUDE "BASE10.INC"
-INCLUDE "BLEND.INC"
	DEFINE('ONEWAY(S)A,SIZE,C,K,SB')    :(ONEWAY_END)
ONEWAY	RAN_VAR = 1
	A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ012345'
	PWR = 5
ONEWAY_1	S LEN(1) . C =              :F(ONEWAY_2)
	A @K C                              :F(ERROR)
	SB = SB LPAD(BASEB(K,2),PWR,'0')
	RAN_VAR = REMDR(RAN_VAR * 2 ** PWR + K, 414971)
	                                    :(ONEWAY_1)
ONEWAY_2
	RPERMUTE(BLEND(SB,REPLACE(SB,'01','10')))
+	LEN(SIZE(SB)) . SB
ONEWAY_3
	SB LEN(PWR) . S =                   :F(RETURN)
	A POS(BASE10(S,2)) LEN(1) . C
	ONEWAY = ONEWAY C                   :(ONEWAY_3)
ONEWAY_END
