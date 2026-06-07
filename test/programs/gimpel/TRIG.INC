-MODULE TRIG
-INCLUDE "SQRT.INC"
-INCLUDE "DEXP.INC"
	DEFINE('SIN(A)K')
	DEFINE('SIN.(A)')
	PI. = 3.14159265358979              :(SIN_END)
SIN	SIN = LT(A,0) -SIN(-A)              :S(RETURN)
	SIN = LT(A,2 * PI.) SIN.(A)         :S(RETURN)
	K = CONVERT(A / (2 * PI.) , 'INTEGER')
	SIN = SIN.(A - K * 2 * PI.)         :(RETURN)
SIN.	SIN. = EQ(27., 27. - 4 * A * A) A   :S(RETURN)
	A = SIN.(A / 3.)
	SIN. = A * (3 - 4 * A * A)          :(RETURN)
SIN_END
	DEXP('COS(A) = SQRT(1 - SIN(A) ** 2)')
	DEXP('TAN(A) = SIN(A) / COS(A)')
