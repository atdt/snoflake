* CARDPAK.inc - Collection of functions useful for card games.
*
* RHAND(K,FLAG) will return a random hand with K cards in it.
*		If FLAG is nonnull, the dect will be reshuffled.
*		If an insufficient number of cards remain, RHAND
*		will fail.
*
* SUITS(H) will return just the suits for the hand H.
*
* VALS(H) will return just the values of the hand H.
*
* DISPLAY(H) will return a string representing the hand H in
*	     a form consistent with conventional representations.

-INCLUDE "RPERMUTE.INC"
-INCLUDE "ORDER.INC"
	DEFINE('RHAND(K,FLAG)')
	DEFINE('SUITS(H)')
	DEFINE('VALS(H)')
	DEFINE('DISPLAY(H)VALS,SUITS,V,S')
	FULL_DECK =
+	'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
	ALL_VALS = 'ABCDEFGHIJKLM'
	JUST_VALS = DUPL(ALL_VALS,4)
	JUST_SUITS = DUPL('C',13) DUPL('D',13) DUPL('H',13)
+	DUPL('S',13)
	                                            :(CARDPAK_END)
RHAND	RANDOM_DECK = DIFFER(FLAG) RPERMUTE(FULL_DECK)
	RANDOM_DECK LEN(K) . RHAND =                :F(FRETURN)S(RETURN)
SUITS	SUITS = REPLACE(H,FULL_DECK,JUST_SUITS)     :(RETURN)
VALS	VALS = REPLACE(H,FULL_DECK,JUST_VALS)       :(RETURN)
DISPLAY	VALS = REPLACE(VALS(H),ALL_VALS,'23456789TJQKA')
	SUITS = SUITS(H)
DISPLAY_1
	VALS LEN(1) . V =                           :F(RETURN)
	V = IDENT(V,'T') '10'
	SUITS LEN(1) . S =
	DISPLAY = DISPLAY V S ' '                   :(DISPLAY_1)
CARDPAK_END
