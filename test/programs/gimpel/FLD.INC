* FLD.inc - FLD(ST,I) will return (by name) the Ith field of the
*	    structure ST, failing if I exceeds the number of
*	    fields in the structure ST.
*
*	    Given:
*		DATA("FOO(A,B)")
*		X = FOO("aaa","bbb")
*		Y = .FLD(X,2)
*	    Then:
*		$Y yields "bbb"
*	    and	$Y = "ccc" changes B(X) to "ccc"
*
	DEFINE('FLD(ST,I)')			:(FLD_END)
FLD	FLD  =  .APPLY(FIELD(DATATYPE(ST), I), ST)
+						:S(NRETURN)F(FRETURN)
FLD_END
