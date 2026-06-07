* SPACING.inc - SPACING(S) will determine the spacing of the
*		string S.  If S has been B-normalized, this
*		will yield the number of print positions
*		occupied by the string.
*
-INCLUDE "COUNT.INC"
	DEFINE('SPACING(S)')
*  Ensure BSPACE / USCORE exist before IF_OVERSTRIKE is constructed.
*  Catspaw's INCs assume the caller pre-initializes them; the book
*  programs (Ch. 10) likewise assume a global typesetter setup. Pin
*  them here so SPACING.INC loads in any include order. BSPACE is
*  the ASCII BS character (codepoint 8); USCORE is '_'.
	IDENT(BSPACE)                   :F(SPACING_INIT_DONE)
	&ALPHABET TAB(8) LEN(1) . BSPACE
	USCORE = '_'
SPACING_INIT_DONE
	IF_OVERSTRIKE = BREAK(BSPACE USCORE)
	                                :(SPACING_END)
SPACING	SPACING = SIZE(S)
	S IF_OVERSTRIKE                 :F(RETURN)
	SPACING = SPACING - 2 * COUNT(S,BSPACE)
+	- COUNT(S,USCORE)               :(RETURN)
SPACING_END
