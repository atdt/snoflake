* TPROFILE.inc - TPROFILE() will produce a time profile of the time
*		 spent in each SPITBOL statement.
*
* NOTE - It is much more efficient to use SPITBOL's built-in
* profiling system by setting &PROFILE = 1 or 2.
*
-INCLUDE "LPROG.INC"
	DEFINE('TPROFILE()S,T')
	TP_ARY = ARRAY(LPROG())
	TRACE(.STCOUNT,'KEYWORD',,'TPROFILE')
	&TRACE = 32767                  :(TPROFILE_END)
TPROFILE	S = &LASTNO
	T = TIME()
	TP_ARY<LAST_STNO> = TP_ARY<LAST_STNO> + T - LAST_TIME
	LAST_STNO = S
	LAST_TIME = TIME()              :(RETURN)
TPROFILE_END
