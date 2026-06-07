-MODULE PHYSICAL
-INCLUDE "ORDER.INC"
-INCLUDE "REDEFINE.INC"
	DATA('PHYS(VAL,NUM,DEN)')
	REDEFINE('-', 'MINUS(X)')
	REDEFINE('+', 'SUM(X,Y)')
	REDEFINE('-', 'DIFF(X,Y)')
	REDEFINE('*', 'MULT(X,Y)')
	REDEFINE('/', 'DIV(X,Y)')
	REDEFINE( , 'EQ(X,Y)')
	DEFINE('NORM(X)C')                              :(NORM_END)
NORM	X = DIFFER(DATATYPE(X), 'PHYS') PHYS(X)
	NORM = X
	DEN(X) = ORDER(DEN(X))
	NUM(X) = ORDER(NUM(X))
NORM_1	IDENT(DEN(X))                                   :S(RETURN)
	NUM(X) ANY(DEN(X)) . C =                        :F(RETURN)
	DEN(X) C =                                      :(NORM_1)
NORM_END
	DEFINE('XY()')                                  :(XY_END)
XY	(DIFFER(DATATYPE(X), 'PHYS')
+	DIFFER(DATATYPE(Y), 'PHYS'))                    :S(RETURN)
	X = NORM(X) ; Y = NORM(Y)                       :(FRETURN)
XY_END	                                                :(PHYSICAL_END)

MINUS	MINUS = XY() MINUS.(X)                          :S(RETURN)
	MINUS = PHYS(-VAL(X),NUM(X),DEN(X))             :(RETURN)

SUM	SUM = XY() SUM.(X,Y)                            :S(RETURN)
	SUM = PHYS(VAL(X) + VAL(Y), NUM(X), DEN(X))     :(RETURN)

DIFF	DIFF = X + -Y                                   :(RETURN)

MULT	MULT = XY() MULT.(X,Y)                          :S(RETURN)
	MULT = PHYS(VAL(X) * VAL(Y), NUM(X) NUM(Y),
+	DEN(X) DEN(Y))                                  :(RETURN)

DIV	DIV = XY() DIV.(X,Y)                            :S(RETURN)
	DIV = PHYS(VAL(X) / VAL(Y), NUM(X) DEN(Y),
+	DEN(X) NUM(Y))                                  :(RETURN)

EQ	XY()                                            :F(EQ_1)
	EQ.(X,Y)                                        :S(RETURN)F(FRETURN)
EQ_1	(EQ(VAL(X),VAL(Y)) IDENT(NUM(X),NUM(Y))
+	IDENT(DEN(X),DEN(Y)))                           :S(RETURN)F(FRETURN)
PHYSICAL_END
