import{a as M,b as C,c as T,d as g,e as F,f as p,g as f}from"./chunks/chunk-AS2LTD4L.js";var O=[{name:"Pattern matching",file:"PATTERN.SNO",source:`READ    LINE = INPUT :F(END)
        LINE ('GOLD' | 'BLUE') . SHADE ('FISH' | 'BIRD') . KIND :F(READ)
        OUTPUT = SHADE ' ' KIND :(READ)
END`,input:`GOLDFISH
BLUEBIRD
SNOWBIRD
GOLDFINCH
BLUEFISH
`,files:{}},{name:"Swap",file:"SWAP.SNO",source:`        WORD = 'SNOBOL'
        WORD LEN(3) . HEAD REM . TAIL
        OUTPUT = TAIL HEAD
END`,input:"",files:{}},{name:"Fibonacci",file:"FIB.SNO",source:`        A = 0
        B = 1
LOOP    OUTPUT = B
        T = A + B
        A = B
        B = LT(B, 100) T :S(LOOP)
END`,input:"",files:{}},{name:"Word tally",file:"TALLY.SNO",source:`        COUNT = TABLE()
LINE    TEXT = INPUT :F(DONE)
NEXT    TEXT BREAK(' ') . WORD SPAN(' ') = :F(LAST)
        COUNT<WORD> = COUNT<WORD> + 1 :(NEXT)
LAST    COUNT<TEXT> = DIFFER(TEXT) COUNT<TEXT> + 1 :(LINE)
DONE    RESULT = CONVERT(COUNT, 'ARRAY')
        I = 0
PRINT   I = I + 1
        OUTPUT = RESULT<I,1> ': ' RESULT<I,2> :S(PRINT)
END`,input:`TO BE OR NOT TO BE
THAT IS THE QUESTION

TO BE
`,files:{}},{name:"Random story",file:"STORY.SNO",source:`* From James F. Gimpel, "Algorithms in SNOBOL4" (1976), Ch. 13.5
* (Catspaw SNOBOL4+ program diskette).
-INCLUDE "RSENTENC.INC"
	RAN_VAR = TIMESTAMP()
	ACTIONS = TABLE()
	BB = BREAK(' ')
	SB = SPAN(' ')
READ_PHRASE
	X = TRIM(INPUT)                     :F(BEGIN_STORY)
	IDENT(X,'END')                      :S(BEGIN_STORY)
	X (BB SB BB) . SUBJ_VERB SB REM . OBJS
	OBJS = OBJS '|'
READ_PH1
	OBJS POS(0) '<' ARB . VAR '>' = RSENT_TBL<VAR>
	OBJS POS(0) '|' =                   :S(READ_PH1)
	OBJS BREAK('|') . OBJ '|' =         :F(READ_PHRASE)
	ACTIONS<OBJ> = ACTIONS<OBJ> '|' SUBJ_VERB
	                                    :(READ_PH1)
BEGIN_STORY	RSTORY = RSENTENCE('<OPENING>')
	LIST = PET " won't jump over the " BARRIER
	LAST = PET
	&MAXLNGTH = 30000
NEW_AGENT
	TRY = 0
RETRY	TRY = TRY + 1 LT(TRY,10)            :F(REQUEST)
	ALTS = ACTIONS<LAST>
	RSENTENCE(RSELECT(ALTS)) BB . SUBJ SB REM . VERB
	RSTORY ' ' SUBJ ' '                 :S(RETRY)
	RSTORY ' ' VERB ' '                 :S(RETRY)
REQUEST	RSTORY = RSTORY RSENTENCE('<REFUSAL>')
	LIST = SUBJ " won't " VERB ' the ' LAST ", " LIST
	LAST = SUBJ
	LT(SIZE(LIST), 175)                 :S(NEW_AGENT)
FIN1	LIST "won't" = "began to"           :S(FIN1)
FIN2	LIST ',' = "; the"                  :S(FIN2)
	RSTORY = RSTORY RSENTENCE('<PERSUADED>')
OUT	RSTORY (LEN(50) BB) . OUTPUT SB =   :S(OUT)
	OUTPUT = RSTORY
END`,input:`<OPENING>::=<TIME> there was a =CHAR= who went to <PLACE> and
 bought a =PET=.  On the way home they came upon a =BARRIER=
 which the (PET) was afraid to cross.  The (CHAR) said "(PET),
 (PET), jump over the (BARRIER) or I won't get home tonight."
<TIME>::=Once upon a time|Once|Long ago in a small village|
In days gone by in a little town by the river
<PLACE>::=market|a pet store|a super market|town|the city
<BARRIER>::=fence|ditch|fallen tree|large rock|stream|brook
<PET>::=dog|cat|parrot|pony
<REFUSAL>::= But the (LAST) would not.  The (CHAR)
 <EXCURSION> and she met a (SUBJ).  She said, "(SUBJ), (SUBJ),
 (VERB) (LAST), (LIST) and I shan't get home tonight."
<EXCURSION>::=went down the path|went over a hill|went by
 <OBJECT> and then <EXCURSION>|went toward <OBJECT>|
went over hill and dale|went near <OBJECT>|went on the road to
 <OBJECT>|went for (RANDOM(20) + 1) miles
<OBJECT>::=the <COLOR> <THING>
<COLOR>::=white|blue|red|yellow|grey|black|dark|green|orange
<THING>::=mill|tavern|church|school|house|meadow|rock|barn
<PERSUADED>::= The (SUBJ) knew the (CHAR) and, in fact,
 had been saved by her from a wild <WILD_AN>.  So the (LIST)
 and the (CHAR) got home that night.
<CHAR>::=little old woman|little old lady|kind grandmother|
kind old aunt|little girl dressed in red|retired seamstress|
nice old lady|little girl green
<DOM_AN>::=cow|pig|horse|sheep|chicken
<WILD_AN>::=lion|giraffe|tiger|camel|ostrich|rhinoceros
<ANIMAL>::=<DOM_AN>|<WILD_AN>|<PET>
<HUMAN>::=farmer|girl|policeman|hunter|man|boy
<A>::=<HUMAN>|<ANIMAL>
<CUT>::=cut|slice|snip|slash
<CUTTER>::=knife|scissor|sword|dagger
<BEE>::=bee|wasp|horse-fly
<HURT>::=bite|frighten|scare|kick|eat
END
<ANIMAL> <HURT> <HUMAN>
<CUTTER> <CUT> <A>
<A> break <CUTTER>
water drown <A>
<A> drink water
fire burn <A>
smoke suffocate <A>
<BEE> sting <A>
<A> swat <BEE>
wind blow-out fire
wind disperse smoke
smoke pollute wind
smoke smother fire
<HUMAN> disperse smoke
<A> spill liquor
liquor intoxicate <A>
<HUMAN> slay <WILD_AN>
<WILD_AN> eat <HUMAN>
END
`,files:{"BAL.INC":`	DEFINE('BAL(PARENS,QTS)Q,GBAL,NAME,STAR,LP,RP')
	                                                    :(BAL_END)
BAL	NAME = 'BAL_.' &STCOUNT
	STAR = CONVERT(NAME, 'EXPRESSION')
	GBAL = NOTANY(PARENS QTS)
BAL_1	QTS LEN(1) . Q =                                    :F(BAL_2)
	GBAL = Q BREAK(Q) Q | GBAL                          :(BAL_1)
BAL_2	PARENS LEN(1) . LP RTAB(1) . PARENS LEN(1) . RP     :F(BAL_3)
	GBAL = LP (STAR | NULL) RP | GBAL                   :(BAL_2)
BAL_3	BAL = GBAL ARBNO(GBAL)
	$NAME = BAL                                         :(RETURN)
BAL_END`,"BREAKX.INC":`* BREAKX.inc - BREAKX(S) will return a pattern that will
*	       extend itself to include characters from S
*	       if required by a rematch attempt.
*	       
*  Built-in function in SNOBOL4+ and SPITBOL.
*
	DEFINE('BREAKX(S)')             :(BREAKX_END)
BREAKX	BREAKX = BREAK(S) ARBNO(LEN(1) BREAK(S))
	                                :(RETURN)
BREAKX_END
`,"QUOTE.INC":`* QUOTE.inc - QUOTE(S) will convert its argument to a string
*	      which will resemble a SNOBOL4 expression which,
*	      when evaluated, will yield the original string S.
*
-INCLUDE "REPL.INC"
	DEFINE('QUOTE(S)S1,Q,QQ')                       :(QUOTE_END)
QUOTE	Q = "'" ; QQ = '"'
	QUOTE = Q REPL(S, Q, Q ' ' QQ Q QQ ' ' Q) Q     :(RETURN)
QUOTE_END
`,"RANDOM.INC":`	DEFINE('RANDOM(N)')
	RAN_VAR = 1                     :(RANDOM_END)
RANDOM
	RAN_VAR = REMDR(RAN_VAR * 4676, 414971)
	RANDOM = RAN_VAR / 414971.
	RANDOM = NE(N,0) CONVERT(RANDOM * N,'INTEGER') + 1
	                                :(RETURN)
RANDOM_END`,"REPL.INC":`* REPL.inc - REPL(S1,S2,S3) will do a string-by-string replacement
*	     (as opposed to a character-by-character replacement
*	     ala REPLACE) on the string S1.  The string S1 is scanned
*	     for instances of the string S2  and each is replaced by
*	     S3.  Portions of S1 already scanned and the replaced
*	     string are not reexamined for instances of S2.
*
-INCLUDE "BREAKX.INC"
	DEFINE('REPL(S1,S2,S3)C,T,FINDC')   :(REPL_END)
REPL	S2 LEN(1) . C =                     :F(FRETURN)
	FINDC = BREAK(C) . T LEN(1)
	S2 = POS(0) S2
REPL_1	S1 FINDC =                          :F(REPL_2)
	S1 S2 =                             :F(REPL_3)
	REPL = REPL T S3                    :(REPL_1)
REPL_3	REPL = REPL T C                     :(REPL_1)
REPL_2	REPL = REPL S1                      :(RETURN)
REPL_END`,"RSELECT.INC":`* RSELECT.inc - RSELECT(S) will make a random selection of one of
*		a sequence of strings passed to it as an argument.
*		The first character in S is taken to be a break
*		character separating strings in the sequence.
*
*	RSELECT('|A|BIG|CAT') will return either "A", "BIG", or
*	"CAT" with probability one-third.  An optional integer
*	weight enclosed in sharp signs (#) may be placed at the
*	beginning of any alternation.  Thus:
*
*	RSELECT('|A|#3#BIG|CAT') will return "BIG" 3 times out
*	of five.
*
-INCLUDE "QUOTE.INC"
-INCLUDE "RANDOM.INC"
	DEFINE('RSELECT(S)WT,WTS,ALT,CODE,I,CODE,SSAVED,BC')
	RSEL_TBL = TABLE()              :(RSELECT_END)
RSELECT	CODE = RSEL_TBL<S>
	DIFFER(CODE,NULL)               :S<CODE>
	SSAVED = S
	S LEN(1) . BC =                 :F(RETURN)
RSELECT_1
	WT = 1
	S POS(0) '#' BREAK('#') . WT '#' =
	S (BREAK(BC) | REM) . ALT =
	WTS = WTS + WT
	CODE = CODE ' ;  RSELECT = LE(I,' WTS ') '
+	QUOTE(ALT) '				:S(RETURN)'
	S BC =                          :S(RSELECT_1)
	CODE = '  I = RANDOM(' WTS ') ' CODE
	S = SSAVED
	RSEL_TBL<S> = CODE(CODE)        :S(RSELECT)F(ERROR)
RSELECT_END`,"RSENTENC.INC":`-MODULE RSENTENCE
-INCLUDE "BAL.INC"
-INCLUDE "RSELECT.INC"
	DEFINE('RSENTENCE(STACK)VAR,EXP,S,TEXT')
	SYN.VAR = POS(0) '<' ARB . VAR '>'
	SNOBAL.EXP = POS(0) '(' BAL('(<>)','"' "'") . EXP ')'
	ASGN.VAR = POS(0) '=' ARB . VAR '='
	LITERAL.TEXT = BREAK('<=(') . TEXT
	RSENT_TBL = TABLE()
	SS = TRIM(INPUT)
RSI_1	S = TRIM(INPUT)
	S POS(0) ('<' | 'END' RPOS(0))              :S(RSI_2)
	SS = SS S                                   :(RSI_1)
RSI_2	SS '<' ARB . NM '>::=' =
	RSENT_TBL<NM> = '|' SS
	IDENT(S,'END')                              :S(RSENTENCE_END)
	SS = S                                      :(RSI_1)

RSENTENCE
	STACK SYN.VAR = RSELECT(RSENT_TBL<VAR>)     :S(RSENTENCE)
	STACK SNOBAL.EXP =                          :F(RSENT_1)
	S = S EVAL(EXP)                             :(RSENTENCE)
RSENT_1	STACK ASGN.VAR =                            :F(RSENT_2)
	$VAR = RSENTENCE('<' VAR '>')
	S = S $VAR                                  :(RSENTENCE)
RSENT_2	STACK LITERAL.TEXT =                        :F(RSENT_3)
	S = S TEXT                                  :(RSENTENCE)
RSENT_3	RSENTENCE = S STACK                         :(RETURN)
RSENTENCE_END`}},{name:"Random poem",file:"POEM.SNO",source:`* From James F. Gimpel, "Algorithms in SNOBOL4" (1976), \xA716.9 (RPOEM).
-INCLUDE "RSENTENC.INC"
	RAN_VAR = TIMESTAMP()

RPOEM	RPOEM = RSENTENCE('<RPOEM>')
RPOEM_1	RPOEM BREAK('/') . OUTPUT '/' =     :S(RPOEM_1)
	OUTPUT =
	N = LT(N,3) N + 1                   :S(RPOEM)
END`,input:`<PROP>::=action|duration|hunger|feeling|activity|movement|
motion|notion|endurance|tenderness|age|taste|bounty|goodness
<GEN>::=time|nature|age|wisdom|war|peace|power|energy|earth|
love|beauty|charity|faith|hope|thought|strength|night|
piety|heart|land|evil
<SPEC>::=flower|tree|dove|star|cloud|twig|pond|dog|goat|
muffin|petal|wagon wheel|gate|trap|lark|raven|drop|dish|spoon|
spark|bone|brain|tooth|face|rake|shovel|book|cover|whistle
<PREP>::=on|up|over|under|within|beside|of|in
<TVERB>::=revere|worship|understand|beseech|control|provoke|
heal|pursue|strengthen|become|kill|arouse|becalm|ensnare
<IVERB>::=sing|talk|run|aspire|twiddle|think|gurgle|ponder|
wiggle|bend|simmer|bask|break|tumble|dance|whistle|squawk
<ADJ>::=gentle|frail|happy|sorrowful|mournful|gay|rusty|
frolicking|wanton|lustful|timid|pensive|timorous|moody
<AUX>::=may|can|shall|should|must|doth
<NOUN>::=a <ADJ> <SPEC>|a <SPEC> of <GEN>|the <PROP> of a
 <SPEC>|the <SPEC> <PREP> <NOUN>|<GEN> <PREP> <GEN>|<GEN>'s
 <PROP>|<ADJ> <GEN>|the <PROP> of <GEN>
<RPOEM>::=A =ADJ= =SPEC= <AUX> <IVERB> <PREP> =NOUN=/And <AUX>
 <TVERB> <NOUN>./But <NOUN> <TVERB>s <NOUN>/While (NOUN)
 <TVERB>s the (ADJ) (SPEC)./
END
`,files:{"BAL.INC":`	DEFINE('BAL(PARENS,QTS)Q,GBAL,NAME,STAR,LP,RP')
	                                                    :(BAL_END)
BAL	NAME = 'BAL_.' &STCOUNT
	STAR = CONVERT(NAME, 'EXPRESSION')
	GBAL = NOTANY(PARENS QTS)
BAL_1	QTS LEN(1) . Q =                                    :F(BAL_2)
	GBAL = Q BREAK(Q) Q | GBAL                          :(BAL_1)
BAL_2	PARENS LEN(1) . LP RTAB(1) . PARENS LEN(1) . RP     :F(BAL_3)
	GBAL = LP (STAR | NULL) RP | GBAL                   :(BAL_2)
BAL_3	BAL = GBAL ARBNO(GBAL)
	$NAME = BAL                                         :(RETURN)
BAL_END`,"BREAKX.INC":`* BREAKX.inc - BREAKX(S) will return a pattern that will
*	       extend itself to include characters from S
*	       if required by a rematch attempt.
*	       
*  Built-in function in SNOBOL4+ and SPITBOL.
*
	DEFINE('BREAKX(S)')             :(BREAKX_END)
BREAKX	BREAKX = BREAK(S) ARBNO(LEN(1) BREAK(S))
	                                :(RETURN)
BREAKX_END`,"QUOTE.INC":`* QUOTE.inc - QUOTE(S) will convert its argument to a string
*	      which will resemble a SNOBOL4 expression which,
*	      when evaluated, will yield the original string S.
*
-INCLUDE "REPL.INC"
	DEFINE('QUOTE(S)S1,Q,QQ')                       :(QUOTE_END)
QUOTE	Q = "'" ; QQ = '"'
	QUOTE = Q REPL(S, Q, Q ' ' QQ Q QQ ' ' Q) Q     :(RETURN)
QUOTE_END`,"RANDOM.INC":`	DEFINE('RANDOM(N)')
	RAN_VAR = 1                     :(RANDOM_END)
RANDOM
	RAN_VAR = REMDR(RAN_VAR * 4676, 414971)
	RANDOM = RAN_VAR / 414971.
	RANDOM = NE(N,0) CONVERT(RANDOM * N,'INTEGER') + 1
	                                :(RETURN)
RANDOM_END`,"REPL.INC":`* REPL.inc - REPL(S1,S2,S3) will do a string-by-string replacement
*	     (as opposed to a character-by-character replacement
*	     ala REPLACE) on the string S1.  The string S1 is scanned
*	     for instances of the string S2  and each is replaced by
*	     S3.  Portions of S1 already scanned and the replaced
*	     string are not reexamined for instances of S2.
*
-INCLUDE "BREAKX.INC"
	DEFINE('REPL(S1,S2,S3)C,T,FINDC')   :(REPL_END)
REPL	S2 LEN(1) . C =                     :F(FRETURN)
	FINDC = BREAK(C) . T LEN(1)
	S2 = POS(0) S2
REPL_1	S1 FINDC =                          :F(REPL_2)
	S1 S2 =                             :F(REPL_3)
	REPL = REPL T S3                    :(REPL_1)
REPL_3	REPL = REPL T C                     :(REPL_1)
REPL_2	REPL = REPL S1                      :(RETURN)
REPL_END`,"RSELECT.INC":`* RSELECT.inc - RSELECT(S) will make a random selection of one of
*		a sequence of strings passed to it as an argument.
*		The first character in S is taken to be a break
*		character separating strings in the sequence.
*
*	RSELECT('|A|BIG|CAT') will return either "A", "BIG", or
*	"CAT" with probability one-third.  An optional integer
*	weight enclosed in sharp signs (#) may be placed at the
*	beginning of any alternation.  Thus:
*
*	RSELECT('|A|#3#BIG|CAT') will return "BIG" 3 times out
*	of five.
*
-INCLUDE "QUOTE.INC"
-INCLUDE "RANDOM.INC"
	DEFINE('RSELECT(S)WT,WTS,ALT,CODE,I,CODE,SSAVED,BC')
	RSEL_TBL = TABLE()              :(RSELECT_END)
RSELECT	CODE = RSEL_TBL<S>
	DIFFER(CODE,NULL)               :S<CODE>
	SSAVED = S
	S LEN(1) . BC =                 :F(RETURN)
RSELECT_1
	WT = 1
	S POS(0) '#' BREAK('#') . WT '#' =
	S (BREAK(BC) | REM) . ALT =
	WTS = WTS + WT
	CODE = CODE ' ;  RSELECT = LE(I,' WTS ') '
+	QUOTE(ALT) '				:S(RETURN)'
	S BC =                          :S(RSELECT_1)
	CODE = '  I = RANDOM(' WTS ') ' CODE
	S = SSAVED
	RSEL_TBL<S> = CODE(CODE)        :S(RSELECT)F(ERROR)
RSELECT_END`,"RSENTENC.INC":`-MODULE RSENTENCE
-INCLUDE "BAL.INC"
-INCLUDE "RSELECT.INC"
	DEFINE('RSENTENCE(STACK)VAR,EXP,S,TEXT')
	SYN.VAR = POS(0) '<' ARB . VAR '>'
	SNOBAL.EXP = POS(0) '(' BAL('(<>)','"' "'") . EXP ')'
	ASGN.VAR = POS(0) '=' ARB . VAR '='
	LITERAL.TEXT = BREAK('<=(') . TEXT
	RSENT_TBL = TABLE()
	SS = TRIM(INPUT)
RSI_1	S = TRIM(INPUT)
	S POS(0) ('<' | 'END' RPOS(0))              :S(RSI_2)
	SS = SS S                                   :(RSI_1)
RSI_2	SS '<' ARB . NM '>::=' =
	RSENT_TBL<NM> = '|' SS
	IDENT(S,'END')                              :S(RSENTENCE_END)
	SS = S                                      :(RSI_1)

RSENTENCE
	STACK SYN.VAR = RSELECT(RSENT_TBL<VAR>)     :S(RSENTENCE)
	STACK SNOBAL.EXP =                          :F(RSENT_1)
	S = S EVAL(EXP)                             :(RSENTENCE)
RSENT_1	STACK ASGN.VAR =                            :F(RSENT_2)
	$VAR = RSENTENCE('<' VAR '>')
	S = S $VAR                                  :(RSENTENCE)
RSENT_2	STACK LITERAL.TEXT =                        :F(RSENT_3)
	S = S TEXT                                  :(RSENTENCE)
RSENT_3	RSENTENCE = S STACK                         :(RETURN)
RSENTENCE_END`}},{name:"Conversions",file:"CONVERT.SNO",source:`* From James F. Gimpel, "Algorithms in SNOBOL4" (1976), Ch. 2 (UPLO, ROMAN, BASE, SPELL, MDY).
-INCLUDE "UPLO.INC"
-INCLUDE "ROMAN.INC"
-INCLUDE "BASEB.INC"
-INCLUDE "BASE10.INC"
-INCLUDE "SPELL.INC"
-INCLUDE "MDY.INC"
	OUTPUT = UPLO('Algorithms In SNOBOL4!')
	OUTPUT = ROMAN(1976)
	OUTPUT = BASEB(255,16)
	OUTPUT = BASE10('FF',16)
	OUTPUT = SPELL(1976)
	OUTPUT = MDY(71,83)
END`,input:"",files:{"BASE10.INC":`* BASE10 - BASE10(N,B) will convert the string N assumed
*	   to be a numeral expressed in base B arithmetic
*	   to decimal (base 10).
*
*	   Digits beyond 0-9 are from the set A-Z.
*
	DEFINE('BASE10(N,B)T')
	BASEB_ALPHA = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	                                :(BASE10_END)
BASE10	N LEN(1) . T =                  :F(RETURN)
	BASEB_ALPHA BREAK(*T) @T        :F(ERROR)
	BASE10 = (BASE10 * B) + T       :(BASE10)
BASE10_END`,"BASEB.INC":`*  BASEB(N,B) will convert the integer N to its base B representation.
*
*  B may be any positive integer <=36.
*
	DEFINE('BASEB(N,B)R,C')
	BASEB_ALPHA = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	                                :(BASEB_END)
BASEB	EQ(N,0)                         :S(RETURN)
	R = REMDR(N,B)
	BASEB_ALPHA TAB(*R) LEN(1) . C  :F(ERROR)
	BASEB = C BASEB
	N = N / B                       :(BASEB)
BASEB_END`,"MDY.INC":`* MDY.inc - MDY(Y,DY) will convert a year,day date into a
*	    month/day/year date.  For example MDY(71,83) will
*	    return '3/24/71'.  The global variables M and D are
*	    set to equal the month and day respectively.
*
	DEFINE('MDY(Y,DY)X,T')
	DAY_MONTH = '(334,12)(304,11)(273,10)(243,9)'
+	'(212,8)(181,7)(151,6)(120,5)(90,4)(59,3)(31,2)(0,1)'
	LY_DAY_MONTH = '(335,12)(305,11)(274,10)(244,9)'
+	'(213,8)(182,7)(152,6)(121,5)(91,4)(60,3)(31,2)(0,1)'
	I = SPAN('0123456789')
	SEARCH.X.M = '(' I $ X *GT(DY,X) ',' I $ M  :(MDY_END)
MDY	T = EQ(REMDR(Y,400),0) LY_DAY_MONTH         :S(MDY_1)
	T = EQ(REMDR(Y,100),0) DAY_MONTH            :S(MDY_1)
	T = EQ(REMDR(Y , 4),0) LY_DAY_MONTH         :S(MDY_1)
	T = DAY_MONTH
MDY_1	T SEARCH.X.M                                :F(FRETURN)
	D = DY - X
	GT(D, 31)                                   :S(FRETURN)
	MDY = M '/' D '/' Y                         :(RETURN)
MDY_END`,"ROMAN.INC":`* ROMAN.inc - ROMAN(N) will return the roman numeral representation
*	      of the integer N.  0 < N < 4000.
*
	DEFINE('ROMAN(N)T')             :(ROMAN_END)
ROMAN	N RPOS(1) LEN(1) . T =          :F(RETURN)
	'0,1I,2II,3III,4IV,5V,6VI,7VII,8VIII,9IX,'
+	T BREAK(',') . T                :F(FRETURN)
	ROMAN = REPLACE(ROMAN(N), 'IVXLCDM', 'XLCDM**') T
+                                       :S(RETURN)F(FRETURN)
ROMAN_END`,"SPELL.INC":`* SPELL.inc - SPELL(N) will return an English phrase designating
*	      the integer N.  Thus SPELL(13) will return "THIRTEEN".
*
	DEFINE('SPELL(N)M')                             :(SPELL_END)
SPELL	GE(N,1000)                                      :S(SPELL_1000)
	GE(N,100)                                       :S(SPELL_100)
	GE(N,20)                                        :S(SPELL_20)
	GE(N,13)                                        :S(SPELL_13)
	('1ONE,2TWO,3THREE,4FOUR,5FIVE,6SIX,7SEVEN,8EIGHT,9NINE,'
+	'10TEN,11ELEVEN,12TWELVE,') N ARB . SPELL ','   :(RETURN)
SPELL_13	N 1 LEN(1) . M
	SPELL = SPELL(M 0)
	SPELL 'TY' = 'TEEN'
	SPELL 'FOR' = 'FOUR'                            :(RETURN)
SPELL_20	N LEN(1) . M =
	'2TWEN,3THIR,4FOR,5FIF,6SIX,7SEVEN,8EIGH,9NINE,'
+	M BREAK(',') . SPELL
	SPELL = SPELL 'TY'
	SPELL = NE(N,0) SPELL '-' SPELL(N)              :(RETURN)
SPELL_100	N LEN(1) . M =
	SPELL = SPELL(M) ' HUNDRED'
	SPELL = NE(N,0) SPELL ' AND ' SPELL(+N)         :(RETURN)
SPELL_1000
	N RTAB(3) . M =
	SPELL = SPELL(M)
	SPELL 'THOUSAND' = 'MILLION'
	SPELL = SPELL ' THOUSAND'
	SPELL = NE(N,0) SPELL ' AND ' SPELL(+N)         :(RETURN)
SPELL_END`,"UPLO.INC":`* UPLO.inc - UPLO(S) will return its argument with upper case letters
*	     converted to lower case, and vice versa.  Non-alphabetic
*	     characters are ignored.
*
	DEFINE('UPLO(S)')
	UP_LO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
	LO_UP = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
	                                    :(UPLO_END)
UPLO	UPLO = REPLACE(S, UP_LO, LO_UP)     :(RETURN)
UPLO_END`}},{name:"Bignum arithmetic",file:"BIGNUM.SNO",source:`* From James F. Gimpel, "Algorithms in SNOBOL4" (1976), \xA715.3 (INFINIP: infinite-precision integers).
-INCLUDE "INFINIP.INC"
	BIG = '111111111111111111111'
	MED1 = '2222222222'
	MED2 = '3333333333'
	OUTPUT = 'BIG + BIG    = ' BIG + BIG
	OUTPUT = 'BIG - BIG    = ' BIG - BIG
	OUTPUT = 'BIG * 4      = ' BIG * 4
	OUTPUT = 'BIG / 4      = ' BIG / 4
	OUTPUT = 'REMDR(BIG,7) = ' REMDR(BIG, 7)
	OUTPUT = 'MED1 * MED2  = ' MED1 * MED2
	OUTPUT = 'MED1 + MED2  = ' MED1 + MED2
	FACT = 1
	N = 1
FACT_LOOP	FACT = FACT * N
	N = N + 1
	LE(N, 20)                       :S(FACT_LOOP)
	OUTPUT = '20!          = ' FACT
END`,input:"",files:{"INFINIP.INC":`-MODULE INFINIP
-INCLUDE "REDEFINE.INC"
-INCLUDE "SWAP.INC"
-INCLUDE "LPAD.INC"
	REDEFINE('-','MINUS(X)Y')
	REDEFINE( ,'GT(X,Y)')
	REDEFINE( ,'EQ(X,Y)')
	REDEFINE( ,'GE(X,Y)')
	REDEFINE( ,'NE(X,Y)')
	REDEFINE( ,'LT(X,Y)')
	REDEFINE( ,'LE(X,Y)')
	REDEFINE('-','DIFF(X,Y)')
	REDEFINE('+','SUM(X,Y)X1,X2,Y1,Y2,K')
	REDEFINE('*','MULT(X,Y)X1,X2,K')
	REDEFINE('/','DIV(X,Y)X1,X2,Y1,Y2,T,T1,T2,KX,KY')
	REDEFINE( ,'REMDR(X,Y)')
	SIGN_OFF = POS(0) '-'
	LDG_ZEROS = BREAK('123456789') | RTAB(1)
	NO_DIGITS = 4
	DEFINE('SMALL()')
	DEFINE('SPLIT(NAME,PAT)')       :(INFINIP_END)
SMALL	(LE.(SIZE(X),NO_DIGITS)
+	LE.(SIZE(Y),NO_DIGITS))         :S(RETURN)F(FRETURN)
SPLIT	PAT = IDENT(PAT) LEN(SIZE($NAME) / 2)
	$NAME (PAT | '') . $(NAME 1) @SPLIT (SPAN('0') | '')
+	REM . $(NAME 2)
	SPLIT = SIZE($NAME) - SPLIT     :(RETURN)
MINUS	MINUS = SMALL() MINUS.(X)       :S(RETURN)
	MINUS = X
	MINUS SIGN_OFF =                :S(RETURN)
	MINUS = '-' X                   :(RETURN)
GT	SMALL()                         :F(GT_1)
	GT.(X,Y)                        :S(RETURN)F(FRETURN)
GT_1	X SIGN_OFF =                    :F(GT_2)
	Y SIGN_OFF =                    :F(FRETURN)
	SWAP(.X,.Y)
GT_2	Y SIGN_OFF =                    :S(RETURN)
	LGT(LPAD(X,SIZE(Y),'0'),
+	LPAD(Y,SIZE(X),'0'))            :S(RETURN)F(FRETURN)

EQ	SMALL()                         :F(EQ_1)
	EQ.(X,Y)                        :S(RETURN)F(FRETURN)
EQ_1	IDENT(X,Y)                      :S(RETURN)F(FRETURN)

GE	~(~GT(X,Y) ~EQ(X,Y))            :S(RETURN)F(FRETURN)
NE	EQ(X,Y)                         :S(FRETURN)F(RETURN)
LT	GE(X,Y)                         :S(FRETURN)F(RETURN)
LE	GT(X,Y)                         :S(FRETURN)F(RETURN)
DIFF	DIFF = X + -Y                   :(RETURN)
SUM	SUM = SMALL() SUM.(X,Y)         :S(RETURN)
	SUM = LT(X,0) -(-X + -Y)        :S(RETURN)
	Y SIGN_OFF =                    :S(SUM_1)
	(LT(X,Y) SWAP(.X,.Y))
	K = SPLIT(.X)
	Y = Y + X2
	SPLIT(.Y,RTAB(K))
	SUM = (Y1 + X1) LPAD(Y2,K,'0')  :(RETURN)
SUM_1	SUM = GT(Y,X) -(Y - X)          :S(RETURN)
	Y = LPAD(Y,SIZE(X),'0')
*       Add 10's complement of Y
	SUM = X + 1 + REPLACE(Y,'0123456789','9876543210')
	SUM '1' LDG_ZEROS REM . SUM     :(RETURN)
MULT	MULT = LE(SIZE(X) + SIZE(Y),NO_DIGITS)
+	MULT.(X,Y)                      :S(RETURN)
	MULT = LT(X,0) -X * -Y          :S(RETURN)
	MULT = LT(Y,0) -(X * -Y)        :S(RETURN)
	(GT(Y,X) SWAP(.X,.Y))
	MULT = EQ(Y,0) 0                :S(RETURN)
	K = SPLIT(.X)
	MULT = (Y * X1) DUPL('0',K)
	MULT = MULT + X2 * Y            :(RETURN)
DIV	DIV = SMALL() DIV.(X,Y)         :S(RETURN)
	DIV = LT(X,0) -(-X / Y)         :S(RETURN)
	DIV = LT(Y,0) -(X / -Y)         :S(RETURN)
	DIV = GT(Y,X) 0                 :S(RETURN)
* Original statement from book:
*	KY  =  SPLIT(.Y,LEN(NO_DIGITS / 2) | REM)
*	KX  =  SPLIT(.X,LEN(NO_DIGITS))
* Suggested replacement to avoid generating error terms that are
* larger than the incoming numerator.  Such a situation can produce
* cycles.
	KY = SPLIT(.Y,LEN(NO_DIGITS / 2) | REM)
	KX = SPLIT(.X,LEN(NO_DIGITS / 2) | REM)
	KX = LT.(X1,Y1) SPLIT(.X,LEN(NO_DIGITS / 2 + 1) | REM)
* End of replacement statements.
	T1 = X1 / Y1
	T2 = DUPL('0', KX - KY)
	T = X - ((T1 * Y) T2)
	DIV = T1 T2
	T = LT(T,0) T + 1 - Y
	DIV = DIV + (T / Y)             :(RETURN)
REMDR	REMDR = X - (X / Y) * Y         :(RETURN)
INFINIP_END`,"LPAD.INC":`* LPAD.inc - LPAD(S,N,C) will pad string S on the left with
*	     character C until the string is N characters long.
*	     S is returned if it is >= N characters long.  C
*	     is taken to be ' ' if unspecified.
*
	DEFINE('LPAD(S,N,C)')           :(LPAD_END)
LPAD	LPAD = GE(SIZE(S),N) S          :S(RETURN)
	C = IDENT(C) ' '
	LPAD = DUPL(C, N - SIZE(S)) S   :(RETURN)
LPAD_END`,"REDEFINE.INC":`* REDEFINE.inc - REDEFINE(OP,DEF,LBL) will redefine the built-in
*	         operator OP to the name of the function given
*		 with prototype DEF and entry label LBL.  The
*		 old definition of the operator is preserved in
*		 the function name with appended period.
*
* CAUTION - This cannot be used with SPITBOL, which does not
*	    permit the redefition of built-in operators.
*
	DEFINE('REDEFINE(OP,DEF,LBL)NAME,N,FLAG')
	                                :(REDEFINE_END)
REDEFINE	DEF BREAK('(') . NAME '(' BREAK('),') LEN(1) . FLAG
	N = 1
	N = IDENT(FLAG, ',') 2
	N = IDENT(OP)
	OP = IDENT(OP) NAME
	OPSYN(NAME '.', OP, N)
	DEFINE(DEF, LBL)
	OPSYN(OP, NAME, N)              :(RETURN)
REDEFINE_END`,"SWAP.INC":`* SWAP.inc - SWAP(.N,.M) will swap the contents of the two named
*	     variables.
*
	DEFINE('SWAP(SWAP_ARG1,SWAP_ARG2)')     :(SWAP_END)
SWAP	SWAP = $SWAP_ARG1
	$SWAP_ARG1 = $SWAP_ARG2
	$SWAP_ARG2 = SWAP
	SWAP =                                  :(RETURN)
SWAP_END`}},{name:"Day of week",file:"WEEKDAY.SNO",source:`* From James F. Gimpel, "Algorithms in SNOBOL4" (1976), \xA72.8 (weekday from a date).
-INCLUDE "DAY.INC"
	OUTPUT = DAY('3/24/71')
	OUTPUT = D
	OUTPUT = DAY('3/24/1825')
	OUTPUT = DAY('2/29/2000')
	OUTPUT = DAY('1/1/1904')
	OUTPUT = DAY('12/25/2023')
END`,input:"",files:{"DAY.INC":`* DAY.inc - DAY(DATE) returns the day of the week for a
*	    month/day/year date.  Two-digit years are interpreted as
*	    twentieth-century years, following the book.
*
	DEFINE('DAY(DATE)M,Y')
	YEAR_ = 365
	YEAR_4 = 4 * YEAR_ + 1
	CENT_ = (25 * YEAR_4) - 1
	CENT_4 = 4 * CENT_ + 1
	DAY_ZERO = 2
	                                :(DAY_END)
DAY	DATE BREAK('/') . M LEN(1)
+	(BREAK('/') . D LEN(1) REM . Y | REM . D)
	(IDENT(Y,'') DATE()) '/' ARB '/' REM . Y
	Y = EQ(SIZE(Y),2) '19' Y
	M = LE(M,2) M + 12              :F(DAY_1)
	Y = Y - 1
DAY_1	M = M - 3
DAY_2	DAY = (Y / 400) * CENT_4 + (REMDR(Y,400) / 100) * CENT_
.	+ (REMDR(Y,100) / 4) * YEAR_4 + REMDR(Y,4) * YEAR_
	DAY = DAY + ((153 * M) + 2) / 5 + D + DAY_ZERO
	D = REMDR(DAY,7)
	'0SUN1MON2TUES3WEDNES4THURS5FRI6SATUR7'
+	D BREAK('01234567') . DAY
	DAY = DAY 'DAY'                 :(RETURN)
DAY_END`}},{name:"Sorting",file:"SORT.SNO",source:`* From James F. Gimpel, "Algorithms in SNOBOL4" (1976), Ch. 13 (bubble, heap, and shell sort).
-INCLUDE "SWAP.INC"
-INCLUDE "BSORT.INC"
-INCLUDE "HSORT.INC"
-INCLUDE "SSORT.INC"
-INCLUDE "STRINGOU.INC"
	A = ARRAY(5)
	A<1> = 'PEAR'; A<2> = 'FIG'; A<3> = 'APPLE'; A<4> = 'KIWI'; A<5> = 'DATE'
	BSORT(A,1,5)
	OUTPUT = STRINGOUT(A, ',')
	B = ARRAY(5)
	B<1> = 'PEAR'; B<2> = 'FIG'; B<3> = 'APPLE'; B<4> = 'KIWI'; B<5> = 'DATE'
	HSORT(B,1,5)
	OUTPUT = STRINGOUT(B, ',')
	SS = ','
	SS = SSORT(SS,'PEAR')
	SS = SSORT(SS,'FIG')
	SS = SSORT(SS,'APPLE')
	SS = SSORT(SS,'KIWI')
	SS = SSORT(SS,'DATE')
	OUTPUT = SS
END`,input:"",files:{"BSORT.INC":`* BSORT - Bubble Sort
*
* BSORT(A,I,N) will sort in ascending lexical order the
* strings in the subarray A<I>, A<I + 1>, ..., A<N>.
*
* CAUTION: Bubble sorts may be time consuming for large arrays.
*
	DEFINE('BSORT(A,I,N)J,K,V')     :(BSORT_END)
BSORT	J = I
BSORT_1	J = J + 1 LT(J,N)               :F(RETURN)
	K = J
	V = A<J>
BSORT_2	K = K - 1 GT(K,I)               :F(BSORT_RO)
	A<K + 1> = LGT(A<K>,V) A<K>     :S(BSORT_2)
	A<K + 1> = V                    :(BSORT_1)
BSORT_RO	A<I> = V                :(BSORT_1)
BSORT_END`,"HSORT.INC":`* HSORT.inc - HSORT(A,I,N) will sort the strings in array A<I>,
*	      A<I + 1>, ..., A<N> in ascending sequence using
*	      Hoare's Quicksort.
*
-INCLUDE "SWAP.INC"
	DEFINE('HSORT(A,I,N)J,K,CRITERION')     :(HSORT_END)
HSORT	GT(N - I, 1)                            :S(HSORT_LARGE)
	GE(I,N)                                 :S(RETURN)
	(LGT(A<I>, A<N>) SWAP(.A<I>, .A<N>))    :(RETURN)
HSORT_LARGE
	CRITERION = A<(I + N) / 2>
	J = I - 1
	K = N + 1
HSORT_UP	J = J + 1
	~LGT(CRITERION, A<J>)                   :F(HSORT_UP)
HSORT_DOWN	K = K - 1
	~LGT(A<K>, CRITERION)                   :F(HSORT_DOWN)
	(LT(J,K) SWAP(.A<J>, .A<K>))            :S(HSORT_UP)
	HSORT(A,I,K)
	HSORT(A, K + 1, N)                      :(RETURN)
HSORT_END`,"SSORT.INC":`* SSORT - SSORT(SS,S) is a string sort.  The string S is
*	  inserted into a string of strings (separated by
*	  commas) in SS.  The augmented list is returned
*	  as value.
*
	DEFINE('SSORT(SSORT,S)T')
	SS_PAT = ',' (BREAK(',') $ T *LGT(T,S) | RPOS(0)) . T
	                                :(SSORT_END)
SSORT	SSORT SS_PAT = ',' S ',' T      :S(RETURN)
	SSORT = ',' S ','               :(RETURN)
SSORT_END`,"STRINGOU.INC":`* STRINGOUT.inc - STRINGOUT(A,SEP) will serve to convert from array
*		  to string.  SEP contains a separation string to be
*		  inserted between strings of the array A.
*
	DEFINE('STRINGOUT(A,SEP)I')     :(STRINGOUT_END)
STRINGOUT	I = 1
	STRINGOUT = A<1>                :F(RETURN)
STRINGOUT_1	I = I + 1
	STRINGOUT = STRINGOUT SEP A<I>  :S(STRINGOUT_1)F(RETURN)
STRINGOUT_END`,"SWAP.INC":`* SWAP.inc - SWAP(.N,.M) will swap the contents of the two named
*	     variables.
*
	DEFINE('SWAP(SWAP_ARG1,SWAP_ARG2)')     :(SWAP_END)
SWAP	SWAP = $SWAP_ARG1
	$SWAP_ARG1 = $SWAP_ARG2
	$SWAP_ARG2 = SWAP
	SWAP =                                  :(RETURN)
SWAP_END`}}];var En="POEM.SNO",K="\0new",Y=document.querySelector("#status"),i=document.querySelector("main"),v=document.querySelector("#input"),I=document.querySelector("#out"),o=document.querySelector("#example"),d=document.querySelector("#theme"),G=document.querySelector("#show-input"),Sn=document.querySelector("#run"),u=document.querySelector("#file-tabs"),Nn=document.querySelector("#editor-stack"),Rn=document.querySelector("#add-file"),m;function c(n,t=!1){clearTimeout(m),Y.textContent=n,Y.classList.toggle("error",t)}var W="snoflake-theme";function V(n){n==="auto"?delete document.documentElement.dataset.theme:document.documentElement.dataset.theme=n,d.value=n,localStorage.setItem(W,n)}d.addEventListener("change",()=>V(d.value));V(localStorage.getItem(W)||"auto");var Tn=C.theme({"&":{backgroundColor:"var(--bg)",color:"var(--fg)"},".cm-gutters":{backgroundColor:"var(--panel)",color:"var(--muted)",border:"none"},".cm-activeLine":{backgroundColor:"var(--active-line)"},".cm-activeLineGutter":{backgroundColor:"var(--active-line)"},".cm-content":{caretColor:"var(--accent)"},".cm-cursor, .cm-dropCursor":{borderLeftColor:"var(--accent)"},"&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":{backgroundColor:"var(--selection)"}}),an=g.define([{tag:T.lineComment,color:"var(--muted)",fontStyle:"italic"},{tag:T.meta,color:"var(--muted)"},{tag:T.labelName,color:"var(--accent)",fontWeight:"600"},{tag:T.controlKeyword,color:"var(--accent)"},{tag:T.keyword,color:"var(--accent)"},{tag:T.standard(T.variableName),color:"var(--builtin)"},{tag:T.string,color:"var(--literal)"},{tag:T.special(T.string),color:"var(--literal)"},{tag:T.number,color:"var(--literal)"}]),rn=new URL("./editor-worker.js",import.meta.url);function An(n){I.textContent+=n+`
`}var s,l=!1,_=null;function Q(){s=new Worker(rn,{type:"module"}),s.onmessage=n=>{let t=n.data;t.type==="ready"?(_?.(),_=null):t.type==="line"?An(t.line):t.type==="done"?(l=!1,c("Ready")):(l=!1,c(`Error: ${t.message}`,!0))},s.onerror=n=>{l=!1,c(`Error: ${n.message}`,!0)}}function B(){l&&(s.terminate(),Q()),l=!0,I.textContent="",clearTimeout(m),m=setTimeout(()=>c("Running\u2026"),200),h();let n={};S.forEach((t,e)=>{e!==R&&(n[t.name]=t.state.doc.toString())}),s.postMessage({source:S[R].state.doc.toString(),input:v.value,files:n})}Q();var on=[p,f(),Tn,F(an)],L=new C({parent:Nn}),S=[],R=0,P=n=>M.create({doc:n,extensions:on});function h(){S[R]&&(S[R].state=L.state)}function U(){u.replaceChildren(),S.forEach((n,t)=>{let e=t===R,E=document.createElement("span"),a=document.createElement("span");if(E.className=e?"tab active":"tab",a.className="name",a.textContent=n.name,a.title=n.name,E.append(a),E.addEventListener("click",()=>{t!==R?k(t):Ln(a,n)}),S.length>1){let A=document.createElement("button");A.className="close",A.type="button",A.title="Remove file",A.textContent="\xD7",A.addEventListener("click",tn=>{tn.stopPropagation(),On(t)}),E.append(A)}u.append(E)})}function k(n){h(),R=n,L.setState(S[n].state),U(),L.focus()}function Ln(n,t){let e=document.createElement("input");e.value=t.name,e.setAttribute("aria-label","File name"),n.replaceChildren(e),e.focus(),e.select(),e.addEventListener("click",E=>E.stopPropagation()),e.addEventListener("blur",()=>{let E=e.value.trim();E&&E!==t.name&&!S.some(a=>a.name===E)&&(t.name=E),U()}),e.addEventListener("keydown",E=>{E.key==="Escape"&&(e.value=t.name),(E.key==="Enter"||E.key==="Escape")&&e.blur()})}function sn(n,t=""){S.push({name:n,state:P(t)}),k(S.length-1)}function ln(n,t){let e=`${n}${t}`;for(let E=2;S.some(a=>a.name===e);E++)e=`${n}${E}${t}`;return e}var In=`*  Edit this program, or write your own.
        OUTPUT = 'Hello, world.'
END
`;function Dn(){j([{name:"MAIN.SNO",state:P(In)}],""),u.querySelector(".tab").classList.add("flash"),L.focus()}function On(n){h(),S.splice(n,1),R=R>n?R-1:Math.min(R,S.length-1),L.setState(S[R].state),U()}Rn.addEventListener("click",()=>sn(ln("FILE",".INC")));Sn.addEventListener("click",B);addEventListener("keydown",n=>{(n.metaKey||n.ctrlKey)&&n.key==="Enter"&&(n.preventDefault(),B())});I.addEventListener("keydown",n=>{(n.metaKey||n.ctrlKey)&&n.key==="a"&&(n.preventDefault(),getSelection().selectAllChildren(I))});G.addEventListener("change",()=>{i.classList.toggle("input-hidden",!G.checked),D()});var H=document.querySelector("#sources"),J=document.querySelector("#input-section"),x=I.closest("section"),$=[...i.querySelectorAll(".gutter")],q=matchMedia("(max-width: 720px)"),w=6,X=120,Z=new Map([[H,1.1],[J,.55],[x,.8]]),r=new Map(Z);function D(){if(q.matches){i.style.gridTemplateColumns="";return}let n=!i.classList.contains("input-hidden");$[1].style.display=n?"":"none";let t=[r.get(H)+"fr",w+"px"];n&&t.push(r.get(J)+"fr",w+"px"),t.push(r.get(x)+"fr"),i.style.gridTemplateColumns=t.join(" ")}function y(n,t){let e=n[t];for(;e&&!(e.matches("section")&&getComputedStyle(e).display!=="none");)e=e[t];return e}var N=null;function cn(n,t){let e=y(t,"previousElementSibling"),E=y(t,"nextElementSibling");!e||!E||(t.setPointerCapture(n.pointerId),t.classList.add("dragging"),i.classList.add("resizing"),N={gutter:t,left:e,right:E,startX:n.clientX,leftPx:e.getBoundingClientRect().width,spanPx:e.getBoundingClientRect().width+E.getBoundingClientRect().width,spanFr:r.get(e)+r.get(E)})}function Pn(n){if(!N)return;let t=Math.max(X,Math.min(N.spanPx-X,N.leftPx+(n.clientX-N.startX))),e=N.spanFr*t/N.spanPx;r.set(N.left,e),r.set(N.right,N.spanFr-e),D()}function b(){N&&(N.gutter.classList.remove("dragging"),i.classList.remove("resizing"),N=null)}function Bn(){for(let[n,t]of Z)r.set(n,t);D()}for(let n of $)n.addEventListener("pointerdown",t=>cn(t,n)),n.addEventListener("pointermove",Pn),n.addEventListener("pointerup",b),n.addEventListener("lostpointercapture",b),n.addEventListener("dblclick",Bn);q.addEventListener("change",D);D();function j(n,t){S=n,R=0,L.setState(S[0].state),U(),v.value=t}function z(n){j([{name:n.file,state:P(n.source)},...Object.entries(n.files).map(([t,e])=>({name:t,state:P(e)}))],n.input)}var nn=new Option("LOAD\u2026","",!0,!0);nn.disabled=!0;o.add(nn);o.add(new Option("NEW",K));for(let n of O){let t=new Option(n.file,n.file);t.title=n.name,o.add(t)}o.addEventListener("change",()=>{let n=o.value;o.selectedIndex=0,n===K?Dn():z(O.find(t=>t.file===n)),B()});z(O.find(n=>n.file===En));_=B;
