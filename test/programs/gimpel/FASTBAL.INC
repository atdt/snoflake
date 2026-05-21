* FASTBAL.inc - FASTBAL(PARENS,QTS,S) will return a pattern which
*	will match all nonnull balanced strings where PARENS is
*	used to specify paired brackets in nested fashion and QTS
*	specifies characters to be used as quotes.  Bracket
*	characters within quotes are ignored for balancing purposes.
*	S specifies other special characters that BREAK should
*	stop at.
*
*	FASTBAL('(<[]>)',"'" '"',',)') will scan for arguments in
*	a function call in SNOBOL4 source.
*
*	See also:   BAL.INC or BALX.INC
*
	DEFINE('FASTBAL(PARENS,QTS,S)NAME,IBAL,SPCHARS,ELEM'
+	',LPS,Q,LP,RP')				:(FASTBAL_END)
FASTBAL	NAME  =  'FASTBAL_'  &STCOUNT
	IBAL  =  CONVERT(NAME, 'EXPRESSION')
	IBAL  =  DIFFER(S,NULL)  FASTBAL(PARENS,QTS)
	SPCHARS  =  PARENS QTS S
	ELEM  =  NOTANY(PARENS QTS) BREAK(SPCHARS)
FASTBAL_1	QTS    LEN(1) . Q  =		:F(FASTBAL_2)
	ELEM  =  Q BREAK(Q) Q | ELEM		:(FASTBAL_1)
FASTBAL_2	PARENS   LEN(1) . LP  RTAB(1) . PARENS
+	LEN(1) . RP				:F(FASTBAL_3)
	ELEM  =  LP IBAL RP | ELEM		:(FASTBAL_2)
FASTBAL_3	FASTBAL  =  BREAK(SPCHARS)  ARBNO(ELEM)
	$NAME  =  FASTBAL			:(RETURN)
FASTBAL_END
