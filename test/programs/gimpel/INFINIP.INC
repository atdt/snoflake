-MODULE INFINIP
-INCLUDE "REDEFINE.INC"
-INCLUDE "SWAP.INC"
-INCLUDE "LPAD.INC"
	REDEFINE('-','MINUS(X)Y')
	REDEFINE( ,'GT(X,Y)')
	REDEFINE( ,'EQ(X,Y)')
	REDEFINE( ,'GE(X,Y)')
	REDEFINE( ,'NE(X,Y)')
	REDEFINE( ,'LT(X,Y)')
	REDEFINE( ,'LE(X,Y)')
	REDEFINE('-','DIFF(X,Y)')
	REDEFINE('+','SUM(X,Y)X1,X2,Y1,Y2,K')
	REDEFINE('*','MULT(X,Y)X1,X2,K')
	REDEFINE('/','DIV(X,Y)X1,X2,Y1,Y2,T,T1,T2,KX,KY')
	REDEFINE( ,'REMDR(X,Y)')
	SIGN_OFF = POS(0) '-'
	LDG_ZEROS = BREAK('123456789') | RTAB(1)
	NO_DIGITS = 4
	DEFINE('SMALL()')
	DEFINE('SPLIT(NAME,PAT)')       :(INFINIP_END)
SMALL	(LE.(SIZE(X),NO_DIGITS)
+	LE.(SIZE(Y),NO_DIGITS))         :S(RETURN)F(FRETURN)
SPLIT	PAT = IDENT(PAT) LEN(SIZE($NAME) / 2)
	$NAME (PAT | '') . $(NAME 1) @SPLIT (SPAN('0') | '')
+	REM . $(NAME 2)
	SPLIT = SIZE($NAME) - SPLIT     :(RETURN)
MINUS	MINUS = SMALL() MINUS.(X)       :S(RETURN)
	MINUS = X
	MINUS SIGN_OFF =                :S(RETURN)
	MINUS = '-' X                   :(RETURN)
GT	SMALL()                         :F(GT_1)
	GT.(X,Y)                        :S(RETURN)F(FRETURN)
GT_1	X SIGN_OFF =                    :F(GT_2)
	Y SIGN_OFF =                    :F(FRETURN)
	SWAP(.X,.Y)
GT_2	Y SIGN_OFF =                    :S(RETURN)
	LGT(LPAD(X,SIZE(Y),'0'),
+	LPAD(Y,SIZE(X),'0'))            :S(RETURN)F(FRETURN)

EQ	SMALL()                         :F(EQ_1)
	EQ.(X,Y)                        :S(RETURN)F(FRETURN)
EQ_1	IDENT(X,Y)                      :S(RETURN)F(FRETURN)

GE	~(~GT(X,Y) ~EQ(X,Y))            :S(RETURN)F(FRETURN)
NE	EQ(X,Y)                         :S(FRETURN)F(RETURN)
LT	GE(X,Y)                         :S(FRETURN)F(RETURN)
LE	GT(X,Y)                         :S(FRETURN)F(RETURN)
DIFF	DIFF = X + -Y                   :(RETURN)
SUM	SUM = SMALL() SUM.(X,Y)         :S(RETURN)
	SUM = LT(X,0) -(-X + -Y)        :S(RETURN)
	Y SIGN_OFF =                    :S(SUM_1)
	(LT(X,Y) SWAP(.X,.Y))
	K = SPLIT(.X)
	Y = Y + X2
	SPLIT(.Y,RTAB(K))
	SUM = (Y1 + X1) LPAD(Y2,K,'0')  :(RETURN)
SUM_1	SUM = GT(Y,X) -(Y - X)          :S(RETURN)
	Y = LPAD(Y,SIZE(X),'0')
*       Add 10's complement of Y
	SUM = X + 1 + REPLACE(Y,'0123456789','9876543210')
	SUM '1' LDG_ZEROS REM . SUM     :(RETURN)
MULT	MULT = LE(SIZE(X) + SIZE(Y),NO_DIGITS)
+	MULT.(X,Y)                      :S(RETURN)
	MULT = LT(X,0) -X * -Y          :S(RETURN)
	MULT = LT(Y,0) -(X * -Y)        :S(RETURN)
	(GT(Y,X) SWAP(.X,.Y))
	MULT = EQ(Y,0) 0                :S(RETURN)
	K = SPLIT(.X)
	MULT = (Y * X1) DUPL('0',K)
	MULT = MULT + X2 * Y            :(RETURN)
DIV	DIV = SMALL() DIV.(X,Y)         :S(RETURN)
	DIV = LT(X,0) -(-X / Y)         :S(RETURN)
	DIV = LT(Y,0) -(X / -Y)         :S(RETURN)
	DIV = GT(Y,X) 0                 :S(RETURN)
* Original statement from book:
*	KY  =  SPLIT(.Y,LEN(NO_DIGITS / 2) | REM)
*	KX  =  SPLIT(.X,LEN(NO_DIGITS))
* Suggested replacement to avoid generating error terms that are
* larger than the incoming numerator.  Such a situation can produce
* cycles.
	KY = SPLIT(.Y,LEN(NO_DIGITS / 2) | REM)
	KX = SPLIT(.X,LEN(NO_DIGITS / 2) | REM)
	KX = LT.(X1,Y1) SPLIT(.X,LEN(NO_DIGITS / 2 + 1) | REM)
* End of replacement statements.
	T1 = X1 / Y1
	T2 = DUPL('0', KX - KY)
	T = X - ((T1 * Y) T2)
	DIV = T1 T2
	T = LT(T,0) T + 1 - Y
	DIV = DIV + (T / Y)             :(RETURN)
REMDR	REMDR = X - (X / Y) * Y         :(RETURN)
INFINIP_END
