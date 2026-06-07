	DEFINE('BAL(PARENS,QTS)Q,GBAL,NAME,STAR,LP,RP')
	                                                    :(BAL_END)
BAL	NAME = 'BAL_.' &STCOUNT
	STAR = CONVERT(NAME, 'EXPRESSION')
	GBAL = NOTANY(PARENS QTS)
BAL_1	QTS LEN(1) . Q =                                    :F(BAL_2)
	GBAL = Q BREAK(Q) Q | GBAL                          :(BAL_1)
BAL_2	PARENS LEN(1) . LP RTAB(1) . PARENS LEN(1) . RP     :F(BAL_3)
	GBAL = LP (STAR | NULL) RP | GBAL                   :(BAL_2)
BAL_3	BAL = GBAL ARBNO(GBAL)
	$NAME = BAL                                         :(RETURN)
BAL_END
