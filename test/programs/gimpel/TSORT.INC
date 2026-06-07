* TSORT.inc - TSORT(A,F,P) will perform a tournament sort on array
*	      or table A according to predicate P (default LGT).
*	      A may be singly-dimensioned if which case F, if non-
*	      null, will idicate the field of a programmer-defined
*	      datatype on which the sort is based.  A may also be a
*	      table or a doubly-dimensionted array.  In these cases
*	      F may be an integer indicating the column on which to
*	      sort.  If F is null, it is taken to be 1.  The array A
*	      is not modified; a new array is allocated and returned.
*
	DEFINE('TSORT(A,F,P)I,J,X,N,TS,T,P_I_J,K,II,W')
	DEFINE('PLAYOFF(K)')            :(PLAYOFF_END)
PLAYOFF	LT(K,1)                         :S(FRETURN)
	I = T<K * 2>                    :F(PLF_J)
	J = T<K * 2 + 1>                :F(PLF_I)
	LE(I,0)                         :S(PLF_J)
	LE(J,0)                         :S(PLF_I)
	EVAL(P_I_J)                     :S(PLF_J)
PLF_I	T<K> = I                        :(RETURN)
PLF_J	T<K> = J                        :(RETURN)
PLAYOFF_END
	DEFINE('TS(N)')                 :(TS_END)
TS	TS = 1
TS_1	TS = LT(TS,N) TS * 2            :S(TS_1)F(RETURN)
TS_END
	                                :(TSORT_END)
TSORT	A = CONVERT(A,'ARRAY')
	TSORT = ARRAY(PROTOTYPE(A))
	N = PROTOTYPE(A)
	N BREAK(',') . N                :F(TSORT_1)
	F = IDENT(F) 1
TSORT_1	TS = TS(N)
	T = ARRAY(TS - 1 + N)
TSORT_2	I = I + 1
	T<TS - 1 + I> = I               :S(TSORT_2)
	P = IDENT(P) 'LGT'
	X = F '(A<I>),' F '(A<J>)'
	X = IDENT(DATATYPE(F),'INTEGER')
+	'A<I,' F '>,A<J,' F '>'
	P_I_J = CONVERT(P '(' X ')', 'EXPRESSION')
	K = TS
TSORT_3	K = K - 1
	PLAYOFF(K)                      :S(TSORT_3)
TSORT_4	II = II + 1
	W = T<1>
	EQ(W,0)                         :S(RETURN)
	TSORT<II DIFFER(DATATYPE(F),'INTEGER')> = A<W>
+                                       :S(TSORT_7)
	J = 0
TSORT_6	J = J + 1
	TSORT<II,J> = A<W,J>            :S(TSORT_6)
TSORT_7	K = TS - 1 + W
	T<K> = 0
TSORT_5	K = K / 2
	PLAYOFF(K)                      :S(TSORT_5)F(TSORT_4)
TSORT_END
