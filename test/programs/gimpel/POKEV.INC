* POKEV.inc - POKEV(H) will evaluate a poker hand (5 cards) producint
*	      a number uniformly distributed in the range (0,1) and
*	      monotonically increasing with strength of the hand.
*
-INCLUDE "ORDER.INC"
-INCLUDE "ROTATER.INC"
-INCLUDE "REVERSE.INC"
-INCLUDE "COMB.INC"
-INCLUDE "BASE10.INC"
-INCLUDE "CARDPAK.INC"
-INCLUDE "DECOMB.INC"
-INCLUDE "SUBSTR.INC"
	DEFINE('POKEV(H)VALS,SUITS,V,W')
	STRAIGHT_SEQ = REVERSE(ALL_VALS) SUBSTR(ALL_VALS,13,1)
	PAIR.V = LEN(1) $ V *V
	TRIPS.V = PAIR.V *V
	FOURS.V = TRIPS.V *V
	FLUSH.V = FOURS.V *V
	POKEV_A = ARRAY('-1:8')
	POKEV_A<0> = 0.501
	POKEV_A<1> = 0.924
	POKEV_A<2> = 0.971
	POKEV_A<3> = 0.9924
	POKEV_A<4> = 0.9963
	POKEV_A<5> = 0.9983
	POKEV_A<6> = 0.99974
	POKEV_A<7> = 0.999985
	POKEV_A<8> = 1.0
	DEFINE('PR(L,PREFIX)COMBS,FRACTION,A')  :(POKEV_END)
PR
	COMBS = COMB(13,SIZE(VALS))
	BASEB_ALPHA = ALL_VALS
	COMB_ALPHA = ALL_VALS
	FRACTION = (BASE10(PREFIX,13) * COMBS + DECOMB(VALS))
+	/ (13. ** SIZE(PREFIX) * COMBS)
	A = POKEV_A
	POKEV = A<L - 1> + (A<L> - A<L - 1>) * FRACTION
	PR = .RETURN                            :(NRETURN)
POKEV	VALS = REVERSE(ORDER(VALS(H)))
	SUITS = SUITS(H)
	STRAIGHT_SEQ VALS | ROTATER(VALS,-1)    :F(POKEV_3)
	SUITS FLUSH.V                           :S(PR(8))F(PR(4))
POKEV_3
	SUITS FLUSH.V                           :S(PR(5))
	VALS PAIR.V                             :F(PR(0))
	VALS FOURS.V =                          :S(PR(7,V))
	VALS TRIPS.V =                          :F(POKEV_5)
	W = V
	VALS PAIR.V =                           :S(PR(6,W V))F(PR(3,W))
POKEV_5
	VALS PAIR.V =
	W = V
	VALS PAIR.V =                           :S(PR(2,W V))F(PR(1,W))
POKEV_END
