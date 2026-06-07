* FLOORCEIL.inc
*	FLOOR(X) will return the largest integer not greater than X.
*	CEIL(X) will return the smallest integer not less than X.
*
-INCLUDE "DEXP.INC"
	DEXP('CEIL(X) = -FLOOR(-X)')

	DEFINE('FLOOR(X)')              :(FLOOR_END)
FLOOR	FLOOR = CONVERT(X,'INTEGER')
	GE(X,0)                         :S(RETURN)
	FLOOR = NE(X,FLOOR) FLOOR - 1   :(RETURN)
FLOOR_END
