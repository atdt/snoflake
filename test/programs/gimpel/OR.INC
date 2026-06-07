* OR.inc - OR(LIST) is intended to form the OR (in the pattern sense)
*	   of several strings contained in LIST.  For example,
*	   OR(',ABLE,ACTOR,ANCHOR,BAKER,BULL') is equivalent to
*	   'A' ('BLE' | 'CTOR' | 'NCHOR') | 'B' ('AKER' | 'ULL')
*
*	   Characters in parenthesis impley an ANY-like construction:
*	   OR(',C(AO)D,C(AO)ST') is equivalent to
*	   'C' ANY('AO') ('D' | 'ST')
*
*	   The first character of LIST is used as the delimiter
*	   character between substrings.
*
*  Note 1: Modified with new statement at ORX_0 to detect case where
*	   one string is a prefix of another string: ",LI,LIST".
*	   This reduced to "LI" OR_EXTRACT(",,ST") which case
*	   was not handled properly.
*
*  Note 2: See files ORSORT.INC and ORBREAK.INC for adjunct functions
*	   to improve the efficiency of OR().
*
*  Note 3: When LIST contains many thousands of alternatives, it is
*	   very inefficient to concatenate other patterns (such as POS(0)
*	   or RPOS(0)) with the large pattern tree returned by OR.
*	   Use a variable to hold the pattern result of OR, and then use
*	   *variable deferred evaluation to concatenate other patterns to it.
*	   This form of concatenation is very efficient, because it only
*	   is done to the top-level "*" node:
*
*	      LIST_P = OR(LIST)		 ;* assume LIST is very large
*	      P = POS(0) *LIST_P RPOS(0) ;* fast pattern concatenation
* 
*  Note 4: If you do not need the transformation of parenthsized characters
*	   into ANY functions, OR can be speeded up by deleting the two
*	   statements at ORX_4, and changing the two lines following ORX_2
*	   from:
*		BALREV(COMMON)      BAL  REM . COMMON	:F(ERROR)
*		COMMON  =  BALREV(COMMON)		:(ORX_2)
*	   to:
*		COMMON = SUBSTR(COMMON,1,SIZE(COMMON) - 1) :(ORX_2)
*
*
-INCLUDE "BALREV.INC"
*
* OR(LIST) will return the alternation of the substring of
* LIST separated by the break character determined by the
* first character in LIST.  Parenthesized strings are
* regarded as ANY.
*
	DEFINE('OR(LIST)BC,SEIZE,ANC')
*
* OR_EXTRACT() is a function used by OR to extract from the
* global variable LIST, the substrings beginning with the
* same first character (or parenthesized expression).
*
	DEFINE('OR_EXTRACT()COMMON,IC,P,SUBLIST,T,TLIST,C1,C2')
	                                                    :(OR_END)
*
* Entry point for OR.  Determine the break character and
* define a pattern to be used throughout to SEIZE all up to
* the next break character.  Define ANC as a pattern to
* anchor the scan and match the Break Character.
*
OR	LIST LEN(1) . BC                                    :F(FRETURN)
	SEIZE = BREAK(BC) | REM
	ANC = POS(0) BC
*
* Or together all extractions.
*
	OR = OR_EXTRACT()
OR_LOOP	OR = OR | OR_EXTRACT()                              :S(OR_LOOP)F(RETURN)
*
* Entry point for OR_EXTRACT():  Set TLIST to be a copy of
* LIST.  Extract initial character (IC) and set COMMON equal
* to the first substring.  If this pattern fails, no IC could
* be found.  This means that LIST is either emptyin which
* case we fail, or contains only BC in which case we return
* the null string.  Both of these cases are important since
* the former terminates the loop in OR() and the latter
* breaks the recursion of OR_EXTRACT().
*
OR_EXTRACT
	TLIST = LIST
	LIST ANC (BAL . IC SEIZE) . COMMON                  :S(ORX_0)
	IDENT(LIST, NULL)                                   :S(FRETURN)
	LIST = NULL                                         :(RETURN)
*
* Find the largest COMMON prefix contained in all strings
* beginning with IC.
* ORX_0 statement added by MBE to detect ",,XX" case.
*
ORX_0	LIST ANC (BC REM) . LIST                            :S(RETURN)
ORX_1	TLIST ANC IC                                        :F(ORX_3)
ORX_2	TLIST ANC COMMON SEIZE =                            :S(ORX_1)
*
* COMMON was not there.  Reduce  COMMON by one character and
* try again.  This means extract the last balanced string of
* COMMON.
*
	BALREV(COMMON) BAL REM . COMMON                     :F(ERROR)
	COMMON = BALREV(COMMON)                             :(ORX_2)
*
* Now remove the COMMON characters from each string as we
* prepare a SUBLIST to be OR'ed.
*
ORX_3	LIST ANC COMMON SEIZE . T =                         :F(ORX_4)
	SUBLIST = SUBLIST BC T                              :(ORX_3)
*
* Convert any parenthesized expression in COMMON to an ANY.
* Build up the pattern in a temporary P.  Then join this with
* the results of a recursive call to OR.
*
ORX_4	COMMON BREAK('(') . C1 '(' BREAK(')') . C2 ')' =    :F(ORX_5)
	P = P C1 ANY(C2)                                    :(ORX_4)
ORX_5	OR_EXTRACT = P COMMON OR(SUBLIST)                   :(RETURN)
OR_END
