-MODULE ACOS
-INCLUDE "SQRT.INC"
-INCLUDE "DEXP.INC"
	DEFINE('ACOS(X)K,TERM,T')
	DEFINE('ATAN(X)')
	PI. = 3.14159265358979          :(ACOS_END)
ACOS	ACOS = LT(X,0) PI. - ACOS(-X)   :S(RETURN)
	ACOS = 1.0
	TERM = 1.0
	X = 1.0 - X
	K = 1
ACOS_1	TERM = TERM * (2 * K - 1) * X / (4 * K)
	ACOS = ACOS + TERM / (2 * K + 1)
	K = K + 1
	T = NE(ACOS,T) ACOS             :S(ACOS_1)
	ACOS = SQRT(2 * X) * ACOS       :(RETURN)
ACOS_END
	DEXP('ASIN(X) = (PI. / 2) - ACOS(X)')
	                                :(ARC_END)
ATAN	ATAN = ACOS(1. / SQRT(1 + X * X))
	ATAN = LT(X,0) -ATAN            :(RETURN)
ARC_END
