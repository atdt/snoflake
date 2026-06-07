* TICTACTOE.inc - Functions useful for constructing a TicTacToe
*		  or other 0-X board games.
*
*	NEXTBD(B) will cycle through all the boards equivalent to
*	equivalent to a given board.  B is the last board returned.
*	Initialize by setting NEXT_N to 0.
*
*	TTTV(B) will determine the value of the board B to player
*	X given that it is X's move.  It is presumed that X does not
*	yet have a winning combination.
*
*	TTTM(B) will find the best move that player X can make on
*	the given board.  It first checks to determine whether it
*	or any board similar to it was processed before.  Old boards
*	are kept in table TTT.  TTTM actually returns the new game state.
*
	DEFINE('NEXTBD(B)')                             :(NEXTBD_END)
NEXTBD	NEXT_N = EQ(NEXT_N,8)                           :S(FRETURN)
	NEXT_N = NEXT_N + 1
	NEXTBD = REPLACE('741852963','123456789',B)
	NEXTBD = EQ(REMDR(NEXT_N,4))
+	REPLACE('321654987','123456789',B)
	                                                :(RETURN)
NEXTBD_END
	DEFINE('TTTV(BOARD)')
	LOS_PAT = POS(0) ('OOO' | 'O' LEN(3) 'O' LEN(3) 'O'
+	| LEN(3) 'OOO')
	                                                :(TTTV_END)
TTTV	NEXT_N = 0
	TTTV = -1
TTTV_1
	BOARD = NEXTBD(BOARD)                           :F(TTTV_2)
	BOARD LOS_PAT                                   :S(RETURN)F(TTTV_1)
TTTV_2
	TTTV = 0
	TTTV = -TTTV(REPLACE(TTTM(BOARD),'XO','OX'))    :(RETURN)
TTTV_END
	DEFINE('TTTM(BOARD)T,N,MAX,V')
	TTT = TABLE()
	                                                :(TTTM_END)
TTTM	NEXT_N = 0
	MAX = -2
	BOARD ' '                                       :F(FRETURN)
TTTM_1	BOARD = NEXTBD(BOARD)                           :F(TTTM_2)
	TTTM = TTT<BOARD>
	DIFFER(TTTM)                                    :S(RETURN)F(TTTM_1)
TTTM_2	BOARD (TAB(N) ARB) . T ' ' @N = T 'X'           :F(TTTM_4)
	V = -TTTV(REPLACE(BOARD,'OX','XO'))
	MAX = GT(V,MAX) V                               :F(TTTM_3)
	TTTM = BOARD
TTTM_3	BOARD POS(N - 1) LEN(1) = ' '                   :(TTTM_2)
TTTM_4	TTT<BOARD> = TTTM                               :(RETURN)
TTTM_END
