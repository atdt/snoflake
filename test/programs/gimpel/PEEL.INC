-MODULE PEEL
-INCLUDE "BAL.INC"
	DEFINE('PEEL(NAME.,N.)K1.,K2.')
	BEFORE = ') ,>'
	AFTER = '( ,<'
	PEEL.K2. = POS(0) TAB(*K1.) (ANY(AFTER) @K2. |
+	BAL(,'"' "'") (@K2. ANY(BEFORE) | ANY(AFTER) @K2. |
+	RPOS(0) @K2.))
	                                :(PEEL_END)
PEEL	LE(SIZE($NAME.),N.)             :F(PEEL_1)
	PEEL = $NAME.
	$NAME. =                        :(RETURN)
PEEL_1	$NAME. PEEL.K2.                 :F(ERROR)
	GT(K2.,N.)                      :S(PEEL_2)
	K1. = K2.                       :(PEEL_1)
PEEL_2	EQ(K1.,0)                       :S(FRETURN)
	$NAME. LEN(K1.) . PEEL =        :(RETURN)
PEEL_END
