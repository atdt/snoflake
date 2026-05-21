* COMB.inc - COMB(N,M) returns the number of combinations
*	     of N things, taken M at a time.
*
	DEFINE('COMB(N,M)')			:(COMB_END)
COMB	COMB  =  EQ(M,0)  1			:S(RETURN)
	COMB  =  COMB(N - 1,M - 1) * N / M	:(RETURN)
COMB_END
