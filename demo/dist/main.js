import{b as j,f as J,g as $}from"./chunks/chunk-I2WGIKSS.js";import{a as q,b as Q,d as _}from"./chunks/chunk-PDJ4X3AL.js";function ee(){let E=[];return{lines:E,write(e){E.push(e)}}}function Ee(E){return E.length===0?"":E.join(`
`)+`
`}function X(E,e={}){let t=ee(),n=ee(),i=e.file||"demo.sno",A=e.input||"input.txt",O=new Map([[i,E],[A,e.inputText||""]]),a=new q({...e,file:i,input:e.inputText===void 0?void 0:A,stdout:t,stderr:n,loader:{load(r){if(!O.has(r))throw new Error("No demo file named "+r);return O.get(r)}}});try{a.run(Q)}catch(r){n.write("Execution error: "+(r&&r.message||r))}return{stdout:Ee(t.lines),stderr:Ee(n.lines),exitCode:a.exitCode}}function K(E){let e=new j({doc:E.value,extensions:[J,$()]});return e.contentDOM.setAttribute("aria-label",E.getAttribute("aria-label")||""),E.replaceWith(e.dom),{getValue(){return e.state.doc.toString()},setValue(t){e.dispatch({changes:{from:0,to:e.state.doc.length,insert:t}})}}}var te=`* Split each input line into words with Intl.Segmenter,
* loaded as the WORDS helper. One loop fits every script.
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
`;var ue=`Hello world!
\u3053\u3093\u306B\u3061\u306F\u4E16\u754C\u3002
\u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E35\u0E0A\u0E32\u0E27\u0E42\u0E25\u0E01!
\u041F\u0440\u0438\u0432\u0435\u0442 \u043C\u0438\u0440!
`;function Oe(){let E=K(document.querySelector("#batch-io-source")),e=document.querySelector("#batch-io-input"),t=document.querySelector("#batch-io-output"),n=document.querySelector("#batch-io-status"),i=document.querySelector("#batch-io-run"),A=document.querySelector("#batch-io-reset");function O(T){n.textContent=T}function a(){t.textContent="",O("Running");try{let T=X(E.getValue(),{inputText:e.value});t.textContent=[T.stdout,T.stderr].filter(Boolean).join(`
`)||"(no output)",O(T.stderr||T.exitCode?"Error":"Finished")}catch(T){t.textContent="Execution error: "+(T&&T.message||T),O("Error")}}function r(){t.textContent="",E.setValue(te),e.value=ue,O("Ready")}i.addEventListener("click",a),A.addEventListener("click",r),r()}var re=`* PLEASE WAIT A MINUTE WHILE I PREPARE TO BE YOUR CONSULTANT.\r
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
`;function ne(){let E=K(document.querySelector("#interactive-io-source")),e=document.querySelector("#interactive-io-conversation"),t=document.querySelector("#interactive-io-status"),n=document.querySelector("#interactive-io-restart"),i=document.querySelector("#interactive-io-reset"),A=document.querySelector("#interactive-io-input-form"),O=document.querySelector("#interactive-io-input-line"),a=document.querySelector("#interactive-io-send"),r=document.querySelector("#interactive-io-eof"),T=null,N=!1;function I(l){t.textContent=l}function S(l){O.disabled=a.disabled=r.disabled=!l,A.classList.toggle("disabled",!l)}function s(l,o="program"){let c=document.createElement("div");c.className="terminal-line "+o,c.textContent=l,e.append(c),e.scrollTop=e.scrollHeight}function F(){T=null,N=!1,S(!1)}function u(){F(),e.textContent="",I("Running"),T=_({source:E.getValue(),onOutput:l=>s(l),onError:l=>s(l,"error"),onDone:l=>{N=!1,S(!1),I(l?"Error":"Finished")}}),N=!0,S(!0),T.start()}function V(){E.setValue(re),u()}A.addEventListener("submit",function(l){if(l.preventDefault(),!N||!T)return;let o=O.value;O.value="",s("> "+o,"input"),T.send(o)}),O.addEventListener("keydown",function(l){l.key!=="Enter"||l.shiftKey||(l.preventDefault(),A.requestSubmit())}),r.addEventListener("click",function(){!N||!T||(s("<EOF>","input"),T.end(),S(!1))}),n.addEventListener("click",u),i.addEventListener("click",V),S(!1),V()}function b(E,e){for(let[t,n]of Object.entries(e)){let i=document.createElement("option");i.value=t,i.textContent=n.label,E.append(i)}}function v(E){let e=E.getContext("2d");return e.lineWidth=1,e.lineCap="round",e.beginPath(),{"WIDTH()INTEGER":()=>E.width,"HEIGHT()INTEGER":()=>E.height,"COLOR(STRING)":t=>{e.fillStyle=e.strokeStyle=t},"CLEAR()":()=>e.fillRect(0,0,E.width,E.height),"FILLRECT(REAL,REAL,REAL,REAL)":(t,n,i,A)=>e.fillRect(t,n,i,A),"MOVETO(REAL,REAL)":(t,n)=>e.moveTo(t,n),"LINETO(REAL,REAL)":(t,n)=>e.lineTo(t,n),"STROKE()":()=>{e.stroke(),e.beginPath()}}}var z={koch:{label:"Koch snowflake",axiom:"F++F++F",rules:{F:"F-F++F-F"},depth:4,angle:60,startAngle:0},"koch-square":{label:"Square Koch curve",axiom:"F",rules:{F:"F+F-F-F+F"},depth:3,angle:90,startAngle:0},dragon:{label:"Dragon curve",axiom:"FX",rules:{X:"X+YF+",Y:"-FX-Y"},depth:11,angle:90,startAngle:0},hilbert:{label:"Hilbert curve",axiom:"A",rules:{A:"+BF-AFA-FB+",B:"-AF+BFB+FA-"},depth:5,angle:90,startAngle:0},plant:{label:"Fractal plant",axiom:"X",rules:{X:"F+[[X]-X]-F[-FX]+X",F:"FF"},depth:5,angle:25,startAngle:-90}};function oe(E,e,t){return{...v(E),"AXIOM()STRING":()=>e.axiom,"DEPTH()INTEGER":()=>e.depth,"ANGLE()REAL":()=>e.angle,"STARTANGLE()REAL":()=>e.startAngle,"LOOKUP(STRING)STRING":n=>e.rules[n]||"","EMIT(STRING)":n=>{t&&t(n)}}}var Te=`* L-system: SNOBOL rewrites the grammar, then walks the result as a
* turtle and draws it. The host supplies the preset and a narrow
* canvas binding; the drawing decisions all live here.

         &TRIM = 1
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
`;var Ae=160;function Re(){let E=K(document.querySelector("#lsystem-source")),e=document.querySelector("#lsystem-canvas"),t=document.querySelector("#lsystem-strings"),n=document.querySelector("#lsystem-preset"),i=document.querySelector("#lsystem-run"),A=document.querySelector("#lsystem-status");function O(N){A.textContent=N}function a(N,I){let S=document.createElement("div"),s=document.createElement("div"),F=document.createElement("span"),u=document.createElement("div");S.className="strings-row",s.className="gen",s.textContent="gen "+N,F.className="len",F.textContent=I.length+" ch",s.append(F),u.className="body",u.textContent=I.length>Ae?I.slice(0,Ae)+"\u2026":I,S.append(s,u),t.append(S)}function r(){let N=z[n.value];N&&(t.textContent="",O("Drawing"),requestAnimationFrame(function(){let I=0,S=oe(e,N,function(s){a(I++,s)});try{let s=X(E.getValue(),{extensions:S});s.stderr?(O("Error"),console.error(s.stderr)):O("Drawn")}catch(s){O("Error"),console.error(s)}}))}function T(){E.setValue(Te),b(n,z),r()}i.addEventListener("click",r),n.addEventListener("change",r),T()}var k={rule30:{label:"Rule 30 (chaos)",rule:30,init:"seed"},rule90:{label:"Rule 90 (Sierpinski)",rule:90,init:"seed"},rule110:{label:"Rule 110 (gliders)",rule:110,init:"random"},rule184:{label:"Rule 184 (traffic)",rule:184,init:"random"},rule54:{label:"Rule 54",rule:54,init:"seed"}};function ie(E,e){return{...v(E),"RULE()INTEGER":()=>e.rule,"INITKIND()STRING":()=>e.init,"ROWS()INTEGER":()=>80,"RANDBIT()INTEGER":()=>Math.random()<.5?1:0}}var se=`* Elementary 1D cellular automaton, end to end in SNOBOL: decode the
* Wolfram rule number into its lookup table, build row 0, slide a
* 3-cell window to step each row, and paint the cells.

         &TRIM = 1

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
`;function ae(){let E=K(document.querySelector("#cellular-automata-source")),e=document.querySelector("#cellular-automata-canvas"),t=document.querySelector("#cellular-automata-preset"),n=document.querySelector("#cellular-automata-run"),i=document.querySelector("#cellular-automata-status");function A(r){i.textContent=r}function O(){let r=k[t.value];r&&(A("Running"),requestAnimationFrame(function(){let T=ie(e,r);try{let N=X(E.getValue(),{extensions:T});N.stderr?(A("Error"),console.error(N.stderr)):A("Done")}catch(N){A("Error"),console.error(N)}}))}function a(){E.setValue(se),b(t,k),O()}n.addEventListener("click",O),t.addEventListener("change",O),a()}var de={PRK:[122,168,116],FND:[180,173,158],BRC:[173,95,70],GLS:[134,195,220],RUF:[82,88,96]},g={PY:1,MY:.28,PX:.85,MX:.55,PZ:.42,MZ:.88},De={x:0,y:1,z:0};function Pe(E,e){return{x:E.x-e.x,y:E.y-e.y,z:E.z-e.z}}function Z(E,e){return E.x*e.x+E.y*e.y+E.z*e.z}function Ne(E,e){return{x:E.y*e.z-E.z*e.y,y:E.z*e.x-E.x*e.z,z:E.x*e.y-E.y*e.x}}function Se(E){let e=Math.hypot(E.x,E.y,E.z)||1;return{x:E.x/e,y:E.y/e,z:E.z/e}}function G(E,e){return"rgb("+Math.round(E[0]*e)+","+Math.round(E[1]*e)+","+Math.round(E[2]*e)+")"}function le(E){let e=E.getContext("2d"),t=[],n=1,i=1,A=-.6,O=.55,a=150,r=!0,T=!0;function N(){let o=globalThis.devicePixelRatio||1,c=E.getBoundingClientRect();n=Math.max(c.width,1),i=Math.max(c.height,1),E.width=Math.round(n*o),E.height=Math.round(i*o),e.setTransform(o,0,0,o,0,0),r=!0}function I(o,c,y,w,L,U,p,f){let M=Pe(o,c),h=Z(M,y),C=Z(M,w),B=Z(M,L);return B<.5?null:{sx:U*h/B+p,sy:-U*C/B+f,cz:B}}function S(o,c,y,w,L,U,p,f,M,h){let C=[],B=0;for(let m=0;m<4;m++){let R=I(c[m],y,w,L,U,p,f,M);if(!R)return;C.push(R),B+=R.cz}o.push({pts:C,color:h,depth:B})}function s(){let o=Math.cos(O),c=Math.sin(O),y=Math.cos(A),w=Math.sin(A),L={x:a*o*w,y:a*c,z:a*o*y},U=Se({x:-L.x,y:-L.y,z:-L.z}),p=Se(Ne(U,De)),f=Ne(p,U),M=Math.max(n,i)*1.05,h=n/2,C=i/2,B=e.createLinearGradient(0,0,0,i);B.addColorStop(0,"#d3dde7"),B.addColorStop(1,"#eef2ee"),e.fillStyle=B,e.fillRect(0,0,n,i);let m=[];for(let R of t){let Y=R.x,W=R.y,d=R.z,D=R.x+R.w,P=R.y+R.h,H=R.z+R.d,x=de[R.color]||[200,200,200];L.x>D&&S(m,[{x:D,y:W,z:d},{x:D,y:W,z:H},{x:D,y:P,z:H},{x:D,y:P,z:d}],L,p,f,U,M,h,C,G(x,g.PX)),L.x<Y&&S(m,[{x:Y,y:W,z:H},{x:Y,y:W,z:d},{x:Y,y:P,z:d},{x:Y,y:P,z:H}],L,p,f,U,M,h,C,G(x,g.MX)),L.y>P&&S(m,[{x:Y,y:P,z:d},{x:D,y:P,z:d},{x:D,y:P,z:H},{x:Y,y:P,z:H}],L,p,f,U,M,h,C,G(x,g.PY)),L.y<W&&S(m,[{x:Y,y:W,z:H},{x:D,y:W,z:H},{x:D,y:W,z:d},{x:Y,y:W,z:d}],L,p,f,U,M,h,C,G(x,g.MY)),L.z>H&&S(m,[{x:D,y:W,z:H},{x:Y,y:W,z:H},{x:Y,y:P,z:H},{x:D,y:P,z:H}],L,p,f,U,M,h,C,G(x,g.PZ)),L.z<d&&S(m,[{x:Y,y:W,z:d},{x:D,y:W,z:d},{x:D,y:P,z:d},{x:Y,y:P,z:d}],L,p,f,U,M,h,C,G(x,g.MZ))}m.sort((R,Y)=>Y.depth-R.depth);for(let R of m)e.fillStyle=R.color,e.strokeStyle=R.color,e.lineWidth=.6,e.beginPath(),e.moveTo(R.pts[0].sx,R.pts[0].sy),e.lineTo(R.pts[1].sx,R.pts[1].sy),e.lineTo(R.pts[2].sx,R.pts[2].sy),e.lineTo(R.pts[3].sx,R.pts[3].sy),e.closePath(),e.fill(),e.stroke()}function F(){T&&(A+=.0035,r=!0),r&&(s(),r=!1),requestAnimationFrame(F)}let u=null,V=()=>{T=!1};E.addEventListener("pointerdown",o=>{E.setPointerCapture(o.pointerId),u={x:o.clientX,y:o.clientY},V()}),E.addEventListener("pointermove",o=>{if(!u)return;let c=o.clientX-u.x,y=o.clientY-u.y;u.x=o.clientX,u.y=o.clientY,A-=c*.008,O=Math.max(.05,Math.min(Math.PI/2-.05,O+y*.008)),r=!0});let l=()=>{u=null};return E.addEventListener("pointerup",l),E.addEventListener("pointercancel",l),E.addEventListener("wheel",o=>{o.preventDefault(),a=Math.max(60,Math.min(360,a*(1+o.deltaY*.001))),r=!0,V()},{passive:!1}),globalThis.addEventListener("resize",N),N(),requestAnimationFrame(F),{addBox(o){t.push(o),r=!0},clear(){t.length=0,r=!0},count(){return t.length},resetCamera(){A=-.6,O=.55,a=150,T=!0,r=!0}}}var Le=`* Snoflake browser demo: a 3-D shape grammar.
*
* SNOBOL holds a worklist string of symbols of the form
* NAME(arg,arg,...) separated by spaces. Each iteration peels the
* leading symbol off the worklist, dispatches on its NAME, and
* prepends one or more child symbols. Terminal BOX symbols are
* passed to the host renderer through the EMIT extension:
*
*       EMIT(x, y, z, w, h, d, color)
*
* Coordinates are integer "studs"; Y is up. The renderer scales
* the world to pixels and centers the scene.
*
* Try editing the heights in R_BLOCK, the floor stripe colours in
* R_FLOOR, or the rooftop machine room in BCAP. The grammar runs
* in a Web Worker, so it will not freeze the page.

        &TRIM    = 1
        &ANCHOR  = 1

*-----------------------------------------------------------------
*       Patterns: HEAD peels the leading symbol off the worklist;
*       ARGSn unpacks N comma-separated arguments into V1..Vn.
*-----------------------------------------------------------------

        HEAD     = BREAK('(') . NAME '(' BREAK(')') . ARGS ')' ' '

        ARGS3    = BREAK(',') . V1 ',' BREAK(',') . V2 ',' REM . V3
        ARGS4    = BREAK(',') . V1 ',' BREAK(',') . V2
+                  ',' BREAK(',') . V3 ',' REM . V4
        ARGS6    = BREAK(',') . V1 ',' BREAK(',') . V2
+                  ',' BREAK(',') . V3 ',' BREAK(',') . V4
+                  ',' BREAK(',') . V5 ',' REM . V6
        ARGS7    = BREAK(',') . V1 ',' BREAK(',') . V2
+                  ',' BREAK(',') . V3 ',' BREAK(',') . V4
+                  ',' BREAK(',') . V5 ',' BREAK(',') . V6
+                  ',' REM . V7

*       Seed: one city block, 72 studs square, centred at the origin.
        WORK     = 'BLOCK(-36,-36,72,72) '

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
*       BLOCK(x, z, w, d) - ground slab + 3x3 grid of lots.
*       Lots are 20x20, streets 4 wide, outer margin 2.
*       Heights are hardcoded for a varied skyline.
*-----------------------------------------------------------------
R_BLOCK ARGS ARGS4
        X = V1
        Z = V2
        W = V3
        D = V4
        WORK = 'BOX(' X ',-1,' Z ',' W ',1,' D ',PRK) ' WORK
        X1 = X + 2
        X2 = X + 26
        X3 = X + 50
        Z1 = Z + 2
        Z2 = Z + 26
        Z3 = Z + 50
        WORK = 'LOT(' X1 ',' Z1 ',5) LOT(' X2 ',' Z1 ',9) LOT(' X3 ',' Z1 ',6) ' WORK
        WORK = 'LOT(' X1 ',' Z2 ',7) LOT(' X2 ',' Z2 ',4) LOT(' X3 ',' Z2 ',8) ' WORK
        WORK = 'LOT(' X1 ',' Z3 ',8) LOT(' X2 ',' Z3 ',6) LOT(' X3 ',' Z3 ',5) ' WORK
        :(LOOP)

*-----------------------------------------------------------------
*       LOT(x, z, n) - foundation slab + BUILD with N floors.
*       Lot footprint is fixed at 20x20.
*-----------------------------------------------------------------
R_LOT   ARGS ARGS3
        X = V1
        Z = V2
        N = V3
        WORK = 'BOX(' X ',0,' Z ',20,1,20,FND) ' WORK
        WORK = 'BUILD(' X ',1,' Z ',20,20,' N ') ' WORK
        :(LOOP)

*-----------------------------------------------------------------
*       BUILD(x, y, z, w, d, n) - n stacked FLOORs then a roof cap.
*       Each floor is 3 studs tall.
*-----------------------------------------------------------------
R_BUILD ARGS ARGS6
        X = V1
        Y = V2
        Z = V3
        W = V4
        D = V5
        N = V6
        EQ(N, 0)                 :S(BCAP)
        WORK = 'FLOOR(' X ',' Y ',' Z ',' W ',3,' D ') ' WORK
        Y2 = Y + 3
        N2 = N - 1
        WORK = 'BUILD(' X ',' Y2 ',' Z ',' W ',' D ',' N2 ') ' WORK
        :(LOOP)
BCAP    WORK = 'BOX(' X ',' Y ',' Z ',' W ',1,' D ',RUF) ' WORK
        XC = X + 8
        ZC = Z + 8
        Y3 = Y + 1
        WORK = 'BOX(' XC ',' Y3 ',' ZC ',4,2,4,RUF) ' WORK
        :(LOOP)

*-----------------------------------------------------------------
*       FLOOR(x, y, z, w, h, d) - three perimeter BANDs.
*       Brick lintel, glass ribbon, brick sill.
*-----------------------------------------------------------------
R_FLOOR ARGS ARGS6
        X = V1
        Y = V2
        Z = V3
        W = V4
        H = V5
        D = V6
        Y2 = Y + 1
        Y3 = Y + H - 1
        WORK = 'BAND(' X ',' Y ',' Z ',' W ',1,' D ',BRC) ' WORK
        WORK = 'BAND(' X ',' Y2 ',' Z ',' W ',1,' D ',GLS) ' WORK
        WORK = 'BAND(' X ',' Y3 ',' Z ',' W ',1,' D ',BRC) ' WORK
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
`;var Me=new URL("./shape-worker.js",import.meta.url);function Ie(){let E=K(document.querySelector("#shape-grammar-source")),e=document.querySelector("#shape-grammar-canvas"),t=document.querySelector("#shape-grammar-status"),n=document.querySelector("#shape-grammar-restart"),i=document.querySelector("#shape-grammar-reset"),A=le(e),O=null;function a(I){t.textContent=I}function r(){O&&(O.terminate(),O=null)}function T(){r(),A.clear(),A.resetCamera();let I=0;O=new Worker(Me,{type:"module"}),O.addEventListener("message",function(S){let s=S.data;s.type==="box"?(A.addBox(s.box),a(++I+" boxes")):s.type==="done"?a(I+" boxes \xB7 finished"):s.type==="stderr"&&a("Error: "+s.line)}),O.addEventListener("error",function(S){a("Error: "+S.message)}),a("Running"),O.postMessage({type:"start",source:E.getValue()})}function N(){E.setValue(Le),T()}n.addEventListener("click",T),i.addEventListener("click",N),N()}Oe();ne();Re();ae();Ie();
