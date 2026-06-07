* ONCE.inc - ONCE() returns a pattern that will succeed
*	     just once and only once and thereafter fail
*	     forever.  ONCE() is similar to FENCE in that it
*	     matches the null string initially.  Unlike FENCE,
*	     however, failure in subsequent tries is like FAIL,
*	     (as opposed to ABORT) which permits other alter-
*	     nates to be taken.
*
	DEFINE('ONCE(ID)NAME')                          :(ONCE_END)
ONCE	ONCE = IDENT(ID,NULL)
+	CONVERT('ONCE(' &STCOUNT ')' , 'EXPRESSION')    :S(RETURN)
	NAME = 'ONCE..' ID
	ONCE = $NAME
	$NAME = FAIL                                    :(RETURN)
ONCE_END
