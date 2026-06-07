* TR.inc - TR() translates and reduces to null a Polish prefix
*	   string in global POLISH.  The form of the string is
*	   that produced by POL.inc.  The output of TR is a string
*	   of 4-tuples, suitable for the code generator in TUPLE.inc.
*
-INCLUDE "PUSH.INC"
-INCLUDE "TEMP.INC"
	DEFINE('TR(ARG)OP,N,P,T,ID,L1,L2')
	ITREE = ANY('+-*/') ':' ANY('12') ',' *ITREE |
+	ANY('IJKLMNijklmn') BREAK(',:') ',' | 'REF:2,' *ITREE
	RTREE = ANY('+-*/') ':' ANY('12') ',' *RTREE |
+	NOTANY('IJKLMNijklmn') BREAK(',:') ',' | 'REF:2,' *RTREE
	                                    :(TR_END)
TR	POLISH POS(0) BREAK(':,') . OP ':' BREAK(',') . N
+	',' =                               :S($('TR_' OP))
	POLISH BREAK(',') . *PUSH() ',' =   :(RETURN)
TR_+	;TR_- ;TR_* ;TR_/
	TR = EQ(N,1) TR() 'MNS,' POP() ',,' PUSH(TEMP()) '//'
+                                           :S(RETURN)
	'+ADD-SUB*MUL/DIV' OP LEN(3) . OP
	POLISH POS(0) ITREE                 :S(TR_1)
	OP = 'F' OP
TR_1	T = TR()
	P = POP()
	TR = T TR() OP ',' P ',' POP() ',' PUSH(TEMP()) '//'
+                                           :(RETURN)
TR_REF	POLISH BREAK(',') . ID ',' =
	TR = TR()
	TOP() '('                           :S(TR_REF1)
	PUSH(ID '(' POP() ')')              :(RETURN)
TR_REF1	T = TEMP()
	TR = TR 'ASGN,' POP() ',,' T '//'
	PUSH(ID '(' T ')')                  :(RETURN)
TR_>	;TR_>= ;TR_< ;TR_<= ;TR_~= ;TR_EQ
	'EQNE ~=EQ <GE >LE <=GT >=LT' OP LEN(2) . OP
	T = TR()
	P = POP()
	TR = T TR() 'BR' OP ',' P ',' POP() ',' ARG '//'
+                                           :(RETURN)
TR_=	TR = TR() TR() 'ASGN,' POP() ',,' POP() '//'
+                                           :(RETURN)
TR_IFTHEN
TR_IFELSE	L1 = LABEL()
	POLISH POS(0) '=:2' = 'EQ:2'
	TR = TR(L1) TR()
	TR = EQ(N,2) TR 'LBL,' L1 '//'      :S(RETURN)
	L2 = LABEL()
	TR = TR 'BR,,,' L2 '//'
+	'LBL,' L1 '//' TR() 'LBL,' L2 '//'  :(RETURN)
TR_END
	DEFINE('LABEL()')                   :(LABEL_END)
LABEL	LABEL_NO = LABEL_NO + 1
	LABEL = 'LBL.' LABEL_NO             :(RETURN)
LABEL_END
