* MDY.inc - MDY(Y,DY) will convert a year,day date into a
*	    month/day/year date.  For example MDY(71,83) will
*	    return '3/24/71'.  The global variables M and D are
*	    set to equal the month and day respectively.
*
	DEFINE('MDY(Y,DY)X,T')
	DAY_MONTH  =  '(334,12)(304,11)(273,10)(243,9)'
+	'(212,8)(181,7)(151,6)(120,5)(90,4)(59,3)(31,2)(0,1)'
	LY_DAY_MONTH  =  '(335,12)(305,11)(274,10)(244,9)'
+	'(213,8)(182,7)(152,6)(121,5)(91,4)(60,3)(31,2)(0,1)'
	I  =  SPAN('0123456789')
	SEARCH.X.M = '(' I $ X *GT(DY,X) ',' I $ M	:(MDY_END)
MDY	T = EQ(REMDR(Y,400),0) LY_DAY_MONTH	:S(MDY_1)
	T = EQ(REMDR(Y,100),0) DAY_MONTH	:S(MDY_1)
	T = EQ(REMDR(Y , 4),0) LY_DAY_MONTH	:S(MDY_1)
	T  =  DAY_MONTH
MDY_1	T   SEARCH.X.M				:F(FRETURN)
	D  =  DY - X
	GT(D, 31)				:S(FRETURN)
	MDY  =  M  '/'  D  '/'  Y		:(RETURN)
MDY_END
