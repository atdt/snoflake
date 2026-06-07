* MSORT.inc - MSORT(A,OP) uses a merge sort to return an array
*	      of indices which can then be used to sort the array A.
*	      OP is the operation to be used to indicate ordering.
*
-INCLUDE "IP.INC"
	DEFINE('MSORT(A,OP)U,P,I,K,SAVE,AI,AJ')
	DEFINE('CHAIN(L,U)I,J,MIDDLE,K')
	                                :(MSORT_END)
CHAIN	CHAIN = EQ(L,U) L               :S(RETURN)
	MIDDLE = (L + U) / 2
	I = CHAIN(L, MIDDLE)
	J = CHAIN(MIDDLE + 1,U)
	CHAIN = I
	AI = A<I>
	AJ = A<J>
	CHAIN = CHAINOP(A<I>,A<J>) J
	K = CHAIN
	EQ(K,I)                         :S(CHAIN_I1)F(CHAIN_J1)
CHAIN_COMP	CHAINOP(AI,AJ)          :S(CHAIN_J)F(CHAIN_I)
CHAIN_I	P<K> = I
	K = I
CHAIN_I1	I = P<I>
	AI = A<I>                       :S(CHAIN_COMP)
	P<K> = J                        :(RETURN)
CHAIN_J	P<K> = J
	K = J
CHAIN_J1	J = P<J>
	AJ = A<J>                       :S(CHAIN_COMP)
	P<K> = I                        :(RETURN)

MSORT	OP = IDENT(OP) 'LGT'
	OPSYN('CHAINOP',OP)
	U = +PROTOTYPE(A)
	P = ARRAY(U)
	I = CHAIN(1,U)
MSORT_1	K = K + 1
	SAVE = P<I>                     :F(MSORT_2)
	P<I> = K
	I = SAVE                        :(MSORT_1)
MSORT_2	IP(P)
	MSORT = P                       :(RETURN)
MSORT_END
