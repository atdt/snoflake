import{b as V,f as w}from"./chunks/chunk-5K2CWJIC.js";import{b as f,c as X,e as y}from"./chunks/chunk-CVLCSGYR.js";import{a as G,b as x}from"./chunks/chunk-CFSBF4EM.js";function v(){let E=[];return{lines:E,write(e){E.push(e)}}}function Z(E){return E.length===0?"":E.join(`
`)+`
`}function b(E,e={}){let r=v(),o=v(),T=e.inputText!==void 0,O=0;try{({exitCode:O}=G({...e,source:E,sourcePath:e.file||"demo.sno",input:T?e.input||"input.txt":void 0,loader:{load:()=>e.inputText??""},stdout:r,stderr:o}))}catch(t){o.write("Execution error: "+(t?.message||t))}return{stdout:Z(r.lines),stderr:Z(o.lines),exitCode:O}}function W(E){let e=new V({doc:E.value,extensions:[w]});return e.contentDOM.setAttribute("aria-label",E.getAttribute("aria-label")||""),E.replaceWith(e.dom),{getValue(){return e.state.doc.toString()},setValue(r){e.dispatch({changes:{from:0,to:e.state.doc.length,insert:r}})}}}var d=E=>e=>{E.textContent=e};function B(E,e){for(let[r,o]of Object.entries(e)){let T=document.createElement("option");T.value=r,T.textContent=o.label,E.append(T)}}var k=`* Split each input line into words with Intl.Segmenter,
* loaded as the WORDS helper.
  LOAD('WORDS(STRING)STRING',\`
    function (s) {
      var out = [];
      for (var p of new Intl.Segmenter("en",
          { granularity: "word" }).segment(s))
        if (p.isWordLike) out.push(p.segment);
      return out.join("|");
    }\`)

NEXT  LINE = INPUT  :F(END)
  OUTPUT = WORDS(LINE)  :(NEXT)
END
`;var ie=`Hello world!
\u3053\u3093\u306B\u3061\u306F\u4E16\u754C\u3002
\u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E35\u0E0A\u0E32\u0E27\u0E42\u0E25\u0E01!
\u041F\u0440\u0438\u0432\u0435\u0442 \u043C\u0438\u0440!
`;function z(){let E=W(document.querySelector("#batch-io-source")),e=document.querySelector("#batch-io-input"),r=document.querySelector("#batch-io-output"),o=d(document.querySelector("#batch-io-status")),T=document.querySelector("#batch-io-run"),O=document.querySelector("#batch-io-reset");function t(){r.textContent="",o("Running");let R=b(E.getValue(),{inputText:e.value});r.textContent=[R.stdout,R.stderr].filter(Boolean).join(`
`)||"(no output)",o(R.stderr||R.exitCode?"Error":"Finished")}function i(){r.textContent="",E.setValue(k),e.value=ie,o("Ready")}T.addEventListener("click",t),O.addEventListener("click",i),i()}var q=`* PLEASE WAIT A MINUTE WHILE I PREPARE TO BE YOUR CONSULTANT.\r
* This program is based on the ELIZA program in the 1970 December\r
* issue of SIGPLAN page 50, by Robert T. Duquet.\r
* It has been modified by Mike Alexander and Viktors Berstis.\r
* ELIZA was originally written in LISP.  See "ELIZA - A Computer Program\r
* For the Study of Natural Language Communication Between Man and Machine"\r
* in Communications of the ACM, Volume 9, Number 1, January 1966, pages 36-45.\r
*\r
* Modernized by O.L. (2026-05-09):\r
* - Removed obsolete CODE()/SAVE() memory hacks and custom I/O bindings.\r
* - Replaced dynamic compilation with a standard SETUP -> MAIN flow.\r
* - Fixed EOF (CTRL-D) loop and removed the teletype paper-feed hack.\r
* - Removed non-standard &STAT keyword for strict v3.11 compatibility.\r
        :(SETUP)\r
MAIN    OUTPUT = 'HELLO. PLEASE TELL ME ABOUT YOUR PROBLEM.'\r
\r
RESET   Q =\r
        PMAX = 0\r
        KLIST = '/'\r
        TX = ' '\r
        TEXT = REPLACE(TRIM(INPUT),LC,UC) ' '  :F(OOFF)\r
        TEXT NOTANY(' ')        :F(OOFF)\r
        TEXT POS(0) ('QUIT' | 'OFF' | 'BYE' | 'END' | 'STOP' |\r
+   'GOOD' ARB 'BYE' | 'SIGNOFF') (SPAN('., !') | '') RPOS(0) :S(OOFF)\r
DPOS    TEXT "'" =     :S(DPOS)\r
NXWD    TEXT WORD =            :F(NUKEY)\r
        W PUNCT =\r
        $('W.' W) KEY          :F(ADWD)\r
        W = DIFFER(SW) SW\r
        PMAX = GT(P,PMAX) P    :F(PLOW)\r
        KLIST = KL '/' KLIST   :(ADWD)\r
PLOW    KLIST = DIFFER(KL) KLIST KL '/'\r
ADWD    TX = TX W ' '\r
        Q = DIFFER(Q)          :F(NXWD)\r
        GT(SIZE(KLIST),1)      :S(NUKEY)\r
        TX = ' '\r
        TEXT = R ' ' TEXT      :(NXWD)\r
NUKEY   KLIST NKEY =          :F(NOK)\r
NUPAT   KL NPAT =             :F(NUKEY)\r
        TX PAT<K>             :F(NUPAT)\r
GREP    REP<K> NREP = RL REPLY '/'\r
        REPLY '=' REM . K     :S(GREP)\r
ESUB    REPLY EPAT = $EE      :S(ESUB)\r
DBLNK2  REPLY ' ' SPAN(' ') = ' ' :S(DBLNK2)\r
        REPLY ' ' ANY('.?') . QQX = QQX\r
        OUTPUT = REPLY        :(RESET)\r
NOK     K = 0   :(GREP)\r
OOFF    OUTPUT = 'THANK YOU.  I HAVE ENJOYED TALKING WITH YOU.'    :(END)\r
SETUP   LC = 'abcdefghijklmnopqrstuvwxyz'\r
        UC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'\r
        WORD = POS(0) BREAK(' ') . W LEN(1)\r
        PUNCT = ANY('.,;:?') . Q REM . R\r
        KEY = POS(0) BREAK('/') . SW LEN(1) BREAK('/') . P LEN(1) REM . KL\r
        NKEY = POS(0) BREAK('/') . KL LEN(1)\r
        NPAT = POS(0) BREAK('.') . K LEN(1)\r
        NREP = POS(0) BREAK('/') . REPLY LEN(1) REM . RL\r
        EPAT = '#' LEN(2) . EE\r
        PAT = ARRAY(100) ; REP = ARRAY('0:100')\r
        REP<0> = "I AM NOT SURE I UNDERSTAND YOU FULLY./PLEASE GO ON./"\r
.  "WHAT DOES THAT SUGGEST TO YOU?/DO YOU FEEL STRONGLY ABOUT DISCUS"\r
.  "SING SUCH THINGS?/"\r
        PFAM = "MOTHER " | "FATHER " | "SISTER " | "BROTHER " | "WIFE "\r
.       | "CHILDREN " | "HUSBAND " | "KID " | "KIDS "\r
        W.MY = "YOUR/2/1.2."\r
        PAT<1> = "YOUR " ARB PFAM . E4 REM . E5\r
        REP<1> = "TELL ME MORE ABOUT YOUR FAMILY./WHO ELSE IN YOUR FAMILY #E5?"\r
.   "/YOUR #E4?/WHAT ELSE COMES TO MIND WHEN YOU THINK OF YOUR #E4?/"\r
        PAT<2> = "YOUR " REM . E3\r
        REP<2> = "YOUR #E3?/WHY DO YOU SAY YOUR #E3?/DOES THAT SUGGEST ANY"\r
.   "THING ELSE WHICH BELONGS TO YOU?/"\r
.  "IS IT IMPORTANT TO YOU THAT YOUR #E3?/"\r
        W.YOU = "I//3.4.5.6."\r
        PAT<3> = "I REMIND YOU OF"\r
        REP<3> = "=DIT/"\r
        PAT<4> = "I ARE " REM . E4\r
        REP<4> = "WHAT MAKES YOU THINK I AM #E4?/"\r
.  "DOES IT PLEASE YOU TO BELIEVE I AM #E4?/"\r
.  "DO YOU SOMETIMES WISH YOU WERE #E4?/"\r
.  "PERHAPS YOU WOULD LIKE TO BE #E4./"\r
        PAT<5> = "I " ARB . E3 "YOU " RPOS(0)\r
        REP<5> = "WHY DO YOU THINK I #E3 YOU?/YOU LIKE TO THINK I #E3 YOU, "\r
.     "DON'T YOU?/WHAT MAKES YOU THINK I #E3 YOU?/REALLY, I #E3 YOU/"\r
.   "SUPPOSE I DID #E3 YOU -- WHAT WOULD THAT MEAN?/"\r
.   "DOES SOMEONE ELSE BELIEVE I #E3 YOU?/"\r
        PAT<6> = "I " REM . E3\r
        REP<6> = "WE WERE DISCUSSING YOU, NOT ME./OH, I #E3/"\r
.  "YOU'RE NOT REALLY TALKING ABOUT ME, ARE YOU?/"\r
.   "WHAT ARE YOUR FEELINGS NOW?/"\r
        W.MOM = "MOTHER//"\r
        W.DAD = "FATHER//"\r
        W.YES = "//7."\r
        PAT<7> = ARB\r
        REP<7> = "PLEASE TELL ME MORE./YOU ARE SURE?/I SEE./I UNDERSTAND./"\r
        W.NO = "//8."\r
        PAT<8> = ARB\r
        REP<8> = "PLEASE EXPLAIN YOUR ANSWER IN MORE DETAIL/WHY NOT?/"\r
.   "YOU ARE BEING A BIT NEGATIVE./WHY 'NO'?/WOULD MOST PEOPLE SAY NO?/"\r
        PEVRY = "EVERYONE " | "EVERYBODY " | "NOBODY " | "NOONE "\r
        W.EVERYONE = "/2/9."\r
        PAT<9> = PEVRY . E2\r
        REP<9> = "REALLY, #E2?/SURELY NOT #E2/CAN YOU THINK OF ANYONE IN "\r
.    "PARTICULAR?/WHO, FOR EXAMPLE?/YOU ARE THINKING OF A VERY SPECIAL"\r
.    " PERSON./WHO, MAY I ASK?/SOMEONE SPECIAL PERHAPS?/YOU HAVE A "\r
.   "PARTICULAR PERSON IN MIND, DON'T YOU?/WHO DO YOU THINK YOU'RE "\r
.    "TALKING ABOUT?/"\r
        W.EVERYBODY = "/2/9."\r
        W.NOBODY = "/2/9."\r
        W.NOONE = "/2/9."\r
        W.ALWAYS = "/1/10."\r
        PAT<10> = ARB\r
        REP<10> = "CAN YOU THINK OF A SPECIFIC EXAMPLE?/WHEN?/"\r
.   "WHAT INCIDENT ARE YOU THINKING OF?/REALLY, ALWAYS?/"\r
        PBE = "AM " | "IS " | "ARE " | "WAS "\r
        W.LIKE = "/10/11."\r
        PAT<11> = PBE ARB "LIKE "\r
        REP<11> = "IN WHAT WAY?/WHAT RESEMBLANCE DO YOU SEE?/WHAT DOES "\r
.   "THAT SIMILARITY SUGGEST TO YOU?/WHAT OTHER CONNECTIONS DO YOU "\r
.   "SEE?/WHAT DO YOU SUPPOSE THAT RESEMBLANCE MEANS?/HOW?/"\r
        W.SORRY = "//12."\r
        PAT<12> = ARB\r
        REP<12> = "PLEASE DON'T APOLOGIZE./APOLOGIES ARE NOT NECESSARY./"\r
.   "WHAT FEELINGS DO YOU HAVE WHEN YOU APOLOGIZE?/"\r
        W.REMEMBER = "/5/13.14."\r
        PAT<13> = "YOU REMEMBER " REM . E4\r
        REP<13> = "DO YOU OFTEN THINK OF #E4?/DOES THINKING OF #E4 BRING "\r
.  "ANYTHING ELSE TO MIND?/WHAT ELSE DO YOU REMEMBER?/WHY DO YOU "\r
.  "REMEMBER #E4 JUST NOW?/WHAT IN THE PRESENT SITUATION REMINDS "\r
.  "YOU OF #E4?/WHAT IS THE CONNECTION BETWEEN ME AND #E4?/"\r
        PAT<14> = "DO I REMEMBER " REM . E5\r
        REP<14> = "DID YOU THINK I WOULD FORGET #E5?/WHY DO YOU THINK I "\r
.  "SHOULD RECALL #E5 NOW?/WHAT ABOUT #E5?/=15/YOU MENTIONED #E5./"\r
        W.WHAT = "//15."\r
        PAT<15> = ARB\r
        REP<15> = "WHY DO YOU ASK?/DOES THAT QUESTION INTEREST YOU?/"\r
.  "WHAT IS IT YOU REALLY WANT TO KNOW?/ARE SUCH QUESTIONS MUCH "\r
.  "ON YOUR MIND?/WHAT ANSWER WOULD PLEASE YOU MOST?/"\r
        W.IF = "/3/16."\r
        PAT<16> = "IF " REM . E3\r
        REP<16> = "DO YOU THINK ITS LIKELY THAT #E3?/DO YOU WISH THAT #E3?/"\r
.  "WHAT DO YOU THINK ABOUT #E3?/REALLY, IF #E3?/"\r
        W.DREAMT = "/4/17."\r
        PAT<17> = "YOU DREAMT " REM . E4\r
        REP<17> = "REALLY, #E4/HAVE YOU EVER FANTASIED #E4 WHILE YOU WERE "\r
.  "AWAKE?/HAVE YOU DREAMT #E4 BEFORE?/=18/"\r
        W.DREAMED = "DREAMT/4/17."\r
        W.DREAM = "/3/18."\r
        PAT<18> = ARB\r
        REP<18> = "WHAT DOES THAT DREAM SUGGEST TO YOU?/DO YOU DREAM OFTEN?/"\r
.  "WHAT PERSONS APPEAR IN YOUR DREAMS?/DON'T YOU BELIEVE THAT "\r
.  "DREAM HAS SOMETHING TO DO WITH YOUR PROBLEM?/"\r
        W.DREAMS = "/3/18."\r
        W.HOW = "//15."\r
        W.WHEN = "//15."\r
        W.ALIKE = "/10/11."\r
        W.SAME = "/10/11."\r
        W.CERTAINLY = "//7."\r
        W.PERHAPS = "//19."\r
        PAT<19> = ARB\r
        REP<19> = "YOU DON'T SEEM QUITE CERTAIN./WHY THE UNCERTAIN TONE?/"\r
.  "CAN'T YOU BE MORE POSITIVE?/YOU AREN'T SURE./DON'T YOU KNOW?/"\r
        W.MAYBE = "//19."\r
        W.NAME = "/15/20."\r
        PAT<20> = ARB\r
        REP<20> = "I AM NOT INTERESTED IN NAMES./I'VE TOLD YOU BEFORE, I "\r
.  "DON'T CARE ABOUT NAMES  PLEASE CONTINUE./"\r
        W.COMPUTER = "/50/21."\r
        PAT<21> = ARB\r
        REP<21> = "DO COMPUTERS WORRY YOU?/WHY DO YOU MENTION COMPUTERS?/"\r
.  "WHAT DO YOU THINK MACHINES HAVE TO DO WITH YOUR PROBLEM?/"\r
.  "DON'T YOU THINK COMPUTERS CAN HELP PEOPLE?/WHAT ABOUT MACHINES "\r
.  "WORRIES YOU?/WHAT DO YOU THINK ABOUT MACHINES?/"\r
        W.MACHINE = "/50/21."\r
        W.COMPUTERS = "/50/21."\r
        W.MACHINES = "/50/21."\r
        W.AM = "ARE//22.23."\r
        PAT<22> = "ARE YOU " REM . E4\r
        REP<22> = "DO YOU BELIEVE YOU ARE #E4?/WOULD YOU WANT TO BE #E4?/"\r
.  "YOU WISH I WOULD TELL YOU YOU ARE #E4./WHAT WOULD IT MEAN IF "\r
.  "YOU WERE #E4?/=15/"\r
        PAT<23> = ARB\r
        REP<23> = "WHY DO YOU SAY 'AM'?/I DON'T UNDERSTAND THAT./"\r
        W.ARE = "//24.25."\r
        PAT<24> = "ARE I " REM . E4\r
        REP<24> = "WHY ARE YOU INTERESTED IN WHETHER I AM #E4 OR NOT?/"\r
.  "WOULD YOU PREFER IF I WEREN'T #E4?/PERHAPS I AM #E4 IN YOUR "\r
.  "FANTASIES./DO YOU SOMETIMES THINK I AM #E4?/=15/"\r
        PAT<25> = "ARE " REM . E3\r
        REP<25> = "DID YOU THINK THEY MIGHT NOT BE #E3?/WOULD YOU LIKE "\r
.  "IT IF THEY WERE NOT #E3?/WHAT IF THEY WERE NOT #E3?/"\r
        W.YOUR = "MY//26."\r
        PAT<26> = "MY " REM . E3\r
        REP<26> = "WHY ARE YOU CONCERNED OVER MY #E3?/WHAT ABOUT YOUR "\r
.  "OWN #E3?/ARE YOU WORRIED ABOUT SOMEONE ELSE'S #E3?/REALLY, MY #E3/"\r
        W.WAS = "/2/27.28.29."\r
        PAT<27> = "WAS YOU " REM . E4\r
        REP<27> = "WHAT IF YOU WERE #E4?/DO YOU THINK YOU WERE #E4?/WERE YOU "\r
.  "#E4?/WHAT WOULD IT MEAN IF YOU WERE #E4?/=15/"\r
        PAT<28> = "YOU WAS " REM . E4\r
        REP<28> = "WERE YOU REALLY?/WHY DO YOU TELL ME YOU WERE #E4 NOW?/"\r
.  "PERHAPS I ALREADY KNEW YOU WERE #E4./"\r
        PAT<29> = "WAS I " REM . E4\r
        REP<29> = "WOULD YOU LIKE TO BELIEVE I WAS #E4?/WHAT SUGGEST THAT I "\r
.  "WAS #E4?/WHAT DO YOU THINK?/PERHAPS I WAS #E4./"\r
        W.WERE = "WAS//27.28.29."\r
        W.ME = "YOU//"\r
        W.MYSELF = "YOURSELF//"\r
        W.YOURSELF = "MYSELF//"\r
        W.I = "YOU//30.31.32.33.34.35.36.37.38.39.40.41."\r
        PAT<30> = "YOU " ("WANT " | "NEED ") REM . E4\r
        REP<30> = "WHAT WOULD IT MEAN TO YOU IF YOU GOT #E4?/WHY DO YOU WANT "\r
.   "#E4?/SUPPOSE YOU GOT #E4 SOON./WHAT IF YOU NEVER GOT #E4?/WHAT "\r
.   "WOULD GETTING #E4 MEAN TO YOU?/WHAT DOES WANTING #E4 HAVE TO DO "\r
.   "WITH THIS DISCUSSION?/"\r
        PAT<31> = "YOU ARE " ARB ("SAD " | "UNHAPPY " | "DEPRESSED " | "SICK ")\r
.   . E5\r
        REP<31> = "I AM SORRY TO HEAR YOU ARE #E5./DO YOU THINK COMING HERE "\r
.   "WILL HELP YOU NOT TO BE #E5?/I'M SURE ITS NOT PLEASANT TO BE #E5./"\r
.   "CAN YOU EXPLAIN WHAT MADE YOU #E5?/"\r
        PAT<32> = "YOU ARE " ARB ("HAPPY " | "ELATED " | "GLAD " | "BETTER ")\r
.   . E5\r
        REP<32> = "HOW HAVE I HELPED YOU TO BE #E5?/HAS YOUR TREATMENT MADE "\r
.  "YOU #E5?/WHAT MAKES YOU #E5 JUST NOW?/CAN YOU EXPLAIN WHY YOU "\r
.  "ARE SUDDENLY #E5?/"\r
        PAT<33> = "YOU WAS " REM . E4\r
        REP<33> = "=27/=28/"\r
        PBLIEF = "FEEL " | "THINK " | "BELIEVE " | "WISH "\r
        PAT<34> = "YOU " PBLIEF "YOU " REM . E5\r
        REP<34> = "DO YOU REALLY THINK SO?/BUT YOU ARE NOT SURE YOU #E5./"\r
.  "DO YOU REALLY DOUBT YOU #E5?/"\r
        PAT<35> = "YOU " ARB PBLIEF ARB "I " REM . E4\r
        REP<35> = "=4/"\r
        PAT<36> = "YOU ARE " REM . E4\r
        REP<36> = "IS IT BECAUSE YOU ARE #E4 THAT YOU CAME TO ME?/"\r
.  "HOW LONG HAVE YOU BEEN #E4?/DO YOU BELIEVE IT NORMAL TO BE #E4?/"\r
.  "DO YOU ENJOY BEING #E4?/"\r
        PAT<37> = "YOU " ("CAN'T " | "CANNOT ") REM . E4\r
        REP<37> = "HOW DO YOU KNOW YOU CAN'T #E4?/HAVE YOU TRIED?/"\r
.   "PERHAPS YOU COULD #E4 NOW./"\r
.   "DO YOU REALLY WANT TO BE ABLE TO #E4?/"\r
        PAT<38> = "YOU DON'T " REM . E4\r
        REP<38> = "DON'T YOU REALLY #E4?/WHY DON'T YOU #E4?/"\r
.  "DO YOU WISH TO BE ABLE TO #E4?/DOES THAT TROUBLE YOU?/"\r
        PAT<39> = "YOU FEEL " REM . E4\r
        REP<39> = "TELL ME MORE ABOUT SUCH FEELINGS./DO YOU OFTEN FEEL #E4?/"\r
.  "DO YOU ENJOY FEELING #E4?/OF WHAT DOES FEELING #E4 REMIND YOU?/"\r
        PAT<40> = "YOU " ARB . E3 "I "\r
        REP<40> = "PERHAPS IN YOUR FANTASY WE #E3 EACH OTHER./DO YOU WISH TO "\r
.  "#E3 ME?/YOU SEEM TO NEED TO #E3 ME./DO YOU #E3 ANYONE ELSE?/"\r
        PAT<41> = REM . E1\r
        REP<41> = "YOU SAY #E1./CAN'T YOU ELABORATE ON THAT?/"\r
.  "DO YOU SAY #E1 FOR SOME SPECIAL REASON?/"\r
.  "THAT'S QUITE INTERESTING./"\r
        W.CAN = "//42.43."\r
        PAT<42> = "CAN I " REM . E4\r
        REP<42> = "YOU BELIEVE I CAN #E4, DON'T YOU?/=15/YOU WANT ME TO BE "\r
.  "ABLE TO #E4./PERHAPS YOU WOULD LIKE TO BE ABLE TO #E4 YOURSELF./"\r
        PAT<43> = "CAN YOU " REM . E4\r
        REP<43> = "WHETHER OR NOT YOU CAN #E4 DEPENDS ON YOU MORE THAN ON ME./"\r
.  "DO YOU WANT TO BE ABLE TO #E4?/PERHAPS YOU DON'T WANT TO #E4./"\r
.  "=15/"\r
        W.BECAUSE = "//44."\r
        PAT<44> = ARB\r
        REP<44> = "IS THAT THE REAL REASON?/DON'T ANY OTHER REASONS COME TO "\r
.  "MIND?/DOES THAT REASON SEEM TO EXPLAIN ANYTHING ELSE?/WHAT OTHER "\r
.  "REASONS MIGHT THERE BE?/"\r
        W.WHY = "//45.46.15."\r
        PAT<45> = "WHY DON'T I " REM . E5\r
        REP<45> = "DO YOU BELIEVE I DON'T #E5?/PERHAPS I WILL #E5 IN GOOD "\r
.  "TIME./SHOULD YOU #E5 YOURSELF?/YOU WANT ME TO #E5/=15/"\r
        PAT<46> = "WHY CAN'T YOU " REM . E5\r
        REP<46> = "DO YOU THINK YOU SHOULD BE ABLE TO #E5?/DO YOU WANT TO "\r
.  "BE ABLE TO #E5?/DO YOU BELIEVE THIS WILL HELP YOU TO #E5?/"\r
.  "HAVE YOU ANY IDEA WHY YOU CAN'T #E5?/=15/"\r
        W.DONT = "DON'T//"\r
        W.CANT = "CAN'T//"\r
        W.WONT = "WON'T//"\r
        W.YOURE = "I ARE/4."\r
        W.IM = "YOU ARE//31.32.35.36."\r
        W.THATS = "THAT'S//"\r
THAT'S//"\r
        :(MAIN)\r
END\r
`;function Q(){let E=W(document.querySelector("#interactive-io-source")),e=document.querySelector("#interactive-io-conversation"),r=d(document.querySelector("#interactive-io-status")),o=document.querySelector("#interactive-io-restart"),T=document.querySelector("#interactive-io-reset"),O=document.querySelector("#interactive-io-input-form"),t=document.querySelector("#interactive-io-input-line"),i=document.querySelector("#interactive-io-send"),R=document.querySelector("#interactive-io-eof"),a=null;function N(n){t.disabled=i.disabled=R.disabled=!n,O.classList.toggle("disabled",!n)}function S(n,c="program"){let H=document.createElement("div");H.className="terminal-line "+c,H.textContent=n,e.append(H),e.scrollTop=e.scrollHeight}function L(){a=null,N(!1)}function I(){L(),e.textContent="",r("Running"),a=x({source:E.getValue(),onOutput:n=>S(n),onError:n=>S(n,"error"),onDone:n=>{a=null,N(!1),r(n?"Error":"Finished")}}),N(!0),a.start()}function Y(){E.setValue(q),I()}O.addEventListener("submit",function(n){if(n.preventDefault(),!a)return;let c=t.value;t.value="",S("> "+c,"input"),a.send(c)}),t.addEventListener("keydown",function(n){n.key!=="Enter"||n.shiftKey||(n.preventDefault(),O.requestSubmit())}),R.addEventListener("click",function(){a&&(S("<EOF>","input"),a.end(),N(!1))}),o.addEventListener("click",I),T.addEventListener("click",Y),N(!1),Y()}var _=`* L-system: rewrite the grammar, then walk the result as a turtle
* and draw it.

         STR   = AXIOM()
         G     = 0
         EMIT(STR)

* Rewrite: each pass expands non-terminals via LOOKUP.
NEXTGEN  LT(G, DEPTH())                            :F(TURTLE)
         OUT = ''
         SRC = STR
SCAN     SRC LEN(1) . C =                          :F(BUMP)
         R = LOOKUP(C)
         IDENT(R, '')                              :S(KEEP)
         OUT = OUT R                               :(SCAN)
KEEP     OUT = OUT C                               :(SCAN)
BUMP     STR = OUT
         G   = G + 1
         EMIT(STR)                                 :(NEXTGEN)

* The turtle: F steps one unit along the heading, + and - turn, [ and ]
* save and restore the pose. WALK() only measures the bounding box;
* WALK(1) draws. Measuring first lets the drawing pass scale the curve
* to fit the canvas with a margin.
TURTLE   DEFINE('WALK(DRAW)C')
         A     = ANGLE() * &PI / 180.0
         START = STARTANGLE() * &PI / 180.0
         STKX  = ARRAY(64)
         STKY  = ARRAY(64)
         STKH  = ARRAY(64)
         MINX = 0.0
         MAXX = 0.0
         MINY = 0.0
         MAXY = 0.0
         WALK()
         W = WIDTH() - 48
         H = HEIGHT() - 48
         SPANX = MAXX - MINX
         SPANX = LT(SPANX, 0.001) 0.001
         SPANY = MAXY - MINY
         SPANY = LT(SPANY, 0.001) 0.001
         SCALE = W / SPANX
         SCALE = GT(SCALE, H / SPANY) H / SPANY
         OFFX = 24 + (W - SPANX * SCALE) / 2.0 - MINX * SCALE
         OFFY = 24 + (H - SPANY * SCALE) / 2.0 - MINY * SCALE
         COLOR('#0a0e11')
         CLEAR()
         COLOR('#9fd3c7')
         WALK(1)
         STROKE()                               :(END)

* One pass over STR. X,Y and HD are the pose; the STK arrays save it.
WALK     SRC = STR
         X  = 0.0
         Y  = 0.0
         HD = START
         SP = 0
         IDENT(DRAW, '')                           :S(WSCAN)
         MOVETO(OFFX + X * SCALE, OFFY + Y * SCALE)
WSCAN    SRC LEN(1) . C =                          :F(RETURN)
         IDENT(C, 'F')                             :S(WMOVE)
         IDENT(C, '+')                             :S(WLEFT)
         IDENT(C, '-')                             :S(WRIGHT)
         IDENT(C, '[')                             :S(WPUSH)
         IDENT(C, ']')                             :S(WPOP)
         :(WSCAN)
WMOVE    X = X + COS(HD)
         Y = Y + SIN(HD)
         IDENT(DRAW, '')                           :F(WDRAW)
         MINX = GT(MINX, X) X
         MAXX = LT(MAXX, X) X
         MINY = GT(MINY, Y) Y
         MAXY = LT(MAXY, Y) Y                      :(WSCAN)
WDRAW    LINETO(OFFX + X * SCALE, OFFY + Y * SCALE)   :(WSCAN)
WLEFT    HD = HD + A                               :(WSCAN)
WRIGHT   HD = HD - A                               :(WSCAN)
WPUSH    SP = SP + 1
         STKX<SP> = X
         STKY<SP> = Y
         STKH<SP> = HD                             :(WSCAN)
WPOP     GT(SP, 0)                                 :F(WSCAN)
         X  = STKX<SP>
         Y  = STKY<SP>
         HD = STKH<SP>
         SP = SP - 1
         IDENT(DRAW, '')                           :S(WSCAN)
         MOVETO(OFFX + X * SCALE, OFFY + Y * SCALE)   :(WSCAN)
END
`;var Le=new URL("./canvas-worker.js",import.meta.url),j=160;function J(){let E=W(document.querySelector("#lsystem-source")),e=document.querySelector("#lsystem-canvas"),r=document.querySelector("#lsystem-strings"),o=document.querySelector("#lsystem-preset"),T=document.querySelector("#lsystem-run"),O=d(document.querySelector("#lsystem-status")),t=null;function i(S,L){let I=document.createElement("div"),Y=document.createElement("div"),n=document.createElement("span"),c=document.createElement("div");I.className="strings-row",Y.className="gen",Y.textContent="gen "+S,n.className="len",n.textContent=L.length+" ch",Y.append(n),c.className="body",c.textContent=L.length>j?L.slice(0,j)+"\u2026":L,I.append(Y,c),r.append(I)}function R(){t&&(t.terminate(),t=null)}function a(){if(!X[o.value])return;R(),r.textContent="",O("Drawing");let S=0,L=!1;t=new Worker(Le,{type:"module"}),t.addEventListener("message",function(I){let Y=I.data;Y.type==="emit"?i(S++,Y.str):Y.type==="stderr"?(L=!0,O("Error"),console.error(Y.line)):Y.type==="done"&&(f(e,Y.commands),t=null,L||O("Drawn"))}),t.addEventListener("error",function(I){O("Error: "+I.message)}),t.postMessage({kind:"lsystem",source:E.getValue(),width:e.width,height:e.height,preset:o.value})}function N(){E.setValue(_),B(o,X),a()}T.addEventListener("click",a),o.addEventListener("change",a),N()}var $=`* 1D cellular automaton. Decode the Wolfram rule number into its lookup
* table, build row 0, slide a 3-cell window to step each row, and paint
* the cells.

* RULE position K holds the next cell for 3-bit neighborhood K.
         N = RULE()
         K = 0
DECODE   RULE = LT(K, 8) RULE REMDR(N, 2)          :F(SIZES)
         N = N / 2
         K = K + 1                                 :(DECODE)

* WIDTH = 2 * ROWS + 1, so a centred seed never reaches the edge.
SIZES    HGT = ROWS()
         WID = 2 * HGT + 1

* Row 0: a single centre cell, or random bits.
         IDENT(INITKIND(), 'seed')                 :F(RANDROW)
         ROW = DUPL('0', HGT) '1' DUPL('0', HGT)   :(GEOM)
RANDROW  ROW = LT(SIZE(ROW), WID) ROW RANDBIT()    :S(RANDROW)

* Cells are square, sized to fit the grid in the canvas, centred.
GEOM     CELL = WIDTH() / WID
         CELL = GT(CELL, HEIGHT() / HGT) HEIGHT() / HGT
         CELL = LT(CELL, 1) 1
         OFFX = (WIDTH() - WID * CELL) / 2
         OFFY = (HEIGHT() - HGT * CELL) / 2
         COLOR('#0a0e11')
         CLEAR()
         COLOR('#9fd3c7')

* Paint each row, then derive the next: pad with dead edge cells,
* convert each 3-cell window to an index 0..7, and pick that cell
* of RULE as the new centre.
         R = 0
NEXTROW  C = 0
         REST = ROW
PAINT    REST LEN(1) . B =                         :F(STEP)
         IDENT(B, '1')                             :F(BUMPC)
         FILLRECT(OFFX + C * CELL, OFFY + R * CELL, CELL, CELL)
BUMPC    C = C + 1                                 :(PAINT)
STEP     R = R + 1
         LT(R, HGT)                                :F(END)
         PAD = '0' ROW '0'
         OUT = ''
SCAN     PAD LEN(1) . B2 LEN(1) . B1 LEN(1) . B0   :F(DONE)
         IDX = 4 * B2 + 2 * B1 + B0
         RULE POS(IDX) LEN(1) . NEW
         OUT = OUT NEW
         PAD LEN(1) =                              :(SCAN)
DONE     ROW = OUT                                 :(NEXTROW)
END
`;var le=new URL("./canvas-worker.js",import.meta.url);function ee(){let E=W(document.querySelector("#cellular-automata-source")),e=document.querySelector("#cellular-automata-canvas"),r=document.querySelector("#cellular-automata-preset"),o=document.querySelector("#cellular-automata-run"),T=d(document.querySelector("#cellular-automata-status")),O=null;function t(){O&&(O.terminate(),O=null)}function i(){if(!y[r.value])return;t(),T("Running");let a=!1;O=new Worker(le,{type:"module"}),O.addEventListener("message",function(N){let S=N.data;S.type==="stderr"?(a=!0,T("Error"),console.error(S.line)):S.type==="done"&&(f(e,S.commands),O=null,a||T("Done"))}),O.addEventListener("error",function(N){T("Error: "+N.message)}),O.postMessage({kind:"ca",source:E.getValue(),width:e.width,height:e.height,preset:r.value})}function R(){E.setValue($),B(r,y),i()}o.addEventListener("click",i),r.addEventListener("change",i),R()}var Ie={STR:[64,66,70],FND:[116,122,130],STL:[104,112,122],RUF:[70,76,84],GLS1:[126,170,200],GLS2:[96,152,156],GLS3:[168,190,202],GLS4:[84,124,168]},ce={PY:1,MY:.28,PX:.85,MX:.55,PZ:.42,MZ:.88},Ue=[{axis:"x",high:!0,shade:"PX",corners:[[1,0,0],[1,0,1],[1,1,1],[1,1,0]]},{axis:"x",high:!1,shade:"MX",corners:[[0,0,1],[0,0,0],[0,1,0],[0,1,1]]},{axis:"y",high:!0,shade:"PY",corners:[[0,1,0],[1,1,0],[1,1,1],[0,1,1]]},{axis:"y",high:!1,shade:"MY",corners:[[0,0,1],[1,0,1],[1,0,0],[0,0,0]]},{axis:"z",high:!0,shade:"PZ",corners:[[1,0,1],[0,0,1],[0,1,1],[1,1,1]]},{axis:"z",high:!1,shade:"MZ",corners:[[0,0,0],[1,0,0],[1,1,0],[0,1,0]]}],ue={x:0,y:1,z:0};function We(E,e){return{x:E.x-e.x,y:E.y-e.y,z:E.z-e.z}}function g(E,e){return E.x*e.x+E.y*e.y+E.z*e.z}function Ee(E,e){return{x:E.y*e.z-E.z*e.y,y:E.z*e.x-E.x*e.z,z:E.x*e.y-E.y*e.x}}function te(E){let e=Math.hypot(E.x,E.y,E.z)||1;return{x:E.x/e,y:E.y/e,z:E.z/e}}function de(E,e){return"rgb("+Math.round(E[0]*e)+","+Math.round(E[1]*e)+","+Math.round(E[2]*e)+")"}function Oe(E){let e=E.getContext("2d"),r=[],o=1,T=1,O=-.6,t=.55,i=190,R=!0,a=!0;function N(){let A=globalThis.devicePixelRatio||1,l=E.getBoundingClientRect();o=Math.max(l.width,1),T=Math.max(l.height,1),E.width=Math.round(o*A),E.height=Math.round(T*A),e.setTransform(A,0,0,A,0,0),R=!0}function S(A,l){let D=We(A,l.cam),m=g(D,l.right),U=g(D,l.up),u=g(D,l.forward);return u<.5?null:{sx:l.focal*m/u+l.hx,sy:-l.focal*U/u+l.hy,cz:u}}function L(A,l,D,m){let U=[],u=0;for(let C of l){let p=S(C,D);if(!p)return;U.push(p),u+=p.cz}A.push({pts:U,color:m,depth:u})}function I(){let A=Math.cos(t),l=Math.sin(t),D=Math.cos(O),m=Math.sin(O),U={x:i*A*m,y:i*l,z:i*A*D},u=te({x:-U.x,y:-U.y,z:-U.z}),C=te(Ee(u,ue)),p={cam:U,forward:u,right:C,up:Ee(C,u),focal:Math.max(o,T)*1.05,hx:o/2,hy:T/2},K=e.createLinearGradient(0,0,0,T);K.addColorStop(0,"#d3dde7"),K.addColorStop(1,"#eef2ee"),e.fillStyle=K,e.fillRect(0,0,o,T);let F=[];for(let s of r){let M={x:s.x,y:s.y,z:s.z},h={x:s.x+s.w,y:s.y+s.h,z:s.z+s.d},oe=Ie[s.color]||[200,200,200];for(let P of Ue){if(!(P.high?U[P.axis]>h[P.axis]:U[P.axis]<M[P.axis]))continue;let Te=P.corners.map(([Ae,Re,se])=>({x:Ae?h.x:M.x,y:Re?h.y:M.y,z:se?h.z:M.z}));L(F,Te,p,de(oe,ce[P.shade]))}}F.sort((s,M)=>M.depth-s.depth);for(let s of F)e.fillStyle=s.color,e.strokeStyle=s.color,e.lineWidth=.6,e.beginPath(),e.moveTo(s.pts[0].sx,s.pts[0].sy),e.lineTo(s.pts[1].sx,s.pts[1].sy),e.lineTo(s.pts[2].sx,s.pts[2].sy),e.lineTo(s.pts[3].sx,s.pts[3].sy),e.closePath(),e.fill(),e.stroke()}function Y(){a&&(O+=.0035,R=!0),R&&(I(),R=!1),requestAnimationFrame(Y)}let n=null,c=()=>{a=!1};E.addEventListener("pointerdown",A=>{E.setPointerCapture(A.pointerId),n={x:A.clientX,y:A.clientY},c()}),E.addEventListener("pointermove",A=>{if(!n)return;let l=A.clientX-n.x,D=A.clientY-n.y;n.x=A.clientX,n.y=A.clientY,O-=l*.008,t=Math.max(.05,Math.min(Math.PI/2-.05,t+D*.008)),R=!0});let H=()=>{n=null};return E.addEventListener("pointerup",H),E.addEventListener("pointercancel",H),E.addEventListener("wheel",A=>{A.preventDefault(),i=Math.max(60,Math.min(360,i*(1+A.deltaY*.001))),R=!0,c()},{passive:!1}),globalThis.addEventListener("resize",N),N(),requestAnimationFrame(Y),{addBox(A){r.push(A),R=!0},clear(){r.length=0,R=!0},resetCamera(){O=-.6,t=.55,i=190,a=!0,R=!0}}}var re=`* A 3-D shape grammar. Coordinates are integer "studs"; Y is up.
* Host extensions: EMIT(x,y,z,w,h,d,color) draws a box, FLOORS()
* returns a random height, TINT() a random glass colour.

*-----------------------------------------------------------------
*       Patterns: HEAD peels the leading symbol off the worklist;
*       ARGSn unpacks N comma-separated arguments into V1..Vn.
*-----------------------------------------------------------------

        HEAD     = BREAK('(') . NAME '(' BREAK(')') . ARGS ')' ' '

        ARGS2    = BREAK(',') . V1 ',' REM . V2
        ARGS7    = BREAK(',') . V1 ',' BREAK(',') . V2
+                  ',' BREAK(',') . V3 ',' BREAK(',') . V4
+                  ',' BREAK(',') . V5 ',' BREAK(',') . V6
+                  ',' REM . V7

*       Seed: a ground plane and a 2x2 grid of 72-stud blocks,
*       separated by a 10-stud avenue and centred at the origin.
        WORK     = 'BOX(-90,-1,-90,180,1,180,STR) '
+                  'BLOCK(-77,-77) BLOCK(5,-77) '
+                  'BLOCK(-77,5) BLOCK(5,5) '

*-----------------------------------------------------------------
*       Main rewrite loop: pop, dispatch, repeat.
*-----------------------------------------------------------------

LOOP    WORK HEAD REM . REST     :F(END)
        WORK = REST
        IDENT(NAME, 'BOX')       :S(R_BOX)
        IDENT(NAME, 'BLOCK')     :S(R_BLOCK)
        IDENT(NAME, 'LOT')       :S(R_LOT)
        IDENT(NAME, 'BUILD')     :S(R_BUILD)
        IDENT(NAME, 'FLOOR')     :S(R_FLOOR)
        IDENT(NAME, 'BAND')      :S(R_BAND)
        OUTPUT = 'unknown symbol: ' NAME
        :(LOOP)

*-----------------------------------------------------------------
*       BOX(x, y, z, w, h, d, color) - terminal. Hand to renderer.
*-----------------------------------------------------------------
R_BOX   ARGS ARGS7
        EMIT(V1, V2, V3, V4, V5, V6, V7)
        :(LOOP)

*-----------------------------------------------------------------
*       BLOCK(x, z) - a 3x3 grid of 72-stud lots. Lots are 20x20,
*       streets 4 wide, outer margin 2.
*-----------------------------------------------------------------
R_BLOCK ARGS ARGS2
        X = V1
        Z = V2
        X1 = X + 2
        X2 = X + 26
        X3 = X + 50
        Z1 = Z + 2
        Z2 = Z + 26
        Z3 = Z + 50
        WORK = 'LOT(' X1 ',' Z1 ') LOT(' X2 ',' Z1 ') LOT(' X3 ',' Z1 ') ' WORK
        WORK = 'LOT(' X1 ',' Z2 ') LOT(' X2 ',' Z2 ') LOT(' X3 ',' Z2 ') ' WORK
        WORK = 'LOT(' X1 ',' Z3 ') LOT(' X2 ',' Z3 ') LOT(' X3 ',' Z3 ') ' WORK
        :(LOOP)

*-----------------------------------------------------------------
*       LOT(x, z) - plaza slab + a BUILD whose height and glass tint
*       the host chooses. The renderer scales the world, so the
*       grammar just lays out 20x20 footprints.
*-----------------------------------------------------------------
R_LOT   ARGS ARGS2
        X = V1
        Z = V2
        WORK = 'BOX(' X ',0,' Z ',20,1,20,FND) ' WORK
        WORK = 'BUILD(' X ',1,' Z ',20,20,' FLOORS() ',' TINT() ') ' WORK
        :(LOOP)

*-----------------------------------------------------------------
*       BUILD(x, y, z, w, d, n, g) - n stacked FLOORs in glass tint g,
*       then a roof cap. Each floor is 3 studs tall.
*-----------------------------------------------------------------
R_BUILD ARGS ARGS7
        X = V1
        Y = V2
        Z = V3
        W = V4
        D = V5
        N = V6
        G = V7
        EQ(N, 0)                 :S(BCAP)
        WORK = 'FLOOR(' X ',' Y ',' Z ',' W ',3,' D ',' G ') ' WORK
        Y2 = Y + 3
        N2 = N - 1
        WORK = 'BUILD(' X ',' Y2 ',' Z ',' W ',' D ',' N2 ',' G ') ' WORK
        :(LOOP)
*       Flat roof, then a small mechanical penthouse centred on it.
BCAP    WORK = 'BOX(' X ',' Y ',' Z ',' W ',1,' D ',RUF) ' WORK
        XC = X + 8
        ZC = Z + 8
        Y3 = Y + 1
        WORK = 'BOX(' XC ',' Y3 ',' ZC ',4,2,4,RUF) ' WORK
        :(LOOP)

*-----------------------------------------------------------------
*       FLOOR(x, y, z, w, h, d, g) - a glass curtain wall topped by a
*       thin steel floor line: a tall glass BAND in tint g, then a
*       one-stud STL BAND at the floor slab.
*-----------------------------------------------------------------
R_FLOOR ARGS ARGS7
        X = V1
        Y = V2
        Z = V3
        W = V4
        H = V5
        D = V6
        G = V7
        HG = H - 1
        Y2 = Y + HG
        WORK = 'BAND(' X ',' Y ',' Z ',' W ',' HG ',' D ',' G ') ' WORK
        WORK = 'BAND(' X ',' Y2 ',' Z ',' W ',1,' D ',STL) ' WORK
        :(LOOP)

*-----------------------------------------------------------------
*       BAND(x, y, z, w, h, d, color) - four BOXes forming a hollow
*       perimeter. Side walls skip the corner studs to avoid overlap.
*-----------------------------------------------------------------
R_BAND  ARGS ARGS7
        X = V1
        Y = V2
        Z = V3
        W = V4
        H = V5
        D = V6
        C = V7
        XE = X + W - 1
        ZE = Z + D - 1
        Z2 = Z + 1
        D2 = D - 2
        WORK = 'BOX(' X ',' Y ',' Z ',' W ',' H ',1,' C ') ' WORK
        WORK = 'BOX(' X ',' Y ',' ZE ',' W ',' H ',1,' C ') ' WORK
        WORK = 'BOX(' X ',' Y ',' Z2 ',1,' H ',' D2 ',' C ') ' WORK
        WORK = 'BOX(' XE ',' Y ',' Z2 ',1,' H ',' D2 ',' C ') ' WORK
        :(LOOP)
END
`;var Pe=new URL("./shape-worker.js",import.meta.url);function ne(){let E=W(document.querySelector("#shape-grammar-source")),e=document.querySelector("#shape-grammar-canvas"),r=d(document.querySelector("#shape-grammar-status")),o=document.querySelector("#shape-grammar-restart"),T=document.querySelector("#shape-grammar-reset"),O=Oe(e),t=null;function i(){t&&(t.terminate(),t=null)}function R(){i(),O.clear(),O.resetCamera();let N=0;t=new Worker(Pe,{type:"module"}),t.addEventListener("message",function(S){let L=S.data;L.type==="box"?(O.addBox(L.box),r(++N+" boxes")):L.type==="done"?r(N+" boxes \xB7 finished"):L.type==="stderr"&&r("Error: "+L.line)}),t.addEventListener("error",function(S){r("Error: "+S.message)}),r("Running"),t.postMessage({type:"start",source:E.getValue()})}function a(){E.setValue(re),R()}o.addEventListener("click",R),T.addEventListener("click",a),a()}z();Q();J();ee();ne();
