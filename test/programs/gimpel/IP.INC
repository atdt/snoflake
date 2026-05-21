* IP.inc - IP(P) will invert a permutation  vector contained
*	   in the array P.  No additional storage is consumed.
*
	DEFINE('IP(P)M,PM,K,PK,PPK')		:(IP_END)
IP	M  =  M + 1
	IP  =  ~P<M>  P				:S(RETURN)
	P<M>  =  LT(P<M>,0) -P<M>		:S(IP)
	EQ(P<M>,M)				:S(IP)
	K  =  M   ;   PK  =  P<M>
IP_LOOP	PPK  =  P<PK>
	P<PK>  =  -K
	K  =  PK
	PK  =  PPK
	EQ(PK,M)				:F(IP_LOOP)
	P<PK>  =  K				:(IP)
IP_END
