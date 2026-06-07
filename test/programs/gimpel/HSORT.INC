* HSORT.inc - HSORT(A,I,N) will sort the strings in array A<I>,
*	      A<I + 1>, ..., A<N> in ascending sequence using
*	      Hoare's Quicksort.
*
-INCLUDE "SWAP.INC"
	DEFINE('HSORT(A,I,N)J,K,CRITERION')     :(HSORT_END)
HSORT	GT(N - I, 1)                            :S(HSORT_LARGE)
	GE(I,N)                                 :S(RETURN)
	(LGT(A<I>, A<N>) SWAP(.A<I>, .A<N>))    :(RETURN)
HSORT_LARGE
	CRITERION = A<(I + N) / 2>
	J = I - 1
	K = N + 1
HSORT_UP	J = J + 1
	~LGT(CRITERION, A<J>)                   :F(HSORT_UP)
HSORT_DOWN	K = K - 1
	~LGT(A<K>, CRITERION)                   :F(HSORT_DOWN)
	(LT(J,K) SWAP(.A<J>, .A<K>))            :S(HSORT_UP)
	HSORT(A,I,K)
	HSORT(A, K + 1, N)                      :(RETURN)
HSORT_END
