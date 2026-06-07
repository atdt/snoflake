* VISIT.inc - VISIT(ST) visits every programmer-defined structure
*	      reachable from ST once, calling PROCESS(ND) for each node.
*	      VISIT(ST,-1) resets marks so the structure can be visited again.
*
-INCLUDE "FLD.INC"
	DEFINE('VISIT(SON,SIGN)FATHER,GS,GF,DT,I')

	OPSYN('OLD_DATA', 'DATA')
	DEFINE('DATA(S)')               :(DATA_END)
DATA	S ')' = ',MARK)'
	OLD_DATA(S)                     :(RETURN)
DATA_END
	OPSYN('OLD_FIELD', 'FIELD')
	DEFINE('FIELD(DT,I)')           :(FIELD_END)
FIELD
	OLD_FIELD(DT,I + 1)             :F(FRETURN)
	FIELD = OLD_FIELD(DT,I)         :S(RETURN)F(FRETURN)
FIELD_END
	STND_DT = POS(0) ('STRING' | 'INTEGER' | 'REAL'
+	| 'PATTERN' | 'ARRAY' | 'TABLE' | 'NAME' |
+	'EXPRESSION' | 'CODE' | 'EXTERNAL') RPOS(0)
	                                :(VISIT_END)
VISIT	SIGN = EQ(SIGN,0) 1
	DATATYPE(SON) STND_DT           :S(RETURN)
VISIT_2	PROCESS(SON)
	MARK(SON) = SIGN
	I = 0
VISIT_1	I = I + 1
	GS = FLD(SON, I)                :F(VISIT_3)
	DATATYPE(GS) STND_DT            :S(VISIT_1)
	GT(SIGN * MARK(GS), 0)          :S(VISIT_1)
	MARK(SON) = SIGN * I
	FLD(SON,I) = FATHER
	FATHER = SON
	SON = GS                        :(VISIT_2)
VISIT_3	IDENT(FATHER)                   :S(RETURN)
	I = SIGN * MARK(FATHER)
	GF = FLD(FATHER,I)
	FLD(FATHER,I) = SON
	SON = FATHER
	FATHER = GF                     :(VISIT_1)
VISIT_END
