* SWAP.inc - SWAP(.N,.M) will swap the contents of the two named
*	     variables.
*
	DEFINE('SWAP(SWAP_ARG1,SWAP_ARG2)')	:(SWAP_END)
SWAP	SWAP  =  $SWAP_ARG1
	$SWAP_ARG1  =  $SWAP_ARG2
	$SWAP_ARG2  =  SWAP
	SWAP  =					:(RETURN)
SWAP_END
