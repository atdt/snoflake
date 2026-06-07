* FORTREAD.inc - FORTREAD() will read in and return the next
*		 FORTRAN statement on the input stream.
*
-INCLUDE "READ.INC"
	DEFINE('FORTREAD()T')
	FORT_COMMENT = POS(0) 'C'
	FORT_CONTINUE = POS(0) LEN(5) NOTANY(' ') REM . T
	                                :(FORTREAD_END)
FORTREAD	READ(FORT_COMMENT)      :S(FORTREAD)
	FORTREAD = READ()               :F(FRETURN)
FORTREAD_1	READ(FORT_COMMENT)      :S(FORTREAD_1)
	READ(FORT_CONTINUE)             :F(RETURN)
	FORTREAD = FORTREAD T           :(FORTREAD_1)
FORTREAD_END
