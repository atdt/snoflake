* IMAGE.inc - IMAGE(S,I) will return the Ith print line associated
*	      with the string S.  It will fail if there is no Ith
*	      line.  S is assumed to be B-normalized.
*
-INCLUDE "SPACING.INC"
-INCLUDE "BREAKX.INC"
	DEFINE('IMAGE(S,I)C,BU,T,T1')
	&ALPHABET TAB(8) LEN(1) . BSPACE; USCORE = '_'
	IF_OVERSTRIKE = BREAK(BSPACE USCORE)
	IF_BSPACE = BREAK(BSPACE)
	IF_USCORE = BREAK(USCORE)
	                                                :(IMAGE_END)
IMAGE	LE(I,0)                                         :S(IMAGE_USCORE)
	GT(I,1)                                         :S(IMAGE_BSPACE)
	IMAGE = S
	IMAGE IF_OVERSTRIKE                             :F(RETURN)
IMAGE_1	IMAGE BREAK(BSPACE USCORE) . T
+	(USCORE | LEN(2)) = T                           :S(IMAGE_1)F(RETURN)
IMAGE_USCORE
	S IF_USCORE                                     :F(FRETURN)
	BU = BREAK(USCORE)
IMAGE_UL
	S BU . T USCORE (BU . T1 USCORE | REM . T1) =
	IMAGE = IMAGE DUPL(' ',SPACING(T))
+	DUPL('_',SPACING(T1))
	S BU                                            :S(IMAGE_UL)
	IMAGE = IMAGE DUPL(' ',SPACING(S))              :(RETURN)
IMAGE_BSPACE	S IF_BSPACE                             :F(FRETURN)
	PAT.C = BSPACE LEN(1) . C
IMAGE_B1	I = I - 1 GT(I,2)                       :F(IMAGE_B2)
	PAT.C = BSPACE LEN(1) PAT.C                     :(IMAGE_B1)
IMAGE_B2	S POS(0) BREAKX(BSPACE) . T PAT.C =     :F(IMAGE_B3)
	IMAGE = IMAGE DUPL(' ',SPACING(T) - 1) C
	S POS(0) ARBNO(BSPACE LEN(1)) NOTANY(BSPACE) . C = C
+                                                       :S(IMAGE_B2)F(RETURN)
IMAGE_B3	IDENT(IMAGE,NULL)                       :S(FRETURN)
	IMAGE = IMAGE DUPL(' ',SPACING(S))              :(RETURN)
IMAGE_END
