* LSORT.inc - LSORT(L,VFLD,NFLD,PRED) will sort a linked list L
*	      using a merge sort.  The caller may specify the name
*	      of the value field, the next field and the predicate.
*	      Default names are VALUE, NEXT and LGT.
*
	DEFINE('LSORT(L,VFLD,NFLD,PRED)L1,L2,PTR')
	DEFINE('LSORTA(N)I')            :(LSORT_END)
LSORT	VFLD = IDENT(VFLD) 'VALUE'
	NFLD = IDENT(NFLD) 'NEXT'
	PRED = IDENT(PRED) 'LGT'
	OPSYN('VFLD', VFLD)
	OPSYN('NFLD', NFLD)
	OPSYN('PRED', PRED)
	LSORT = LSORTA(0)               :(RETURN)
LSORTA	IDENT(L)                        :S(FRETURN)
	LSORTA = L
	L = NFLD(L)
	NFLD(LSORTA) =
	I = 1
LSORT_1	EQ(N,I)                         :S(RETURN)
	L2 = LSORTA(I)                  :F(RETURN)
	L1 = LSORTA
	PTR = .LSORTA
LSORT_C	PRED(VFLD(L1),VFLD(L2))         :F(LSORT_L1)
	$PTR = L2
	PTR = .NFLD(L2)
	L2 = NFLD(L2)
	IDENT(L2)                       :F(LSORT_C)
	$PTR = L1                       :(LSORT_DONE)
LSORT_L1	$PTR = L1
	PTR = .NFLD(L1)
	L1 = NFLD(L1)
	IDENT(L1)                       :F(LSORT_C)
	$PTR = L2
LSORT_DONE	I = I * 2               :(LSORT_1)
LSORT_END
