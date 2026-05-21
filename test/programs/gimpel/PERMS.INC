* PERMS.inc - PERMS(S) will permute the characters of the string S.
*	      S is assumed to be at least 2 characters long and no
*	      greater than the size of &ALPHABET.  The argument
*	      S should be the string which had been returned by PERMS
*	      on the last call.  When no more permutations remain,
*	      PERMS will fail.
*
	DEFINE('PERMS(S)T,N,C,K','PERMS_INIT')	:(PERMS_END)
PERMS_INIT
	N  =  SIZE(S)
	N_R  =  ARRAY('2:'  N, 0)
	&ALPHABET    LEN(N) . SECOND_OP		:F(ERROR)
	FIRST_OP  =  ARRAY('2:' N, SECOND_OP)
	K  =  N + 1
PERMS_I1	K  =  K - 1
	FIRST_OP<K>    LEN(1) . S1  TAB(K) . S2  =  S2  S1
+						:S(PERMS_I1)
	DEFINE('PERMS(S)I,K')
	PERMS  =  S				:(RETURN)
PERMS	K  =  SIZE(S)
PERMS_1
	S  =  REPLACE(FIRST_OP<K>, SECOND_OP, S)  :F(PERMS_2)
	N_R<K>  =  N_R<K> + 1
	K  =  EQ(REMDR(N_R<K>, K), 0)  K - 1	:S(PERMS_1)
	PERMS  =  S				:(RETURN)
PERMS_2	DEFINE('PERMS(S)T,N,S1,S2','PERMS_INIT')  :(FRETURN)
PERMS_END
