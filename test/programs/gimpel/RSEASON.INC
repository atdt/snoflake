* RSEASON.inc - RSEASON(GAMES) simulates a season of baseball.
*		GAMES is the number of games.  The value
*		returned is the number of runs scored in
*		the simulation.
*
*	The simulation is governed by statistics read in at
*	initialization time from file RSEASON.in.  The sample
*	data provided is from the starting lineup of the 1927
*	New York Yankees.  There were 154 games that season.
*
*	Caller should open file RSEASON.in attached to
*	variable INPUT prior to calling RSEASON.
*
-INCLUDE "RANDOM.INC"
	DEFINE('RSEASON(GAMES)INNING,RUNS,BASES,OUTS,K')
	DATA('RECORD(AB,H,DB,TR,HR,BB)')
	STATS = ARRAY(9)
	I = 0
RS_INIT	I = I + 1
	STATS<I> = EVAL('RECORD(' INPUT ')')        :S(RS_INIT)
	                                            :(RSEASON_END)
RSEASON	GAMES = GT(GAMES,0) GAMES - 1               :F(RETURN)
	BATTER = 0
RS_1	OUTS = 0
	BASES =
RS_2	BATTER = EQ(BATTER,9) 0
	BATTER = BATTER + 1
	S = STATS<BATTER>
	K = RANDOM(AB(S) + BB(S))
	ADV = GT(K,AB(S)) '1223'                    :S(RS_BB)
	OUTS = GT(K,H(S)) OUTS + 1                  :S(RS_OUT)
	ADV = LE(K,HR(S)) 'RRRR'                    :S(RS_4)
	ADV = LE(K,HR(S) + TR(S)) '3RRR'            :S(RS_4)
	ADV = LE(K,HR(S) + TR(S) + DB(S)) '23RR'    :S(RS_4)
	ADV = '12RR'
RS_4	BASES = REPLACE(BASES 0, '0123', ADV)       :(RS_2)
RS_BB	BASES '321' = '421'
	BASES '21' = '31'                           :(RS_4)
RS_OUT	EQ(OUTS,3)                                  :F(RS_2)
	RUNS = 0
	BASES SPAN('R') @RUNS
	RSEASON = RSEASON + RUNS
	INNING = INNING + 1 LT(INNING,9)            :S(RS_1)
	INNING = 0                                  :(RSEASON)
RSEASON_END
