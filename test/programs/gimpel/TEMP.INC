* TEMP.inc - TEMP() produces temporary variable names for
*	     TR.inc and L_ONE.spt.  Uses global TEMP_NO.
*
	DEFINE('TEMP()')			:(TEMP_END)
TEMP	TEMP_NO  =  TEMP_NO + 1
	TEMP  =  'TEMP'  TEMP_NO		:(RETURN)
TEMP_END
