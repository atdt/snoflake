* PHRASE.inc - Functions to generate praise, insult, and delaying text
*	       for game playing.  INPUT must be open by the caller to
*	       the file containing the phrase text.
*
-INCLUDE "DEXP.INC"
-INCLUDE "RSENTENC.INC"
	DEXP("PRAISE() = RSENTENCE('<PRAISE>')")
	DEXP("INSULT() = RSENTENCE('<INSULT>')")
	DEXP("LETMESEE() = RSENTENCE('<LETMESEE>')")
