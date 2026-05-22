* TREE.inc = TREE(P,N) will match a tree in Polish prefix
*	     form whose node value matches the pattern P and
*	     where N is thenumber of branches.  The tree is
*	     assumbed to be a non-leaf.  If N is 0, then an
*	     arbitrary number of nodes (up to some maximum)
*	     is implied.
*
*	See also: program TR.
*
	DEFINE('TREE(P,N)')
	ARB_TREE  =  TREE(BREAK(':,')) | BREAK(':,') ','
+						:(TREE_END)
TREE	TREE  =  EQ(N,0)  P
+	(TREE(,1) | TREE(,2) | TREE(,3) | TREE(,4))
+						:S(RETURN)
	TREE  =  P  ':' N ','
TREE_1	N  =  N - 1  GT(N,0)			:F(RETURN)
	TREE  =  TREE  *ARB_TREE		:(TREE_1)
TREE_END
