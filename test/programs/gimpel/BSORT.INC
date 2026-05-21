* BSORT - Bubble Sort
*
* BSORT(A,I,N) will sort in ascending lexical order the
* strings in the subarray A<I>, A<I + 1>, ..., A<N>.
*
* CAUTION: Bubble sorts may be time consuming for large arrays.
*
	DEFINE('BSORT(A,I,N)J,K,V')		:(BSORT_END)
BSORT	J  =  I
BSORT_1	J  =  J + 1  LT(J,N)			:F(RETURN)
	K  =  J
	V  =  A<J>
BSORT_2	K  =  K - 1  GT(K,I)			:F(BSORT_RO)
	A<K + 1>  =  LGT(A<K>,V)  A<K>		:S(BSORT_2)
	A<K + 1>  =  V				:(BSORT_1)
BSORT_RO	A<I>  =  V			:(BSORT_1)
BSORT_END
