* PERM.inc - PERM(A) uses Trotter's algorithm to cycle through
*	     every permutation of a singly-dimensioned array with
*	     lower bound 1.  It fails when no more permutations
*	     remain.  A is assumed to have at least 2 elements.
*
*  2/7/1999 -- Erroneous EQ(D,1) term produced duplicate permutations.
*              Error and fix discovered by Logan C. Kinnison.
*
-INCLUDE "SWAP.INC"
	DEFINE('PERM(A)','PERM_INIT')               :(PERM_END)
PERM_INIT	SIZE_A = +PROTOTYPE(A)
	LOC_ELEMENT = ARRAY('0:' SIZE_A - 2, 1)
	DIR_ELEMENT = ARRAY('0:' SIZE_A - 2, 1)
	DEFINE('PERM(A,I,OFFSET)RL,D,LIMIT,AL')     :(RETURN)
PERM	RL = LOC_ELEMENT<I>                         :F(FRETURN)
	D = DIR_ELEMENT<I>
	LIMIT = EQ(D,1) SIZE_A - I
	LIMIT = EQ(D, -1) 1
	EQ(LIMIT, RL)                               :S(PERM_1)
	AL = RL + OFFSET
	SWAP(.A<AL>, .A<AL + D>)
	LOC_ELEMENT<I> = RL + D                     :(RETURN)
PERM_1	DIR_ELEMENT<I> = -D
*       Following line was erroneously printed as
*       EQ(D,1) in the book, instead of EQ(D,-1).
	OFFSET = EQ(D,-1) OFFSET + 1
	PERM(A, I + 1, OFFSET)                      :S(RETURN)
PERM_F	DEFINE('PERM(A)', 'PERM_INIT')              :(FRETURN)
PERM_END
