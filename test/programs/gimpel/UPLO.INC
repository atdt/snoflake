* UPLO.inc - UPLO(S) will return its argument with upper case letters
*	     converted to lower case, and vice versa.  Non-alphabetic
*	     characters are ignored.
*
	DEFINE('UPLO(S)')
	UP_LO  =  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
	LO_UP  =  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
						:(UPLO_END)
UPLO	UPLO   =  REPLACE(S, UP_LO, LO_UP)	:(RETURN)
UPLO_END
