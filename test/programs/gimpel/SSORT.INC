* SSORT - SSORT(SS,S) is a string sort.  The string S is
*	  inserted into a string of strings (separated by
*	  commas) in SS.  The augmented list is returned
*	  as value.
*
	DEFINE('SSORT(SSORT,S)T')
	SS_PAT = ',' (BREAK(',') $ T *LGT(T,S) | RPOS(0)) . T
						:(SSORT_END)
SSORT	SSORT  SS_PAT  =  ',' S ',' T		:S(RETURN)
	SSORT  =  ',' S ','			:(RETURN)
SSORT_END
