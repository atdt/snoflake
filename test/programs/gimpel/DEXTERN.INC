-MODULE DEXTERN
	DEFINE('DEXTERN(PROTO,LBL)NAME')
	DEFINE('LOADEX(LBL)PAT,X,CODE')
	LIB_ = 8                        :(DEXTERN_END)
DEXTERN	PROTO IDENT(LBL) BREAK('(') . LBL
	CODE(LBL "  LOADEX('" LBL "')  ;	:(" LBL ")" )
	DEFINE(PROTO, LBL)              :(RETURN)
LOADEX	REWIND(LIB_)
	INPUT(.LIB_FILE, LIB_)
	PAT = POS(0) LBL (' ' | RPOS(0))
LOADEX_1	CODE = LIB_FILE         :F(ERROR)
	CODE PAT                        :F(LOADEX_1)
	PAT = POS(0) LBL '_END' (' ' | RPOS(0))
LOADEX_2	X = LIB_FILE            :F(LOADEX_3)
	X PAT                           :S(LOADEX_3)
	X POS(0) ANY('*-')              :S(LOADEX_2)
	X = ';' X
	X POS(0) ';' ANY('.+') = ' '
	CODE = CODE X                   :(LOADEX_2)
LOADEX_3	CODE(CODE)              :(RETURN)
DEXTERN_END
