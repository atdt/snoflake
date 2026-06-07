* LOG.inc - CLOG(X) will return the common log (base 10) of X.
*	    LOG(X,B) will return the logarithm of X to the base B.
*	    LOG(X) will return the natural logarithm of X.
*
-INCLUDE "DEXP.INC"

	LN_10 = 2.3025850929940456840
	DEXP('LOG(X,B) = NE(B,0) CLOG(X) / CLOG(B) ;'
+	'   LOG   = EQ(B,0) CLOG(X) * LN_10   ;' )

	DEFINE('CLOG(X)FACTOR,T,K')         :(CLOG_END)
CLOG	X = X * 1.0
	FACTOR = X / X
CLOG_1	X = LT(X,1) 1 / X                   :F(CLOG_2)
	FACTOR = -FACTOR
CLOG_2	EQ(X,1.0)                           :S(RETURN)
	K = SIZE(CONVERT(X,'INTEGER')) - 1  :F(CLOG_4)
	EQ(K,0)                             :S(CLOG_3)
	CLOG = CLOG + K * FACTOR
	T = NE(CLOG,T) CLOG                 :F(RETURN)
	X = X / 10. ** K
CLOG_3	FACTOR = FACTOR / 10.
	X = X ** 10                         :(CLOG_1)
CLOG_4	K = 10
	X = X / 10. ** K
	CLOG = CLOG + K * FACTOR            :(CLOG_2)
CLOG_END
