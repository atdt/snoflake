* PAD.inc - PAD(S,CW) will add or delete blanks to the string S
*	    to make it conform to a column width of CW.
*
-INCLUDE "SPACING.INC"
-INCLUDE "REVERSE.INC"
	DEFINE('PAD(S,CW)I,K,T,N')
	INTERIOR_BK = ((SPAN(' ') | NULL) FENCE BREAK(' ')) . T
	                                :(PAD_END)
PAD	N = CW - SPACING(S)
	PAD = LE(N,0) S                 :S(PAD_REDUCE)
	S '.  ' = '.   '                :F(PAD_1)
	N = N - 1
	PAD = EQ(N,0) S                 :S(RETURN)
PAD_1	S = EQ(PAD_RT, 1) REVERSE(S)
PAD_LOOP	S INTERIOR_BK =         :F(PAD_AGAIN)
	PAD = PAD T ' '
	N = N - 1 GT(N,1)               :S(PAD_LOOP)
PAD_DONE
	PAD = PAD S
	PAD = EQ(PAD_RT,1) REVERSE(PAD)
	PAD_RT = 1 - PAD_RT             :(RETURN)
PAD_AGAIN	IDENT(PAD)              :S(PAD_DONE)
	S = PAD S
	PAD =                           :(PAD_LOOP)
PAD_REDUCE	N = LT(N,0) N + 1       :F(RETURN)
	PAD '  ' = ' '                  :(PAD_REDUCE)
PAD_END
