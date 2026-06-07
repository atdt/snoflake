* PARAGRAPH.inc - PARAGRAPH(FIRST_LINE) will read in a paragraph
*		  provided the first line on input matches the
*		  pattern FIRST_LINE.  The paragraph is assumed
*		  to continue until a blank appears in column 1.
*		  It will fail if a paragraph is not found.
*
-INCLUDE "READ.INC"
	DEFINE('PARAGRAPH(FIRST_LINE)T,P')
	PARA_CONTINUE = POS(0) NOTANY(' ')
	                                            :(PARAGRAPH_END)
PARAGRAPH	P = TRIM(READ(FIRST_LINE))          :F(FRETURN)
PARAGRAPH_1	T = ' '
	P POS(0) RTAB(1) '.'                        :F(PARAGRAPH_2)
	T = '  '
PARAGRAPH_2	P = P T TRIM(READ(PARA_CONTINUE))   :S(PARAGRAPH_1)
	PARAGRAPH = P                               :(RETURN)
PARAGRAPH_END
