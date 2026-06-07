-MODULE RSENTENCE
-INCLUDE "BAL.INC"
-INCLUDE "RSELECT.INC"
	DEFINE('RSENTENCE(STACK)VAR,EXP,S,TEXT')
	SYN.VAR = POS(0) '<' ARB . VAR '>'
	SNOBAL.EXP = POS(0) '(' BAL('(<>)','"' "'") . EXP ')'
	ASGN.VAR = POS(0) '=' ARB . VAR '='
	LITERAL.TEXT = BREAK('<=(') . TEXT
	RSENT_TBL = TABLE()
	SS = TRIM(INPUT)
RSI_1	S = TRIM(INPUT)
	S POS(0) ('<' | 'END' RPOS(0))              :S(RSI_2)
	SS = SS S                                   :(RSI_1)
RSI_2	SS '<' ARB . NM '>::=' =
	RSENT_TBL<NM> = '|' SS
	IDENT(S,'END')                              :S(RSENTENCE_END)
	SS = S                                      :(RSI_1)

RSENTENCE
	STACK SYN.VAR = RSELECT(RSENT_TBL<VAR>)     :S(RSENTENCE)
	STACK SNOBAL.EXP =                          :F(RSENT_1)
	S = S EVAL(EXP)                             :(RSENTENCE)
RSENT_1	STACK ASGN.VAR =                            :F(RSENT_2)
	$VAR = RSENTENCE('<' VAR '>')
	S = S $VAR                                  :(RSENTENCE)
RSENT_2	STACK LITERAL.TEXT =                        :F(RSENT_3)
	S = S TEXT                                  :(RSENTENCE)
RSENT_3	RSENTENCE = S STACK                         :(RETURN)
RSENTENCE_END
