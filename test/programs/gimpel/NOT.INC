* NOT.inc - NOT(P) will return a pattern which will match
*	    the null string if P fails and fail if P matches.
*	    If P aborts, NOT(P) will also abort.
*
-INCLUDE "PUSH.INC"
	DEFINE('NOT(P)')                :(NOT_END)
NOT	NOT = *PUSH() P *(POP() PUSH(1)) FAIL |
+	*IDENT(POP())                   :(RETURN)
NOT_END
