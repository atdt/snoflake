* TIMER.inc - TIMER(S) will time a statement (or statements)  passed
*	      to it as argument.  Example:  TIMER(" A = B + C ").
*	      Multiple statements should be separated by semicolon.
*
-INCLUDE "SYSTEM.INC"
-INCLUDE "RESOLUTI.INC"
	DEFINE('TIMER(S_,N_)C_,T_,I_')          :(TIMER_END)
TIMER	EQ(N_,0)                                :F(TIMER_N)
	N_ = 10
TIMER_1	T_ = TIMER(' ;' S_,N_) - TIMER(,N_)     :F(FRETURN)
	N_ = LT(T_,20 * RESOLUTION()) N_ * 2    :S(TIMER_1)
	T_ = CONVERT(T_, 'REAL')
	OUTPUT =
	OUTPUT = 'THE STATEMENT'
	OUTPUT = S_
	OUTPUT = 'REQUIRED ' (T_ / N_) ' MILLISECONDS +/- 10%'
+	' TO EXECUTE IN ' SYSTEM()              :(RETURN)

TIMER_N	I_ = 1
	C_ = '  COLLECT()  ;  TIMER  =  TIME()  ;'
+	'TIMER_3' S_ ';'
+	'  I_ = I_ + 1 LT(I_,' N_ ')		:S(TIMER_3);'
+	'  TIMER  =  TIME() - TIMER		:(RETURN)'
	C_ = CODE(C_)                           :S<C_>F(FRETURN)
TIMER_END
