* SPACING.inc - SPACING(S) will determine the spacing of the
*		string S.  If S has been B-normalized, this
*		will yield the number of print positions
*		occupied by the string.
*
-INCLUDE "COUNT.INC"
	DEFINE('SPACING(S)')
	IF_OVERSTRIKE  =  BREAK(BSPACE  USCORE)
						:(SPACING_END)
SPACING	SPACING  =  SIZE(S)
	S   IF_OVERSTRIKE			:F(RETURN)
	SPACING  =  SPACING - 2 * COUNT(S,BSPACE)
+	-   COUNT(S,USCORE)			:(RETURN)
SPACING_END
