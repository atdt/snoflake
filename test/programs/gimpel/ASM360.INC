* ASM360 - Parse IBM 360 assembly-language statement.
*
*	This code fragment develops the pattern ASM360
*	which can then be applied to a subject to break
*	the subject into NAME, OPERATION, OPERAND, and
*	COMMENT fields.  It follows all of the contorted
*	rules of the IBM assembly-langauge manual.
*
	LETTER  =  'ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@'
	SP.CH   =  "+-,=.*()'/& "
	SCOTA  =  SP.CH
	SCOTA   '&'  =
	Q  =  "'"
	QLIT  =  Q  FENCE  BREAK(Q)  Q
	ELEM  =  QLIT | 'L' Q | ANY(SCOTA) | BREAK(SCOTA) | REM
	F3  =  ARBNO(ELEM FENCE)
	B  =  (SPAN(' ') | RPOS(0))  FENCE
	F1  =  BREAK(' ')  |  REM
	F2  =  F1
	CAOP  =  ('LCL'  |  'SET')  ANY('ABC')  |
+	'AIF'  |  'AGO'  |  'ACTR'  |  'ANOP'
	ATTR  =  ANY('TLSIKN')
	ELEMC  =  '(' FENCE *F3C ')'  |  ATTR Q  |  ELEM
	F3C    =  ARBNO(ELEMC  FENCE)
	ASM360  =  F1 . NAME  B
+	( CAOP . OPERATION  B  F3C . OPERAND  |
+	F2 . OPERATION    B  F3 . OPERAND)
+	B    REM . COMMENT
