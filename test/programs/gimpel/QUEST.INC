* QUEST.inc - QUEST(QS) will prompt the user, and receive structured
*	      input back.  It uses RSENTENCE to provide rude
*	      commentary if the user's input is not in the proper form.
*
*	Argument QS is a string containing an output prompt, a slash,
*	and a sequence of descriptors separated by a vertical bar.
*	Each descriptor is of the form
*
*		variable(values)label
*
*	See Gimpel, p. 379 for a complete description of QUEST.
*
*	Sample call:
*
*	  QUEST("How much to bet?/BET(1...10)|(QUIT)END") :S($LABEL)
*
*	The INPUT variable should be assigned to the file containing
*	rude phrases prior to including QUEST.inc.
*
-INCLUDE "RSENTENC.INC"
	DEFINE('QUEST(QS)QP,QPA,QN,QVP,QL,QLOW,QHI,QI')
	DEFINE('QUESTP(QS,QP)QP1,QS1')      :(QUESTP_END)
QUESTP	QP BREAK('|') . QP1 '|' =           :F(QUESTP_1)
	QUESTP(QS,QP1)                      :S(RETURN)F(QUESTP)
QUESTP_1	QP BREAK('(') . QN '(' =    :F(FRETURN)
	QN = IDENT(QN) 'QDUMMY'
	QP BREAK(')') . QVP ')' REM . QL
	IDENT(QVP,'ARB')                    :S(QUESTP_3)
	QVP ARB . QLOW '...' REM . QHI      :S(QUESTP_2)
	IDENT(QS,QVP)                       :S(QUESTP_3)F(FRETURN)
QUESTP_2	QLOW = ~INTEGER(QLOW) EVAL(QLOW)
	QHI = ~INTEGER(QHI) EVAL(QHI)
	QS = CONVERT(QS,'INTEGER')          :F(FRETURN)
	(LE(QLOW,QS) LE(QS,QHI))            :F(FRETURN)
QUESTP_3	$QN = QS
	LABEL = DIFFER(QL) QL               :(RETURN)
QUESTP_END
	NEUT = BREAK('|()')
	QUEST.QPA = NEUT '(' NEUT . QPA ')' (NEUT | REM)
	A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	ID.V = (ANY(A) (SPAN(A '0123456789_.') | '')) . V
	                                    :(QUEST_END)
QUEST	LABEL =
	QS BREAK('/') . OUTPUT '/' REM . QP
	QI = TRIM(INPUT)
*	OUTPUT  =  QI
QUEST_1	QP ID.V '...' = EVAL(V) '...'       :S(QUEST_1)
QUEST_2	QP '...' ID.V = '...' EVAL(V)       :S(QUEST_2)
	(DIFFER(QI,'?') QUESTP(QI,QP))      :F(QUEST_3)
	DIFFER(LABEL)                       :S(RETURN)F(FRETURN)
QUEST_3	QP QUEST.QPA = QPA                  :S(QUEST_3)
	OUTPUT = DIFFER(QI,'?')
+	RSENTENCE('Bad input, you <STUPID> <FOOL>')
	OUTPUT = 'The correct form is ' QP  :(QUEST)
QUEST_END
