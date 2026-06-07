* RESOLUTION.inc - RESOLUTION() returns the clock resolution of
*		   the machine as an integral number of milliseconds.
*
	DEFINE('RESOLUTION()T')         :(RESOLUTION_END)
RESOLUTION	T = TIME()
RESOLUTION_1	RESOLUTION = TIME() - T
	GT(RESOLUTION,0)                :S(RETURN)F(RESOLUTION_1)
RESOLUTION_END
