var SNOBOL = require( './base' ); SNOBOL.interp = function (vm) {
  return [ [ null, "TITLE", function () {
    return [ "Table of Contents" ];
  } ], [ null, "TITLE", function () {
    return [ "Linkage and Equivalences" ];
  } ], [ null, "COPY", function () {
    return [ vm.$("MLINK") ];
  } ], [ null, "COPY", function () {
    return [ vm.$("PARMS") ];
  } ], [ "ATTRIB", "EQU", function () {
    return [ 2 * vm.$("DESCR") ];
  } ], [ "LNKFLD", "EQU", function () {
    return [ 3 * vm.$("DESCR") ];
  } ], [ "BCDFLD", "EQU", function () {
    return [ 4 * vm.$("DESCR") ];
  } ], [ "FATHER", "EQU", function () {
    return [ vm.$("DESCR") ];
  } ], [ "LSON", "EQU", function () {
    return [ 2 * vm.$("DESCR") ];
  } ], [ "RSIB", "EQU", function () {
    return [ 3 * vm.$("DESCR") ];
  } ], [ "CODE", "EQU", function () {
    return [ 4 * vm.$("DESCR") ];
  } ], [ "ESASIZ", "EQU", function () {
    return [ 50 ];
  } ], [ "FBLKSZ", "EQU", function () {
    return [ 10 * vm.$("DESCR") ];
  } ], [ "ARRLEN", "EQU", function () {
    return [ 20 ];
  } ], [ "CARDSZ", "EQU", function () {
    return [ 80 ];
  } ], [ "SEQSIZ", "EQU", function () {
    return [ 8 ];
  } ], [ "STNOSZ", "EQU", function () {
    return [ 8 ];
  } ], [ "DSTSZ", "EQU", function () {
    return [ 2 * vm.$("STNOSZ") ];
  } ], [ "CNODSZ", "EQU", function () {
    return [ 4 * vm.$("DESCR") ];
  } ], [ "DATSIZ", "EQU", function () {
    return [ 1e3 ];
  } ], [ "EXTSIZ", "EQU", function () {
    return [ 10 ];
  } ], [ "NAMLSZ", "EQU", function () {
    return [ 20 ];
  } ], [ "NODESZ", "EQU", function () {
    return [ 3 * vm.$("DESCR") ];
  } ], [ "OBSIZ", "EQU", function () {
    return [ 256 ];
  } ], [ "OBARY", "EQU", function () {
    return [ vm.$("OBSIZ") + 3 ];
  } ], [ "OCASIZ", "EQU", function () {
    return [ 1500 ];
  } ], [ "SPDLSZ", "EQU", function () {
    return [ 1e3 ];
  } ], [ "STSIZE", "EQU", function () {
    return [ 1e3 ];
  } ], [ "SPDR", "EQU", function () {
    return [ vm.$("SPEC") + vm.$("DESCR") ];
  } ], [ "OBOFF", "EQU", function () {
    return [ vm.$("OBSIZ") - 2 ];
  } ], [ "SPDLDR", "EQU", function () {
    return [ vm.$("SPDLSZ") * vm.$("DESCR") ];
  } ], [ "ARYTYP", "EQU", function () {
    return [ 7 ];
  } ], [ "CLNTYP", "EQU", function () {
    return [ 5 ];
  } ], [ "CMATYP", "EQU", function () {
    return [ 2 ];
  } ], [ "CMTTYP", "EQU", function () {
    return [ 2 ];
  } ], [ "CNTTYP", "EQU", function () {
    return [ 4 ];
  } ], [ "CTLTYP", "EQU", function () {
    return [ 3 ];
  } ], [ "DIMTYP", "EQU", function () {
    return [ 1 ];
  } ], [ "EOSTYP", "EQU", function () {
    return [ 6 ];
  } ], [ "EQTYP", "EQU", function () {
    return [ 4 ];
  } ], [ "FGOTYP", "EQU", function () {
    return [ 3 ];
  } ], [ "FTOTYP", "EQU", function () {
    return [ 6 ];
  } ], [ "FLITYP", "EQU", function () {
    return [ 6 ];
  } ], [ "FNCTYP", "EQU", function () {
    return [ 5 ];
  } ], [ "ILITYP", "EQU", function () {
    return [ 2 ];
  } ], [ "LPTYP", "EQU", function () {
    return [ 1 ];
  } ], [ "NBTYP", "EQU", function () {
    return [ 1 ];
  } ], [ "NEWTYP", "EQU", function () {
    return [ 1 ];
  } ], [ "NSTTYP", "EQU", function () {
    return [ 4 ];
  } ], [ "QLITYP", "EQU", function () {
    return [ 1 ];
  } ], [ "RBTYP", "EQU", function () {
    return [ 7 ];
  } ], [ "RPTYP", "EQU", function () {
    return [ 3 ];
  } ], [ "SGOTYP", "EQU", function () {
    return [ 2 ];
  } ], [ "STOTYP", "EQU", function () {
    return [ 5 ];
  } ], [ "UGOTYP", "EQU", function () {
    return [ 1 ];
  } ], [ "UTOTYP", "EQU", function () {
    return [ 4 ];
  } ], [ "VARTYP", "EQU", function () {
    return [ 3 ];
  } ], [ "A", "EQU", function () {
    return [ 4 ];
  } ], [ "B", "EQU", function () {
    return [ 2 ];
  } ], [ "C", "EQU", function () {
    return [ 8 ];
  } ], [ "E", "EQU", function () {
    return [ 11 ];
  } ], [ "I", "EQU", function () {
    return [ 6 ];
  } ], [ "K", "EQU", function () {
    return [ 10 ];
  } ], [ "L", "EQU", function () {
    return [ 12 ];
  } ], [ "N", "EQU", function () {
    return [ 9 ];
  } ], [ "P", "EQU", function () {
    return [ 3 ];
  } ], [ "R", "EQU", function () {
    return [ 7 ];
  } ], [ "S", "EQU", function () {
    return [ 1 ];
  } ], [ "T", "EQU", function () {
    return [ 5 ];
  } ], [ null, "TITLE", function () {
    return [ "Program Initialization" ];
  } ], [ "BEGIN", "INIT", function () {
    return [ null ];
  } ], [ null, "ISTACK", function () {
    return [ null ];
  } ], [ null, "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("TITLEF") ];
  } ], [ null, "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("SOURCF") ];
  } ], [ null, "MSTIME", function () {
    return [ vm.$("TIMECL") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("SCBSCL"), vm.$("BLOCK"), vm.$("OCALIM") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("OCSVCL"), vm.$("SCBSCL") ];
  } ], [ null, "RESETF", function () {
    return [ vm.$("SCBSCL"), vm.$("PTR") ];
  } ], [ null, "GETSIZ", function () {
    return [ vm.$("YCL"), vm.$("INITLS") ];
  } ], [ "SPCNVT", "GETD", function () {
    return [ vm.$("XPTR"), vm.$("INITLS"), vm.$("YCL") ];
  } ], [ null, "GETSIZ", function () {
    return [ vm.$("XCL"), vm.$("XPTR") ];
  } ], [ "SPCNV1", "GETD", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), vm.$("XCL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("ZPTR"), 0, null, vm.$("SPCNV2") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("GENVAR"), vm.$("ZPTR") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("XPTR"), vm.$("XCL"), vm.$("ZPTR") ];
  } ], [ "SPCNV2", "DECRA", function () {
    return [ vm.$("XCL"), 2 * vm.$("DESCR") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("XCL"), 0, vm.$("SPCNV1") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("YCL"), vm.$("DESCR") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("YCL"), 0, vm.$("SPCNVT") ];
  } ], [ "INITD1", "GETDC", function () {
    return [ vm.$("XPTR"), vm.$("INITB"), 0 ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("GENVAR"), [ vm.$("XPTR") ] ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("INITB"), vm.$("DESCR") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ZPTR"), 0, vm.$("YPTR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("INITB"), 2 * vm.$("DESCR") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("INITB"), vm.$("INITE"), null, null, vm.$("INITD1") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ABRTKY"), vm.$("DESCR"), vm.$("ABOPAT") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ARBKY"), vm.$("DESCR"), vm.$("ARBPAT") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("BALKY"), vm.$("DESCR"), vm.$("BALPAT") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("FAILKY"), vm.$("DESCR"), vm.$("FALPAT") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("FNCEKY"), vm.$("DESCR"), vm.$("FNCPAT") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("REMKY"), vm.$("DESCR"), vm.$("REMPAT") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("SUCCKY"), vm.$("DESCR"), vm.$("SUCPAT") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("VARSYM"), 0 ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("NBSPTR"), vm.$("BLOCK"), vm.$("NMOVER") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("CMBSCL"), vm.$("SCBSCL") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("UNIT"), vm.$("INPUT") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("OCBSCL"), vm.$("CMBSCL") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("OCLIM"), vm.$("CMBSCL"), vm.$("OCALIM") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("OCLIM"), 5 * vm.$("DESCR") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("INICOM"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("XLATRN") ];
  } ], [ null, "TITLE", function () {
    return [ "Compilation and Interpreter Invocation" ];
  } ], [ "XLATRD", "AEQLC", function () {
    return [ vm.$("LISTCL"), 0, null, vm.$("XLATRN") ];
  } ], [ null, "STPRNT", function () {
    return [ vm.$("IOKEY"), vm.$("OUTBLK"), vm.$("LNBFSP") ];
  } ], [ "XLATRN", "STREAD", function () {
    return [ vm.$("INBFSP"), vm.$("UNIT"), vm.$("XLATRN"), vm.$("COMP5") ];
  } ], [ null, "SETSP", function () {
    return [ vm.$("TEXTSP"), vm.$("NEXTSP") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("XSP"), vm.$("TEXTSP"), vm.$("CARDTB"), vm.$("COMP3"), vm.$("COMP3") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("NEWCRD"), null ];
  } ], [ "XLATNX", "RCALL", function () {
    return [ null, vm.$("CMPILE"), null, [ vm.$("COMP3"), null, vm.$("XLATNX") ] ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("CMOFCL"), vm.$("DESCR") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("CMBSCL"), vm.$("CMOFCL"), vm.$("ENDCL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("LISTCL"), 0, null, vm.$("XLATP") ];
  } ], [ null, "STPRNT", function () {
    return [ vm.$("IOKEY"), vm.$("OUTBLK"), vm.$("LNBFSP") ];
  } ], [ "XLATP", "AEQLC", function () {
    return [ vm.$("STYPE"), vm.$("EOSTYP"), null, vm.$("XLAEND") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("XSP"), vm.$("TEXTSP"), vm.$("IBLKTB"), vm.$("COMP3"), vm.$("XLAEND") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("STYPE"), vm.$("EOSTYP"), null, vm.$("XLAEND") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("STYPE"), vm.$("NBTYP"), vm.$("COMP7") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("XSP"), vm.$("TEXTSP"), vm.$("LBLTB"), vm.$("COMP7"), vm.$("COMP7") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), [ vm.$("XSPPTR") ] ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("OCBSCL"), vm.$("XPTR"), vm.$("ATTRIB") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("OCBSCL"), 0, null, vm.$("COMP7") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("STYPE"), vm.$("EOSTYP"), null, vm.$("XLAEND") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("XSP"), vm.$("TEXTSP"), vm.$("IBLKTB"), vm.$("COMP7"), null, vm.$("COMP7") ];
  } ], [ "XLAEND", "AEQLC", function () {
    return [ vm.$("ESAICL"), 0, null, vm.$("XLATSC") ];
  } ], [ null, "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("ERRCF") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("XLATND") ];
  } ], [ "XLATSC", "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("SUCCF") ];
  } ], [ "XLATND", "SETAC", function () {
    return [ vm.$("UNIT"), 0 ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("LPTR"), 0 ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("OCLIM"), 0 ];
  } ], [ null, "ZERBLK", function () {
    return [ vm.$("COMREG"), vm.$("COMDCT") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("XCL"), vm.$("CMBSCL"), vm.$("CMOFCL") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("SPLIT"), [ vm.$("XCL") ] ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("LISTCL"), 0 ];
  } ], [ null, "MSTIME", function () {
    return [ vm.$("ETMCL") ];
  } ], [ null, "SUBTRT", function () {
    return [ vm.$("TIMECL"), vm.$("ETMCL"), vm.$("TIMECL") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("CNSLCL"), 1 ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("INTERP"), null, [ vm.$("MAIN1"), vm.$("MAIN1"), vm.$("MAIN1") ] ];
  } ], [ null, "TITLE", function () {
    return [ "Support Procedures" ];
  } ], [ "AUGATL", "PROC", function () {
    return [ null ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("A1PTR"), vm.$("A2PTR"), vm.$("A3PTR") ] ];
  } ], [ null, "LOCAPT", function () {
    return [ vm.$("A4PTR"), vm.$("A1PTR"), vm.$("ZEROCL"), vm.$("AUG1") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("A4PTR"), vm.$("DESCR"), vm.$("A2PTR") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("A4PTR"), 2 * vm.$("DESCR"), vm.$("A3PTR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("A5PTR"), vm.$("A1PTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("A5RTN") ];
  } ], [ "AUG1", "GETSIZ", function () {
    return [ vm.$("A4PTR"), vm.$("A1PTR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("A4PTR"), 2 * vm.$("DESCR") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("A4PTR"), vm.$("B") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("A5PTR"), vm.$("BLOCK"), vm.$("A4PTR") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("A5PTR"), vm.$("A4PTR"), vm.$("A3PTR") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("A4PTR"), vm.$("DESCR") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("A5PTR"), vm.$("A4PTR"), vm.$("A2PTR") ];
  } ], [ "AUGMOV", "DECRA", function () {
    return [ vm.$("A4PTR"), vm.$("DESCR") ];
  } ], [ null, "MOVBLK", function () {
    return [ vm.$("A5PTR"), vm.$("A1PTR"), vm.$("A4PTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("A5RTN") ];
  } ], [ "CODSKP", "PROC", function () {
    return [ null ];
  } ], [ null, "POP", function () {
    return [ vm.$("YCL") ];
  } ], [ "CODCNT", "INCRA", function () {
    return [ vm.$("OCICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("XCL"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "TESTF", function () {
    return [ vm.$("XCL"), vm.$("FNC"), null, vm.$("CODFNC") ];
  } ], [ "CODECR", "DECRA", function () {
    return [ vm.$("YCL"), 1 ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("YCL"), 0, vm.$("CODCNT"), vm.$("RTN1"), vm.$("INTR10") ];
  } ], [ "CODFNC", "PUSH", function () {
    return [ vm.$("YCL") ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("YCL"), vm.$("XCL") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("CODSKP"), [ vm.$("YCL") ] ];
  } ], [ null, "POP", function () {
    return [ vm.$("YCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("CODECR") ];
  } ], [ "DTREP", "PROC", function () {
    return [ null ];
  } ], [ null, "POP", function () {
    return [ vm.$("A2PTR") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("A2PTR"), vm.$("A"), null, vm.$("DTARRY") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("A2PTR"), vm.$("T"), null, vm.$("DTABLE") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("A2PTR"), vm.$("R"), vm.$("DTREP1") ];
  } ], [ null, "REALST", function () {
    return [ vm.$("DPSP"), vm.$("A2PTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DTREPR") ];
  } ], [ "DTARRY", "GETDC", function () {
    return [ vm.$("A3PTR"), vm.$("A2PTR"), vm.$("DESCR") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("ZSP"), vm.$("A3PTR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("A3PTR"), vm.$("ZSP") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("A3PTR"), vm.$("ARRLEN"), vm.$("DTREP1") ];
  } ], [ null, "SETLC", function () {
    return [ vm.$("DTARSP"), 0 ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("DTARSP"), vm.$("ARRSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("DTARSP"), vm.$("LPRNSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("DTARSP"), vm.$("QTSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("DTARSP"), vm.$("ZSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("DTARSP"), vm.$("QTSP") ];
  } ], [ "DTARTB", "APDSP", function () {
    return [ vm.$("DTARSP"), vm.$("RPRNSP") ];
  } ], [ null, "SETSP", function () {
    return [ vm.$("DPSP"), vm.$("DTARSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DTREPR") ];
  } ], [ "DTABLE", "GETSIZ", function () {
    return [ vm.$("A3PTR"), vm.$("A2PTR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("A1PTR"), vm.$("A2PTR"), vm.$("A3PTR") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("A3PTR"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("A2PTR"), vm.$("A2PTR"), vm.$("A3PTR") ];
  } ], [ "DTABL1", "AEQLC", function () {
    return [ vm.$("A1PTR"), 1, null, vm.$("DTABL2") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("A3PTR"), vm.$("A3PTR"), vm.$("A2PTR") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("A3PTR"), 2 * vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("A1PTR"), vm.$("A1PTR"), vm.$("A2PTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DTABL1") ];
  } ], [ "DTABL2", "DECRA", function () {
    return [ vm.$("A3PTR"), vm.$("DESCR") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("A2PTR"), 2 * vm.$("DESCR") ];
  } ], [ null, "DIVIDE", function () {
    return [ vm.$("A3PTR"), vm.$("A3PTR"), vm.$("DSCRTW") ];
  } ], [ null, "INTSPC", function () {
    return [ vm.$("ZSP"), vm.$("A3PTR") ];
  } ], [ null, "SETLC", function () {
    return [ vm.$("DTARSP"), 0 ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("DTARSP"), vm.$("ASSCSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("DTARSP"), vm.$("LPRNSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("DTARSP"), vm.$("ZSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("DTARSP"), vm.$("CMASP") ];
  } ], [ null, "DIVIDE", function () {
    return [ vm.$("A2PTR"), vm.$("A2PTR"), vm.$("DSCRTW") ];
  } ], [ null, "INTSPC", function () {
    return [ vm.$("ZSP"), vm.$("A2PTR") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("DTARSP"), vm.$("ZSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DTARTB") ];
  } ], [ "DTREP1", "MOVV", function () {
    return [ vm.$("DT1CL"), vm.$("A2PTR") ];
  } ], [ null, "LOCAPT", function () {
    return [ vm.$("A3PTR"), vm.$("DTATL"), vm.$("DT1CL"), vm.$("DTREPE") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("A3PTR"), vm.$("A3PTR"), 2 * vm.$("DESCR") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("DPSP"), vm.$("A3PTR") ];
  } ], [ "DTREPR", "RRTURN", function () {
    return [ vm.$("DPSPTR"), 1 ];
  } ], [ "DTREPE", "SETSP", function () {
    return [ vm.$("DPSP"), vm.$("EXDTSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DTREPR") ];
  } ], [ "FINDEX", "PROC", function () {
    return [ null ];
  } ], [ null, "POP", function () {
    return [ vm.$("F1PTR") ];
  } ], [ null, "LOCAPV", function () {
    return [ vm.$("F2PTR"), vm.$("FNCPL"), vm.$("F1PTR"), vm.$("FATNF") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("F2PTR"), vm.$("F2PTR"), vm.$("DESCR") ];
  } ], [ "FATBAK", "RRTURN", function () {
    return [ vm.$("F2PTR"), 1 ];
  } ], [ "FATNF", "INCRA", function () {
    return [ vm.$("NEXFCL"), 2 * vm.$("DESCR") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("NEXFCL"), vm.$("FBLKSZ"), vm.$("FATBLK") ];
  } ], [ "FATNXT", "SUM", function () {
    return [ vm.$("F2PTR"), vm.$("FBLOCK"), vm.$("NEXFCL") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("FNCPL"), vm.$("AUGATL"), [ vm.$("FNCPL"), vm.$("F2PTR"), vm.$("F1PTR") ] ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("F2PTR"), 0, vm.$("UNDFCL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("F2PTR"), vm.$("DESCR"), vm.$("F1PTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FATBAK") ];
  } ], [ "FATBLK", "RCALL", function () {
    return [ vm.$("FBLOCK"), vm.$("BLOCK"), vm.$("FBLKRQ") ];
  } ], [ null, "SETF", function () {
    return [ vm.$("FBLOCK"), vm.$("FNC") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("FBLOCK"), 0 ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("NEXFCL"), vm.$("DESCR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FATNXT") ];
  } ], [ null, "TITLE", function () {
    return [ "Storage Allocation and Regeneration Procedures" ];
  } ], [ "BLOCK", "PROC", function () {
    return [ null ];
  } ], [ null, "POP", function () {
    return [ vm.$("ARG1CL") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("ARG1CL"), vm.$("SIZLMT"), vm.$("SIZERR"), vm.$("SIZERR") ];
  } ], [ "BLOCK1", "MOVD", function () {
    return [ vm.$("BLOCL"), vm.$("FRSGPT") ];
  } ], [ null, "MOVV", function () {
    return [ vm.$("BLOCL"), vm.$("ARG1CL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("FRSGPT"), vm.$("DESCR") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("FRSGPT"), vm.$("FRSGPT"), vm.$("ARG1CL") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("TLSGP1"), vm.$("FRSGPT"), null, null, vm.$("BLOGC") ];
  } ], [ null, "ZERBLK", function () {
    return [ vm.$("BLOCL"), vm.$("ARG1CL") ];
  } ], [ null, "PUTAC", function () {
    return [ vm.$("BLOCL"), 0, vm.$("BLOCL") ];
  } ], [ null, "SETFI", function () {
    return [ vm.$("BLOCL"), vm.$("TTL") ];
  } ], [ null, "SETSIZ", function () {
    return [ vm.$("BLOCL"), vm.$("ARG1CL") ];
  } ], [ null, "RRTURN", function () {
    return [ vm.$("BLOCL"), 1 ];
  } ], [ "BLOGC", "MOVA", function () {
    return [ vm.$("FRSGPT"), vm.$("BLOCL") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("GC"), [ vm.$("ARG1CL") ], [ vm.$("ALOC2"), vm.$("BLOCK1") ] ];
  } ], [ "GENVAR", "PROC", function () {
    return [ null ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("CONVSW"), 0 ];
  } ], [ null, "POP", function () {
    return [ vm.$("AXPTR") ];
  } ], [ null, "GETSPC", function () {
    return [ vm.$("SPECR1"), vm.$("AXPTR"), 0 ];
  } ], [ null, "LEQLC", function () {
    return [ vm.$("SPECR1"), 0, null, vm.$("RT1NUL") ];
  } ], [ "LOCA1", "VARID", function () {
    return [ vm.$("EQUVCL"), vm.$("SPECR1") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("BUKPTR"), vm.$("OBPTR"), vm.$("EQUVCL") ];
  } ], [ "LOCA2", "MOVD", function () {
    return [ vm.$("LSTPTR"), vm.$("BUKPTR") ];
  } ], [ null, "GETAC", function () {
    return [ vm.$("BUKPTR"), vm.$("BUKPTR"), vm.$("LNKFLD") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BUKPTR"), 0, null, vm.$("LOCA5") ];
  } ], [ null, "VCMPIC", function () {
    return [ vm.$("BUKPTR"), vm.$("LNKFLD"), vm.$("EQUVCL"), vm.$("LOCA5"), null, vm.$("LOCA2") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("SPECR2"), vm.$("BUKPTR") ];
  } ], [ null, "LEXCMP", function () {
    return [ vm.$("SPECR1"), vm.$("SPECR2"), vm.$("LOCA2"), null, vm.$("LOCA2") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("LCPTR"), vm.$("BUKPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("LOCRET") ];
  } ], [ "LOCA5", "GETLG", function () {
    return [ vm.$("AXPTR"), vm.$("SPECR1") ];
  } ], [ null, "GETLTH", function () {
    return [ vm.$("BKLTCL"), vm.$("AXPTR") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("BKLTCL"), vm.$("SIZLMT"), vm.$("SIZERR") ];
  } ], [ "LOCA7", "MOVD", function () {
    return [ vm.$("LCPTR"), vm.$("FRSGPT") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("LCPTR"), vm.$("S") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("FRSGPT"), vm.$("DESCR") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("FRSGPT"), vm.$("FRSGPT"), vm.$("BKLTCL") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("TLSGP1"), vm.$("FRSGPT"), null, null, vm.$("LOCA4") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("LCPTR"), 0, vm.$("ZEROCL") ];
  } ], [ null, "PUTAC", function () {
    return [ vm.$("LCPTR"), 0, vm.$("LCPTR") ];
  } ], [ null, "SETFI", function () {
    return [ vm.$("LCPTR"), vm.$("TTL") + vm.$("STTL") ];
  } ], [ null, "SETSIZ", function () {
    return [ vm.$("LCPTR"), vm.$("AXPTR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("CONVSW"), 0, vm.$("LOCA6") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("LCPTR"), vm.$("DESCR"), vm.$("NULVCL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("LCPTR"), vm.$("ATTRIB"), vm.$("ZEROCL") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("SPECR2"), vm.$("LCPTR") ];
  } ], [ null, "SETLC", function () {
    return [ vm.$("SPECR2"), 0 ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("SPECR2"), vm.$("SPECR1") ];
  } ], [ "LOCA6", "PUTVC", function () {
    return [ vm.$("LCPTR"), vm.$("LNKFLD"), vm.$("EQUVCL") ];
  } ], [ null, "PUTAC", function () {
    return [ vm.$("LCPTR"), vm.$("LNKFLD"), vm.$("BUKPTR") ];
  } ], [ null, "PUTAC", function () {
    return [ vm.$("LSTPTR"), vm.$("LNKFLD"), vm.$("LCPTR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("VARSYM"), 1 ];
  } ], [ "LOCRET", "RRTURN", function () {
    return [ vm.$("LCPTR"), 1 ];
  } ], [ "LOCA4", "MOVA", function () {
    return [ vm.$("FRSGPT"), vm.$("LCPTR") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("GC"), [ vm.$("BKLTCL") ], [ vm.$("ALOC2"), vm.$("LOCA7") ] ];
  } ], [ "GNVARI", "PROC", function () {
    return [ vm.$("GENVAR") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("CONVSW"), 0 ];
  } ], [ null, "POP", function () {
    return [ vm.$("AXPTR") ];
  } ], [ null, "INTSPC", function () {
    return [ vm.$("SPECR1"), vm.$("AXPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("LOCA1") ];
  } ], [ "CONVAR", "PROC", function () {
    return [ vm.$("GENVAR") ];
  } ], [ null, "POP", function () {
    return [ vm.$("AXPTR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("AXPTR"), 0, null, vm.$("RT1NUL") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("CONVSW"), 1 ];
  } ], [ null, "GETLTH", function () {
    return [ vm.$("BKLTCL"), vm.$("AXPTR") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("BKLTCL"), vm.$("SIZLMT"), vm.$("SIZERR") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("TEMPCL"), vm.$("FRSGPT"), vm.$("BKLTCL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("TEMPCL"), vm.$("DESCR") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("TLSGP1"), vm.$("TEMPCL"), null, null, vm.$("CONVR4") ];
  } ], [ "CONVR5", "PUTDC", function () {
    return [ vm.$("FRSGPT"), 0, vm.$("ZEROCL") ];
  } ], [ null, "PUTAC", function () {
    return [ vm.$("FRSGPT"), 0, vm.$("FRSGPT") ];
  } ], [ null, "SETFI", function () {
    return [ vm.$("FRSGPT"), vm.$("TTL") + vm.$("STTL") ];
  } ], [ null, "SETSIZ", function () {
    return [ vm.$("FRSGPT"), vm.$("AXPTR") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("FRSGPT"), vm.$("DESCR"), vm.$("NULVCL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("FRSGPT"), vm.$("ATTRIB"), vm.$("ZEROCL") ];
  } ], [ null, "MOVA", function () {
    return [ vm.$("BKLTCL"), vm.$("FRSGPT") ];
  } ], [ null, "RRTURN", function () {
    return [ vm.$("BKLTCL"), 1 ];
  } ], [ "CONVR4", "RCALL", function () {
    return [ null, vm.$("GC"), vm.$("BKLTCL"), [ vm.$("ALOC2"), vm.$("CONVR5") ] ];
  } ], [ "GNVARS", "PROC", function () {
    return [ vm.$("GENVAR") ];
  } ], [ null, "POP", function () {
    return [ vm.$("AXPTR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("AXPTR"), 0, null, vm.$("RT1NUL") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("SPECR1"), vm.$("FRSGPT") ];
  } ], [ null, "PUTLG", function () {
    return [ vm.$("SPECR1"), vm.$("AXPTR") ];
  } ], [ null, "SETSIZ", function () {
    return [ vm.$("FRSGPT"), vm.$("AXPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("LOCA1") ];
  } ], [ "GC", "PROC", function () {
    return [ null ];
  } ], [ null, "POP", function () {
    return [ vm.$("GCREQ") ];
  } ], [ null, "PSTACK", function () {
    return [ vm.$("BLOCL") ];
  } ], [ null, "SUBTRT", function () {
    return [ vm.$("BLOCL"), vm.$("BLOCL"), vm.$("STKPTR") ];
  } ], [ null, "SETSIZ", function () {
    return [ vm.$("STKPTR"), vm.$("BLOCL") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("BKDXU"), vm.$("PRMDX") ];
  } ], [ "GCT", "GETD", function () {
    return [ vm.$("GCMPTR"), vm.$("PRMPTR"), vm.$("BKDXU") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("GCMPTR"), 0, null, vm.$("GCTDWN") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("GCM"), [ vm.$("GCMPTR") ] ];
  } ], [ "GCTDWN", "DECRA", function () {
    return [ vm.$("BKDXU"), vm.$("DESCR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BKDXU"), 0, vm.$("GCT") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("BKPTR"), vm.$("OBLIST") - vm.$("DESCR") ];
  } ], [ "GCBA1", "ACOMP", function () {
    return [ vm.$("BKPTR"), vm.$("OBEND"), vm.$("GCLAD") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("BKPTR"), vm.$("DESCR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ST1PTR"), vm.$("BKPTR") ];
  } ], [ "GCBA2", "GETAC", function () {
    return [ vm.$("ST1PTR"), vm.$("ST1PTR"), vm.$("LNKFLD") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("ST1PTR"), 0, null, vm.$("GCBA1") ];
  } ], [ null, "TESTFI", function () {
    return [ vm.$("ST1PTR"), vm.$("MARK"), null, vm.$("GCBA2") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ST2PTR"), vm.$("ST1PTR"), vm.$("DESCR") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("ST2PTR"), vm.$("NULVCL"), vm.$("GCBA4") ];
  } ], [ null, "AEQLIC", function () {
    return [ vm.$("ST1PTR"), vm.$("ATTRIB"), 0, null, vm.$("GCBA2") ];
  } ], [ "GCBA4", "PUTDC", function () {
    return [ vm.$("GCBLK"), vm.$("DESCR"), vm.$("ST1PTR") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("GCM"), [ vm.$("GCBLK") ], vm.$("GCBA2") ];
  } ], [ "GCLAD", "MOVD", function () {
    return [ vm.$("CPYCL"), vm.$("HDSGPT") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("TTLCL"), vm.$("HDSGPT") ];
  } ], [ "GCLAD0", "BKSIZE", function () {
    return [ vm.$("BKDX"), vm.$("TTLCL") ];
  } ], [ null, "TESTFI", function () {
    return [ vm.$("TTLCL"), vm.$("MARK"), vm.$("GCLAD7") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("CPYCL"), vm.$("CPYCL"), vm.$("BKDX") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("TTLCL"), vm.$("TTLCL"), vm.$("BKDX") ];
  } ], [ null, "AEQL", function () {
    return [ vm.$("TTLCL"), vm.$("FRSGPT"), vm.$("GCLAD0"), vm.$("GCBB1") ];
  } ], [ "GCLAD7", "MOVD", function () {
    return [ vm.$("MVSGPT"), vm.$("TTLCL") ];
  } ], [ "GCLAD4", "SUM", function () {
    return [ vm.$("TTLCL"), vm.$("TTLCL"), vm.$("BKDX") ];
  } ], [ null, "AEQL", function () {
    return [ vm.$("TTLCL"), vm.$("FRSGPT"), null, vm.$("GCBB1") ];
  } ], [ null, "BKSIZE", function () {
    return [ vm.$("BKDX"), vm.$("TTLCL") ];
  } ], [ null, "TESTFI", function () {
    return [ vm.$("TTLCL"), vm.$("MARK"), vm.$("GCLAD4") ];
  } ], [ null, "PUTAC", function () {
    return [ vm.$("TTLCL"), 0, vm.$("CPYCL") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("CPYCL"), vm.$("CPYCL"), vm.$("BKDX") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("GCLAD4") ];
  } ], [ "GCBB1", "SETAC", function () {
    return [ vm.$("BKPTR"), vm.$("OBLIST") - vm.$("DESCR") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("NODPCL"), 1 ];
  } ], [ "GCBB2", "ACOMP", function () {
    return [ vm.$("BKPTR"), vm.$("OBEND"), vm.$("GCLAP") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("BKPTR"), vm.$("DESCR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ST1PTR"), vm.$("BKPTR") ];
  } ], [ "GCBB3", "MOVD", function () {
    return [ vm.$("ST2PTR"), vm.$("ST1PTR") ];
  } ], [ "GCBB4", "GETAC", function () {
    return [ vm.$("ST1PTR"), vm.$("ST1PTR"), vm.$("LNKFLD") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("ST1PTR"), 0, null, vm.$("GCBB5") ];
  } ], [ null, "TESTFI", function () {
    return [ vm.$("ST1PTR"), vm.$("MARK"), vm.$("GCBB4") ];
  } ], [ null, "GETAC", function () {
    return [ vm.$("BLOCL"), vm.$("ST1PTR"), 0 ];
  } ], [ null, "PUTAC", function () {
    return [ vm.$("ST2PTR"), vm.$("LNKFLD"), vm.$("BLOCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("GCBB3") ];
  } ], [ "GCBB5", "PUTAC", function () {
    return [ vm.$("ST2PTR"), vm.$("LNKFLD"), vm.$("ZEROCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("GCBB2") ];
  } ], [ "GCLAP", "MOVD", function () {
    return [ vm.$("TTLCL"), vm.$("HDSGPT") ];
  } ], [ "GCLAP0", "BKSIZE", function () {
    return [ vm.$("BKDXU"), vm.$("TTLCL") ];
  } ], [ null, "TESTFI", function () {
    return [ vm.$("TTLCL"), vm.$("STTL"), null, vm.$("GCLAP1") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("BKDX"), vm.$("BKDXU") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("GCLAP2") ];
  } ], [ "GCLAP1", "SETAC", function () {
    return [ vm.$("BKDX"), 3 * vm.$("DESCR") ];
  } ], [ "GCLAP2", "TESTFI", function () {
    return [ vm.$("TTLCL"), vm.$("MARK"), vm.$("GCLAP5") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("BKDX"), vm.$("DESCR") ];
  } ], [ "GCLAP3", "GETD", function () {
    return [ vm.$("DESCL"), vm.$("TTLCL"), vm.$("BKDX") ];
  } ], [ null, "TESTF", function () {
    return [ vm.$("DESCL"), vm.$("PTR"), vm.$("GCLAP4") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("DESCL"), vm.$("MVSGPT"), null, null, vm.$("GCLAP4") ];
  } ], [ null, "TOP", function () {
    return [ vm.$("TOPCL"), vm.$("OFSET"), vm.$("DESCL") ];
  } ], [ null, "ADJUST", function () {
    return [ vm.$("DESCL"), vm.$("TOPCL"), vm.$("OFSET") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("TTLCL"), vm.$("BKDX"), vm.$("DESCL") ];
  } ], [ "GCLAP4", "DECRA", function () {
    return [ vm.$("BKDX"), vm.$("DESCR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BKDX"), 0, vm.$("GCLAP3") ];
  } ], [ "GCLAP5", "SUM", function () {
    return [ vm.$("TTLCL"), vm.$("TTLCL"), vm.$("BKDXU") ];
  } ], [ null, "AEQL", function () {
    return [ vm.$("TTLCL"), vm.$("FRSGPT"), vm.$("GCLAP0") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("BKDXU"), vm.$("PRMDX") ];
  } ], [ "GCLAT1", "GETD", function () {
    return [ vm.$("TTLCL"), vm.$("PRMPTR"), vm.$("BKDXU") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("TTLCL"), 0, null, vm.$("GCLAT4") ];
  } ], [ null, "GETSIZ", function () {
    return [ vm.$("BKDX"), vm.$("TTLCL") ];
  } ], [ "GCLAT2", "GETD", function () {
    return [ vm.$("DESCL"), vm.$("TTLCL"), vm.$("BKDX") ];
  } ], [ null, "TESTF", function () {
    return [ vm.$("DESCL"), vm.$("PTR"), vm.$("GCLAT3") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("DESCL"), vm.$("MVSGPT"), null, null, vm.$("GCLAT3") ];
  } ], [ null, "TOP", function () {
    return [ vm.$("TOPCL"), vm.$("OFSET"), vm.$("DESCL") ];
  } ], [ null, "ADJUST", function () {
    return [ vm.$("DESCL"), vm.$("TOPCL"), vm.$("OFSET") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("TTLCL"), vm.$("BKDX"), vm.$("DESCL") ];
  } ], [ "GCLAT3", "DECRA", function () {
    return [ vm.$("BKDX"), vm.$("DESCR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BKDX"), 0, vm.$("GCLAT2") ];
  } ], [ "GCLAT4", "DECRA", function () {
    return [ vm.$("BKDXU"), vm.$("DESCR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BKDXU"), 0, vm.$("GCLAT1") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("TTLCL"), vm.$("HDSGPT") ];
  } ], [ "GCLAM0", "BKSIZE", function () {
    return [ vm.$("BKDXU"), vm.$("TTLCL") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("TTLCL"), vm.$("MVSGPT"), vm.$("GCLAM5"), vm.$("GCLAM5") ];
  } ], [ null, "GETAC", function () {
    return [ vm.$("TOPCL"), vm.$("TTLCL"), 0 ];
  } ], [ null, "MOVDIC", function () {
    return [ vm.$("TOPCL"), 0, vm.$("TTLCL"), 0 ];
  } ], [ null, "RSETFI", function () {
    return [ vm.$("TOPCL"), vm.$("MARK") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("GCLAM4") ];
  } ], [ "GCLAM5", "MOVA", function () {
    return [ vm.$("BKDX"), vm.$("BKDXU") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("BKDX"), vm.$("DESCR") ];
  } ], [ null, "TESTFI", function () {
    return [ vm.$("TTLCL"), vm.$("MARK"), vm.$("GCLAM4") ];
  } ], [ null, "GETAC", function () {
    return [ vm.$("TOPCL"), vm.$("TTLCL"), 0 ];
  } ], [ null, "MOVDIC", function () {
    return [ vm.$("TOPCL"), 0, vm.$("TTLCL"), 0 ];
  } ], [ null, "RSETFI", function () {
    return [ vm.$("TOPCL"), vm.$("MARK") ];
  } ], [ null, "MOVBLK", function () {
    return [ vm.$("TOPCL"), vm.$("TTLCL"), vm.$("BKDX") ];
  } ], [ "GCLAM4", "SUM", function () {
    return [ vm.$("TTLCL"), vm.$("TTLCL"), vm.$("BKDXU") ];
  } ], [ null, "AEQL", function () {
    return [ vm.$("TTLCL"), vm.$("FRSGPT"), vm.$("GCLAM0") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("GCNO"), 1 ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("NODPCL"), 0 ];
  } ], [ null, "BKSIZE", function () {
    return [ vm.$("BKDX"), vm.$("TOPCL") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("FRSGPT"), vm.$("TOPCL"), vm.$("BKDX") ];
  } ], [ null, "RESETF", function () {
    return [ vm.$("FRSGPT"), vm.$("FNC") ];
  } ], [ null, "SUBTRT", function () {
    return [ vm.$("GCGOT"), vm.$("TLSGP1"), vm.$("FRSGPT") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("GCGOT"), vm.$("DESCR") ];
  } ], [ null, "RESETF", function () {
    return [ vm.$("GCGOT"), vm.$("PTR") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("GCREQ"), vm.$("GCGOT"), vm.$("FAIL") ];
  } ], [ null, "RRTURN", function () {
    return [ vm.$("GCGOT"), 2 ];
  } ], [ "GCM", "PROC", function () {
    return [ null ];
  } ], [ null, "POP", function () {
    return [ vm.$("BK1CL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("ZEROCL") ];
  } ], [ "GCMA1", "GETSIZ", function () {
    return [ vm.$("BKDX"), vm.$("BK1CL") ];
  } ], [ "GCMA2", "GETD", function () {
    return [ vm.$("DESCL"), vm.$("BK1CL"), vm.$("BKDX") ];
  } ], [ null, "TESTF", function () {
    return [ vm.$("DESCL"), vm.$("PTR"), vm.$("GCMA3") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("DESCL"), 0, null, vm.$("GCMA3") ];
  } ], [ null, "TOP", function () {
    return [ vm.$("TOPCL"), vm.$("OFSET"), vm.$("DESCL") ];
  } ], [ null, "TESTFI", function () {
    return [ vm.$("TOPCL"), vm.$("MARK"), vm.$("GCMA4") ];
  } ], [ "GCMA3", "DECRA", function () {
    return [ vm.$("BKDX"), vm.$("DESCR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BKDX"), 0, vm.$("GCMA2") ];
  } ], [ null, "POP", function () {
    return [ vm.$("BK1CL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BK1CL"), 0, null, vm.$("RTN1") ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("BKDX"), vm.$("BK1CL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("GCMA2") ];
  } ], [ "GCMA4", "DECRA", function () {
    return [ vm.$("BKDX"), vm.$("DESCR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BKDX"), 0, null, vm.$("GCMA9") ];
  } ], [ null, "SETVA", function () {
    return [ vm.$("BK1CL"), vm.$("BKDX") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("BK1CL") ];
  } ], [ "GCMA9", "MOVD", function () {
    return [ vm.$("BK1CL"), vm.$("TOPCL") ];
  } ], [ null, "SETFI", function () {
    return [ vm.$("BK1CL"), vm.$("MARK") ];
  } ], [ null, "TESTFI", function () {
    return [ vm.$("BK1CL"), vm.$("STTL"), vm.$("GCMA1") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("BKDX"), vm.$("TWOCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("GCMA2") ];
  } ], [ "SPLIT", "PROC", function () {
    return [ null ];
  } ], [ null, "POP", function () {
    return [ vm.$("A4PTR") ];
  } ], [ null, "TOP", function () {
    return [ vm.$("A5PTR"), vm.$("A6PTR"), vm.$("A4PTR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("A6PTR"), 0, null, vm.$("RTN1") ];
  } ], [ null, "GETSIZ", function () {
    return [ vm.$("A7PTR"), vm.$("A5PTR") ];
  } ], [ null, "SUBTRT", function () {
    return [ vm.$("A7PTR"), vm.$("A7PTR"), vm.$("A6PTR") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("A7PTR"), vm.$("DESCR") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("A7PTR"), 0, null, vm.$("RTN1"), vm.$("RTN1") ];
  } ], [ null, "SETSIZ", function () {
    return [ vm.$("A5PTR"), vm.$("A6PTR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("A4PTR"), vm.$("DESCR") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("A4PTR"), 0, vm.$("ZEROCL") ];
  } ], [ null, "PUTAC", function () {
    return [ vm.$("A4PTR"), 0, vm.$("A4PTR") ];
  } ], [ null, "SETFI", function () {
    return [ vm.$("A4PTR"), vm.$("TTL") ];
  } ], [ null, "SETSIZ", function () {
    return [ vm.$("A4PTR"), vm.$("A7PTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTN1") ];
  } ], [ null, "TITLE", function () {
    return [ "Compilation Procedures" ];
  } ], [ "BINOP", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("FORBLK"), null, vm.$("BINOP1") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("NBTYP"), vm.$("RTN2") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("XSP"), vm.$("TEXTSP"), vm.$("BIOPTB"), vm.$("BINCON") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ZPTR"), vm.$("STYPE") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTZPTR") ];
  } ], [ "BINOP1", "RCALL", function () {
    return [ null, vm.$("FORWRD"), null, vm.$("COMP3") ];
  } ], [ null, "SELBRA", function () {
    return [ vm.$("BRTYPE"), [ null, vm.$("RTN2"), vm.$("RTN2"), null, null, vm.$("RTN2"), vm.$("RTN2") ] ];
  } ], [ "BINERR", "SETAC", function () {
    return [ vm.$("EMSGCL"), vm.$("ILLBIN") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTN1") ];
  } ], [ "BINCON", "MOVD", function () {
    return [ vm.$("ZPTR"), vm.$("CONCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTZPTR") ];
  } ], [ "BINEOS", "SETAC", function () {
    return [ vm.$("EMSGCL"), vm.$("ILLEOS") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTN1") ];
  } ], [ "CMPILE", "PROC", function () {
    return [ null ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("BRTYPE"), 0 ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("BOSCL"), vm.$("CMOFCL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("CSTNCL"), 1 ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("XSP"), vm.$("TEXTSP"), vm.$("LBLTB"), vm.$("CERR1") ];
  } ], [ null, "LEQLC", function () {
    return [ vm.$("XSP"), 0, null, vm.$("CMPILA") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("CMOFCL"), vm.$("DESCR") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("CMBSCL"), vm.$("CMOFCL"), vm.$("BASECL") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("CMBSCL"), vm.$("CMBSCL"), vm.$("CMOFCL") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("CMBSCL"), vm.$("OCLIM"), null, null, vm.$("CMPILO") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XCL"), vm.$("BLOCK"), vm.$("CODELT") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("CMBSCL"), 0, vm.$("GOTGCL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("CMBSCL"), vm.$("DESCR"), vm.$("LIT1CL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("CMBSCL"), 2 * vm.$("DESCR"), vm.$("XCL") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("CMBSCL"), vm.$("XCL") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("OCLIM"), vm.$("CMBSCL"), vm.$("CODELT") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("OCLIM"), 5 * vm.$("DESCR") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("CMBSCL"), vm.$("DESCR"), vm.$("BASECL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("CMBSCL"), vm.$("DESCR") ];
  } ], [ "CMPILO", "SETAC", function () {
    return [ vm.$("CMOFCL"), 0 ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("BOSCL"), 0 ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("LPTR"), vm.$("GENVAR"), vm.$("XSPPTR") ];
  } ], [ null, "AEQLIC", function () {
    return [ vm.$("LPTR"), vm.$("ATTRIB"), 0, null, vm.$("CMPILC") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("CNSLCL"), 0, null, vm.$("CERR2") ];
  } ], [ "CMPILC", "PUTDC", function () {
    return [ vm.$("LPTR"), vm.$("ATTRIB"), vm.$("CMBSCL") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("LPTR"), vm.$("ENDPTR"), null, vm.$("RTN2") ];
  } ], [ "CMPILA", "RCALL", function () {
    return [ null, vm.$("FORBLK"), null, vm.$("CERR12") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("EOSTYP"), null, vm.$("RTN3") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("CMOFCL"), vm.$("DESCR") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("CMBSCL"), vm.$("CMOFCL"), vm.$("INITCL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("CMOFCL"), vm.$("DESCR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("FRNCL"), vm.$("CMOFCL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("NBTYP"), null, vm.$("CMPSUB") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("CLNTYP"), vm.$("CERR3"), vm.$("CMPGO") ];
  } ], [ "CMPSUB", "RCALL", function () {
    return [ vm.$("SUBJND"), vm.$("ELEMNT"), null, [ vm.$("CDIAG"), vm.$("COMP3") ] ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("FORBLK"), null, vm.$("CERR5") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("NBTYP"), null, vm.$("CMPATN") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("EQTYP"), null, vm.$("CMPFRM") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TREPUB"), [ vm.$("SUBJND") ] ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("CLNTYP"), null, vm.$("CMPGO") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("EOSTYP"), vm.$("CERR5"), vm.$("CMPNGO") ];
  } ], [ "CMPATN", "RCALL", function () {
    return [ vm.$("PATND"), vm.$("EXPR"), null, vm.$("CDIAG") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("EQTYP"), null, vm.$("CMPASP") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("CMOFCL"), vm.$("DESCR") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("CMBSCL"), vm.$("CMOFCL"), vm.$("SCANCL") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TREPUB"), [ vm.$("SUBJND") ] ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TREPUB"), [ vm.$("PATND") ] ];
  } ], [ "CMPTGO", "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("EOSTYP"), null, vm.$("CMPNGO") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("CLNTYP"), vm.$("CERR5"), vm.$("CMPGO") ];
  } ], [ "CMPFRM", "RCALL", function () {
    return [ vm.$("FORMND"), vm.$("EXPR"), null, vm.$("CDIAG") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("CMOFCL"), vm.$("DESCR") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("CMBSCL"), vm.$("CMOFCL"), vm.$("ASGNCL") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TREPUB"), [ vm.$("SUBJND") ] ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("CMPFT") ];
  } ], [ "CMPASP", "RCALL", function () {
    return [ vm.$("FORMND"), vm.$("EXPR"), null, vm.$("CDIAG") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("CMOFCL"), vm.$("DESCR") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("CMBSCL"), vm.$("CMOFCL"), vm.$("SJSRCL") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TREPUB"), [ vm.$("SUBJND") ] ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TREPUB"), [ vm.$("PATND") ] ];
  } ], [ "CMPFT", "RCALL", function () {
    return [ null, vm.$("TREPUB"), vm.$("FORMND"), vm.$("CMPTGO") ];
  } ], [ "CMPNGO", "SETVA", function () {
    return [ vm.$("CSTNCL"), vm.$("CMOFCL") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("CMBSCL"), vm.$("FRNCL"), vm.$("CSTNCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTN3") ];
  } ], [ "CMPGO", "RCALL", function () {
    return [ null, vm.$("FORWRD"), null, vm.$("COMP3") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("EOSTYP"), null, vm.$("CMPNGO") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("NBTYP"), vm.$("CERR11") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("XSP"), vm.$("TEXTSP"), vm.$("GOTOTB"), vm.$("CERR11"), vm.$("CERR12") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("GOGOCL"), vm.$("GOTLCL") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("GOBRCL"), vm.$("RPTYP") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("STYPE"), vm.$("GTOCL"), null, vm.$("CMPGG"), vm.$("CMPGG") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("GOGOCL"), vm.$("GOTGCL") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("GOBRCL"), vm.$("RBTYP") ];
  } ], [ "CMPGG", "SELBRA", function () {
    return [ vm.$("STYPE"), [ null, vm.$("CMPSGO"), vm.$("CMPFGO"), null, vm.$("CMPSGO"), vm.$("CMPFGO") ] ];
  } ], [ "CMPUGO", "SETVA", function () {
    return [ vm.$("CSTNCL"), vm.$("CMOFCL") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("CMBSCL"), vm.$("FRNCL"), vm.$("CSTNCL") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("GOTOND"), vm.$("EXPR"), null, vm.$("CDIAG") ];
  } ], [ null, "AEQL", function () {
    return [ vm.$("BRTYPE"), vm.$("GOBRCL"), vm.$("CERR11") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("CMOFCL"), vm.$("DESCR") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("CMBSCL"), vm.$("CMOFCL"), vm.$("GOGOCL") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TREPUB"), [ vm.$("GOTOND") ] ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("FORWRD"), null, vm.$("COMP3") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("EOSTYP"), vm.$("CERR11"), vm.$("RTN3") ];
  } ], [ "CMPSGO", "RCALL", function () {
    return [ vm.$("SGOND"), vm.$("EXPR"), null, vm.$("CDIAG") ];
  } ], [ null, "AEQL", function () {
    return [ vm.$("BRTYPE"), vm.$("GOBRCL"), vm.$("CERR11") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("CMOFCL"), vm.$("DESCR") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("CMBSCL"), vm.$("CMOFCL"), vm.$("GOGOCL") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TREPUB"), [ vm.$("SGOND") ] ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("FORWRD"), null, vm.$("COMP3") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("EOSTYP"), vm.$("CMPILL") ];
  } ], [ null, "SETVA", function () {
    return [ vm.$("CSTNCL"), vm.$("CMOFCL") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("CMBSCL"), vm.$("FRNCL"), vm.$("CSTNCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTN3") ];
  } ], [ "CMPILL", "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("NBTYP"), vm.$("CERR11") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("XSP"), vm.$("TEXTSP"), vm.$("GOTOTB"), vm.$("CERR11"), vm.$("CERR12") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("STYPE"), vm.$("FGOTYP"), vm.$("CMPFTC") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("GOGOCL"), vm.$("GOTLCL") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("GOBRCL"), vm.$("RPTYP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("CMPUGO") ];
  } ], [ "CMPFTC", "AEQLC", function () {
    return [ vm.$("STYPE"), vm.$("FTOTYP"), vm.$("CERR11") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("GOGOCL"), vm.$("GOTGCL") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("GOBRCL"), vm.$("RBTYP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("CMPUGO") ];
  } ], [ "CMPFGO", "RCALL", function () {
    return [ vm.$("FGOND"), vm.$("EXPR"), null, vm.$("CDIAG") ];
  } ], [ null, "AEQL", function () {
    return [ vm.$("BRTYPE"), vm.$("GOBRCL"), vm.$("CERR11") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("FORWRD"), null, vm.$("COMP3") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("EOSTYP"), vm.$("CMPILM") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("CMOFCL"), vm.$("DESCR") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("CMBSCL"), vm.$("CMOFCL"), vm.$("GOTOCL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("CMOFCL"), vm.$("DESCR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("SRNCL"), vm.$("CMOFCL") ];
  } ], [ null, "SETVA", function () {
    return [ vm.$("CSTNCL"), vm.$("CMOFCL") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("CMBSCL"), vm.$("FRNCL"), vm.$("CSTNCL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("CMOFCL"), vm.$("DESCR") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("CMBSCL"), vm.$("CMOFCL"), vm.$("GOGOCL") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TREPUB"), [ vm.$("FGOND") ] ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("CMBSCL"), vm.$("SRNCL"), vm.$("CMOFCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTN3") ];
  } ], [ "CMPILM", "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("NBTYP"), vm.$("CERR11") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("XSP"), vm.$("TEXTSP"), vm.$("GOTOTB"), vm.$("CERR11"), vm.$("CERR12") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("STYPE"), vm.$("SGOTYP"), vm.$("CMPSTC") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("GOTLCL") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("GOBRCL"), vm.$("RPTYP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("CMPILN") ];
  } ], [ "CMPSTC", "AEQLC", function () {
    return [ vm.$("STYPE"), vm.$("STOTYP"), vm.$("CERR11") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("GOTGCL") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("GOBRCL"), vm.$("RBTYP") ];
  } ], [ "CMPILN", "RCALL", function () {
    return [ vm.$("SGOND"), vm.$("EXPR"), null, vm.$("CDIAG") ];
  } ], [ null, "AEQL", function () {
    return [ vm.$("BRTYPE"), vm.$("GOBRCL"), vm.$("CERR11") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("FORWRD"), null, vm.$("COMP3") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("EOSTYP"), vm.$("CERR11") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("CMOFCL"), vm.$("DESCR") ];
  } ], [ null, "POP", function () {
    return [ vm.$("WCL") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("CMBSCL"), vm.$("CMOFCL"), vm.$("WCL") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TREPUB"), [ vm.$("SGOND") ] ];
  } ], [ null, "SETVA", function () {
    return [ vm.$("CSTNCL"), vm.$("CMOFCL") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("CMBSCL"), vm.$("FRNCL"), vm.$("CSTNCL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("CMOFCL"), vm.$("DESCR") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("CMBSCL"), vm.$("CMOFCL"), vm.$("GOGOCL") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TREPUB"), [ vm.$("FGOND") ], vm.$("RTN3") ];
  } ], [ "CERR1", "SETAC", function () {
    return [ vm.$("EMSGCL"), vm.$("EMSG1") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("CDIAG") ];
  } ], [ "CERR2", "SETAC", function () {
    return [ vm.$("EMSGCL"), vm.$("EMSG2") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("CDIAG") ];
  } ], [ "CERR3", "SETAC", function () {
    return [ vm.$("EMSGCL"), vm.$("EMSG3") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("CDIAG") ];
  } ], [ "CERR5", "SETAC", function () {
    return [ vm.$("EMSGCL"), vm.$("ILLBRK") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("CDIAG") ];
  } ], [ "CERR12", "SETAC", function () {
    return [ vm.$("EMSGCL"), vm.$("ILLEOS") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("CDIAG") ];
  } ], [ "CERR11", "SETAC", function () {
    return [ vm.$("EMSGCL"), vm.$("EMSG14") ];
  } ], [ "CDIAG", "INCRA", function () {
    return [ vm.$("BOSCL"), vm.$("DESCR") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("CMBSCL"), vm.$("BOSCL"), vm.$("ERORCL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("BOSCL"), vm.$("DESCR") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("CMBSCL"), vm.$("BOSCL"), vm.$("CSTNCL") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("CMOFCL"), vm.$("BOSCL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("ESAICL"), vm.$("DESCR") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("ESAICL"), vm.$("ESALIM"), vm.$("COMP9") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("LISTCL"), 0, null, vm.$("CDIAG1") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YCL"), vm.$("ERRBAS") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("EOSTYP"), null, vm.$("CDIAG3") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("XCL"), vm.$("TEXTSP") ];
  } ], [ null, "SUBTRT", function () {
    return [ vm.$("YCL"), vm.$("YCL"), vm.$("XCL") ];
  } ], [ "CDIAG3", "PUTLG", function () {
    return [ vm.$("ERRSP"), vm.$("YCL") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("ERRSP"), vm.$("QTSP") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("EOSTYP"), null, vm.$("CDIAG2") ];
  } ], [ null, "STPRNT", function () {
    return [ vm.$("IOKEY"), vm.$("OUTBLK"), vm.$("LNBFSP") ];
  } ], [ "CDIAG2", "STPRNT", function () {
    return [ vm.$("IOKEY"), vm.$("OUTBLK"), vm.$("ERRSP") ];
  } ], [ null, "PUTLG", function () {
    return [ vm.$("ERRSP"), vm.$("YCL") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("ERRSP"), vm.$("BLSP") ];
  } ], [ null, "GETSPC", function () {
    return [ vm.$("TSP"), vm.$("EMSGCL"), 0 ];
  } ], [ null, "SETLC", function () {
    return [ vm.$("CERRSP"), 0 ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("CERRSP"), vm.$("STARSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("CERRSP"), vm.$("TSP") ];
  } ], [ null, "STPRNT", function () {
    return [ vm.$("IOKEY"), vm.$("OUTBLK"), vm.$("CERRSP") ];
  } ], [ null, "STPRNT", function () {
    return [ vm.$("IOKEY"), vm.$("OUTBLK"), vm.$("BLSP") ];
  } ], [ "CDIAG1", "AEQLC", function () {
    return [ vm.$("UNIT"), 0, null, vm.$("RTN1") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("EOSTYP"), null, vm.$("RTN3") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("XSP"), vm.$("TEXTSP"), vm.$("EOSTB"), vm.$("COMP3"), null, vm.$("RTN3") ];
  } ], [ "DIAGRN", "STREAD", function () {
    return [ vm.$("INBFSP"), vm.$("UNIT"), vm.$("DIAGRN"), vm.$("COMP5") ];
  } ], [ null, "SETSP", function () {
    return [ vm.$("TEXTSP"), vm.$("NEXTSP") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("XSP"), vm.$("TEXTSP"), vm.$("CARDTB"), vm.$("COMP3"), vm.$("COMP3") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("NEWCRD"), null, [ null, null, vm.$("RTN3") ] ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("LISTCL"), 0, null, vm.$("DIAGRN") ];
  } ], [ null, "STPRNT", function () {
    return [ vm.$("IOKEY"), vm.$("OUTBLK"), vm.$("LNBFSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DIAGRN") ];
  } ], [ "ELEMNT", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ELEMND"), vm.$("UNOP"), null, vm.$("RTN2") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("XSP"), vm.$("TEXTSP"), vm.$("ELEMTB"), vm.$("ELEICH"), vm.$("ELEILI") ];
  } ], [ "ELEMN9", "SELBRA", function () {
    return [ vm.$("STYPE"), [ null, vm.$("ELEILT"), vm.$("ELEVBL"), vm.$("ELENST"), vm.$("ELEFNC"), vm.$("ELEFLT"), vm.$("ELEARY") ] ];
  } ], [ null, "FSHRTN", function () {
    return [ vm.$("XSP"), 1 ];
  } ], [ null, "SHORTN", function () {
    return [ vm.$("XSP"), 1 ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), [ vm.$("XSPPTR") ] ];
  } ], [ "ELEMN5", "RCALL", function () {
    return [ vm.$("ELEXND"), vm.$("BLOCK"), vm.$("CNDSIZ") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ELEXND"), vm.$("CODE"), vm.$("LITCL") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ELEYND"), vm.$("BLOCK"), vm.$("CNDSIZ") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ELEYND"), vm.$("CODE"), vm.$("XPTR") ];
  } ], [ null, "ADDSON", function () {
    return [ vm.$("ELEXND"), vm.$("ELEYND") ];
  } ], [ "ELEMN1", "AEQLC", function () {
    return [ vm.$("ELEMND"), 0, vm.$("ELEMN6") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ZPTR"), vm.$("ELEXND") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ELEMRR") ];
  } ], [ "ELEMN6", "ADDSON", function () {
    return [ vm.$("ELEMND"), vm.$("ELEXND") ];
  } ], [ "ELEMNR", "MOVD", function () {
    return [ vm.$("ZPTR"), vm.$("ELEMND") ];
  } ], [ "ELEMRR", "AEQLIC", function () {
    return [ vm.$("ZPTR"), vm.$("FATHER"), 0, null, vm.$("RTZPTR") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("ZPTR"), vm.$("FATHER") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ELEMRR") ];
  } ], [ "ELEILT", "SPCINT", function () {
    return [ vm.$("XPTR"), vm.$("XSP"), vm.$("ELEINT"), vm.$("ELEMN5") ];
  } ], [ "ELEFLT", "SPREAL", function () {
    return [ vm.$("XPTR"), vm.$("XSP"), vm.$("ELEDEC"), vm.$("ELEMN5") ];
  } ], [ "ELEVBL", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), [ vm.$("XSPPTR") ] ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ELEXND"), vm.$("BLOCK"), vm.$("CNDSIZ") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ELEXND"), vm.$("CODE"), vm.$("XPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ELEMN1") ];
  } ], [ "ELENST", "PUSH", function () {
    return [ vm.$("ELEMND") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ELEXND"), vm.$("EXPR"), null, vm.$("RTN1") ];
  } ], [ null, "POP", function () {
    return [ vm.$("ELEMND") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("RPTYP"), vm.$("ELECMA"), vm.$("ELEMN1") ];
  } ], [ "ELEFNC", "SHORTN", function () {
    return [ vm.$("XSP"), 1 ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), [ vm.$("XSPPTR") ] ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XCL"), vm.$("FINDEX"), [ vm.$("XPTR") ] ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ELEXND"), vm.$("BLOCK"), vm.$("CNDSIZ") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ELEXND"), vm.$("CODE"), vm.$("XCL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("ELEMND"), 0, null, vm.$("ELEMN7") ];
  } ], [ null, "ADDSON", function () {
    return [ vm.$("ELEMND"), vm.$("ELEXND") ];
  } ], [ "ELEMN7", "PUSH", function () {
    return [ vm.$("ELEXND") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ELEXND"), vm.$("EXPR"), null, vm.$("RTN1") ];
  } ], [ null, "POP", function () {
    return [ vm.$("ELEMND") ];
  } ], [ null, "ADDSON", function () {
    return [ vm.$("ELEMND"), vm.$("ELEXND") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ELEMND"), vm.$("ELEXND") ];
  } ], [ "ELEMN2", "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("RPTYP"), null, vm.$("ELEMN3") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("CMATYP"), vm.$("ELECMA") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("ELEMND") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ELEXND"), vm.$("EXPR"), null, vm.$("RTN1") ];
  } ], [ null, "POP", function () {
    return [ vm.$("ELEMND") ];
  } ], [ null, "ADDSIB", function () {
    return [ vm.$("ELEMND"), vm.$("ELEXND") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ELEMND"), vm.$("ELEXND") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ELEMN2") ];
  } ], [ "ELEMN3", "GETDC", function () {
    return [ vm.$("ELEXND"), vm.$("ELEMND"), vm.$("FATHER") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("XCL"), vm.$("ELEXND"), vm.$("CODE") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("YCL"), vm.$("XCL"), 0 ];
  } ], [ null, "TESTF", function () {
    return [ vm.$("YCL"), vm.$("FNC"), null, vm.$("ELEMNR") ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("XCL"), vm.$("XCL") ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("YCL"), vm.$("YCL") ];
  } ], [ "ELEMN4", "ACOMP", function () {
    return [ vm.$("XCL"), vm.$("YCL"), vm.$("ELEMNR"), vm.$("ELEMNR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ELEYND"), vm.$("BLOCK"), vm.$("CNDSIZ") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ELEYND"), vm.$("CODE"), vm.$("LITCL") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ELEXND"), vm.$("BLOCK"), vm.$("CNDSIZ") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ELEXND"), vm.$("CODE"), vm.$("NULVCL") ];
  } ], [ null, "ADDSON", function () {
    return [ vm.$("ELEYND"), vm.$("ELEXND") ];
  } ], [ null, "ADDSIB", function () {
    return [ vm.$("ELEMND"), vm.$("ELEYND") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ELEMND"), vm.$("ELEYND") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("XCL"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ELEMN4") ];
  } ], [ "ELEARY", "SHORTN", function () {
    return [ vm.$("XSP"), 1 ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), [ vm.$("XSPPTR") ] ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ELEXND"), vm.$("BLOCK"), vm.$("CNDSIZ") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ELEXND"), vm.$("CODE"), vm.$("ITEMCL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("ELEMND"), 0, null, vm.$("ELEMN8") ];
  } ], [ null, "ADDSON", function () {
    return [ vm.$("ELEMND"), vm.$("ELEXND") ];
  } ], [ "ELEMN8", "MOVD", function () {
    return [ vm.$("ELEMND"), vm.$("ELEXND") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ELEXND"), vm.$("BLOCK"), vm.$("CNDSIZ") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ELEXND"), vm.$("CODE"), vm.$("XPTR") ];
  } ], [ null, "ADDSON", function () {
    return [ vm.$("ELEMND"), vm.$("ELEXND") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ELEMND"), vm.$("ELEXND") ];
  } ], [ "ELEAR1", "PUSH", function () {
    return [ vm.$("ELEMND") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ELEXND"), vm.$("EXPR"), null, vm.$("RTN1") ];
  } ], [ null, "POP", function () {
    return [ vm.$("ELEMND") ];
  } ], [ null, "ADDSIB", function () {
    return [ vm.$("ELEMND"), vm.$("ELEXND") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ELEMND"), vm.$("ELEXND") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("RBTYP"), null, vm.$("ELEMNR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("CMATYP"), vm.$("ELECMA"), vm.$("ELEAR1") ];
  } ], [ "ELEICH", "SETAC", function () {
    return [ vm.$("EMSGCL"), vm.$("ILCHAR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTN1") ];
  } ], [ "ELEILI", "AEQLC", function () {
    return [ vm.$("STYPE"), vm.$("QLITYP"), vm.$("ELEMN9") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("EMSGCL"), vm.$("OPNLIT") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTN1") ];
  } ], [ "ELEINT", "SETAC", function () {
    return [ vm.$("EMSGCL"), vm.$("ILLINT") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTN1") ];
  } ], [ "ELEDEC", "SETAC", function () {
    return [ vm.$("EMSGCL"), vm.$("ILLDEC") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTN1") ];
  } ], [ "ELECMA", "SETAC", function () {
    return [ vm.$("EMSGCL"), vm.$("ILLBRK") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTN1") ];
  } ], [ "EXPR", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("EXELND"), vm.$("ELEMNT"), null, [ vm.$("RTN1"), vm.$("EXPNUL") ] ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("EXPRND"), 0 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("EXPR2") ];
  } ], [ "EXPR1", "PUSH", function () {
    return [ vm.$("EXPRND") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("EXELND"), vm.$("ELEMNT"), null, [ vm.$("RTN1"), vm.$("EXPERR") ] ];
  } ], [ null, "POP", function () {
    return [ vm.$("EXPRND") ];
  } ], [ "EXPR2", "RCALL", function () {
    return [ vm.$("EXOPCL"), vm.$("BINOP"), null, [ vm.$("RTN1"), vm.$("EXPR7") ] ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("EXOPND"), vm.$("BLOCK"), vm.$("CNDSIZ") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("EXOPND"), vm.$("CODE"), vm.$("EXOPCL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("EXPRND"), 0, vm.$("EXPR3") ];
  } ], [ null, "ADDSON", function () {
    return [ vm.$("EXOPND"), vm.$("EXELND") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("EXPRND"), vm.$("EXELND") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("EXPR1") ];
  } ], [ "EXPR3", "GETDC", function () {
    return [ vm.$("EXOPCL"), vm.$("EXOPCL"), 2 * vm.$("DESCR") ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("EXOPCL"), vm.$("EXOPCL") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("EXEXND"), vm.$("EXPRND"), vm.$("FATHER") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("XPTR"), vm.$("EXEXND"), vm.$("CODE") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), 2 * vm.$("DESCR") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("XPTR"), vm.$("EXOPCL"), vm.$("EXPR4") ];
  } ], [ null, "ADDSIB", function () {
    return [ vm.$("EXPRND"), vm.$("EXOPND") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("EXPRND"), vm.$("EXOPND") ];
  } ], [ null, "ADDSON", function () {
    return [ vm.$("EXPRND"), vm.$("EXELND") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("EXPRND"), vm.$("EXELND") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("EXPR1") ];
  } ], [ "EXPR4", "ADDSIB", function () {
    return [ vm.$("EXPRND"), vm.$("EXELND") ];
  } ], [ "EXPR5", "AEQLIC", function () {
    return [ vm.$("EXPRND"), vm.$("FATHER"), 0, null, vm.$("EXPR11") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("EXPRND"), vm.$("EXPRND"), vm.$("FATHER") ];
  } ], [ null, "AEQLIC", function () {
    return [ vm.$("EXPRND"), vm.$("FATHER"), 0, null, vm.$("EXPR11") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("EXEXND"), vm.$("EXPRND"), vm.$("FATHER") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("XPTR"), vm.$("EXEXND"), vm.$("CODE") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), 2 * vm.$("DESCR") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("XPTR"), vm.$("EXOPCL"), vm.$("EXPR5") ];
  } ], [ null, "INSERT", function () {
    return [ vm.$("EXPRND"), vm.$("EXOPND") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("EXPR1") ];
  } ], [ "EXPR7", "AEQLC", function () {
    return [ vm.$("EXPRND"), 0, vm.$("EXPR10") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("XPTR"), vm.$("EXELND") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("EXPR9") ];
  } ], [ "EXPR10", "ADDSIB", function () {
    return [ vm.$("EXPRND"), vm.$("EXELND") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("XPTR"), vm.$("EXPRND") ];
  } ], [ "EXPR9", "AEQLIC", function () {
    return [ vm.$("XPTR"), vm.$("FATHER"), 0, null, vm.$("RTXNAM") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), vm.$("FATHER") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("EXPR9") ];
  } ], [ "EXPR11", "ADDSON", function () {
    return [ vm.$("EXOPND"), vm.$("EXPRND") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("EXPR1") ];
  } ], [ "EXPNUL", "RCALL", function () {
    return [ vm.$("EXPRND"), vm.$("BLOCK"), vm.$("CNDSIZ") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("EXPRND"), vm.$("CODE"), vm.$("LITCL") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("EXEXND"), vm.$("BLOCK"), vm.$("CNDSIZ") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("EXEXND"), vm.$("CODE"), vm.$("NULVCL") ];
  } ], [ null, "ADDSON", function () {
    return [ vm.$("EXPRND"), vm.$("EXEXND") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("XPTR"), vm.$("EXPRND") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTXNAM") ];
  } ], [ "EXPERR", "SETAC", function () {
    return [ vm.$("EMSGCL"), vm.$("ILLEOS") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTN1") ];
  } ], [ "FORWRD", "PROC", function () {
    return [ null ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("XSP"), vm.$("TEXTSP"), vm.$("FRWDTB"), vm.$("COMP3"), vm.$("FORRUN") ];
  } ], [ "FORJRN", "MOVD", function () {
    return [ vm.$("BRTYPE"), vm.$("STYPE") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTN2") ];
  } ], [ "FORRUN", "AEQLC", function () {
    return [ vm.$("UNIT"), 0, null, vm.$("FOREOS") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("LISTCL"), 0, null, vm.$("FORRUR") ];
  } ], [ null, "STPRNT", function () {
    return [ vm.$("IOKEY"), vm.$("OUTBLK"), vm.$("LNBFSP") ];
  } ], [ "FORRUR", "STREAD", function () {
    return [ vm.$("INBFSP"), vm.$("UNIT"), vm.$("FORRUR"), vm.$("COMP5") ];
  } ], [ null, "SETSP", function () {
    return [ vm.$("TEXTSP"), vm.$("NEXTSP") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("XSP"), vm.$("TEXTSP"), vm.$("CARDTB"), vm.$("COMP3"), vm.$("COMP3") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("NEWCRD"), null, [ vm.$("FORRUN"), vm.$("FORWRD") ] ];
  } ], [ "FOREOS", "MOVD", function () {
    return [ vm.$("BRTYPE"), vm.$("EOSCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTN2") ];
  } ], [ "FORBLK", "PROC", function () {
    return [ vm.$("FORWRD") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("XSP"), vm.$("TEXTSP"), vm.$("IBLKTB"), vm.$("RTN1"), vm.$("FORRUN"), vm.$("FORJRN") ];
  } ], [ "NEWCRD", "PROC", function () {
    return [ null ];
  } ], [ null, "SELBRA", function () {
    return [ vm.$("STYPE"), [ null, vm.$("CMTCRD"), vm.$("CTLCRD"), vm.$("CNTCRD") ] ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("LISTCL"), 0, null, vm.$("RTN3") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("XCL"), vm.$("CSTNCL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("XCL"), 1 ];
  } ], [ null, "INTSPC", function () {
    return [ vm.$("TSP"), vm.$("XCL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("LLIST"), 0, vm.$("CARDL") ];
  } ], [ null, "SETLC", function () {
    return [ vm.$("RNOSP"), 0 ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("RNOSP"), vm.$("TSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTN3") ];
  } ], [ "CARDL", "SETLC", function () {
    return [ vm.$("LNOSP"), 0 ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("LNOSP"), vm.$("TSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTN3") ];
  } ], [ "CMTCRD", "AEQLC", function () {
    return [ vm.$("LISTCL"), 0, null, vm.$("RTN1") ];
  } ], [ "CMTCLR", "SETLC", function () {
    return [ vm.$("LNOSP"), 0 ];
  } ], [ null, "SETLC", function () {
    return [ vm.$("RNOSP"), 0 ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("LNOSP"), vm.$("BLNSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("RNOSP"), vm.$("BLNSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTN1") ];
  } ], [ "CNTCRD", "FSHRTN", function () {
    return [ vm.$("TEXTSP"), 1 ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("LISTCL"), 0, null, vm.$("RTN2") ];
  } ], [ null, "INTSPC", function () {
    return [ vm.$("TSP"), vm.$("CSTNCL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("LLIST"), 0, vm.$("CARDLL") ];
  } ], [ null, "SETLC", function () {
    return [ vm.$("RNOSP"), 0 ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("RNOSP"), vm.$("TSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTN2") ];
  } ], [ "CARDLL", "SETLC", function () {
    return [ vm.$("LNOSP"), 0 ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("LNOSP"), vm.$("TSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTN2") ];
  } ], [ "CTLCRD", "FSHRTN", function () {
    return [ vm.$("TEXTSP"), 1 ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("XSP"), vm.$("TEXTSP"), vm.$("FRWDTB"), vm.$("COMP3"), vm.$("CMTCRD") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("STYPE"), vm.$("NBTYP"), vm.$("CMTCRD") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("XSP"), vm.$("TEXTSP"), vm.$("LBLXTB"), vm.$("CMTCLR"), vm.$("CMTCLR") ];
  } ], [ null, "LEXCMP", function () {
    return [ vm.$("XSP"), vm.$("UNLSP"), vm.$("CTLCR1"), null, vm.$("CTLCR1") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("LISTCL"), 0 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTN1") ];
  } ], [ "CTLCR1", "LEXCMP", function () {
    return [ vm.$("XSP"), vm.$("LISTSP"), vm.$("CTLCR3"), null, vm.$("CTLCR3") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("LISTCL"), 1 ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("XSP"), vm.$("TEXTSP"), vm.$("FRWDTB"), vm.$("COMP3"), vm.$("CMTCLR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("STYPE"), vm.$("NBTYP"), vm.$("CMTCLR") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("XSP"), vm.$("TEXTSP"), vm.$("LBLXTB"), vm.$("CMTCLR"), vm.$("CMTCLR") ];
  } ], [ null, "LEXCMP", function () {
    return [ vm.$("XSP"), vm.$("LEFTSP"), vm.$("CTLCR2"), null, vm.$("CTLCR2") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("LLIST"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("CMTCLR") ];
  } ], [ "CTLCR2", "SETAC", function () {
    return [ vm.$("LLIST"), 0 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("CMTCLR") ];
  } ], [ "CTLCR3", "LEXCMP", function () {
    return [ vm.$("XSP"), vm.$("EJCTSP"), vm.$("CMTCLR"), null, vm.$("CMTCLR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("LISTCL"), 0, null, vm.$("CMTCLR") ];
  } ], [ null, "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("EJECTF") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("CMTCLR") ];
  } ], [ "TREPUB", "PROC", function () {
    return [ null ];
  } ], [ null, "POP", function () {
    return [ vm.$("YPTR") ];
  } ], [ "TREPU1", "GETDC", function () {
    return [ vm.$("XPTR"), vm.$("YPTR"), vm.$("CODE") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("CMOFCL"), vm.$("DESCR") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("CMBSCL"), vm.$("CMOFCL"), vm.$("XPTR") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("ZPTR"), vm.$("CMBSCL"), vm.$("CMOFCL") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("ZPTR"), vm.$("OCLIM"), vm.$("TREPU5") ];
  } ], [ "TREPU4", "AEQLIC", function () {
    return [ vm.$("YPTR"), vm.$("LSON"), 0, null, vm.$("TREPU2") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("YPTR"), vm.$("YPTR"), vm.$("LSON") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("TREPU1") ];
  } ], [ "TREPU2", "AEQLIC", function () {
    return [ vm.$("YPTR"), vm.$("RSIB"), 0, null, vm.$("TREPU3") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("YPTR"), vm.$("YPTR"), vm.$("RSIB") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("TREPU1") ];
  } ], [ "TREPU3", "AEQLIC", function () {
    return [ vm.$("YPTR"), vm.$("FATHER"), 0, null, vm.$("RTN1") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("YPTR"), vm.$("YPTR"), vm.$("FATHER") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("TREPU2") ];
  } ], [ "TREPU5", "SUM", function () {
    return [ vm.$("ZPTR"), vm.$("CMOFCL"), vm.$("CODELT") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("ZPTR"), vm.$("C") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XCL"), vm.$("BLOCK"), vm.$("ZPTR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("LPTR"), 0, null, vm.$("TREPU6") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("LPTR"), vm.$("ATTRIB"), vm.$("XCL") ];
  } ], [ "TREPU6", "MOVBLK", function () {
    return [ vm.$("XCL"), vm.$("CMBSCL"), vm.$("CMOFCL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("CMBSCL"), vm.$("DESCR"), vm.$("GOTGCL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("CMBSCL"), 2 * vm.$("DESCR"), vm.$("LIT1CL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("CMBSCL"), 3 * vm.$("DESCR"), vm.$("XCL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("CMBSCL"), 3 * vm.$("DESCR") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("SPLIT"), [ vm.$("CMBSCL") ] ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("CMBSCL"), vm.$("XCL") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("OCLIM"), vm.$("CMBSCL"), vm.$("ZPTR") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("OCLIM"), 5 * vm.$("DESCR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("TREPU4") ];
  } ], [ "UNOP", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("FORWRD"), null, vm.$("COMP3") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("XPTR"), 0 ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("BRTYPE"), vm.$("NBTYP"), vm.$("RTN1") ];
  } ], [ "UNOPA", "STREAM", function () {
    return [ vm.$("XSP"), vm.$("TEXTSP"), vm.$("UNOPTB"), vm.$("RTXNAM"), vm.$("RTN1") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("BLOCK"), vm.$("CNDSIZ") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("YPTR"), vm.$("CODE"), vm.$("STYPE") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("XPTR"), 0, null, vm.$("UNOPB") ];
  } ], [ null, "ADDSON", function () {
    return [ vm.$("XPTR"), vm.$("YPTR") ];
  } ], [ "UNOPB", "MOVD", function () {
    return [ vm.$("XPTR"), vm.$("YPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("UNOPA") ];
  } ], [ null, "TITLE", function () {
    return [ "Interpreter Executive and Control Procedures" ];
  } ], [ "BASE", "PROC", function () {
    return [ null ];
  } ], [ null, "SUM", function () {
    return [ vm.$("OCBSCL"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("OCICL"), 0 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTNUL3") ];
  } ], [ "GOTG", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("OCBSCL"), vm.$("ARGVAL"), null, vm.$("INTR5") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("OCBSCL"), vm.$("C"), vm.$("INTR4") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("OCICL"), 0 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTNUL3") ];
  } ], [ "GOTL", "PROC", function () {
    return [ null ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("OCICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("XPTR"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "TESTF", function () {
    return [ vm.$("XPTR"), vm.$("FNC"), null, vm.$("GOTLC") ];
  } ], [ "GOTLV", "ACOMPC", function () {
    return [ vm.$("TRAPCL"), 0, null, vm.$("GOTLV1"), vm.$("GOTLV1") ];
  } ], [ null, "LOCAPT", function () {
    return [ vm.$("ATPTR"), vm.$("TLABL"), vm.$("XPTR"), vm.$("GOTLV1") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TRPHND"), vm.$("ATPTR") ];
  } ], [ null, "POP", function () {
    return [ vm.$("XPTR") ];
  } ], [ "GOTLV1", "DEQL", function () {
    return [ vm.$("XPTR"), vm.$("RETCL"), vm.$("GOTL1") ];
  } ], [ null, "RRTURN", function () {
    return [ null, 6 ];
  } ], [ "GOTL1", "DEQL", function () {
    return [ vm.$("XPTR"), vm.$("FRETCL"), vm.$("GOTL2") ];
  } ], [ null, "RRTURN", function () {
    return [ null, 4 ];
  } ], [ "GOTL2", "DEQL", function () {
    return [ vm.$("XPTR"), vm.$("NRETCL"), vm.$("GOTL3") ];
  } ], [ null, "RRTURN", function () {
    return [ null, 5 ];
  } ], [ "GOTL3", "GETDC", function () {
    return [ vm.$("OCBSCL"), vm.$("XPTR"), vm.$("ATTRIB") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("OCBSCL"), 0, null, vm.$("INTR4") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("OCICL"), 0 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTNUL3") ];
  } ], [ "GOTLC", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("INVOKE"), vm.$("XPTR"), [ vm.$("INTR5"), null, vm.$("INTR4") ] ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("S"), vm.$("INTR4"), vm.$("GOTLV") ];
  } ], [ "GOTO", "PROC", function () {
    return [ null ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("OCICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("OCICL"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTNUL3") ];
  } ], [ "INIT", "PROC", function () {
    return [ null ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("LSTNCL"), vm.$("STNOCL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("OCICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("XCL"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "MOVA", function () {
    return [ vm.$("STNOCL"), vm.$("XCL") ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("FRTNCL"), vm.$("XCL") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("EXNOCL"), vm.$("EXLMCL"), vm.$("EXEX"), vm.$("EXEX") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("EXNOCL"), 1 ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("TRAPCL"), 0, null, vm.$("RTNUL3"), vm.$("RTNUL3") ];
  } ], [ null, "LOCAPT", function () {
    return [ vm.$("ATPTR"), vm.$("TKEYL"), vm.$("STCTKY"), vm.$("RTNUL3") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TRPHND"), vm.$("ATPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTNUL3") ];
  } ], [ "INTERP", "PROC", function () {
    return [ null ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("OCICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("XPTR"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "TESTF", function () {
    return [ vm.$("XPTR"), vm.$("FNC"), vm.$("INTERP") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("INVOKE"), [ vm.$("XPTR") ], [ null, vm.$("INTERP"), vm.$("INTERP"), vm.$("RTN1"), vm.$("RTN2"), vm.$("RTN3") ] ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("OCICL"), vm.$("FRTNCL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("FALCL"), 1 ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("TRAPCL"), 0, null, vm.$("INTERP"), vm.$("INTERP") ];
  } ], [ null, "LOCAPT", function () {
    return [ vm.$("ATPTR"), vm.$("TKEYL"), vm.$("FALKY"), vm.$("INTERP") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TRPHND"), vm.$("ATPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("INTERP") ];
  } ], [ "INVOKE", "PROC", function () {
    return [ null ];
  } ], [ null, "POP", function () {
    return [ vm.$("INCL") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("XPTR"), vm.$("INCL"), 0 ];
  } ], [ null, "VEQL", function () {
    return [ vm.$("INCL"), vm.$("XPTR"), vm.$("INVK2") ];
  } ], [ "INVK1", "BRANIC", function () {
    return [ vm.$("INCL"), 0 ];
  } ], [ "INVK2", "TESTF", function () {
    return [ vm.$("XPTR"), vm.$("FNC"), vm.$("ARGNER"), vm.$("INVK1") ];
  } ], [ null, "TITLE", function () {
    return [ "Argument Evaluation Procedures" ];
  } ], [ "ARGVAL", "PROC", function () {
    return [ null ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("OCICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("XPTR"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "TESTF", function () {
    return [ vm.$("XPTR"), vm.$("FNC"), null, vm.$("ARGVC") ];
  } ], [ "ARGV1", "AEQLC", function () {
    return [ vm.$("INSW"), 0, null, vm.$("ARGV2") ];
  } ], [ null, "LOCAPV", function () {
    return [ vm.$("ZPTR"), vm.$("INATL"), vm.$("XPTR"), vm.$("ARGV2") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("ZPTR"), vm.$("DESCR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("PUTIN"), [ vm.$("ZPTR"), vm.$("XPTR") ], [ vm.$("FAIL"), vm.$("RTXNAM") ] ];
  } ], [ "ARGVC", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("INVOKE"), [ vm.$("XPTR") ], [ vm.$("FAIL"), vm.$("ARGV1"), vm.$("RTXNAM") ] ];
  } ], [ "ARGV2", "GETDC", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTXNAM") ];
  } ], [ "EXPVAL", "PROC", function () {
    return [ null ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 1 ];
  } ], [ "EXPVJN", "POP", function () {
    return [ vm.$("XPTR") ];
  } ], [ "EXPVJ2", "PUSH", function () {
    return [ [ vm.$("OCBSCL"), vm.$("OCICL"), vm.$("PATBCL"), vm.$("PATICL"), vm.$("WPTR"), vm.$("XCL"), vm.$("YCL"), vm.$("TCL") ] ];
  } ], [ null, "PUSH", function () {
    return [ [ vm.$("MAXLEN"), vm.$("LENFCL"), vm.$("PDLPTR"), vm.$("PDLHED"), vm.$("NAMICL"), vm.$("NHEDCL") ] ];
  } ], [ null, "SPUSH", function () {
    return [ [ vm.$("HEADSP"), vm.$("TSP"), vm.$("TXSP"), vm.$("XSP") ] ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("OCBSCL"), vm.$("XPTR") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("OCICL"), vm.$("DESCR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("PDLHED"), vm.$("PDLPTR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("NHEDCL"), vm.$("NAMICL") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("XPTR"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "TESTF", function () {
    return [ vm.$("XPTR"), vm.$("FNC"), null, vm.$("EXPVC") ];
  } ], [ "EXPV11", "AEQLC", function () {
    return [ vm.$("SCL"), 0, null, vm.$("EXPV6") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("INSW"), 0, null, vm.$("EXPV4") ];
  } ], [ null, "LOCAPV", function () {
    return [ vm.$("ZPTR"), vm.$("INATL"), vm.$("XPTR"), vm.$("EXPV4") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("ZPTR"), vm.$("DESCR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("PUTIN"), [ vm.$("ZPTR"), vm.$("XPTR") ], [ vm.$("EXPV1"), vm.$("EXPV6") ] ];
  } ], [ "EXPV4", "GETDC", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ "EXPV6", "SETAC", function () {
    return [ vm.$("SCL"), 2 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("EXPV7") ];
  } ], [ "EXPV9", "POP", function () {
    return [ vm.$("SCL") ];
  } ], [ "EXPV1", "SETAC", function () {
    return [ vm.$("SCL"), 1 ];
  } ], [ "EXPV7", "SPOP", function () {
    return [ [ vm.$("XSP"), vm.$("TXSP"), vm.$("TSP"), vm.$("HEADSP") ] ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("NHEDCL"), vm.$("NAMICL"), vm.$("PDLHED"), vm.$("PDLPTR"), vm.$("LENFCL"), vm.$("MAXLEN") ] ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("TCL"), vm.$("YCL"), vm.$("XCL"), vm.$("WPTR"), vm.$("PATICL"), vm.$("PATBCL"), vm.$("OCICL"), vm.$("OCBSCL") ] ];
  } ], [ null, "SELBRA", function () {
    return [ vm.$("SCL"), [ vm.$("FAIL"), vm.$("RTXNAM"), vm.$("RTZPTR") ] ];
  } ], [ "EXPVC", "PUSH", function () {
    return [ vm.$("SCL") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("INVOKE"), vm.$("XPTR") ];
  } ], [ null, "POP", function () {
    return [ vm.$("SCL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("SCL"), 0, vm.$("EXPV6") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 3 ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("EXPV7") ];
  } ], [ "EXPV5", "POP", function () {
    return [ vm.$("SCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("EXPV11") ];
  } ], [ "EXPEVL", "PROC", function () {
    return [ vm.$("EXPVAL") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 0 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("EXPVJN") ];
  } ], [ "EVAL", "PROC", function () {
    return [ vm.$("EXPVAL") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("ARGVAL"), null, vm.$("FAIL") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("E"), null, vm.$("EVAL1") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("I"), null, vm.$("RTXPTR") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("R"), null, vm.$("RTXPTR") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("S"), vm.$("INTR1") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "LEQLC", function () {
    return [ vm.$("XSP"), 0, null, vm.$("RTXPTR") ];
  } ], [ null, "SPCINT", function () {
    return [ vm.$("XPTR"), vm.$("XSP"), null, vm.$("RTXPTR") ];
  } ], [ null, "SPREAL", function () {
    return [ vm.$("XPTR"), vm.$("XSP"), null, vm.$("RTXPTR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("CONVE"), null, [ vm.$("FAIL"), vm.$("INTR10") ] ];
  } ], [ "EVAL1", "SETAC", function () {
    return [ vm.$("SCL"), 0 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("EXPVJ2") ];
  } ], [ "INTVAL", "PROC", function () {
    return [ null ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("OCICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("XPTR"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "TESTF", function () {
    return [ vm.$("XPTR"), vm.$("FNC"), null, vm.$("INTVC") ];
  } ], [ "INTV1", "AEQLC", function () {
    return [ vm.$("INSW"), 0, null, vm.$("INTV3") ];
  } ], [ null, "LOCAPV", function () {
    return [ vm.$("ZPTR"), vm.$("INATL"), vm.$("XPTR"), vm.$("INTV3") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("ZPTR"), vm.$("DESCR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("PUTIN"), [ vm.$("ZPTR"), vm.$("XPTR") ], vm.$("FAIL") ];
  } ], [ "INTV", "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "SPCINT", function () {
    return [ vm.$("XPTR"), vm.$("XSP"), vm.$("INTR1"), vm.$("RTXNAM") ];
  } ], [ "INTV3", "GETDC", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ "INTV2", "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("I"), null, vm.$("RTXNAM") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("S"), vm.$("INTR1"), vm.$("INTV") ];
  } ], [ "INTVC", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("INVOKE"), [ vm.$("XPTR") ], [ vm.$("FAIL"), vm.$("INTV1"), vm.$("INTV2") ] ];
  } ], [ "PATVAL", "PROC", function () {
    return [ null ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("OCICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("XPTR"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "TESTF", function () {
    return [ vm.$("XPTR"), vm.$("FNC"), null, vm.$("PATVC") ];
  } ], [ "PATV1", "AEQLC", function () {
    return [ vm.$("INSW"), 0, null, vm.$("PATV2") ];
  } ], [ null, "LOCAPV", function () {
    return [ vm.$("ZPTR"), vm.$("INATL"), vm.$("XPTR"), vm.$("PATV2") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("ZPTR"), vm.$("DESCR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("PUTIN"), [ vm.$("ZPTR"), vm.$("XPTR") ], [ vm.$("FAIL"), vm.$("RTXNAM") ] ];
  } ], [ "PATVC", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("INVOKE"), [ vm.$("XPTR") ], [ vm.$("FAIL"), vm.$("PATV1"), vm.$("PATV3") ] ];
  } ], [ "PATV2", "GETDC", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ "PATV3", "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("P"), null, vm.$("RTXNAM") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("S"), null, vm.$("RTXNAM") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("I"), null, vm.$("GENVIX") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("R"), null, vm.$("PATVR") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("E"), vm.$("INTR1") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("STARSZ") ];
  } ], [ null, "MOVBLK", function () {
    return [ vm.$("TPTR"), vm.$("STRPAT"), vm.$("STARSZ") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("TPTR"), 4 * vm.$("DESCR"), vm.$("XPTR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("XPTR"), vm.$("TPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTXNAM") ];
  } ], [ "PATVR", "REALST", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), vm.$("XSPPTR"), vm.$("RTXNAM") ];
  } ], [ "VARVAL", "PROC", function () {
    return [ null ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("OCICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("XPTR"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "TESTF", function () {
    return [ vm.$("XPTR"), vm.$("FNC"), null, vm.$("VARVC") ];
  } ], [ "VARV1", "AEQLC", function () {
    return [ vm.$("INSW"), 0, null, vm.$("VARV4") ];
  } ], [ null, "LOCAPV", function () {
    return [ vm.$("ZPTR"), vm.$("INATL"), vm.$("XPTR"), vm.$("VARV4") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("ZPTR"), vm.$("DESCR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("PUTIN"), [ vm.$("ZPTR"), vm.$("XPTR") ], [ vm.$("FAIL"), vm.$("RTXNAM") ] ];
  } ], [ "VARV4", "GETDC", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ "VARV2", "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("S"), null, vm.$("RTXNAM") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("I"), vm.$("INTR1"), vm.$("GENVIX") ];
  } ], [ "VARVC", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("INVOKE"), [ vm.$("XPTR") ], [ vm.$("FAIL"), vm.$("VARV1"), vm.$("VARV2") ] ];
  } ], [ "XYARGS", "PROC", function () {
    return [ null ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 0 ];
  } ], [ "XYN", "INCRA", function () {
    return [ vm.$("OCICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("YPTR"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "TESTF", function () {
    return [ vm.$("YPTR"), vm.$("FNC"), null, vm.$("XYC") ];
  } ], [ "XY1", "AEQLC", function () {
    return [ vm.$("INSW"), 0, null, vm.$("XY2") ];
  } ], [ null, "LOCAPV", function () {
    return [ vm.$("ZPTR"), vm.$("INATL"), vm.$("YPTR"), vm.$("XY2") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("ZPTR"), vm.$("DESCR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("PUTIN"), [ vm.$("ZPTR"), vm.$("YPTR") ], vm.$("FAIL") ];
  } ], [ "XY3", "AEQLC", function () {
    return [ vm.$("SCL"), 0, vm.$("RTN2") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 1 ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("XPTR"), vm.$("YPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("XYN") ];
  } ], [ "XY2", "GETDC", function () {
    return [ vm.$("YPTR"), vm.$("YPTR"), vm.$("DESCR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("XY3") ];
  } ], [ "XYC", "PUSH", function () {
    return [ [ vm.$("SCL"), vm.$("XPTR") ] ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("INVOKE"), [ vm.$("YPTR") ], [ vm.$("FAIL"), vm.$("XY4") ] ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("XPTR"), vm.$("SCL") ] ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("XY3") ];
  } ], [ "XY4", "POP", function () {
    return [ [ vm.$("XPTR"), vm.$("SCL") ] ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("XY1") ];
  } ], [ null, "TITLE", function () {
    return [ "Arithmetic Operations, Predicates, and Functions" ];
  } ], [ "ADD", "PROC", function () {
    return [ null ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARITH") ];
  } ], [ "DIV", "PROC", function () {
    return [ vm.$("ADD") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 2 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARITH") ];
  } ], [ "EXP", "PROC", function () {
    return [ vm.$("ADD") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 3 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARITH") ];
  } ], [ "MPY", "PROC", function () {
    return [ vm.$("ADD") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 4 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARITH") ];
  } ], [ "SUB", "PROC", function () {
    return [ vm.$("ADD") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 5 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARITH") ];
  } ], [ "EQ", "PROC", function () {
    return [ vm.$("ADD") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 6 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARITH") ];
  } ], [ "GE", "PROC", function () {
    return [ vm.$("ADD") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 7 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARITH") ];
  } ], [ "GT", "PROC", function () {
    return [ vm.$("ADD") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 8 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARITH") ];
  } ], [ "LE", "PROC", function () {
    return [ vm.$("ADD") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 9 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARITH") ];
  } ], [ "LT", "PROC", function () {
    return [ vm.$("ADD") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 10 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARITH") ];
  } ], [ "NE", "PROC", function () {
    return [ vm.$("ADD") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 11 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARITH") ];
  } ], [ "REMDR", "PROC", function () {
    return [ vm.$("ADD") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 12 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARITH") ];
  } ], [ "ARITH", "PUSH", function () {
    return [ vm.$("SCL") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("XYARGS"), null, vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ vm.$("SCL") ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("DTCL"), vm.$("XPTR") ];
  } ], [ null, "MOVV", function () {
    return [ vm.$("DTCL"), vm.$("YPTR") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("IIDTP"), null, vm.$("ARTHII") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("IVDTP"), null, vm.$("ARTHIV") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("VIDTP"), null, vm.$("ARTHVI") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("VVDTP"), null, vm.$("ARTHVV") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("RRDTP"), null, vm.$("ARTHRR") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("IRDTP"), null, vm.$("ARTHIR") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("RIDTP"), null, vm.$("ARTHRI") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("VRDTP"), null, vm.$("ARTHVR") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("RVDTP"), vm.$("INTR1"), vm.$("ARTHRV") ];
  } ], [ "ARTHII", "SELBRA", function () {
    return [ vm.$("SCL"), [ vm.$("AD"), vm.$("DV"), vm.$("EX"), vm.$("MP"), vm.$("SB"), vm.$("CEQ"), vm.$("CGE"), vm.$("CGT"), vm.$("CLE"), vm.$("CLT"), vm.$("CNE"), vm.$("RM") ] ];
  } ], [ "ARTHVI", "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "SPCINT", function () {
    return [ vm.$("XPTR"), vm.$("XSP"), null, vm.$("ARTHII") ];
  } ], [ null, "SPREAL", function () {
    return [ vm.$("XPTR"), vm.$("XSP"), vm.$("INTR1"), vm.$("ARTHRI") ];
  } ], [ "ARTHIV", "LOCSP", function () {
    return [ vm.$("YSP"), vm.$("YPTR") ];
  } ], [ null, "SPCINT", function () {
    return [ vm.$("YPTR"), vm.$("YSP"), null, vm.$("ARTHII") ];
  } ], [ null, "SPREAL", function () {
    return [ vm.$("YPTR"), vm.$("YSP"), vm.$("INTR1"), vm.$("ARTHIR") ];
  } ], [ "ARTHVV", "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "SPCINT", function () {
    return [ vm.$("XPTR"), vm.$("XSP"), null, vm.$("ARTHIV") ];
  } ], [ null, "SPREAL", function () {
    return [ vm.$("XPTR"), vm.$("XSP"), vm.$("INTR1"), vm.$("ARTHRV") ];
  } ], [ "ARTHRR", "SELBRA", function () {
    return [ vm.$("SCL"), [ vm.$("AR"), vm.$("DR"), vm.$("EXR"), vm.$("MR"), vm.$("SR"), vm.$("REQ"), vm.$("RGE"), vm.$("RGT"), vm.$("RLE"), vm.$("RLT"), vm.$("RNE"), vm.$("INTR1") ] ];
  } ], [ "ARTHIR", "INTRL", function () {
    return [ vm.$("XPTR"), vm.$("XPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARTHRR") ];
  } ], [ "ARTHRI", "INTRL", function () {
    return [ vm.$("YPTR"), vm.$("YPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARTHRR") ];
  } ], [ "ARTHVR", "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "SPCINT", function () {
    return [ vm.$("XPTR"), vm.$("XSP"), null, vm.$("ARTHIR") ];
  } ], [ null, "SPREAL", function () {
    return [ vm.$("XPTR"), vm.$("XSP"), vm.$("INTR1"), vm.$("ARTHRR") ];
  } ], [ "ARTHRV", "LOCSP", function () {
    return [ vm.$("YSP"), vm.$("YPTR") ];
  } ], [ null, "SPCINT", function () {
    return [ vm.$("YPTR"), vm.$("YSP"), null, vm.$("ARTHRI") ];
  } ], [ null, "SPREAL", function () {
    return [ vm.$("YPTR"), vm.$("YSP"), vm.$("INTR1"), vm.$("ARTHRR") ];
  } ], [ "AD", "SUM", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), vm.$("YPTR"), vm.$("AERROR"), vm.$("ARTN") ];
  } ], [ "DV", "DIVIDE", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), vm.$("YPTR"), vm.$("AERROR"), vm.$("ARTN") ];
  } ], [ "EX", "EXPINT", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), vm.$("YPTR"), vm.$("AERROR"), vm.$("ARTN") ];
  } ], [ "MP", "MULT", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), vm.$("YPTR"), vm.$("AERROR"), vm.$("ARTN") ];
  } ], [ "SB", "SUBTRT", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), vm.$("YPTR"), vm.$("AERROR"), vm.$("ARTN") ];
  } ], [ "CEQ", "AEQL", function () {
    return [ vm.$("XPTR"), vm.$("YPTR"), vm.$("FAIL"), vm.$("RETNUL") ];
  } ], [ "CGE", "ACOMP", function () {
    return [ vm.$("XPTR"), vm.$("YPTR"), vm.$("RETNUL"), vm.$("RETNUL"), vm.$("FAIL") ];
  } ], [ "CGT", "ACOMP", function () {
    return [ vm.$("XPTR"), vm.$("YPTR"), vm.$("RETNUL"), vm.$("FAIL"), vm.$("FAIL") ];
  } ], [ "CLE", "ACOMP", function () {
    return [ vm.$("XPTR"), vm.$("YPTR"), vm.$("FAIL"), vm.$("RETNUL"), vm.$("RETNUL") ];
  } ], [ "CLT", "ACOMP", function () {
    return [ vm.$("XPTR"), vm.$("YPTR"), vm.$("FAIL"), vm.$("FAIL"), vm.$("RETNUL") ];
  } ], [ "CNE", "AEQL", function () {
    return [ vm.$("XPTR"), vm.$("YPTR"), vm.$("RETNUL"), vm.$("FAIL") ];
  } ], [ "AR", "ADREAL", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), vm.$("YPTR"), vm.$("AERROR"), vm.$("ARTN") ];
  } ], [ "DR", "DVREAL", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), vm.$("YPTR"), vm.$("AERROR"), vm.$("ARTN") ];
  } ], [ "EXR", "EXREAL", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), vm.$("YPTR"), vm.$("AERROR"), vm.$("ARTN") ];
  } ], [ "MR", "MPREAL", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), vm.$("YPTR"), vm.$("AERROR"), vm.$("ARTN") ];
  } ], [ "SR", "SBREAL", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), vm.$("YPTR"), vm.$("AERROR"), vm.$("ARTN") ];
  } ], [ "REQ", "RCOMP", function () {
    return [ vm.$("XPTR"), vm.$("YPTR"), vm.$("FAIL"), vm.$("RETNUL"), vm.$("FAIL") ];
  } ], [ "RGE", "RCOMP", function () {
    return [ vm.$("XPTR"), vm.$("YPTR"), vm.$("RETNUL"), vm.$("RETNUL"), vm.$("FAIL") ];
  } ], [ "RGT", "RCOMP", function () {
    return [ vm.$("XPTR"), vm.$("YPTR"), vm.$("RETNUL"), vm.$("FAIL"), vm.$("FAIL") ];
  } ], [ "RLE", "RCOMP", function () {
    return [ vm.$("XPTR"), vm.$("YPTR"), vm.$("FAIL"), vm.$("RETNUL"), vm.$("RETNUL") ];
  } ], [ "RLT", "RCOMP", function () {
    return [ vm.$("XPTR"), vm.$("YPTR"), vm.$("FAIL"), vm.$("FAIL"), vm.$("RETNUL") ];
  } ], [ "RNE", "RCOMP", function () {
    return [ vm.$("XPTR"), vm.$("YPTR"), vm.$("RETNUL"), vm.$("FAIL"), vm.$("RETNUL") ];
  } ], [ "RM", "DIVIDE", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), vm.$("YPTR"), vm.$("AERROR") ];
  } ], [ null, "MULT", function () {
    return [ vm.$("WPTR"), vm.$("ZPTR"), vm.$("YPTR") ];
  } ], [ null, "SUBTRT", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), vm.$("WPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARTN") ];
  } ], [ "INTGER", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("ARGVAL"), null, vm.$("FAIL") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("I"), null, vm.$("RETNUL") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("S"), vm.$("FAIL") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "SPCINT", function () {
    return [ vm.$("XPTR"), vm.$("XSP"), vm.$("FAIL"), vm.$("RETNUL") ];
  } ], [ "MNS", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("ARGVAL"), null, vm.$("FAIL") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("I"), null, vm.$("MNSM") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("S"), null, vm.$("MNSV") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("R"), vm.$("INTR1"), vm.$("MNSR") ];
  } ], [ "MNSM", "MNSINT", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), vm.$("AERROR"), vm.$("ARTN") ];
  } ], [ "MNSV", "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "SPCINT", function () {
    return [ vm.$("XPTR"), vm.$("XSP"), null, vm.$("MNSM") ];
  } ], [ null, "SPREAL", function () {
    return [ vm.$("XPTR"), vm.$("XSP"), vm.$("INTR1") ];
  } ], [ "MNSR", "MNREAL", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARTN") ];
  } ], [ "PLS", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("ARGVAL"), null, vm.$("FAIL") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("ZPTR"), vm.$("I"), null, vm.$("ARTN") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("ZPTR"), vm.$("S"), null, vm.$("PLSV") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("ZPTR"), vm.$("R"), vm.$("INTR1"), vm.$("ARTN") ];
  } ], [ "PLSV", "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("ZPTR") ];
  } ], [ null, "SPCINT", function () {
    return [ vm.$("ZPTR"), vm.$("XSP"), null, vm.$("ARTN") ];
  } ], [ null, "SPREAL", function () {
    return [ vm.$("ZPTR"), vm.$("XSP"), vm.$("INTR1"), vm.$("ARTN") ];
  } ], [ null, "TITLE", function () {
    return [ "Pattern-valued Functions and Operations" ];
  } ], [ "ANY", "PROC", function () {
    return [ null ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("ANYCCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("CHARZ") ];
  } ], [ "BREAK", "PROC", function () {
    return [ vm.$("ANY") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("BRKCCL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("ZEROCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ABNSND") ];
  } ], [ "NOTANY", "PROC", function () {
    return [ vm.$("ANY") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("NNYCCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("CHARZ") ];
  } ], [ "SPAN", "PROC", function () {
    return [ vm.$("ANY") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("SPNCCL") ];
  } ], [ "CHARZ", "PUSH", function () {
    return [ vm.$("CHARCL") ];
  } ], [ "ABNSND", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("ARGVAL"), null, vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("ZCL"), vm.$("YCL") ] ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("S"), null, vm.$("PATNOD") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("E"), null, vm.$("PATNOD") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("I"), vm.$("INTR1") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GNVARI"), vm.$("XPTR") ];
  } ], [ "PATNOD", "DEQL", function () {
    return [ vm.$("XPTR"), vm.$("NULVCL"), null, vm.$("NONAME") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("LNODSZ") ];
  } ], [ null, "MAKNOD", function () {
    return [ vm.$("ZPTR"), vm.$("TPTR"), vm.$("ZCL"), vm.$("ZEROCL"), vm.$("YCL"), vm.$("XPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTZPTR") ];
  } ], [ "LEN", "PROC", function () {
    return [ vm.$("ANY") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("LNTHCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("LPRTND") ];
  } ], [ "POS", "PROC", function () {
    return [ vm.$("ANY") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("POSICL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("LPRTND") ];
  } ], [ "RPOS", "PROC", function () {
    return [ vm.$("ANY") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("RPSICL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("LPRTND") ];
  } ], [ "RTAB", "PROC", function () {
    return [ vm.$("ANY") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("RTBCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("LPRTND") ];
  } ], [ "TAB", "PROC", function () {
    return [ vm.$("ANY") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("TBCL") ];
  } ], [ "LPRTND", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("ARGVAL"), null, vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ vm.$("YCL") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ZCL"), vm.$("ZEROCL") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("I"), null, vm.$("LPRTNI") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("E"), null, vm.$("PATNOD") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("S"), vm.$("INTR1") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("ZSP"), vm.$("XPTR") ];
  } ], [ null, "SPCINT", function () {
    return [ vm.$("XPTR"), vm.$("ZSP"), vm.$("INTR1") ];
  } ], [ "LPRTNI", "ACOMPC", function () {
    return [ vm.$("XPTR"), 0, null, null, vm.$("LENERR") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("YCL"), vm.$("LNTHCL"), vm.$("PATNOD") ];
  } ], [ null, "MOVA", function () {
    return [ vm.$("ZCL"), vm.$("XPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("PATNOD") ];
  } ], [ "ARBNO", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("PATVAL"), null, vm.$("FAIL") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("P"), null, vm.$("ARBP") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("S"), vm.$("INTR1") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("TSP"), vm.$("XPTR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("TMVAL"), vm.$("TSP") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("LNODSZ") ];
  } ], [ null, "MAKNOD", function () {
    return [ vm.$("XPTR"), vm.$("TPTR"), vm.$("TMVAL"), vm.$("ZEROCL"), vm.$("CHRCL"), vm.$("XPTR") ];
  } ], [ "ARBP", "GETSIZ", function () {
    return [ vm.$("XSIZ"), vm.$("XPTR") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("TSIZ"), vm.$("XSIZ"), vm.$("ARBSIZ") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("TSIZ"), vm.$("P") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("TSIZ") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ZPTR"), vm.$("TPTR") ];
  } ], [ null, "GETSIZ", function () {
    return [ vm.$("TSIZ"), vm.$("ARHEAD") ];
  } ], [ null, "CPYPAT", function () {
    return [ vm.$("TPTR"), vm.$("ARHEAD"), vm.$("ZEROCL"), vm.$("ZEROCL"), vm.$("ZEROCL"), vm.$("TSIZ") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("ZSIZ"), vm.$("XSIZ"), vm.$("TSIZ") ];
  } ], [ null, "CPYPAT", function () {
    return [ vm.$("TPTR"), vm.$("XPTR"), vm.$("ZEROCL"), vm.$("TSIZ"), vm.$("ZSIZ"), vm.$("XSIZ") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("TSIZ"), vm.$("NODSIZ"), vm.$("NODSIZ") ];
  } ], [ null, "CPYPAT", function () {
    return [ vm.$("TPTR"), vm.$("ARTAIL"), vm.$("ZEROCL"), vm.$("ZSIZ"), vm.$("ZEROCL"), vm.$("TSIZ") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("ZSIZ"), vm.$("TSIZ"), vm.$("ZSIZ") ];
  } ], [ null, "CPYPAT", function () {
    return [ vm.$("TPTR"), vm.$("ARBACK"), vm.$("ZEROCL"), vm.$("ZSIZ"), vm.$("TSIZ"), vm.$("TSIZ") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTZPTR") ];
  } ], [ "ATOP", "PROC", function () {
    return [ null ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("OCICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("YPTR"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "TESTF", function () {
    return [ vm.$("YPTR"), vm.$("FNC"), vm.$("ATOP1") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("INVOKE"), vm.$("YPTR") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("YPTR"), vm.$("E"), vm.$("NEMO") ];
  } ], [ "ATOP1", "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("LNODSZ") ];
  } ], [ null, "MAKNOD", function () {
    return [ vm.$("ZPTR"), vm.$("TPTR"), vm.$("ZEROCL"), vm.$("ZEROCL"), vm.$("ATOPCL"), vm.$("YPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTZPTR") ];
  } ], [ "NAM", "PROC", function () {
    return [ null ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("ENMECL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("NAM5") ];
  } ], [ "DOL", "PROC", function () {
    return [ vm.$("NAM") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("ENMICL") ];
  } ], [ "NAM5", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("PATVAL"), null, vm.$("FAIL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("OCICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("YPTR"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "TESTF", function () {
    return [ vm.$("YPTR"), vm.$("FNC"), null, vm.$("NAMC2") ];
  } ], [ "NAM3", "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("S"), null, vm.$("NAMV") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("P"), vm.$("INTR1"), vm.$("NAMP") ];
  } ], [ "NAMC2", "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("INVOKE"), vm.$("YPTR") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("YPTR"), vm.$("E"), vm.$("NEMO") ];
  } ], [ "NAM4", "POP", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("NAM3") ];
  } ], [ "NAMV", "LOCSP", function () {
    return [ vm.$("TSP"), vm.$("XPTR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("TMVAL"), vm.$("TSP") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("LNODSZ") ];
  } ], [ null, "MAKNOD", function () {
    return [ vm.$("XPTR"), vm.$("TPTR"), vm.$("TMVAL"), vm.$("ZEROCL"), vm.$("CHRCL"), vm.$("XPTR") ];
  } ], [ "NAMP", "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("SNODSZ") ];
  } ], [ null, "MAKNOD", function () {
    return [ vm.$("WPTR"), vm.$("TPTR"), vm.$("ZEROCL"), vm.$("ZEROCL"), vm.$("NMECL") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("LNODSZ") ];
  } ], [ null, "POP", function () {
    return [ vm.$("TVAL") ];
  } ], [ null, "MAKNOD", function () {
    return [ vm.$("YPTR"), vm.$("TPTR"), vm.$("ZEROCL"), vm.$("ZEROCL"), vm.$("TVAL"), vm.$("YPTR") ];
  } ], [ null, "GETSIZ", function () {
    return [ vm.$("XSIZ"), vm.$("XPTR") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("YSIZ"), vm.$("XSIZ"), vm.$("NODSIZ") ];
  } ], [ null, "GETSIZ", function () {
    return [ vm.$("TSIZ"), vm.$("YPTR") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("ZSIZ"), vm.$("YSIZ"), vm.$("TSIZ") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("ZSIZ"), vm.$("P") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("ZSIZ") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ZPTR"), vm.$("TPTR") ];
  } ], [ null, "LVALUE", function () {
    return [ vm.$("TVAL"), vm.$("XPTR") ];
  } ], [ null, "CPYPAT", function () {
    return [ vm.$("TPTR"), vm.$("WPTR"), vm.$("TVAL"), vm.$("ZEROCL"), vm.$("NODSIZ"), vm.$("NODSIZ") ];
  } ], [ null, "CPYPAT", function () {
    return [ vm.$("TPTR"), vm.$("XPTR"), vm.$("ZEROCL"), vm.$("NODSIZ"), vm.$("YSIZ"), vm.$("XSIZ") ];
  } ], [ null, "CPYPAT", function () {
    return [ vm.$("TPTR"), vm.$("YPTR"), vm.$("ZEROCL"), vm.$("YSIZ"), vm.$("ZEROCL"), vm.$("TSIZ") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTZPTR") ];
  } ], [ "OR", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("PATVAL"), null, vm.$("FAIL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("PATVAL"), null, vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("DTCL"), vm.$("XPTR") ];
  } ], [ null, "MOVV", function () {
    return [ vm.$("DTCL"), vm.$("YPTR") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("VVDTP"), null, vm.$("ORVV") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("VPDTP"), null, vm.$("ORVP") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("PVDTP"), null, vm.$("ORPV") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("PPDTP"), vm.$("INTR1"), vm.$("ORPP") ];
  } ], [ "ORVV", "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("TMVAL"), vm.$("XSP") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("LNODSZ") ];
  } ], [ null, "MAKNOD", function () {
    return [ vm.$("XPTR"), vm.$("TPTR"), vm.$("TMVAL"), vm.$("ZEROCL"), vm.$("CHRCL"), vm.$("XPTR") ];
  } ], [ "ORPV", "LOCSP", function () {
    return [ vm.$("YSP"), vm.$("YPTR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("TMVAL"), vm.$("YSP") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("LNODSZ") ];
  } ], [ null, "MAKNOD", function () {
    return [ vm.$("YPTR"), vm.$("TPTR"), vm.$("TMVAL"), vm.$("ZEROCL"), vm.$("CHRCL"), vm.$("YPTR") ];
  } ], [ "ORPP", "GETSIZ", function () {
    return [ vm.$("XSIZ"), vm.$("XPTR") ];
  } ], [ null, "GETSIZ", function () {
    return [ vm.$("YSIZ"), vm.$("YPTR") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("TSIZ"), vm.$("XSIZ"), vm.$("YSIZ") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("TSIZ"), vm.$("P") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("TSIZ") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ZPTR"), vm.$("TPTR") ];
  } ], [ null, "CPYPAT", function () {
    return [ vm.$("TPTR"), vm.$("XPTR"), vm.$("ZEROCL"), vm.$("ZEROCL"), vm.$("ZEROCL"), vm.$("XSIZ") ];
  } ], [ null, "CPYPAT", function () {
    return [ vm.$("TPTR"), vm.$("YPTR"), vm.$("ZEROCL"), vm.$("XSIZ"), vm.$("ZEROCL"), vm.$("YSIZ") ];
  } ], [ null, "LINKOR", function () {
    return [ vm.$("ZPTR"), vm.$("XSIZ") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTZPTR") ];
  } ], [ "ORVP", "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("TMVAL"), vm.$("XSP") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("LNODSZ") ];
  } ], [ null, "MAKNOD", function () {
    return [ vm.$("XPTR"), vm.$("TPTR"), vm.$("TMVAL"), vm.$("ZEROCL"), vm.$("CHRCL"), vm.$("XPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ORPP") ];
  } ], [ null, "TITLE", function () {
    return [ "Pattern Matching Procedures" ];
  } ], [ "SCAN", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("ARGVAL"), null, vm.$("FAIL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("PATVAL"), null, vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("DTCL"), vm.$("XPTR") ];
  } ], [ null, "MOVV", function () {
    return [ vm.$("DTCL"), vm.$("YPTR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("SCNCL"), 1 ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("VVDTP"), null, vm.$("SCANVV") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("VPDTP"), null, vm.$("SCANVP") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("IVDTP"), null, vm.$("SCANIV") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("RVDTP"), null, vm.$("SCANRV") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("RPDTP"), null, vm.$("SCANRP") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("IPDTP"), vm.$("INTR1"), vm.$("SCANIP") ];
  } ], [ "SCANVV", "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("YSP"), vm.$("YPTR") ];
  } ], [ "SCANVB", "SUBSP", function () {
    return [ vm.$("TSP"), vm.$("YSP"), vm.$("XSP"), vm.$("FAIL") ];
  } ], [ null, "LEXCMP", function () {
    return [ vm.$("TSP"), vm.$("YSP"), null, vm.$("RETNUL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("ANCCL"), 0, vm.$("FAIL") ];
  } ], [ null, "FSHRTN", function () {
    return [ vm.$("XSP"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCANVB") ];
  } ], [ "SCANIV", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GNVARI"), vm.$("XPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCANVV") ];
  } ], [ "SCANVP", "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("SCNR"), null, [ vm.$("FAIL"), null, vm.$("FAIL") ] ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("NMD"), null, [ vm.$("FAIL"), vm.$("RTN2") ] ];
  } ], [ "SCANIP", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GNVARI"), vm.$("XPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCANVP") ];
  } ], [ "SCANRV", "REALST", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), vm.$("XSPPTR"), vm.$("SCANVV") ];
  } ], [ "SCANRP", "REALST", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), vm.$("XSPPTR"), vm.$("SCANVP") ];
  } ], [ "SJSR", "PROC", function () {
    return [ null ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("OCICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("WPTR"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "TESTF", function () {
    return [ vm.$("WPTR"), vm.$("FNC"), null, vm.$("SJSRC1") ];
  } ], [ "SJSR1", "AEQLC", function () {
    return [ vm.$("INSW"), 0, null, vm.$("SJSR1A") ];
  } ], [ null, "LOCAPV", function () {
    return [ vm.$("ZPTR"), vm.$("INATL"), vm.$("WPTR"), vm.$("SJSR1A") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("ZPTR"), vm.$("DESCR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("PUTIN"), [ vm.$("ZPTR"), vm.$("WPTR") ], [ vm.$("FAIL"), vm.$("SJSR1B") ] ];
  } ], [ "SJSR1A", "GETDC", function () {
    return [ vm.$("XPTR"), vm.$("WPTR"), vm.$("DESCR") ];
  } ], [ "SJSR1B", "PUSH", function () {
    return [ [ vm.$("WPTR"), vm.$("XPTR") ] ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("PATVAL"), null, vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("DTCL"), vm.$("XPTR") ];
  } ], [ null, "MOVV", function () {
    return [ vm.$("DTCL"), vm.$("YPTR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("SCNCL"), 1 ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("VVDTP"), null, vm.$("SJSSVV") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("VPDTP"), null, vm.$("SJSSVP") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("IVDTP"), null, vm.$("SJSSIV") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("RVDTP"), null, vm.$("SJSSRV") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("RPDTP"), null, vm.$("SJSSRP") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("IPDTP"), vm.$("INTR1"), vm.$("SJSSIP") ];
  } ], [ "SJSRC1", "RCALL", function () {
    return [ vm.$("WPTR"), vm.$("INVOKE"), [ vm.$("WPTR") ], [ vm.$("FAIL"), vm.$("SJSR1"), vm.$("NEMO") ] ];
  } ], [ "SJSSVP", "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("SCNR"), null, [ vm.$("FAIL"), null, vm.$("FAIL") ] ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("NAMGCL"), 1 ];
  } ], [ null, "REMSP", function () {
    return [ vm.$("TAILSP"), vm.$("XSP"), vm.$("TXSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SJSS1") ];
  } ], [ "SJSSIP", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GNVARI"), vm.$("XPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SJSSVP") ];
  } ], [ "SJSSIV", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GNVARI"), vm.$("XPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SJSSVV") ];
  } ], [ "SJSSRV", "REALST", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), vm.$("XSPPTR"), vm.$("SJSSVV") ];
  } ], [ "SJSSRP", "REALST", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), vm.$("XSPPTR"), vm.$("SJSSVP") ];
  } ], [ "SJVVON", "AEQLC", function () {
    return [ vm.$("ANCCL"), 0, vm.$("FAIL") ];
  } ], [ null, "ADDLG", function () {
    return [ vm.$("HEADSP"), vm.$("ONECL") ];
  } ], [ null, "FSHRTN", function () {
    return [ vm.$("XSP"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SJSSV2") ];
  } ], [ "SJSSVV", "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("YSP"), vm.$("YPTR") ];
  } ], [ null, "SETSP", function () {
    return [ vm.$("HEADSP"), vm.$("XSP") ];
  } ], [ null, "SETLC", function () {
    return [ vm.$("HEADSP"), 0 ];
  } ], [ "SJSSV2", "SUBSP", function () {
    return [ vm.$("TSP"), vm.$("YSP"), vm.$("XSP"), vm.$("FAIL") ];
  } ], [ null, "LEXCMP", function () {
    return [ vm.$("TSP"), vm.$("YSP"), vm.$("SJVVON"), null, vm.$("SJVVON") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("NAMGCL"), 0 ];
  } ], [ null, "REMSP", function () {
    return [ vm.$("TAILSP"), vm.$("XSP"), vm.$("TSP") ];
  } ], [ "SJSS1", "SPUSH", function () {
    return [ [ vm.$("TAILSP"), vm.$("HEADSP") ] ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("NAMGCL"), 0, null, vm.$("SJSS1A") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("NMD"), null, vm.$("FAIL") ];
  } ], [ "SJSS1A", "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("ARGVAL"), null, vm.$("FAIL") ];
  } ], [ null, "SPOP", function () {
    return [ [ vm.$("HEADSP"), vm.$("TAILSP") ] ];
  } ], [ null, "POP", function () {
    return [ vm.$("WPTR") ];
  } ], [ null, "LEQLC", function () {
    return [ vm.$("HEADSP"), 0, vm.$("SJSSDT") ];
  } ], [ null, "LEQLC", function () {
    return [ vm.$("TAILSP"), 0, null, vm.$("SJSRV1") ];
  } ], [ "SJSSDT", "VEQLC", function () {
    return [ vm.$("ZPTR"), vm.$("S"), null, vm.$("SJSRV") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("ZPTR"), vm.$("P"), null, vm.$("SJSRP") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("ZPTR"), vm.$("I"), null, vm.$("SJSRI") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("ZPTR"), vm.$("R"), null, vm.$("SJSRR") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("ZPTR"), vm.$("E"), vm.$("INTR1") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("STARSZ") ];
  } ], [ null, "MOVBLK", function () {
    return [ vm.$("TPTR"), vm.$("STRPAT"), vm.$("STARSZ") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("TPTR"), 4 * vm.$("DESCR"), vm.$("ZPTR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ZPTR"), vm.$("TPTR") ];
  } ], [ "SJSRP", "SETSP", function () {
    return [ vm.$("XSP"), vm.$("HEADSP") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), [ vm.$("XSPPTR") ] ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("TMVAL"), vm.$("HEADSP") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("LNODSZ") ];
  } ], [ null, "MAKNOD", function () {
    return [ vm.$("XPTR"), vm.$("TPTR"), vm.$("TMVAL"), vm.$("ZEROCL"), vm.$("CHRCL"), vm.$("XPTR") ];
  } ], [ null, "SETSP", function () {
    return [ vm.$("YSP"), vm.$("TAILSP") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("GENVAR"), [ vm.$("YSPPTR") ] ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("TMVAL"), vm.$("TAILSP") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("LNODSZ") ];
  } ], [ null, "MAKNOD", function () {
    return [ vm.$("YPTR"), vm.$("TPTR"), vm.$("TMVAL"), vm.$("ZEROCL"), vm.$("CHRCL"), vm.$("YPTR") ];
  } ], [ null, "GETSIZ", function () {
    return [ vm.$("XSIZ"), vm.$("XPTR") ];
  } ], [ null, "GETSIZ", function () {
    return [ vm.$("YSIZ"), vm.$("YPTR") ];
  } ], [ null, "GETSIZ", function () {
    return [ vm.$("ZSIZ"), vm.$("ZPTR") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("TSIZ"), vm.$("XSIZ"), vm.$("ZSIZ") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("TSIZ"), vm.$("TSIZ"), vm.$("YSIZ") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("TSIZ"), vm.$("P") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("TSIZ") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("VVAL"), vm.$("TPTR") ];
  } ], [ null, "LVALUE", function () {
    return [ vm.$("TVAL"), vm.$("ZPTR") ];
  } ], [ null, "CPYPAT", function () {
    return [ vm.$("TPTR"), vm.$("XPTR"), vm.$("TVAL"), vm.$("ZEROCL"), vm.$("XSIZ"), vm.$("XSIZ") ];
  } ], [ null, "LVALUE", function () {
    return [ vm.$("TVAL"), vm.$("YPTR") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("TSIZ"), vm.$("XSIZ"), vm.$("ZSIZ") ];
  } ], [ null, "CPYPAT", function () {
    return [ vm.$("TPTR"), vm.$("ZPTR"), vm.$("TVAL"), vm.$("XSIZ"), vm.$("TSIZ"), vm.$("ZSIZ") ];
  } ], [ null, "CPYPAT", function () {
    return [ vm.$("TPTR"), vm.$("YPTR"), vm.$("ZEROCL"), vm.$("TSIZ"), vm.$("ZEROCL"), vm.$("YSIZ") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ZPTR"), vm.$("VVAL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SJSRV1") ];
  } ], [ "SJSRV", "LOCSP", function () {
    return [ vm.$("ZSP"), vm.$("ZPTR") ];
  } ], [ "SJSRS", "GETLG", function () {
    return [ vm.$("XPTR"), vm.$("TAILSP") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("YPTR"), vm.$("HEADSP") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("ZPTR"), vm.$("ZSP") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), vm.$("YPTR") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), vm.$("ZPTR") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("XPTR"), vm.$("MLENCL"), vm.$("INTR8") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("CONVAR"), [ vm.$("XPTR") ] ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("TSP"), vm.$("ZPTR") ];
  } ], [ null, "SETLC", function () {
    return [ vm.$("TSP"), 0 ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("TSP"), vm.$("HEADSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("TSP"), vm.$("ZSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("TSP"), vm.$("TAILSP") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("GNVARS"), vm.$("XPTR") ];
  } ], [ "SJSRV1", "PUTDC", function () {
    return [ vm.$("WPTR"), vm.$("DESCR"), vm.$("ZPTR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("OUTSW"), 0, null, vm.$("SJSRV2") ];
  } ], [ null, "LOCAPV", function () {
    return [ vm.$("YPTR"), vm.$("OUTATL"), vm.$("WPTR"), vm.$("SJSRV2") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("YPTR"), vm.$("YPTR"), vm.$("DESCR") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("PUTOUT"), [ vm.$("YPTR"), vm.$("ZPTR") ] ];
  } ], [ "SJSRV2", "ACOMPC", function () {
    return [ vm.$("TRAPCL"), 0, null, vm.$("RTN3"), vm.$("RTN3") ];
  } ], [ null, "LOCAPT", function () {
    return [ vm.$("ATPTR"), vm.$("TVALL"), vm.$("WPTR"), vm.$("RTN3") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TRPHND"), vm.$("ATPTR"), vm.$("RTN3") ];
  } ], [ "SJSRI", "INTSPC", function () {
    return [ vm.$("ZSP"), vm.$("ZPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SJSRS") ];
  } ], [ "SJSRR", "REALST", function () {
    return [ vm.$("ZSP"), vm.$("ZPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SJSRS") ];
  } ], [ "SCNR", "PROC", function () {
    return [ null ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("MAXLEN"), vm.$("XSP") ];
  } ], [ null, "LVALUE", function () {
    return [ vm.$("YSIZ"), vm.$("YPTR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("FULLCL"), 0, vm.$("SCNR1") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("YSIZ"), vm.$("MAXLEN"), vm.$("FAIL") ];
  } ], [ "SCNR1", "SETSP", function () {
    return [ vm.$("TXSP"), vm.$("XSP") ];
  } ], [ null, "SETLC", function () {
    return [ vm.$("TXSP"), 0 ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("PDLPTR"), vm.$("PDLHED") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("NAMICL"), vm.$("NHEDCL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("ANCCL"), 0, vm.$("SCNR3") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("FULLCL"), 0, null, vm.$("SCNR4") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YSIZ"), vm.$("MAXLEN") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCNR5") ];
  } ], [ "SCNR4", "SUBTRT", function () {
    return [ vm.$("YSIZ"), vm.$("MAXLEN"), vm.$("YSIZ") ];
  } ], [ "SCNR5", "SUM", function () {
    return [ vm.$("YSIZ"), vm.$("YSIZ"), vm.$("CHARCL") ];
  } ], [ "SCNR2", "PUSH", function () {
    return [ [ vm.$("YPTR"), vm.$("YSIZ") ] ];
  } ], [ null, "SETSP", function () {
    return [ vm.$("HEADSP"), vm.$("TXSP") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("PDLPTR"), 3 * vm.$("DESCR") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("PDLPTR"), vm.$("PDLEND"), vm.$("INTR31") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("LENFCL"), 1 ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), vm.$("DESCR"), vm.$("SCONCL") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("TMVAL"), vm.$("TXSP") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), 2 * vm.$("DESCR"), vm.$("TMVAL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), 3 * vm.$("DESCR"), vm.$("LENFCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCIN1") ];
  } ], [ "SCNR3", "INCRA", function () {
    return [ vm.$("PDLPTR"), 3 * vm.$("DESCR") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("PDLPTR"), vm.$("PDLEND"), vm.$("INTR31") ];
  } ], [ null, "SETLC", function () {
    return [ vm.$("HEADSP"), 0 ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), vm.$("DESCR"), vm.$("SCFLCL") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("TMVAL"), vm.$("TXSP") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), 2 * vm.$("DESCR"), vm.$("TMVAL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), 3 * vm.$("DESCR"), vm.$("LENFCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCIN1") ];
  } ], [ "SCIN", "PROC", function () {
    return [ vm.$("SCNR") ];
  } ], [ "SCIN1", "MOVD", function () {
    return [ vm.$("PATBCL"), vm.$("YPTR") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("PATICL"), 0 ];
  } ], [ "SCIN2", "SETAC", function () {
    return [ vm.$("LENFCL"), 1 ];
  } ], [ "SCIN3", "INCRA", function () {
    return [ vm.$("PATICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("ZCL"), vm.$("PATBCL"), vm.$("PATICL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("PATICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("XCL"), vm.$("PATBCL"), vm.$("PATICL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("PATICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("YCL"), vm.$("PATBCL"), vm.$("PATICL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("PDLPTR"), 3 * vm.$("DESCR") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("PDLPTR"), vm.$("PDLEND"), vm.$("INTR31") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), vm.$("DESCR"), vm.$("XCL") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("TMVAL"), vm.$("TXSP") ];
  } ], [ null, "MOVV", function () {
    return [ vm.$("TMVAL"), vm.$("YCL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), 2 * vm.$("DESCR"), vm.$("TMVAL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), 3 * vm.$("DESCR"), vm.$("LENFCL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("FULLCL"), 0, vm.$("SCIN4") ];
  } ], [ null, "CHKVAL", function () {
    return [ vm.$("MAXLEN"), vm.$("YCL"), vm.$("TXSP"), vm.$("SALT1") ];
  } ], [ "SCIN4", "BRANIC", function () {
    return [ vm.$("ZCL"), 0 ];
  } ], [ "SALF", "PROC", function () {
    return [ vm.$("SCNR") ];
  } ], [ "SALF1", "SETAC", function () {
    return [ vm.$("LENFCL"), 0 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SALT2") ];
  } ], [ "SALT", "PROC", function () {
    return [ vm.$("SCNR") ];
  } ], [ "SALT1", "GETDC", function () {
    return [ vm.$("LENFCL"), vm.$("PDLPTR"), 3 * vm.$("DESCR") ];
  } ], [ "SALT2", "GETDC", function () {
    return [ vm.$("XCL"), vm.$("PDLPTR"), vm.$("DESCR") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("YCL"), vm.$("PDLPTR"), 2 * vm.$("DESCR") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("PDLPTR"), 3 * vm.$("DESCR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("PATICL"), vm.$("XCL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("PATICL"), 0, null, vm.$("SALT3") ];
  } ], [ null, "PUTLG", function () {
    return [ vm.$("TXSP"), vm.$("YCL") ];
  } ], [ null, "TESTF", function () {
    return [ vm.$("PATICL"), vm.$("FNC"), vm.$("SCIN3") ];
  } ], [ null, "BRANIC", function () {
    return [ vm.$("PATICL"), 0 ];
  } ], [ "SALT3", "AEQLC", function () {
    return [ vm.$("LENFCL"), 0, vm.$("SALT1") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SALF1") ];
  } ], [ "SCOK", "PROC", function () {
    return [ vm.$("SCNR") ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("PATICL"), vm.$("XCL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("PATICL"), 0, vm.$("SCIN2"), vm.$("RTN2") ];
  } ], [ "SCON", "PROC", function () {
    return [ vm.$("SCNR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("FULLCL"), 0, vm.$("SCON1") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("LENFCL"), 0, vm.$("FAIL") ];
  } ], [ "SCON1", "POP", function () {
    return [ [ vm.$("YSIZ"), vm.$("YPTR") ] ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("YSIZ"), 1 ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("YSIZ"), 0, null, vm.$("FAIL"), vm.$("INTR13") ];
  } ], [ null, "ADDLG", function () {
    return [ vm.$("TXSP"), vm.$("ONECL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCNR2") ];
  } ], [ "UNSC", "PROC", function () {
    return [ vm.$("SCNR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("PATBCL"), vm.$("YPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SALT3") ];
  } ], [ "ANYC", "PROC", function () {
    return [ null ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 1 ];
  } ], [ "ABNS", "INCRA", function () {
    return [ vm.$("PATICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("XPTR"), vm.$("PATBCL"), vm.$("PATICL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("SCL") ];
  } ], [ "ABNS1", "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("S"), null, vm.$("ABNSV") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("E"), null, vm.$("ABNSE") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("I"), null, vm.$("ABNSI") ];
  } ], [ null, "POP", function () {
    return [ vm.$("SCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCDTER") ];
  } ], [ "ABNSE", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("EXPVAL"), vm.$("XPTR"), [ vm.$("ABNSF"), vm.$("ABNS1") ] ];
  } ], [ "ABNSF", "POP", function () {
    return [ vm.$("SCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("TSALF") ];
  } ], [ "ABNSI", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GNVARI"), vm.$("XPTR") ];
  } ], [ "ABNSV", "POP", function () {
    return [ vm.$("SCL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("XPTR"), 0, null, vm.$("SCNAME") ];
  } ], [ null, "SELBRA", function () {
    return [ vm.$("SCL"), [ null, vm.$("BRKV"), vm.$("NNYV"), vm.$("SPNV") ] ];
  } ], [ "ANYV", "DEQL", function () {
    return [ vm.$("XPTR"), vm.$("TBLCS"), vm.$("ANYC2") ];
  } ], [ null, "AEQL", function () {
    return [ vm.$("TBLFNC"), vm.$("ANYCCL"), null, vm.$("ANYC3") ];
  } ], [ "ANYC2", "CLERTB", function () {
    return [ vm.$("SNABTB"), vm.$("ERROR") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("YSP"), vm.$("XPTR") ];
  } ], [ null, "PLUGTB", function () {
    return [ vm.$("SNABTB"), vm.$("STOP"), vm.$("YSP") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("TBLCS"), vm.$("XPTR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("TBLFNC"), vm.$("ANYCCL") ];
  } ], [ "ANYC3", "SETSP", function () {
    return [ vm.$("VSP"), vm.$("XSP") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("FULLCL"), 0, vm.$("ANYC4") ];
  } ], [ null, "PUTLG", function () {
    return [ vm.$("VSP"), vm.$("MAXLEN") ];
  } ], [ null, "LCOMP", function () {
    return [ vm.$("VSP"), vm.$("TXSP"), null, null, vm.$("TSALT") ];
  } ], [ null, "CHKVAL", function () {
    return [ vm.$("MAXLEN"), vm.$("ZEROCL"), vm.$("XSP"), null, vm.$("ANYC4"), vm.$("ANYC4") ];
  } ], [ null, "ADDLG", function () {
    return [ vm.$("VSP"), vm.$("ONECL") ];
  } ], [ "ANYC4", "REMSP", function () {
    return [ vm.$("YSP"), vm.$("VSP"), vm.$("TXSP") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("ZSP"), vm.$("YSP"), vm.$("SNABTB"), vm.$("TSALF"), vm.$("TSALT") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("XPTR"), vm.$("ZSP") ];
  } ], [ null, "ADDLG", function () {
    return [ vm.$("TXSP"), vm.$("XPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCOK"), vm.$("SCNR") ];
  } ], [ "BRKC", "PROC", function () {
    return [ vm.$("ANYC") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 2 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ABNS") ];
  } ], [ "BRKV", "DEQL", function () {
    return [ vm.$("XPTR"), vm.$("TBLCS"), vm.$("BRKC2") ];
  } ], [ null, "AEQL", function () {
    return [ vm.$("TBLFNC"), vm.$("BRKCCL"), null, vm.$("ANYC3") ];
  } ], [ "BRKC2", "CLERTB", function () {
    return [ vm.$("SNABTB"), vm.$("CONTIN") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("YSP"), vm.$("XPTR") ];
  } ], [ null, "PLUGTB", function () {
    return [ vm.$("SNABTB"), vm.$("STOPSH"), vm.$("YSP") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("TBLCS"), vm.$("XPTR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("TBLFNC"), vm.$("BRKCCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ANYC3") ];
  } ], [ "NNYC", "PROC", function () {
    return [ vm.$("ANYC") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 3 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ABNS") ];
  } ], [ "NNYV", "DEQL", function () {
    return [ vm.$("XPTR"), vm.$("TBLCS"), vm.$("NNYC2") ];
  } ], [ null, "AEQL", function () {
    return [ vm.$("TBLFNC"), vm.$("NNYCCL"), null, vm.$("ANYC3") ];
  } ], [ "NNYC2", "CLERTB", function () {
    return [ vm.$("SNABTB"), vm.$("STOP") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("YSP"), vm.$("XPTR") ];
  } ], [ null, "PLUGTB", function () {
    return [ vm.$("SNABTB"), vm.$("ERROR"), vm.$("YSP") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("TBLCS"), vm.$("XPTR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("TBLFNC"), vm.$("NNYCCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ANYC3") ];
  } ], [ "SPNC", "PROC", function () {
    return [ vm.$("ANYC") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 4 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ABNS") ];
  } ], [ "SPNV", "DEQL", function () {
    return [ vm.$("XPTR"), vm.$("TBLCS"), vm.$("SPNC2") ];
  } ], [ null, "AEQL", function () {
    return [ vm.$("TBLFNC"), vm.$("SPNCCL"), null, vm.$("SPNC3") ];
  } ], [ "SPNC2", "CLERTB", function () {
    return [ vm.$("SNABTB"), vm.$("STOPSH") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("YSP"), vm.$("XPTR") ];
  } ], [ null, "PLUGTB", function () {
    return [ vm.$("SNABTB"), vm.$("CONTIN"), vm.$("YSP") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("TBLCS"), vm.$("XPTR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("TBLFNC"), vm.$("SPNCCL") ];
  } ], [ "SPNC3", "LCOMP", function () {
    return [ vm.$("XSP"), vm.$("TXSP"), null, vm.$("TSALT"), vm.$("TSALT") ];
  } ], [ null, "REMSP", function () {
    return [ vm.$("YSP"), vm.$("XSP"), vm.$("TXSP") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("ZSP"), vm.$("YSP"), vm.$("SNABTB"), vm.$("TSALF") ];
  } ], [ null, "LEQLC", function () {
    return [ vm.$("ZSP"), 0, null, vm.$("TSALF") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("XPTR"), vm.$("ZSP") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("FULLCL"), 0, vm.$("SPNC5") ];
  } ], [ null, "CHKVAL", function () {
    return [ vm.$("MAXLEN"), vm.$("XPTR"), vm.$("TXSP"), vm.$("TSALT") ];
  } ], [ "SPNC5", "ADDLG", function () {
    return [ vm.$("TXSP"), vm.$("XPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCOK"), vm.$("SCNR") ];
  } ], [ "LNTH", "PROC", function () {
    return [ null ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 1 ];
  } ], [ "LPRRT", "INCRA", function () {
    return [ vm.$("PATICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("XPTR"), vm.$("PATBCL"), vm.$("PATICL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("SCL") ];
  } ], [ "LPRRT1", "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("I"), null, vm.$("LPRRTI") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("E"), null, vm.$("LPRRTE") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("S"), null, vm.$("LPRRTV") ];
  } ], [ null, "POP", function () {
    return [ vm.$("SCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCDTER") ];
  } ], [ "LPRRTE", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("EXPVAL"), vm.$("XPTR"), [ null, vm.$("LPRRT1") ] ];
  } ], [ null, "POP", function () {
    return [ vm.$("SCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("TSALF") ];
  } ], [ "LPRRTV", "LOCSP", function () {
    return [ vm.$("ZSP"), vm.$("XPTR") ];
  } ], [ null, "SPCINT", function () {
    return [ vm.$("XPTR"), vm.$("ZSP"), vm.$("SCDTER") ];
  } ], [ "LPRRTI", "POP", function () {
    return [ vm.$("SCL") ];
  } ], [ null, "SELBRA", function () {
    return [ vm.$("SCL"), [ null, vm.$("POSII"), vm.$("RPSII"), vm.$("RTBI"), vm.$("TBI") ] ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("XPTR"), 0, null, null, vm.$("SCLENR") ];
  } ], [ null, "CHKVAL", function () {
    return [ vm.$("MAXLEN"), vm.$("XPTR"), vm.$("TXSP"), vm.$("TSALT") ];
  } ], [ null, "ADDLG", function () {
    return [ vm.$("TXSP"), vm.$("XPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCOK"), vm.$("SCNR") ];
  } ], [ "POSII", "ACOMPC", function () {
    return [ vm.$("XPTR"), 0, null, null, vm.$("SCLENR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("NVAL"), vm.$("TXSP") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("XPTR"), vm.$("MAXLEN"), vm.$("TSALT") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("XPTR"), vm.$("NVAL"), vm.$("TSALF"), vm.$("TSCOK") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SALT"), vm.$("SCNR") ];
  } ], [ "RPSII", "ACOMPC", function () {
    return [ vm.$("XPTR"), 0, null, null, vm.$("SCLENR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("NVAL"), vm.$("XSP") ];
  } ], [ null, "SUBTRT", function () {
    return [ vm.$("TVAL"), vm.$("NVAL"), vm.$("XPTR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("NVAL"), vm.$("TXSP") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("NVAL"), vm.$("TVAL"), vm.$("TSALT"), vm.$("TSCOK"), vm.$("TSALF") ];
  } ], [ "RTBI", "ACOMPC", function () {
    return [ vm.$("XPTR"), 0, null, null, vm.$("SCLENR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("NVAL"), vm.$("XSP") ];
  } ], [ null, "SUBTRT", function () {
    return [ vm.$("TVAL"), vm.$("NVAL"), vm.$("XPTR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("NVAL"), vm.$("TXSP") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("NVAL"), vm.$("TVAL"), vm.$("TSALT") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("FULLCL"), 0, vm.$("RTBII") ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("NVAL"), vm.$("YCL") ];
  } ], [ null, "SUBTRT", function () {
    return [ vm.$("NVAL"), vm.$("MAXLEN"), vm.$("NVAL") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("NVAL"), vm.$("TVAL"), null, null, vm.$("TSALT") ];
  } ], [ "RTBII", "PUTLG", function () {
    return [ vm.$("TXSP"), vm.$("TVAL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCOK"), vm.$("SCNR") ];
  } ], [ "TBI", "ACOMPC", function () {
    return [ vm.$("XPTR"), 0, null, null, vm.$("SCLENR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("NVAL"), vm.$("TXSP") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("NVAL"), vm.$("XPTR"), vm.$("TSALT") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("XPTR"), vm.$("MAXLEN"), vm.$("TSALT") ];
  } ], [ null, "PUTLG", function () {
    return [ vm.$("TXSP"), vm.$("XPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCOK"), vm.$("SCNR") ];
  } ], [ "POSI", "PROC", function () {
    return [ vm.$("LNTH") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 2 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("LPRRT") ];
  } ], [ "RPSI", "PROC", function () {
    return [ vm.$("LNTH") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 3 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("LPRRT") ];
  } ], [ "RTB", "PROC", function () {
    return [ vm.$("LNTH") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 4 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("LPRRT") ];
  } ], [ "TB", "PROC", function () {
    return [ vm.$("LNTH") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 5 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("LPRRT") ];
  } ], [ "ARBN", "PROC", function () {
    return [ null ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("TMVAL"), vm.$("TXSP") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("TMVAL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCOK"), vm.$("SCNR") ];
  } ], [ "ARBF", "PROC", function () {
    return [ vm.$("ARBN") ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("TMVAL") ] ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ONAR2") ];
  } ], [ "EARB", "PROC", function () {
    return [ vm.$("ARBN") ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("TMVAL") ] ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), vm.$("DESCR"), vm.$("TMVAL") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("TMVAL"), vm.$("TXSP") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), 2 * vm.$("DESCR"), vm.$("TMVAL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), 3 * vm.$("DESCR"), vm.$("ZEROCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCOK"), vm.$("SCNR") ];
  } ], [ "ONAR", "PROC", function () {
    return [ vm.$("ARBN") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("FULLCL"), 0, vm.$("TSCOK") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("TVAL"), vm.$("ZEROCL") ];
  } ], [ null, "GETAC", function () {
    return [ vm.$("TVAL"), vm.$("PDLPTR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("TMVAL"), vm.$("TXSP") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("TVAL"), vm.$("TMVAL"), vm.$("TSCOK"), null, vm.$("TSCOK") ];
  } ], [ "ONAR1", "PUSH", function () {
    return [ vm.$("TVAL") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("PDLPTR"), 6 * vm.$("DESCR") ];
  } ], [ "ONAR2", "AEQLC", function () {
    return [ vm.$("LENFCL"), 0, vm.$("TSALT") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SALF"), vm.$("SCNR") ];
  } ], [ "ONRF", "PROC", function () {
    return [ vm.$("ARBN") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("TVAL"), vm.$("ZEROCL") ];
  } ], [ null, "GETAC", function () {
    return [ vm.$("TVAL"), vm.$("PDLPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ONAR1") ];
  } ], [ "FARB", "PROC", function () {
    return [ null ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("FULLCL"), 0, null, vm.$("FARB2") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("NVAL"), 0 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FARB3") ];
  } ], [ "FARB2", "AEQLC", function () {
    return [ vm.$("LENFCL"), 0, vm.$("FARB1") ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("NVAL"), vm.$("YCL") ];
  } ], [ "FARB3", "GETLG", function () {
    return [ vm.$("TVAL"), vm.$("TXSP") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("TVAL"), vm.$("TVAL"), vm.$("NVAL") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("TVAL"), vm.$("MAXLEN"), vm.$("FARB1"), vm.$("FARB1") ];
  } ], [ null, "ADDLG", function () {
    return [ vm.$("TXSP"), vm.$("ONECL") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("TVAL"), vm.$("TXSP") ];
  } ], [ null, "PUTAC", function () {
    return [ vm.$("PDLPTR"), 2 * vm.$("DESCR"), vm.$("TVAL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCOK"), vm.$("SCNR") ];
  } ], [ "FARB1", "DECRA", function () {
    return [ vm.$("PDLPTR"), 3 * vm.$("DESCR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SALT"), vm.$("SCNR") ];
  } ], [ "ATP", "PROC", function () {
    return [ null ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("PATICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("XPTR"), vm.$("PATBCL"), vm.$("PATICL") ];
  } ], [ "ATP1", "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("E"), null, vm.$("ATPEXN") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("NVAL"), vm.$("TXSP") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("NVAL"), vm.$("I") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("XPTR"), vm.$("DESCR"), vm.$("NVAL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("OUTSW"), 0, null, vm.$("ATP2") ];
  } ], [ null, "LOCAPV", function () {
    return [ vm.$("ZPTR"), vm.$("OUTATL"), vm.$("XPTR"), vm.$("ATP2") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("ZPTR"), vm.$("DESCR") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("PUTOUT"), [ vm.$("ZPTR"), vm.$("NVAL") ] ];
  } ], [ "ATP2", "AEQLC", function () {
    return [ vm.$("TRAPCL"), 0, null, vm.$("TSCOK") ];
  } ], [ null, "LOCAPT", function () {
    return [ vm.$("ATPTR"), vm.$("TVALL"), vm.$("XPTR"), vm.$("TSCOK") ];
  } ], [ null, "PUSH", function () {
    return [ [ vm.$("PATBCL"), vm.$("PATICL"), vm.$("WPTR"), vm.$("XCL"), vm.$("YCL") ] ];
  } ], [ null, "PUSH", function () {
    return [ [ vm.$("MAXLEN"), vm.$("LENFCL"), vm.$("PDLPTR"), vm.$("PDLHED"), vm.$("NAMICL"), vm.$("NHEDCL") ] ];
  } ], [ null, "SPUSH", function () {
    return [ [ vm.$("HEADSP"), vm.$("TSP"), vm.$("TXSP"), vm.$("XSP") ] ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("PDLHED"), vm.$("PDLPTR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("NHEDCL"), vm.$("NAMICL") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TRPHND"), vm.$("ATPTR") ];
  } ], [ null, "SPOP", function () {
    return [ [ vm.$("XSP"), vm.$("TXSP"), vm.$("TSP"), vm.$("HEADSP") ] ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("NHEDCL"), vm.$("NAMICL"), vm.$("PDLHED"), vm.$("PDLPTR"), vm.$("LENFCL"), vm.$("MAXLEN") ] ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("YCL"), vm.$("XCL"), vm.$("WPTR"), vm.$("PATICL"), vm.$("PATBCL") ] ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCOK"), vm.$("SCNR") ];
  } ], [ "ATPEXN", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("EXPEVL"), vm.$("XPTR"), [ vm.$("TSALF"), vm.$("ATP1"), vm.$("SCNEMO") ] ];
  } ], [ "BAL", "PROC", function () {
    return [ null ];
  } ], [ "BALF1", "AEQLC", function () {
    return [ vm.$("FULLCL"), 0, null, vm.$("BALF4") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("NVAL"), 0 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("BALF2") ];
  } ], [ "BALF4", "SETAV", function () {
    return [ vm.$("NVAL"), vm.$("YCL") ];
  } ], [ "BALF2", "GETLG", function () {
    return [ vm.$("TVAL"), vm.$("TXSP") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("TVAL"), vm.$("TVAL"), vm.$("NVAL") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("TVAL"), vm.$("MAXLEN"), vm.$("BAL1"), vm.$("BAL1") ];
  } ], [ null, "SUBTRT", function () {
    return [ vm.$("TVAL"), vm.$("MAXLEN"), vm.$("TVAL") ];
  } ], [ null, "GETBAL", function () {
    return [ vm.$("TXSP"), vm.$("TVAL"), vm.$("BAL1") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("TVAL"), vm.$("TXSP") ];
  } ], [ null, "PUTAC", function () {
    return [ vm.$("PDLPTR"), 2 * vm.$("DESCR"), vm.$("TVAL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCOK"), vm.$("SCNR") ];
  } ], [ "BAL1", "DECRA", function () {
    return [ vm.$("PDLPTR"), 3 * vm.$("DESCR") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("PDLPTR"), vm.$("PDLHED"), vm.$("TSALF"), vm.$("TSALF"), vm.$("INTR13") ];
  } ], [ "BALF", "PROC", function () {
    return [ vm.$("BAL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("FULLCL"), 0, null, vm.$("BALF3") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("NVAL"), 0 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("BALF2") ];
  } ], [ "BALF3", "AEQLC", function () {
    return [ vm.$("LENFCL"), 0, vm.$("BAL1"), vm.$("BALF1") ];
  } ], [ "CHR", "PROC", function () {
    return [ null ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("PATICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("YPTR"), vm.$("PATBCL"), vm.$("PATICL") ];
  } ], [ "CHR1", "LOCSP", function () {
    return [ vm.$("TSP"), vm.$("YPTR") ];
  } ], [ "CHR2", "REMSP", function () {
    return [ vm.$("VSP"), vm.$("XSP"), vm.$("TXSP") ];
  } ], [ null, "SUBSP", function () {
    return [ vm.$("VSP"), vm.$("TSP"), vm.$("VSP"), vm.$("TSALT") ];
  } ], [ null, "LEXCMP", function () {
    return [ vm.$("VSP"), vm.$("TSP"), vm.$("TSALF"), null, vm.$("TSALF") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("YPTR"), vm.$("TSP") ];
  } ], [ null, "ADDLG", function () {
    return [ vm.$("TXSP"), vm.$("YPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCOK"), vm.$("SCNR") ];
  } ], [ "STAR", "PROC", function () {
    return [ vm.$("CHR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("PATICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("YPTR"), vm.$("PATBCL"), vm.$("PATICL") ];
  } ], [ "STAR2", "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("EXPVAL"), vm.$("YPTR"), vm.$("TSALF") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("YPTR"), vm.$("E"), null, vm.$("STAR2") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("XPTR"), vm.$("PATBCL"), vm.$("PATICL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("XPTR"), 7 * vm.$("DESCR"), vm.$("YPTR") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("YPTR"), vm.$("S"), null, vm.$("CHR1") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("YPTR"), vm.$("P"), null, vm.$("STARP") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("YPTR"), vm.$("I"), vm.$("SCDTER") ];
  } ], [ null, "INTSPC", function () {
    return [ vm.$("TSP"), vm.$("YPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("CHR2") ];
  } ], [ "STARP", "AEQLC", function () {
    return [ vm.$("FULLCL"), 0, null, vm.$("STARP1") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("NVAL"), 0 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("STARP4") ];
  } ], [ "STARP1", "SETAV", function () {
    return [ vm.$("NVAL"), vm.$("YCL") ];
  } ], [ "STARP4", "SUBTRT", function () {
    return [ vm.$("NVAL"), vm.$("MAXLEN"), vm.$("NVAL") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("NVAL"), 0, null, null, vm.$("TSALT") ];
  } ], [ null, "LVALUE", function () {
    return [ vm.$("TSIZ"), vm.$("YPTR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("FULLCL"), 0, vm.$("STARP6") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("TSIZ"), vm.$("NVAL"), vm.$("TSALT") ];
  } ], [ "STARP6", "INCRA", function () {
    return [ vm.$("PDLPTR"), 3 * vm.$("DESCR") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("PDLPTR"), vm.$("PDLEND"), vm.$("INTR31") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), vm.$("DESCR"), vm.$("SCFLCL") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("TMVAL"), vm.$("TXSP") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), 2 * vm.$("DESCR"), vm.$("TMVAL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), 3 * vm.$("DESCR"), vm.$("LENFCL") ];
  } ], [ null, "PUSH", function () {
    return [ [ vm.$("MAXLEN"), vm.$("PATBCL"), vm.$("PATICL"), vm.$("XCL"), vm.$("YCL") ] ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("MAXLEN"), vm.$("NVAL") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("SCIN"), null, [ vm.$("STARP5"), null, vm.$("RTNUL3") ] ];
  } ], [ "STARP2", "POP", function () {
    return [ [ vm.$("YCL"), vm.$("XCL"), vm.$("PATICL"), vm.$("PATBCL"), vm.$("MAXLEN") ] ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCOK"), vm.$("SCNR") ];
  } ], [ "STARP5", "POP", function () {
    return [ [ vm.$("YCL"), vm.$("XCL"), vm.$("PATICL"), vm.$("PATBCL"), vm.$("MAXLEN") ] ];
  } ], [ "STARP3", "AEQLC", function () {
    return [ vm.$("LENFCL"), 0, vm.$("TSALT") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SALF"), vm.$("SCNR") ];
  } ], [ "DSAR", "PROC", function () {
    return [ vm.$("CHR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("PATICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("YPTR"), vm.$("PATBCL"), vm.$("PATICL") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("YPTR"), vm.$("S"), null, vm.$("STARP3") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("YPTR"), vm.$("P"), null, vm.$("DSARP") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("YPTR"), vm.$("I"), vm.$("SCDTER"), vm.$("STARP3") ];
  } ], [ "DSARP", "AEQLC", function () {
    return [ vm.$("FULLCL"), 0, null, vm.$("DSARP1") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("NVAL"), 0 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DSARP2") ];
  } ], [ "DSARP1", "SETAV", function () {
    return [ vm.$("NVAL"), vm.$("YCL") ];
  } ], [ "DSARP2", "SUBTRT", function () {
    return [ vm.$("NVAL"), vm.$("MAXLEN"), vm.$("NVAL") ];
  } ], [ null, "PUSH", function () {
    return [ [ vm.$("MAXLEN"), vm.$("PATBCL"), vm.$("PATICL"), vm.$("XCL"), vm.$("YCL") ] ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("MAXLEN"), vm.$("NVAL") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("UNSC"), null, [ vm.$("STARP5"), vm.$("STARP2"), vm.$("RTNUL3") ] ];
  } ], [ "FNCE", "PROC", function () {
    return [ null ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("PDLPTR"), 3 * vm.$("DESCR") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("PDLPTR"), vm.$("PDLEND"), vm.$("INTR31") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), vm.$("DESCR"), vm.$("FNCFCL") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("TMVAL"), vm.$("TXSP") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), 2 * vm.$("DESCR"), vm.$("TMVAL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), 3 * vm.$("DESCR"), vm.$("LENFCL") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("LENFCL"), 1 ];
  } ], [ null, "BRANIC", function () {
    return [ vm.$("SCOKCL"), 0 ];
  } ], [ "NME", "PROC", function () {
    return [ null ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("PDLPTR"), 3 * vm.$("DESCR") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("PDLPTR"), vm.$("PDLEND"), vm.$("INTR31") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), vm.$("DESCR"), vm.$("FNMECL") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("TMVAL"), vm.$("TXSP") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), 2 * vm.$("DESCR"), vm.$("TMVAL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), 3 * vm.$("DESCR"), vm.$("LENFCL") ];
  } ], [ null, "PUSH", function () {
    return [ [ vm.$("TMVAL") ] ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("LENFCL"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCOK"), vm.$("SCNR") ];
  } ], [ "FNME", "PROC", function () {
    return [ vm.$("NME") ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("TVAL") ] ];
  } ], [ "FNME1", "AEQLC", function () {
    return [ vm.$("LENFCL"), 0, vm.$("TSALT"), vm.$("TSALF") ];
  } ], [ "ENME", "PROC", function () {
    return [ vm.$("NME") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("PATICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("YPTR"), vm.$("PATBCL"), vm.$("PATICL") ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("NVAL") ] ];
  } ], [ null, "SETVA", function () {
    return [ vm.$("YCL"), vm.$("NVAL") ];
  } ], [ null, "SETSP", function () {
    return [ vm.$("TSP"), vm.$("TXSP") ];
  } ], [ null, "PUTLG", function () {
    return [ vm.$("TSP"), vm.$("NVAL") ];
  } ], [ null, "REMSP", function () {
    return [ vm.$("TSP"), vm.$("TXSP"), vm.$("TSP") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("TPTR"), vm.$("NBSPTR"), vm.$("NAMICL") ];
  } ], [ null, "PUTSPC", function () {
    return [ vm.$("TPTR"), vm.$("DESCR"), vm.$("TSP") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("TPTR"), vm.$("DESCR") + vm.$("SPEC"), vm.$("YPTR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("NAMICL"), vm.$("DESCR") + vm.$("SPEC") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("NAMICL"), vm.$("NMOVER"), vm.$("INTR13"), vm.$("ENME1") ];
  } ], [ "ENME2", "INCRA", function () {
    return [ vm.$("PDLPTR"), vm.$("DESCR") + vm.$("SPEC") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("PDLPTR"), vm.$("PDLEND"), vm.$("INTR31") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), vm.$("DESCR"), vm.$("DNMECL") ];
  } ], [ "ENME3", "GETLG", function () {
    return [ vm.$("TMVAL"), vm.$("TXSP") ];
  } ], [ null, "MOVV", function () {
    return [ vm.$("TMVAL"), vm.$("YCL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), 2 * vm.$("DESCR"), vm.$("TMVAL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), 3 * vm.$("DESCR"), vm.$("LENFCL") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("LENFCL"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCOK"), vm.$("SCNR") ];
  } ], [ "ENME1", "MOVD", function () {
    return [ vm.$("WCL"), vm.$("NMOVER") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("NMOVER"), vm.$("NAMLSZ") * vm.$("SPDR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("NMOVER") ];
  } ], [ null, "MOVBLK", function () {
    return [ vm.$("TPTR"), vm.$("NBSPTR"), vm.$("WCL") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("NBSPTR"), vm.$("TPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ENME2") ];
  } ], [ "DNME", "PROC", function () {
    return [ vm.$("NME") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("NAMICL"), vm.$("DESCR") + vm.$("SPEC") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("TPTR"), vm.$("NBSPTR"), vm.$("NAMICL") ];
  } ], [ "DNME1", "PROC", function () {
    return [ vm.$("NME") ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("VVAL"), vm.$("YCL") ];
  } ], [ null, "PUSH", function () {
    return [ [ vm.$("VVAL") ] ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FNME1") ];
  } ], [ "ENMI", "PROC", function () {
    return [ vm.$("NME") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("PATICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("YPTR"), vm.$("PATBCL"), vm.$("PATICL") ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("NVAL") ] ];
  } ], [ null, "SETVA", function () {
    return [ vm.$("YCL"), vm.$("NVAL") ];
  } ], [ null, "SETSP", function () {
    return [ vm.$("TSP"), vm.$("TXSP") ];
  } ], [ null, "PUTLG", function () {
    return [ vm.$("TSP"), vm.$("NVAL") ];
  } ], [ null, "REMSP", function () {
    return [ vm.$("TSP"), vm.$("TXSP"), vm.$("TSP") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("ZCL"), vm.$("TSP") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("ZCL"), vm.$("MLENCL"), vm.$("SCLNOR") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("YPTR"), vm.$("E"), null, vm.$("ENMEXN") ];
  } ], [ "ENMI5", "VEQLC", function () {
    return [ vm.$("YPTR"), vm.$("K"), null, vm.$("ENMIC") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("VVAL"), vm.$("GENVAR"), [ vm.$("TSPPTR") ] ];
  } ], [ "ENMI3", "PUTDC", function () {
    return [ vm.$("YPTR"), vm.$("DESCR"), vm.$("VVAL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("OUTSW"), 0, null, vm.$("ENMI4") ];
  } ], [ null, "LOCAPV", function () {
    return [ vm.$("ZPTR"), vm.$("OUTATL"), vm.$("YPTR"), vm.$("ENMI4") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("ZPTR"), vm.$("DESCR") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("PUTOUT"), [ vm.$("ZPTR"), vm.$("VVAL") ] ];
  } ], [ "ENMI4", "ACOMPC", function () {
    return [ vm.$("TRAPCL"), 0, null, vm.$("ENMI2"), vm.$("ENMI2") ];
  } ], [ null, "LOCAPT", function () {
    return [ vm.$("ATPTR"), vm.$("TVALL"), vm.$("YPTR"), vm.$("ENMI2") ];
  } ], [ null, "PUSH", function () {
    return [ [ vm.$("PATBCL"), vm.$("PATICL"), vm.$("WPTR"), vm.$("XCL"), vm.$("YCL") ] ];
  } ], [ null, "PUSH", function () {
    return [ [ vm.$("MAXLEN"), vm.$("LENFCL"), vm.$("PDLPTR"), vm.$("PDLHED"), vm.$("NAMICL"), vm.$("NHEDCL") ] ];
  } ], [ null, "SPUSH", function () {
    return [ [ vm.$("HEADSP"), vm.$("TSP"), vm.$("TXSP"), vm.$("XSP") ] ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("PDLHED"), vm.$("PDLPTR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("NHEDCL"), vm.$("NAMICL") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TRPHND"), vm.$("ATPTR") ];
  } ], [ null, "SPOP", function () {
    return [ [ vm.$("XSP"), vm.$("TXSP"), vm.$("TSP"), vm.$("HEADSP") ] ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("NHEDCL"), vm.$("NAMICL"), vm.$("PDLHED"), vm.$("PDLPTR"), vm.$("LENFCL"), vm.$("MAXLEN") ] ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("YCL"), vm.$("XCL"), vm.$("WPTR"), vm.$("PATICL"), vm.$("PATBCL") ] ];
  } ], [ "ENMI2", "INCRA", function () {
    return [ vm.$("PDLPTR"), 3 * vm.$("DESCR") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("PDLPTR"), vm.$("PDLEND"), vm.$("INTR31") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), vm.$("DESCR"), vm.$("DNMICL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ENME3") ];
  } ], [ "ENMIC", "SPCINT", function () {
    return [ vm.$("VVAL"), vm.$("TSP"), vm.$("SCDTER"), vm.$("ENMI3") ];
  } ], [ "ENMEXN", "PUSH", function () {
    return [ vm.$("ZEROCL") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("EXPEVL"), vm.$("YPTR"), [ vm.$("TSALF"), null, vm.$("SCNEMO") ] ];
  } ], [ null, "POP", function () {
    return [ vm.$("ZEROCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ENMI5") ];
  } ], [ "SUCE", "PROC", function () {
    return [ null ];
  } ], [ "SUCE1", "INCRA", function () {
    return [ vm.$("PDLPTR"), 3 * vm.$("DESCR") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("PDLPTR"), vm.$("PDLEND"), vm.$("INTR31") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), vm.$("DESCR"), vm.$("SUCFCL") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("TMVAL"), vm.$("TXSP") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), 2 * vm.$("DESCR"), vm.$("TMVAL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("PDLPTR"), 3 * vm.$("DESCR"), vm.$("LENFCL") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("LENFCL"), 1 ];
  } ], [ null, "BRANIC", function () {
    return [ vm.$("SCOKCL"), 0 ];
  } ], [ "SUCF", "PROC", function () {
    return [ vm.$("SUCE") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("XCL"), vm.$("PDLPTR"), vm.$("DESCR") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("YCL"), vm.$("PDLPTR"), 2 * vm.$("DESCR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SUCE1") ];
  } ], [ null, "TITLE", function () {
    return [ "Defined Functions" ];
  } ], [ "DEFINE", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("YSP"), vm.$("XSP"), vm.$("VARATB"), vm.$("PROTER"), vm.$("PROTER") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("STYPE"), vm.$("LPTYP"), vm.$("PROTER") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), [ vm.$("YSPPTR") ] ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZCL"), vm.$("FINDEX"), [ vm.$("XPTR") ] ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("YPTR"), vm.$("NULVCL"), vm.$("DEFIN3") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YPTR"), vm.$("XPTR") ];
  } ], [ "DEFIN3", "PUSH", function () {
    return [ vm.$("YPTR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YCL"), vm.$("ZEROCL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ "DEFIN4", "FSHRTN", function () {
    return [ vm.$("XSP"), 1 ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("YSP"), vm.$("XSP"), vm.$("VARATB"), vm.$("PROTER"), vm.$("PROTER") ];
  } ], [ null, "SELBRA", function () {
    return [ vm.$("STYPE"), [ vm.$("PROTER"), null, vm.$("DEFIN6") ] ];
  } ], [ null, "LEQLC", function () {
    return [ vm.$("YSP"), 0, null, vm.$("DEFIN4") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), [ vm.$("YSPPTR") ] ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("YCL"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DEFIN4") ];
  } ], [ "DEFIN6", "LEQLC", function () {
    return [ vm.$("YSP"), 0, null, vm.$("DEFIN9") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("YCL"), 1 ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), [ vm.$("YSPPTR") ] ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ "DEFIN9", "SETVA", function () {
    return [ vm.$("DEFCL"), vm.$("YCL") ];
  } ], [ "DEFIN8", "FSHRTN", function () {
    return [ vm.$("XSP"), 1 ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("YSP"), vm.$("XSP"), vm.$("VARATB"), vm.$("PROTER"), vm.$("DEF10") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("STYPE"), vm.$("CMATYP"), vm.$("PROTER") ];
  } ], [ null, "LEQLC", function () {
    return [ vm.$("YSP"), 0, null, vm.$("DEFIN8") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), [ vm.$("YSPPTR") ] ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("YCL"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DEFIN8") ];
  } ], [ "DEF10", "LEQLC", function () {
    return [ vm.$("YSP"), 0, null, vm.$("DEF11") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), vm.$("YSPPTR") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("YCL"), 1 ];
  } ], [ "DEF11", "INCRA", function () {
    return [ vm.$("YCL"), 2 ];
  } ], [ null, "MULTC", function () {
    return [ vm.$("XCL"), vm.$("YCL"), vm.$("DESCR") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("XCL"), vm.$("B") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("BLOCK"), vm.$("XCL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ZCL"), 0, vm.$("DEFCL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ZCL"), vm.$("DESCR"), vm.$("XPTR") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), vm.$("XCL") ];
  } ], [ "DEF12", "DECRA", function () {
    return [ vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ null, "POP", function () {
    return [ vm.$("YPTR") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("XPTR"), vm.$("DESCR"), vm.$("YPTR") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("YCL"), 1 ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("YCL"), 0, vm.$("DEF12"), vm.$("RETNUL") ];
  } ], [ "DEFFNC", "PROC", function () {
    return [ null ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("XCL"), vm.$("INCL") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("WCL"), vm.$("XCL") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YCL"), vm.$("INCL") ];
  } ], [ null, "PSTACK", function () {
    return [ vm.$("YPTR") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("NULVCL") ];
  } ], [ "DEFF1", "INCRA", function () {
    return [ vm.$("OCICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("XPTR"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "TESTF", function () {
    return [ vm.$("XPTR"), vm.$("FNC"), null, vm.$("DEFFC") ];
  } ], [ "DEFF2", "AEQLC", function () {
    return [ vm.$("INSW"), 0, null, vm.$("DEFF14") ];
  } ], [ null, "LOCAPV", function () {
    return [ vm.$("ZPTR"), vm.$("INATL"), vm.$("XPTR"), vm.$("DEFF14") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("ZPTR"), vm.$("DESCR") ];
  } ], [ null, "PUSH", function () {
    return [ [ vm.$("XCL"), vm.$("WCL"), vm.$("YCL"), vm.$("YPTR") ] ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("PUTIN"), [ vm.$("ZPTR"), vm.$("XPTR") ], vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("YPTR"), vm.$("YCL"), vm.$("WCL"), vm.$("XCL") ] ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DEFF3") ];
  } ], [ "DEFF14", "GETDC", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ "DEFF3", "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("XCL"), 1 ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("XCL"), 0, vm.$("DEFF1"), null, vm.$("INTR10") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("XCL"), vm.$("YCL"), 0 ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("XCL"), vm.$("XCL") ];
  } ], [ "DEFF4", "ACOMP", function () {
    return [ vm.$("WCL"), vm.$("XCL"), vm.$("DEFF9"), vm.$("DEFF5") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("NULVCL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("WCL"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DEFF4") ];
  } ], [ "DEFF9", "POP", function () {
    return [ vm.$("ZCL") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("WCL"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DEFF4") ];
  } ], [ "DEFF5", "GETDC", function () {
    return [ vm.$("ZCL"), vm.$("YCL"), vm.$("DESCR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("XPTR"), vm.$("ZCL") ];
  } ], [ null, "GETSIZ", function () {
    return [ vm.$("WCL"), vm.$("ZCL") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("WPTR"), vm.$("ZCL"), vm.$("WCL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("XCL"), 1 ];
  } ], [ "DEFF8", "INCRA", function () {
    return [ vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("YPTR"), vm.$("DESCR") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("TPTR"), vm.$("ZPTR"), vm.$("DESCR") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ATPTR"), vm.$("YPTR"), vm.$("DESCR") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ZPTR"), vm.$("DESCR"), vm.$("ATPTR") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("YPTR"), vm.$("DESCR"), vm.$("TPTR") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("XCL"), 1 ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("XCL"), 0, vm.$("DEFF8"), null, vm.$("INTR10") ];
  } ], [ "DEFF10", "INCRA", function () {
    return [ vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ null, "AEQL", function () {
    return [ vm.$("XPTR"), vm.$("WPTR"), null, vm.$("DEFFGO") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("TPTR"), vm.$("ZPTR"), vm.$("DESCR") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("TPTR") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ZPTR"), vm.$("DESCR"), vm.$("NULVCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DEFF10") ];
  } ], [ "DEFFGO", "PUSH", function () {
    return [ [ vm.$("FRTNCL"), vm.$("STNOCL"), vm.$("OCICL"), vm.$("OCBSCL"), vm.$("ZCL"), vm.$("ZCL") ] ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("XCL"), vm.$("ZCL"), vm.$("DESCR") ];
  } ], [ null, "AEQLIC", function () {
    return [ vm.$("XCL"), vm.$("ATTRIB"), 0, null, vm.$("UNDFFE") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("OCBSCL"), vm.$("XCL"), vm.$("ATTRIB") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("TRACL"), 0, null, vm.$("DEFF18"), vm.$("DEFF18") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("TRACL"), 1 ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ATPTR"), vm.$("ZCL"), 2 * vm.$("DESCR") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("ZCL") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("FENTR2"), [ vm.$("ATPTR") ], [ vm.$("INTR10"), vm.$("INTR10") ] ];
  } ], [ null, "POP", function () {
    return [ vm.$("ZCL") ];
  } ], [ "DEFF18", "ACOMPC", function () {
    return [ vm.$("TRAPCL"), 0, null, vm.$("DEFF19"), vm.$("DEFF19") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ATPTR"), vm.$("ZCL"), 2 * vm.$("DESCR") ];
  } ], [ null, "LOCAPT", function () {
    return [ vm.$("ATPTR"), vm.$("TFENTL"), vm.$("ATPTR"), vm.$("DEFF19") ];
  } ], [ null, "PUSH", function () {
    return [ [ vm.$("OCBSCL"), vm.$("ZCL") ] ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TRPHND"), vm.$("ATPTR") ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("ZCL"), vm.$("OCBSCL") ] ];
  } ], [ "DEFF19", "INCRA", function () {
    return [ vm.$("LVLCL"), 1 ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("TRAPCL"), 0, null, vm.$("DEFF15"), vm.$("DEFF15") ];
  } ], [ null, "LOCAPT", function () {
    return [ vm.$("ATPTR"), vm.$("TKEYL"), vm.$("FNCLKY"), vm.$("DEFF15") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TRPHND"), vm.$("ATPTR") ];
  } ], [ "DEFF15", "SETAC", function () {
    return [ vm.$("OCICL"), 0 ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("INTERP"), null, [ vm.$("DEFFF"), vm.$("DEFFNR") ] ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("RETPCL"), vm.$("RETCL") ];
  } ], [ "DEFFS1", "POP", function () {
    return [ vm.$("ZCL") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("TRACL"), 0, null, vm.$("DEFF20"), vm.$("DEFF20") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("TRACL"), 1 ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ATPTR"), vm.$("ZCL"), 2 * vm.$("DESCR") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("ZCL") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("FNEXT2"), [ vm.$("ATPTR") ], [ vm.$("INTR10"), vm.$("INTR10") ] ];
  } ], [ null, "POP", function () {
    return [ vm.$("ZCL") ];
  } ], [ "DEFF20", "ACOMPC", function () {
    return [ vm.$("TRAPCL"), 0, null, vm.$("DEFFS2"), vm.$("DEFFS2") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ATPTR"), vm.$("ZCL"), 2 * vm.$("DESCR") ];
  } ], [ null, "LOCAPT", function () {
    return [ vm.$("ATPTR"), vm.$("TFEXTL"), vm.$("ATPTR"), vm.$("DEFFS2") ];
  } ], [ null, "PUSH", function () {
    return [ [ vm.$("RETPCL"), vm.$("ZCL") ] ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TRPHND"), vm.$("ATPTR") ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("ZCL"), vm.$("RETPCL") ] ];
  } ], [ "DEFFS2", "DECRA", function () {
    return [ vm.$("LVLCL"), 1 ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("TRAPCL"), 0, null, vm.$("DEFF17"), vm.$("DEFF17") ];
  } ], [ null, "LOCAPT", function () {
    return [ vm.$("ATPTR"), vm.$("TKEYL"), vm.$("FNCLKY"), vm.$("DEFF17") ];
  } ], [ null, "PUSH", function () {
    return [ [ vm.$("RETPCL"), vm.$("ZCL") ] ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TRPHND"), vm.$("ATPTR") ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("ZCL"), vm.$("RETPCL") ] ];
  } ], [ "DEFF17", "POP", function () {
    return [ [ vm.$("ZCL"), vm.$("OCBSCL"), vm.$("OCICL"), vm.$("STNOCL"), vm.$("FRTNCL") ] ];
  } ], [ null, "GETSIZ", function () {
    return [ vm.$("WCL"), vm.$("ZCL") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("WCL"), vm.$("DESCR") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("WCL"), 0, null, vm.$("INTR10"), vm.$("INTR10") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("WPTR"), vm.$("ZCL"), vm.$("WCL") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YPTR"), vm.$("ZCL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("YPTR"), vm.$("DESCR") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("YPTR"), vm.$("DESCR") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("ZPTR"), vm.$("DESCR") ];
  } ], [ "DEFF6", "POP", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("YPTR"), vm.$("WPTR"), vm.$("DESCR") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("YPTR"), vm.$("DESCR"), vm.$("XPTR") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("WPTR"), vm.$("DESCR") ];
  } ], [ null, "AEQL", function () {
    return [ vm.$("WPTR"), vm.$("ZCL"), vm.$("DEFF6") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("RETPCL"), vm.$("FRETCL"), null, vm.$("FAIL") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("RETPCL"), vm.$("NRETCL"), vm.$("RTZPTR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("XPTR"), vm.$("ZPTR") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("S"), null, vm.$("DEFFVX") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("I"), null, vm.$("GENVIX") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("N"), null, vm.$("RTXNAM") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("K"), vm.$("NONAME"), vm.$("RTXNAM") ];
  } ], [ "DEFFVX", "AEQLC", function () {
    return [ vm.$("XPTR"), 0, vm.$("RTXNAM"), vm.$("NONAME") ];
  } ], [ "DEFFF", "MOVD", function () {
    return [ vm.$("RETPCL"), vm.$("FRETCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DEFFS1") ];
  } ], [ "DEFFC", "PUSH", function () {
    return [ [ vm.$("XCL"), vm.$("WCL"), vm.$("YCL"), vm.$("YPTR") ] ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("INVOKE"), [ vm.$("XPTR") ], [ vm.$("FAIL"), vm.$("DEFFN") ] ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("YPTR"), vm.$("YCL"), vm.$("WCL"), vm.$("XCL") ] ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DEFF3") ];
  } ], [ "DEFFN", "POP", function () {
    return [ [ vm.$("YPTR"), vm.$("YCL"), vm.$("WCL"), vm.$("XCL") ] ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DEFF2") ];
  } ], [ "DEFFNR", "MOVD", function () {
    return [ vm.$("RETPCL"), vm.$("NRETCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DEFFS1") ];
  } ], [ null, "TITLE", function () {
    return [ "External Functions" ];
  } ], [ "LOAD", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("WPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("VSP"), vm.$("WPTR") ];
  } ], [ null, "POP", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("YSP"), vm.$("XSP"), vm.$("VARATB"), vm.$("PROTER"), vm.$("PROTER") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("STYPE"), vm.$("LPTYP"), vm.$("PROTER") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), vm.$("YSPPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZCL"), vm.$("FINDEX"), vm.$("XPTR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YCL"), vm.$("ZEROCL") ];
  } ], [ "LOAD4", "FSHRTN", function () {
    return [ vm.$("XSP"), 1 ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("ZSP"), vm.$("XSP"), vm.$("VARATB"), vm.$("LOAD1"), vm.$("PROTER") ];
  } ], [ null, "SELBRA", function () {
    return [ vm.$("STYPE"), [ vm.$("PROTER"), null, vm.$("LOAD6") ] ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), vm.$("ZSPPTR") ];
  } ], [ null, "LOCAPV", function () {
    return [ vm.$("XPTR"), vm.$("DTATL"), vm.$("XPTR"), vm.$("LOAD9") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ "LOAD10", "INCRA", function () {
    return [ vm.$("YCL"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("LOAD4") ];
  } ], [ "LOAD6", "INCRA", function () {
    return [ vm.$("YCL"), 1 ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), vm.$("ZSPPTR") ];
  } ], [ null, "LOCAPV", function () {
    return [ vm.$("XPTR"), vm.$("DTATL"), vm.$("XPTR"), vm.$("LOAD11") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ "LOAD13", "FSHRTN", function () {
    return [ vm.$("XSP"), 1 ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), vm.$("XSPPTR") ];
  } ], [ null, "LOCAPV", function () {
    return [ vm.$("XPTR"), vm.$("DTATL"), vm.$("XPTR"), vm.$("LOAD7") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ "LOAD8", "SETVA", function () {
    return [ vm.$("LODCL"), vm.$("YCL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("YCL"), 1 ];
  } ], [ null, "MULTC", function () {
    return [ vm.$("XCL"), vm.$("YCL"), vm.$("DESCR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("XCL"), vm.$("DESCR") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("XCL"), vm.$("B") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("BLOCK"), vm.$("XCL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ZCL"), 0, vm.$("LODCL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ZCL"), vm.$("DESCR"), vm.$("XPTR") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), vm.$("XCL") ];
  } ], [ "LOAD12", "DECRA", function () {
    return [ vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ null, "POP", function () {
    return [ vm.$("YPTR") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("XPTR"), vm.$("DESCR"), vm.$("YPTR") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("YCL"), 1 ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("YCL"), 0, vm.$("LOAD12") ];
  } ], [ null, "LOAD", function () {
    return [ vm.$("YPTR"), vm.$("YSP"), vm.$("VSP"), vm.$("FAIL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("XPTR"), 0, vm.$("YPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RETNUL") ];
  } ], [ "LOAD7", "PUSH", function () {
    return [ vm.$("ZEROCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("LOAD8") ];
  } ], [ "LOAD9", "PUSH", function () {
    return [ vm.$("ZEROCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("LOAD10") ];
  } ], [ "LOAD1", "PUSH", function () {
    return [ vm.$("ZEROCL") ];
  } ], [ null, "SETSP", function () {
    return [ vm.$("TSP"), vm.$("XSP") ];
  } ], [ null, "SETLC", function () {
    return [ vm.$("TSP"), 1 ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("YCL"), 1 ];
  } ], [ null, "LEXCMP", function () {
    return [ vm.$("TSP"), vm.$("RPRNSP"), vm.$("LOAD4"), vm.$("LOAD13"), vm.$("LOAD4") ];
  } ], [ "LOAD11", "PUSH", function () {
    return [ vm.$("ZEROCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("LOAD13") ];
  } ], [ "UNLOAD", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZCL"), vm.$("FINDEX"), vm.$("XPTR") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ZCL"), 0, vm.$("UNDFCL") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "UNLOAD", function () {
    return [ vm.$("XSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RETNUL") ];
  } ], [ "LNKFNC", "PROC", function () {
    return [ null ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("XCL"), vm.$("INCL") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YCL"), vm.$("INCL") ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("WCL"), vm.$("YCL") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZCL"), vm.$("YCL"), vm.$("DESCR") ];
  } ], [ null, "PSTACK", function () {
    return [ vm.$("YPTR") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("TCL"), 2 * vm.$("DESCR") ];
  } ], [ "LNKF1", "PUSH", function () {
    return [ [ vm.$("XCL"), vm.$("ZCL"), vm.$("TCL"), vm.$("YPTR"), vm.$("WCL"), vm.$("YCL") ] ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("ARGVAL"), null, vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("YCL"), vm.$("WCL"), vm.$("YPTR"), vm.$("TCL"), vm.$("ZCL"), vm.$("XCL") ] ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("WCL"), 1 ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("WCL"), 0, null, null, vm.$("LNKF8") ];
  } ], [ "LNKF7", "GETD", function () {
    return [ vm.$("ZPTR"), vm.$("ZCL"), vm.$("TCL") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("ZPTR"), 0, null, vm.$("LNKF6") ];
  } ], [ null, "VEQL", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), null, vm.$("LNKF6") ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("DTCL"), vm.$("XPTR") ];
  } ], [ null, "MOVV", function () {
    return [ vm.$("DTCL"), vm.$("ZPTR") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("VIDTP"), null, vm.$("LNKVI") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("IVDTP"), null, vm.$("LNKIV") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("RIDTP"), null, vm.$("LNKRI") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("IRDTP"), null, vm.$("LNKIR") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("RVDTP"), null, vm.$("LNKRV") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("VRDTP"), vm.$("INTR1"), vm.$("LNKVR") ];
  } ], [ "LNKIV", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GNVARI"), vm.$("XPTR"), vm.$("LNKF6") ];
  } ], [ "LNKRI", "RLINT", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), vm.$("INTR1"), vm.$("LNKF6") ];
  } ], [ "LNKIR", "INTRL", function () {
    return [ vm.$("XPTR"), vm.$("XPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("LNKF6") ];
  } ], [ "LNKVR", "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "SPCINT", function () {
    return [ vm.$("XPTR"), vm.$("XSP"), null, vm.$("LNKIR") ];
  } ], [ null, "SPREAL", function () {
    return [ vm.$("XPTR"), vm.$("XSP"), vm.$("INTR1"), vm.$("LNKF6") ];
  } ], [ "LNKRV", "REALST", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), vm.$("XSPPTR"), vm.$("LNKF6") ];
  } ], [ "LNKVI", "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "SPCINT", function () {
    return [ vm.$("XPTR"), vm.$("XSP"), null, vm.$("LNKF6") ];
  } ], [ null, "SPREAL", function () {
    return [ vm.$("XPTR"), vm.$("XSP"), vm.$("INTR1"), vm.$("LNKRI") ];
  } ], [ "LNKF6", "INCRA", function () {
    return [ vm.$("TCL"), vm.$("DESCR") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ "LNKF8", "DECRA", function () {
    return [ vm.$("XCL"), 1 ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("XCL"), 0, vm.$("LNKF1") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("WPTR"), vm.$("YCL"), 0 ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("WPTR"), vm.$("WPTR") ];
  } ], [ "LNKF4", "ACOMPC", function () {
    return [ vm.$("WCL"), 0, null, vm.$("LNKF5"), vm.$("LNKF5") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("NULVCL") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("WCL"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("LNKF4") ];
  } ], [ "LNKF5", "GETSIZ", function () {
    return [ vm.$("WCL"), vm.$("ZCL") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("XPTR"), vm.$("ZCL"), vm.$("WCL") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), 0 ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZCL"), vm.$("ZCL"), vm.$("DESCR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("YPTR"), 2 * vm.$("DESCR") ];
  } ], [ null, "LINK", function () {
    return [ vm.$("ZPTR"), vm.$("YPTR"), vm.$("WPTR"), vm.$("ZCL"), vm.$("FAIL") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("ZPTR"), vm.$("L"), vm.$("RTZPTR") ];
  } ], [ null, "GETSPC", function () {
    return [ vm.$("ZSP"), vm.$("ZPTR"), 0 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("GENVRZ") ];
  } ], [ null, "TITLE", function () {
    return [ "Arrays, Tables, and Defined Data Objects" ];
  } ], [ "ARRAY", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("ARGVAL"), null, vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("ARRMRK"), 0 ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("WCL"), vm.$("ZEROCL") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("XCL"), vm.$("ONECL") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ "ARRAY1", "STREAM", function () {
    return [ vm.$("YSP"), vm.$("XSP"), vm.$("NUMBTB"), vm.$("PROTER"), vm.$("ARROT1") ];
  } ], [ null, "SPCINT", function () {
    return [ vm.$("YCL"), vm.$("YSP"), vm.$("PROTER") ];
  } ], [ null, "SELBRA", function () {
    return [ vm.$("STYPE"), [ null, vm.$("ARRAY3") ] ];
  } ], [ null, "FSHRTN", function () {
    return [ vm.$("XSP"), 1 ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("ZSP"), vm.$("XSP"), vm.$("NUMBTB"), vm.$("PROTER"), vm.$("ARROT2") ];
  } ], [ null, "SPCINT", function () {
    return [ vm.$("ZCL"), vm.$("ZSP"), vm.$("PROTER") ];
  } ], [ null, "SELBRA", function () {
    return [ vm.$("STYPE"), [ vm.$("PROTER"), vm.$("ARRAY5") ] ];
  } ], [ "ARRAY3", "ACOMPC", function () {
    return [ vm.$("YCL"), 0, null, vm.$("PROTER"), vm.$("PROTER") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ZCL"), vm.$("YCL") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("YCL"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARRAY6") ];
  } ], [ "ARRAY5", "SUBTRT", function () {
    return [ vm.$("ZCL"), vm.$("ZCL"), vm.$("YCL") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("ZCL"), vm.$("ZCL"), vm.$("ONECL") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("ZCL"), 0, null, null, vm.$("PROTER") ];
  } ], [ "ARRAY6", "SETVA", function () {
    return [ vm.$("YCL"), vm.$("ZCL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("YCL") ];
  } ], [ null, "MULT", function () {
    return [ vm.$("XCL"), vm.$("XCL"), vm.$("ZCL"), vm.$("PROTER") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("WCL"), 1 ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("ARRMRK"), 0, vm.$("ARRAY7") ];
  } ], [ null, "FSHRTN", function () {
    return [ vm.$("XSP"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARRAY1") ];
  } ], [ "ARROT1", "SETAC", function () {
    return [ vm.$("ARRMRK"), 1 ];
  } ], [ null, "SPCINT", function () {
    return [ vm.$("YCL"), vm.$("YSP"), vm.$("PROTER"), vm.$("ARRAY3") ];
  } ], [ "ARROT2", "SETAC", function () {
    return [ vm.$("ARRMRK"), 1 ];
  } ], [ null, "SPCINT", function () {
    return [ vm.$("ZCL"), vm.$("ZSP"), vm.$("PROTER"), vm.$("ARRAY5") ];
  } ], [ "ARRAY7", "SUM", function () {
    return [ vm.$("ZCL"), vm.$("XCL"), vm.$("WCL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("ZCL"), 2 ];
  } ], [ null, "MULTC", function () {
    return [ vm.$("ZCL"), vm.$("ZCL"), vm.$("DESCR") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("ZCL"), vm.$("A") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("BLOCK"), vm.$("ZCL") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("XPTR"), vm.$("ZPTR") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("WPTR"), vm.$("XPTR"), vm.$("ZCL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ZPTR"), 2 * vm.$("DESCR"), vm.$("WCL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ "ARRAY8", "INCRA", function () {
    return [ vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ null, "POP", function () {
    return [ vm.$("YPTR") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("XPTR"), vm.$("DESCR"), vm.$("YPTR") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("WCL"), 1 ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("WCL"), 0, vm.$("ARRAY8"), vm.$("ARRFIL") ];
  } ], [ "ARRAY9", "PUTDC", function () {
    return [ vm.$("XPTR"), vm.$("DESCR"), vm.$("TPTR") ];
  } ], [ "ARRFIL", "INCRA", function () {
    return [ vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("XPTR"), vm.$("WPTR"), vm.$("INTR10"), null, vm.$("ARRAY9") ];
  } ], [ null, "POP", function () {
    return [ vm.$("WPTR") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ZPTR"), vm.$("DESCR"), vm.$("WPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTZPTR") ];
  } ], [ "ASSOC", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("INTVAL"), null, vm.$("FAIL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("WPTR"), vm.$("INTVAL"), null, vm.$("FAIL") ];
  } ], [ null, "MULT", function () {
    return [ vm.$("ZPTR"), vm.$("WPTR"), vm.$("DSCRTW"), vm.$("SIZERR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("ZPTR"), 2 * vm.$("DESCR") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("ZPTR"), vm.$("SIZLMT"), vm.$("SIZERR"), vm.$("SIZERR") ];
  } ], [ null, "POP", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("XPTR"), 0, vm.$("ASSOC1"), null, vm.$("LENERR") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("XPTR"), vm.$("EXTSIZ") ];
  } ], [ "ASSOC1", "INCRA", function () {
    return [ vm.$("XPTR"), 1 ];
  } ], [ null, "MULTC", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), 2 * vm.$("DESCR") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("WPTR"), 0, vm.$("ASSOC4"), null, vm.$("LENERR") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("WPTR"), vm.$("EXTSIZ") ];
  } ], [ "ASSOC4", "INCRA", function () {
    return [ vm.$("WPTR"), 1 ];
  } ], [ null, "MULTC", function () {
    return [ vm.$("WPTR"), vm.$("WPTR"), 2 * vm.$("DESCR") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("XPTR"), vm.$("T") ];
  } ], [ "ASSOCE", "PROC", function () {
    return [ vm.$("ASSOC") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("BLOCK"), vm.$("XPTR") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), vm.$("ONECL") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), vm.$("WPTR") ];
  } ], [ "ASSOC2", "DECRA", function () {
    return [ vm.$("XPTR"), 2 * vm.$("DESCR") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), vm.$("NULVCL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("XPTR"), vm.$("DESCR"), vm.$("ASSOC2"), vm.$("RTZPTR") ];
  } ], [ "DATDEF", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("DATACL"), 0 ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("YSP"), vm.$("XSP"), vm.$("VARATB"), vm.$("PROTER"), vm.$("PROTER") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("STYPE"), vm.$("LPTYP"), vm.$("PROTER") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), [ vm.$("YSPPTR") ] ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZCL"), vm.$("FINDEX"), [ vm.$("XPTR") ] ];
  } ], [ null, "INCRV", function () {
    return [ vm.$("DATSEG"), 1 ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("DATSEG"), vm.$("DATSIZ"), null, vm.$("INTR27") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YCL"), vm.$("ZEROCL") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("DTATL"), vm.$("AUGATL"), [ vm.$("DTATL"), vm.$("DATSEG"), vm.$("XPTR") ] ];
  } ], [ null, "PSTACK", function () {
    return [ vm.$("WPTR") ];
  } ], [ null, "PUSH", function () {
    return [ [ vm.$("DATSEG"), vm.$("XPTR") ] ];
  } ], [ "DATA3", "FSHRTN", function () {
    return [ vm.$("XSP"), 1 ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("DATACL"), 0, vm.$("DAT5") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("YSP"), vm.$("XSP"), vm.$("VARATB"), vm.$("PROTER"), vm.$("PROTER") ];
  } ], [ null, "SELBRA", function () {
    return [ vm.$("STYPE"), [ vm.$("PROTER"), null, vm.$("DATA6") ] ];
  } ], [ "DATA4", "LEQLC", function () {
    return [ vm.$("YSP"), 0, null, vm.$("DATA3") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), vm.$("YSPPTR") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XCL"), vm.$("FINDEX"), [ vm.$("XPTR") ] ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("WCL"), vm.$("XCL"), 0 ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("WCL"), vm.$("FLDCL"), vm.$("DAT6") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("XCL"), vm.$("DESCR") ];
  } ], [ null, "MULTC", function () {
    return [ vm.$("TCL"), vm.$("YCL"), vm.$("DESCR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("AUGATL"), [ vm.$("ZPTR"), vm.$("DATSEG"), vm.$("TCL") ] ];
  } ], [ "DAT7", "PUTDC", function () {
    return [ vm.$("XCL"), vm.$("DESCR"), vm.$("ZPTR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("YCL"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DATA3") ];
  } ], [ "DATA6", "SETAC", function () {
    return [ vm.$("DATACL"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DATA4") ];
  } ], [ "DAT5", "LEQLC", function () {
    return [ vm.$("XSP"), 0, vm.$("PROTER") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("YCL"), 0, null, vm.$("PROTER") ];
  } ], [ null, "SETVA", function () {
    return [ vm.$("DATCL"), vm.$("YCL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ZCL"), 0, vm.$("DATCL") ];
  } ], [ null, "MULTC", function () {
    return [ vm.$("YCL"), vm.$("YCL"), vm.$("DESCR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("YCL"), 2 * vm.$("DESCR") ];
  } ], [ null, "MOVV", function () {
    return [ vm.$("YCL"), vm.$("DATSEG") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("BLOCK"), vm.$("YCL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("WPTR"), vm.$("DESCR") ];
  } ], [ null, "MOVBLK", function () {
    return [ vm.$("ZPTR"), vm.$("WPTR"), vm.$("YCL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ZCL"), vm.$("DESCR"), vm.$("ZPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RETNUL") ];
  } ], [ "DAT6", "PUTDC", function () {
    return [ vm.$("XCL"), 0, vm.$("FLDCL") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("BLOCK"), vm.$("TWOCL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ZPTR"), vm.$("DESCR"), vm.$("DATSEG") ];
  } ], [ null, "MULTC", function () {
    return [ vm.$("TCL"), vm.$("YCL"), vm.$("DESCR") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ZPTR"), 2 * vm.$("DESCR"), vm.$("TCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DAT7") ];
  } ], [ "PROTO", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("ARGVAL"), null, vm.$("FAIL") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("A"), vm.$("NONARY") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTZPTR") ];
  } ], [ "ITEM", "PROC", function () {
    return [ null ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("XCL"), vm.$("INCL") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("XCL"), 1 ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XCL") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YCL"), vm.$("ARGVAL"), null, vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ vm.$("XCL") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("YCL"), vm.$("A"), null, vm.$("ARYAD3") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("YCL"), vm.$("T"), vm.$("NONARY"), vm.$("ASSCR") ];
  } ], [ "ARYAD3", "MOVD", function () {
    return [ vm.$("WCL"), vm.$("XCL") ];
  } ], [ "ARYAD1", "ACOMPC", function () {
    return [ vm.$("XCL"), 0, null, vm.$("ARYAD2"), vm.$("ARYAD2") ];
  } ], [ null, "PUSH", function () {
    return [ [ vm.$("XCL"), vm.$("WCL"), vm.$("YCL") ] ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("INTVAL"), null, vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("YCL"), vm.$("WCL"), vm.$("XCL") ] ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("XCL"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARYAD1") ];
  } ], [ "ARYAD2", "MOVD", function () {
    return [ vm.$("ZPTR"), vm.$("ZEROCL") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZCL"), vm.$("YCL"), 2 * vm.$("DESCR") ];
  } ], [ null, "MULTC", function () {
    return [ vm.$("YPTR"), vm.$("ZCL"), vm.$("DESCR") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("YPTR"), vm.$("YCL"), vm.$("YPTR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("YPTR"), 2 * vm.$("DESCR") ];
  } ], [ "ARYAD7", "ACOMP", function () {
    return [ vm.$("WCL"), vm.$("ZCL"), vm.$("ARGNER"), vm.$("ARYAD9") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("ZEROCL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("WCL"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARYAD7") ];
  } ], [ "ARYAD9", "INCRA", function () {
    return [ vm.$("YCL"), 2 * vm.$("DESCR") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("WPTR"), vm.$("YCL"), vm.$("DESCR") ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("TPTR"), vm.$("WPTR") ];
  } ], [ "ARYA11", "POP", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "SUBTRT", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), vm.$("WPTR") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("XPTR"), 0, null, null, vm.$("FAIL") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("XPTR"), vm.$("TPTR"), vm.$("FAIL"), vm.$("FAIL") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("XPTR"), vm.$("ZPTR"), vm.$("XPTR") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("ZCL"), 1 ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("ZCL"), 0, null, vm.$("ARYA12") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("YCL"), vm.$("DESCR") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("WPTR"), vm.$("YCL"), vm.$("DESCR") ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("TPTR"), vm.$("WPTR") ];
  } ], [ null, "MULT", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), vm.$("TPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARYA11") ];
  } ], [ "ARYA12", "MULTC", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("XPTR"), vm.$("YPTR"), vm.$("XPTR") ];
  } ], [ "ARYA10", "SETVC", function () {
    return [ vm.$("XPTR"), vm.$("N") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTXNAM") ];
  } ], [ "ASSCR", "AEQLC", function () {
    return [ vm.$("XCL"), 1, vm.$("ARGNER") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("YCL") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("ARGVAL"), null, vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ vm.$("XPTR") ];
  } ], [ "ASSCR5", "LOCAPV", function () {
    return [ vm.$("WPTR"), vm.$("XPTR"), vm.$("YPTR"), null, vm.$("ASSCR4") ];
  } ], [ null, "LOCAPV", function () {
    return [ vm.$("WPTR"), vm.$("XPTR"), vm.$("ZEROCL"), vm.$("ASSCR2") ];
  } ], [ "ASSCR4", "MOVA", function () {
    return [ vm.$("XPTR"), vm.$("WPTR") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("XPTR"), 2 * vm.$("DESCR"), vm.$("YPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARYA10") ];
  } ], [ "ASSCR2", "GETSIZ", function () {
    return [ vm.$("TCL"), vm.$("XPTR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), vm.$("TCL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("ZPTR"), 1, null, vm.$("ASSCR3") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("XPTR"), vm.$("ZPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ASSCR5") ];
  } ], [ "ASSCR3", "DECRA", function () {
    return [ vm.$("TCL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("WPTR"), vm.$("XPTR"), vm.$("TCL") ];
  } ], [ null, "PUSH", function () {
    return [ [ vm.$("XPTR"), vm.$("TCL"), vm.$("YPTR") ] ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("XPTR"), vm.$("WPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("ASSOCE"), null, [ vm.$("INTR10"), vm.$("INTR10") ] ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("YPTR"), vm.$("TCL"), vm.$("XPTR") ] ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("ZPTR"), vm.$("B") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("TCL"), vm.$("DESCR") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("XPTR"), vm.$("TCL"), vm.$("ZPTR") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ZPTR"), 2 * vm.$("DESCR"), vm.$("YPTR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("XPTR"), vm.$("ZPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARYA10") ];
  } ], [ "DEFDAT", "PROC", function () {
    return [ null ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("XCL"), vm.$("INCL") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("WCL"), vm.$("XCL") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YCL"), vm.$("INCL") ];
  } ], [ null, "PSTACK", function () {
    return [ vm.$("YPTR") ];
  } ], [ "DEFD1", "INCRA", function () {
    return [ vm.$("OCICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("XPTR"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "TESTF", function () {
    return [ vm.$("XPTR"), vm.$("FNC"), null, vm.$("DEFDC") ];
  } ], [ "DEFD2", "AEQLC", function () {
    return [ vm.$("INSW"), 0, null, vm.$("DEFD8") ];
  } ], [ null, "LOCAPV", function () {
    return [ vm.$("ZPTR"), vm.$("INATL"), vm.$("XPTR"), vm.$("DEFD8") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("ZPTR"), vm.$("DESCR") ];
  } ], [ null, "PUSH", function () {
    return [ [ vm.$("XCL"), vm.$("WCL"), vm.$("YCL"), vm.$("YPTR") ] ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("PUTIN"), [ vm.$("ZPTR"), vm.$("XPTR") ], vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("YPTR"), vm.$("YCL"), vm.$("WCL"), vm.$("XCL") ] ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DEFD3") ];
  } ], [ "DEFD8", "GETDC", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ "DEFD3", "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("XCL"), 1 ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("XCL"), 0, vm.$("DEFD1"), null, vm.$("INTR10") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("XCL"), vm.$("YCL"), 0 ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("XCL"), vm.$("XCL") ];
  } ], [ "DEFD4", "ACOMP", function () {
    return [ vm.$("WCL"), vm.$("XCL"), vm.$("DEFD5"), vm.$("DEFD5") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("NULVCL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("WCL"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DEFD4") ];
  } ], [ "DEFD5", "GETDC", function () {
    return [ vm.$("WCL"), vm.$("YCL"), vm.$("DESCR") ];
  } ], [ null, "MULTC", function () {
    return [ vm.$("XCL"), vm.$("XCL"), vm.$("DESCR") ];
  } ], [ null, "MOVV", function () {
    return [ vm.$("XCL"), vm.$("WCL") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("BLOCK"), vm.$("XCL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("YPTR"), vm.$("DESCR") ];
  } ], [ null, "MOVBLK", function () {
    return [ vm.$("ZPTR"), vm.$("YPTR"), vm.$("XCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTZPTR") ];
  } ], [ "DEFDC", "PUSH", function () {
    return [ [ vm.$("XCL"), vm.$("WCL"), vm.$("YCL"), vm.$("YPTR") ] ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("INVOKE"), [ vm.$("XPTR") ], [ vm.$("FAIL"), vm.$("DEFDN") ] ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("YPTR"), vm.$("YCL"), vm.$("WCL"), vm.$("XCL") ] ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DEFD3") ];
  } ], [ "DEFDN", "POP", function () {
    return [ [ vm.$("YPTR"), vm.$("YCL"), vm.$("WCL"), vm.$("XCL") ] ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DEFD2") ];
  } ], [ "FIELD", "PROC", function () {
    return [ null ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("INCL") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("ARGVAL"), null, vm.$("FAIL") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("XPTR"), vm.$("NULVCL"), null, vm.$("NONAME") ];
  } ], [ null, "POP", function () {
    return [ vm.$("YCL") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("I"), vm.$("FIELD1") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GNVARI"), vm.$("XPTR") ];
  } ], [ "FIELD1", "MOVV", function () {
    return [ vm.$("DT1CL"), vm.$("XPTR") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("YPTR"), vm.$("YCL"), vm.$("DESCR") ];
  } ], [ null, "LOCAPT", function () {
    return [ vm.$("ZCL"), vm.$("YPTR"), vm.$("DT1CL"), vm.$("INTR1") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZCL"), vm.$("ZCL"), 2 * vm.$("DESCR") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), vm.$("ZCL") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("XPTR"), vm.$("N") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTXNAM") ];
  } ], [ null, "TITLE", function () {
    return [ "Input and Output" ];
  } ], [ "READ", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("IND"), null, vm.$("FAIL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("INTVAL"), null, vm.$("FAIL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("YPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("INTVAL"), null, vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("YPTR"), vm.$("XPTR") ] ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("YPTR"), 0, null, vm.$("READ5"), vm.$("UNTERR") ];
  } ], [ "READ6", "ACOMPC", function () {
    return [ vm.$("ZPTR"), 0, vm.$("READ2"), null, vm.$("LENERR") ];
  } ], [ null, "LOCAPT", function () {
    return [ vm.$("TPTR"), vm.$("INSATL"), vm.$("YPTR"), vm.$("READ4") ];
  } ], [ "READ3", "LOCAPV", function () {
    return [ vm.$("ZPTR"), vm.$("INATL"), vm.$("XPTR"), vm.$("READ1") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ZPTR"), vm.$("DESCR"), vm.$("TPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RETNUL") ];
  } ], [ "READ1", "RCALL", function () {
    return [ vm.$("INATL"), vm.$("AUGATL"), [ vm.$("INATL"), vm.$("TPTR"), vm.$("XPTR") ], vm.$("RETNUL") ];
  } ], [ "READ4", "MOVD", function () {
    return [ vm.$("ZPTR"), vm.$("DFLSIZ") ];
  } ], [ "READ2", "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("IOBLSZ") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("TPTR"), vm.$("DESCR"), vm.$("YPTR") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("TPTR"), 2 * vm.$("DESCR"), vm.$("ZPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("READ3") ];
  } ], [ "READ5", "SETAC", function () {
    return [ vm.$("YPTR"), vm.$("UNITI") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("READ6") ];
  } ], [ "PRINT", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("IND"), null, vm.$("FAIL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("INTVAL"), null, vm.$("FAIL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("YPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("YPTR"), vm.$("XPTR") ] ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("YPTR"), 0, null, vm.$("PRINT5"), vm.$("UNTERR") ];
  } ], [ "PRINT6", "AEQLC", function () {
    return [ vm.$("ZPTR"), 0, vm.$("PRINT2") ];
  } ], [ null, "LOCAPT", function () {
    return [ vm.$("TPTR"), vm.$("OTSATL"), vm.$("YPTR"), vm.$("PRINT4") ];
  } ], [ "PRINT3", "LOCAPV", function () {
    return [ vm.$("ZPTR"), vm.$("OUTATL"), vm.$("XPTR"), vm.$("PRINT1") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ZPTR"), vm.$("DESCR"), vm.$("TPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RETNUL") ];
  } ], [ "PRINT1", "RCALL", function () {
    return [ vm.$("OUTATL"), vm.$("AUGATL"), [ vm.$("OUTATL"), vm.$("TPTR"), vm.$("XPTR") ], vm.$("RETNUL") ];
  } ], [ "PRINT4", "MOVD", function () {
    return [ vm.$("ZPTR"), vm.$("DFLFST") ];
  } ], [ "PRINT2", "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("IOBLSZ") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("TPTR"), vm.$("DESCR"), vm.$("YPTR") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("TPTR"), 2 * vm.$("DESCR"), vm.$("ZPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("PRINT3") ];
  } ], [ "PRINT5", "SETAC", function () {
    return [ vm.$("YPTR"), vm.$("UNITO") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("PRINT6") ];
  } ], [ "BKSPCE", "PROC", function () {
    return [ null ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("IOOP") ];
  } ], [ "ENFILE", "PROC", function () {
    return [ vm.$("BKSPCE") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 2 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("IOOP") ];
  } ], [ "REWIND", "PROC", function () {
    return [ vm.$("BKSPCE") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 3 ];
  } ], [ "IOOP", "PUSH", function () {
    return [ vm.$("SCL") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XCL"), vm.$("INTVAL"), null, vm.$("FAIL") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("XCL"), 0, null, vm.$("UNTERR"), vm.$("UNTERR") ];
  } ], [ null, "POP", function () {
    return [ vm.$("SCL") ];
  } ], [ null, "SELBRA", function () {
    return [ vm.$("SCL"), [ null, vm.$("EOP"), vm.$("ROP") ] ];
  } ], [ null, "BKSPCE", function () {
    return [ vm.$("XCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RETNUL") ];
  } ], [ "EOP", "ENFILE", function () {
    return [ vm.$("XCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RETNUL") ];
  } ], [ "ROP", "REWIND", function () {
    return [ vm.$("XCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RETNUL") ];
  } ], [ "DETACH", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("IND"), null, vm.$("FAIL") ];
  } ], [ null, "LOCAPV", function () {
    return [ vm.$("ZPTR"), vm.$("INATL"), vm.$("XPTR"), vm.$("DTCH1") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ZPTR"), vm.$("DESCR"), vm.$("ZEROCL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ZPTR"), 2 * vm.$("DESCR"), vm.$("ZEROCL") ];
  } ], [ "DTCH1", "LOCAPV", function () {
    return [ vm.$("ZPTR"), vm.$("OUTATL"), vm.$("XPTR"), vm.$("RETNUL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ZPTR"), vm.$("DESCR"), vm.$("ZEROCL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("ZPTR"), 2 * vm.$("DESCR"), vm.$("ZEROCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RETNUL") ];
  } ], [ "PUTIN", "PROC", function () {
    return [ null ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("IO1PTR"), vm.$("IO2PTR") ] ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("IO3PTR"), vm.$("IO1PTR"), vm.$("DESCR") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("IO1PTR"), vm.$("IO1PTR"), 2 * vm.$("DESCR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("IO4PTR"), vm.$("CONVAR"), [ vm.$("IO1PTR") ] ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("IOSP"), vm.$("IO4PTR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("RSTAT"), 1 ];
  } ], [ null, "STREAD", function () {
    return [ vm.$("IOSP"), vm.$("IO3PTR"), vm.$("FAIL"), vm.$("COMP5") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("TRIMCL"), 0, null, vm.$("PUTIN1") ];
  } ], [ null, "TRIMSP", function () {
    return [ vm.$("IOSP"), vm.$("IOSP") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("IO1PTR"), vm.$("IOSP") ];
  } ], [ "PUTIN1", "ACOMP", function () {
    return [ vm.$("IO1PTR"), vm.$("MLENCL"), vm.$("INTR8") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("IO2PTR"), vm.$("K"), null, vm.$("PUTIN3") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("IO1PTR"), vm.$("GNVARS"), vm.$("IO1PTR") ];
  } ], [ "PUTIN2", "PUTDC", function () {
    return [ vm.$("IO2PTR"), vm.$("DESCR"), vm.$("IO1PTR") ];
  } ], [ null, "RRTURN", function () {
    return [ vm.$("IO1PTR"), 2 ];
  } ], [ "PUTIN3", "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("IO1PTR") ];
  } ], [ null, "SPCINT", function () {
    return [ vm.$("IO1PTR"), vm.$("XSP"), vm.$("INTR1"), vm.$("PUTIN2") ];
  } ], [ "PUTOUT", "PROC", function () {
    return [ null ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("IO1PTR"), vm.$("IO2PTR") ] ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("IO2PTR"), vm.$("S"), null, vm.$("PUTV") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("IO2PTR"), vm.$("I"), null, vm.$("PUTI") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("IO2PTR"), vm.$("DTREP"), vm.$("IO2PTR") ];
  } ], [ null, "GETSPC", function () {
    return [ vm.$("IOSP"), vm.$("IO2PTR"), 0 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("PUTVU") ];
  } ], [ "PUTV", "LOCSP", function () {
    return [ vm.$("IOSP"), vm.$("IO2PTR") ];
  } ], [ "PUTVU", "STPRNT", function () {
    return [ vm.$("IOKEY"), vm.$("IO1PTR"), vm.$("IOSP") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("WSTAT"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTN1") ];
  } ], [ "PUTI", "INTSPC", function () {
    return [ vm.$("IOSP"), vm.$("IO2PTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("PUTVU") ];
  } ], [ null, "TITLE", function () {
    return [ "Tracing Procedures and Functions" ];
  } ], [ "TRACE", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("IND"), null, vm.$("FAIL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("YPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("WPTR"), vm.$("ARGVAL"), null, vm.$("FAIL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("WPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("WPTR"), vm.$("YPTR"), vm.$("XPTR") ] ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("YPTR"), vm.$("NULVCL"), vm.$("TRAC5") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YPTR"), vm.$("VALTRS") ];
  } ], [ "TRAC5", "LOCAPV", function () {
    return [ vm.$("YPTR"), vm.$("TRATL"), vm.$("YPTR"), vm.$("TRAC1") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("YPTR"), vm.$("YPTR"), vm.$("DESCR") ];
  } ], [ "TRACEP", "PROC", function () {
    return [ vm.$("TRACE") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("TPTR"), vm.$("YPTR"), vm.$("DESCR") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("ZPTR"), vm.$("NULVCL"), null, vm.$("TRAC2") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("FINDEX"), [ vm.$("ZPTR") ] ];
  } ], [ "TRAC2", "SETAC", function () {
    return [ vm.$("XSIZ"), 5 * vm.$("DESCR") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("XSIZ"), vm.$("C") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XCL"), vm.$("BLOCK"), vm.$("XSIZ") ];
  } ], [ null, "MOVBLK", function () {
    return [ vm.$("XCL"), vm.$("TRCBLK"), vm.$("XSIZ") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("TPTR"), 2 ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("XCL"), 1 * vm.$("DESCR"), vm.$("TPTR") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("XCL"), 3 * vm.$("DESCR"), vm.$("XPTR") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("XCL"), 5 * vm.$("DESCR"), vm.$("WPTR") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("TPTR"), vm.$("YPTR"), 0 ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("TPTR"), 0, null, vm.$("TRAC4") ];
  } ], [ null, "LOCAPT", function () {
    return [ vm.$("TPTR"), vm.$("TPTR"), vm.$("XPTR"), vm.$("TRAC3") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("TPTR"), 2 * vm.$("DESCR"), vm.$("XCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RETNUL") ];
  } ], [ "TRAC3", "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("AUGATL"), [ vm.$("TPTR"), vm.$("XPTR"), vm.$("XCL") ] ];
  } ], [ "TRAC6", "PUTDC", function () {
    return [ vm.$("YPTR"), 0, vm.$("TPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RETNUL") ];
  } ], [ "TRAC1", "DEQL", function () {
    return [ vm.$("YPTR"), vm.$("FUNTCL"), vm.$("INTR30") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YPTR"), vm.$("TFNCLP") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TRACEP"), null, [ vm.$("INTR10"), vm.$("INTR10") ] ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YPTR"), vm.$("TFNRLP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("TRACEP") ];
  } ], [ "TRAC4", "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("TWOCL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("TPTR"), vm.$("DESCR"), vm.$("XPTR") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("TPTR"), 2 * vm.$("DESCR"), vm.$("XCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("TRAC6") ];
  } ], [ "STOPTR", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("IND"), null, vm.$("FAIL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("YPTR"), vm.$("NULVCL"), vm.$("STOPT2") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YPTR"), vm.$("VALTRS") ];
  } ], [ "STOPT2", "LOCAPV", function () {
    return [ vm.$("YPTR"), vm.$("TRATL"), vm.$("YPTR"), vm.$("STOPT1") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("YPTR"), vm.$("YPTR"), vm.$("DESCR") ];
  } ], [ "STOPTP", "PROC", function () {
    return [ vm.$("STOPTR") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("YPTR"), vm.$("YPTR"), 0 ];
  } ], [ null, "LOCAPT", function () {
    return [ vm.$("YPTR"), vm.$("YPTR"), vm.$("XPTR"), vm.$("FAIL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("YPTR"), vm.$("DESCR"), vm.$("ZEROCL") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("YPTR"), 2 * vm.$("DESCR"), vm.$("ZEROCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RETNUL") ];
  } ], [ "STOPT1", "DEQL", function () {
    return [ vm.$("YPTR"), vm.$("FUNTCL"), vm.$("INTR30") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YPTR"), vm.$("TFNCLP") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("STOPTP"), null, [ vm.$("FAIL"), vm.$("INTR10") ] ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YPTR"), vm.$("TFNRLP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("STOPTP") ];
  } ], [ "FENTR", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("WPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ "FENTR3", "SETLC", function () {
    return [ vm.$("PROTSP"), 0 ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("TRSTSP") ];
  } ], [ null, "INTSPC", function () {
    return [ vm.$("XSP"), vm.$("STNOCL") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("XSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("COLSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("TRLVSP") ];
  } ], [ null, "INTSPC", function () {
    return [ vm.$("XSP"), vm.$("LVLCL") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("XSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("TRCLSP") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("WPTR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("TCL"), vm.$("XSP") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("TCL"), vm.$("BUFLEN"), vm.$("FXOVR"), vm.$("FXOVR") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("XSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("LPRNSP") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("WCL"), 0 ];
  } ], [ "FNTRLP", "INCRA", function () {
    return [ vm.$("WCL"), 1 ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("ARGINT"), [ vm.$("WPTR"), vm.$("WCL") ], [ vm.$("FENTR4"), vm.$("INTR10") ] ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("ZPTR"), vm.$("DESCR") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("ZPTR"), vm.$("S"), null, vm.$("DEFTV") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("ZPTR"), vm.$("I"), null, vm.$("DEFTI") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("A2PTR"), vm.$("DTREP"), vm.$("ZPTR") ];
  } ], [ null, "GETSPC", function () {
    return [ vm.$("XSP"), vm.$("A2PTR"), 0 ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("SCL"), vm.$("XSP") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("TCL"), vm.$("TCL"), vm.$("SCL") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("TCL"), vm.$("BUFLEN"), vm.$("FXOVR"), vm.$("FXOVR") ];
  } ], [ "DEFTIA", "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("XSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DEFDTT") ];
  } ], [ "DEFTI", "INTSPC", function () {
    return [ vm.$("XSP"), vm.$("ZPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DEFTIA") ];
  } ], [ "DEFTV", "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("ZPTR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("SCL"), vm.$("XSP") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("TCL"), vm.$("TCL"), vm.$("SCL") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("TCL"), vm.$("BUFLEN"), vm.$("FXOVR"), vm.$("FXOVR") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("QTSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("XSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("QTSP") ];
  } ], [ "DEFDTT", "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("CMASP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FNTRLP") ];
  } ], [ "FENTR4", "AEQLC", function () {
    return [ vm.$("WCL"), 1, null, vm.$("FENTR5") ];
  } ], [ null, "SHORTN", function () {
    return [ vm.$("PROTSP"), 1 ];
  } ], [ "FENTR5", "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("RPRNSP") ];
  } ], [ null, "MSTIME", function () {
    return [ vm.$("ZPTR") ];
  } ], [ null, "SUBTRT", function () {
    return [ vm.$("ZPTR"), vm.$("ZPTR"), vm.$("ETMCL") ];
  } ], [ null, "INTSPC", function () {
    return [ vm.$("XSP"), vm.$("ZPTR") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("ETIMSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("XSP") ];
  } ], [ null, "STPRNT", function () {
    return [ vm.$("IOKEY"), vm.$("OUTBLK"), vm.$("PROTSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTNUL3") ];
  } ], [ "FENTR2", "PROC", function () {
    return [ vm.$("FENTR") ];
  } ], [ null, "POP", function () {
    return [ vm.$("WPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FENTR3") ];
  } ], [ "FXOVR", "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("PRTOVF") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTNUL3") ];
  } ], [ "KEYTR", "PROC", function () {
    return [ null ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("FNVLCL"), 1 ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("WPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("WPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YCL"), vm.$("KEYT"), [ vm.$("WPTR") ] ];
  } ], [ "KEYTR3", "SETLC", function () {
    return [ vm.$("PROTSP"), 0 ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("TRSTSP") ];
  } ], [ null, "INTSPC", function () {
    return [ vm.$("TSP"), vm.$("STNOCL") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("TSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("COLSP") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("FNVLCL"), 0, null, vm.$("KEYTR4") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("AMPSP") ];
  } ], [ "KEYTR4", "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("XSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("BLSP") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("FNVLCL"), 0, null, vm.$("KEYTR5") ];
  } ], [ null, "INTSPC", function () {
    return [ vm.$("YSP"), vm.$("YCL") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("EQLSP") ];
  } ], [ "KEYTR5", "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("YSP") ];
  } ], [ null, "MSTIME", function () {
    return [ vm.$("YPTR") ];
  } ], [ null, "SUBTRT", function () {
    return [ vm.$("YPTR"), vm.$("YPTR"), vm.$("ETMCL") ];
  } ], [ null, "INTSPC", function () {
    return [ vm.$("XSP"), vm.$("YPTR") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("ETIMSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("XSP") ];
  } ], [ null, "STPRNT", function () {
    return [ vm.$("IOKEY"), vm.$("OUTBLK"), vm.$("PROTSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTN2") ];
  } ], [ "LABTR", "PROC", function () {
    return [ vm.$("KEYTR") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("FNVLCL"), 0 ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("YSP"), vm.$("YPTR") ];
  } ], [ null, "SETSP", function () {
    return [ vm.$("XSP"), vm.$("XFERSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("KEYTR3") ];
  } ], [ "TRPHND", "PROC", function () {
    return [ null ];
  } ], [ null, "POP", function () {
    return [ vm.$("ATPTR") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("TRAPCL"), 1 ];
  } ], [ null, "PUSH", function () {
    return [ [ vm.$("LSTNCL"), vm.$("STNOCL"), vm.$("FRTNCL"), vm.$("OCBSCL"), vm.$("OCICL"), vm.$("TRAPCL"), vm.$("TRACL") ] ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("OCBSCL"), vm.$("ATPTR"), 2 * vm.$("DESCR") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("OCICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("XPTR"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("TRAPCL"), 0 ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("TRACL"), 0 ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("INVOKE"), vm.$("XPTR") ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("TRACL"), vm.$("TRAPCL"), vm.$("OCICL"), vm.$("OCBSCL"), vm.$("FRTNCL"), vm.$("STNOCL"), vm.$("LSTNCL") ] ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTN1") ];
  } ], [ "VALTR", "PROC", function () {
    return [ null ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("FNVLCL"), 1 ];
  } ], [ "VALTR2", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("IND"), null, vm.$("FAIL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ vm.$("XPTR") ];
  } ], [ "VALTR4", "SETLC", function () {
    return [ vm.$("TRACSP"), 0 ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("TRACSP"), vm.$("TRSTSP") ];
  } ], [ null, "INTSPC", function () {
    return [ vm.$("XSP"), vm.$("STNOCL") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("TRACSP"), vm.$("XSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("TRACSP"), vm.$("COLSP") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("FNVLCL"), 0, null, vm.$("FNEXT1") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("S"), vm.$("DEFDT") ];
  } ], [ "VALTR3", "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("TCL"), vm.$("XSP") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("TCL"), vm.$("BUFLEN"), vm.$("VXOVR"), vm.$("VXOVR") ];
  } ], [ "VALTR1", "APDSP", function () {
    return [ vm.$("TRACSP"), vm.$("XSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("TRACSP"), vm.$("BLEQSP") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("YPTR"), vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("YPTR"), vm.$("S"), null, vm.$("TRV") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("YPTR"), vm.$("I"), null, vm.$("TRI") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("DTREP"), vm.$("YPTR") ];
  } ], [ null, "GETSPC", function () {
    return [ vm.$("XSP"), vm.$("XPTR"), 0 ];
  } ], [ "TRI2", "APDSP", function () {
    return [ vm.$("TRACSP"), vm.$("XSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("TRPRT") ];
  } ], [ "TRV", "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("YPTR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("SCL"), vm.$("XSP") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("TCL"), vm.$("TCL"), vm.$("SCL") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("TCL"), vm.$("BUFLEN"), vm.$("VXOVR"), vm.$("VXOVR") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("TRACSP"), vm.$("QTSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("TRACSP"), vm.$("XSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("TRACSP"), vm.$("QTSP") ];
  } ], [ "TRPRT", "MSTIME", function () {
    return [ vm.$("YPTR") ];
  } ], [ null, "SUBTRT", function () {
    return [ vm.$("YPTR"), vm.$("YPTR"), vm.$("ETMCL") ];
  } ], [ null, "INTSPC", function () {
    return [ vm.$("XSP"), vm.$("YPTR") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("TRACSP"), vm.$("ETIMSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("TRACSP"), vm.$("XSP") ];
  } ], [ null, "STPRNT", function () {
    return [ vm.$("IOKEY"), vm.$("OUTBLK"), vm.$("TRACSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTNUL3") ];
  } ], [ "TRI", "INTSPC", function () {
    return [ vm.$("XSP"), vm.$("YPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("TRI2") ];
  } ], [ "DEFDT", "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("ZPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("VALTR1") ];
  } ], [ "FNEXTR", "PROC", function () {
    return [ vm.$("VALTR") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("FNVLCL"), 0 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("VALTR2") ];
  } ], [ "FNEXT1", "APDSP", function () {
    return [ vm.$("TRACSP"), vm.$("TRLVSP") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("XCL"), vm.$("LVLCL") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("XCL"), 1 ];
  } ], [ null, "INTSPC", function () {
    return [ vm.$("XSP"), vm.$("XCL") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("TRACSP"), vm.$("XSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("TRACSP"), vm.$("BLSP") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("RETPCL") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("TRACSP"), vm.$("XSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("TRACSP"), vm.$("OFSP") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("RETPCL"), vm.$("FRETCL"), vm.$("VALTR3") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("TCL"), vm.$("XSP") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("TCL"), vm.$("BUFLEN"), vm.$("VXOVR"), vm.$("VXOVR") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("TRACSP"), vm.$("XSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("TRPRT") ];
  } ], [ "FNEXT2", "PROC", function () {
    return [ vm.$("VALTR") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("FNVLCL"), 0 ];
  } ], [ null, "POP", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("VALTR4") ];
  } ], [ "VXOVR", "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("PRTOVF") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTNUL3") ];
  } ], [ null, "TITLE", function () {
    return [ "Other Operations" ];
  } ], [ "ASGN", "PROC", function () {
    return [ null ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("OCICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("XPTR"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "TESTF", function () {
    return [ vm.$("XPTR"), vm.$("FNC"), null, vm.$("ASGNC") ];
  } ], [ "ASGNV", "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("K"), null, vm.$("ASGNIC") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("OCICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("YPTR"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "TESTF", function () {
    return [ vm.$("YPTR"), vm.$("FNC"), null, vm.$("ASGNCV") ];
  } ], [ "ASGNVN", "AEQLC", function () {
    return [ vm.$("INSW"), 0, null, vm.$("ASGNV1") ];
  } ], [ null, "LOCAPV", function () {
    return [ vm.$("ZPTR"), vm.$("INATL"), vm.$("YPTR"), vm.$("ASGNV1") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("ZPTR"), vm.$("DESCR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("PUTIN"), [ vm.$("ZPTR"), vm.$("YPTR") ], [ vm.$("FAIL"), vm.$("ASGNVV") ] ];
  } ], [ "ASGNV1", "GETDC", function () {
    return [ vm.$("YPTR"), vm.$("YPTR"), vm.$("DESCR") ];
  } ], [ "ASGNVV", "PUTDC", function () {
    return [ vm.$("XPTR"), vm.$("DESCR"), vm.$("YPTR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("OUTSW"), 0, null, vm.$("ASGN1") ];
  } ], [ null, "LOCAPV", function () {
    return [ vm.$("ZPTR"), vm.$("OUTATL"), vm.$("XPTR"), vm.$("ASGN1") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("ZPTR"), vm.$("DESCR") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("PUTOUT"), [ vm.$("ZPTR"), vm.$("YPTR") ] ];
  } ], [ "ASGN1", "ACOMPC", function () {
    return [ vm.$("TRAPCL"), 0, null, vm.$("RTNUL3"), vm.$("RTNUL3") ];
  } ], [ null, "LOCAPT", function () {
    return [ vm.$("ATPTR"), vm.$("TVALL"), vm.$("XPTR"), vm.$("RTNUL3") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TRPHND"), vm.$("ATPTR"), vm.$("RTNUL3") ];
  } ], [ "ASGNC", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("INVOKE"), [ vm.$("XPTR") ], [ vm.$("FAIL"), vm.$("ASGNV"), vm.$("NEMO") ] ];
  } ], [ "ASGNCV", "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("INVOKE"), [ vm.$("YPTR") ], [ vm.$("FAIL"), vm.$("ASGNVP") ] ];
  } ], [ "ASGNCJ", "POP", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ASGNVV") ];
  } ], [ "ASGNVP", "POP", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ASGNVN") ];
  } ], [ "ASGNIC", "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("INTVAL"), null, [ vm.$("FAIL"), vm.$("ASGNCJ") ] ];
  } ], [ "CON", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("XYARGS"), null, vm.$("FAIL") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("XPTR"), vm.$("NULVCL"), null, vm.$("RTYPTR") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("YPTR"), vm.$("NULVCL"), null, vm.$("RTXPTR") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("S"), null, vm.$("CON5") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("P"), null, vm.$("CON5") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("I"), null, vm.$("CON4I") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("R"), null, vm.$("CON4R") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("E"), vm.$("INTR1") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("STARSZ") ];
  } ], [ null, "MOVBLK", function () {
    return [ vm.$("TPTR"), vm.$("STRPAT"), vm.$("STARSZ") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("TPTR"), 4 * vm.$("DESCR"), vm.$("XPTR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("XPTR"), vm.$("TPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("CON5") ];
  } ], [ "CON4R", "REALST", function () {
    return [ vm.$("REALSP"), vm.$("XPTR") ];
  } ], [ null, "SETSP", function () {
    return [ vm.$("XSP"), vm.$("REALSP") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), vm.$("XSPPTR"), vm.$("CON5") ];
  } ], [ "CON4I", "INTSPC", function () {
    return [ vm.$("ZSP"), vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GENVAR"), [ vm.$("ZSPPTR") ] ];
  } ], [ "CON5", "VEQLC", function () {
    return [ vm.$("YPTR"), vm.$("S"), null, vm.$("CON7") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("YPTR"), vm.$("P"), null, vm.$("CON7") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("YPTR"), vm.$("I"), null, vm.$("CON5I") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("YPTR"), vm.$("R"), null, vm.$("CON5R") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("YPTR"), vm.$("E"), vm.$("INTR1") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("STARSZ") ];
  } ], [ null, "MOVBLK", function () {
    return [ vm.$("TPTR"), vm.$("STRPAT"), vm.$("STARSZ") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("TPTR"), 4 * vm.$("DESCR"), vm.$("YPTR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YPTR"), vm.$("TPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("CON7") ];
  } ], [ "CON5R", "REALST", function () {
    return [ vm.$("REALSP"), vm.$("YPTR") ];
  } ], [ null, "SETSP", function () {
    return [ vm.$("YSP"), vm.$("REALSP") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("GENVAR"), vm.$("YSPPTR"), vm.$("CON7") ];
  } ], [ "CON5I", "INTSPC", function () {
    return [ vm.$("ZSP"), vm.$("YPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("GENVAR"), [ vm.$("ZSPPTR") ] ];
  } ], [ "CON7", "SETAV", function () {
    return [ vm.$("DTCL"), vm.$("XPTR") ];
  } ], [ null, "MOVV", function () {
    return [ vm.$("DTCL"), vm.$("YPTR") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("VVDTP"), null, vm.$("CONVV") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("VPDTP"), null, vm.$("CONVP") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("PVDTP"), null, vm.$("CONPV") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("PPDTP"), vm.$("INTR1"), vm.$("CONPP") ];
  } ], [ "CONVV", "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("YSP"), vm.$("YPTR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("XCL"), vm.$("XSP") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("YCL"), vm.$("YSP") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("XCL"), vm.$("XCL"), vm.$("YCL") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("XCL"), vm.$("MLENCL"), vm.$("INTR8") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("CONVAR"), [ vm.$("XCL") ] ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("TSP"), vm.$("ZPTR") ];
  } ], [ null, "SETLC", function () {
    return [ vm.$("TSP"), 0 ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("TSP"), vm.$("XSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("TSP"), vm.$("YSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("GENVSZ") ];
  } ], [ "CONVP", "LOCSP", function () {
    return [ vm.$("TSP"), vm.$("XPTR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("TMVAL"), vm.$("TSP") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("LNODSZ") ];
  } ], [ null, "MAKNOD", function () {
    return [ vm.$("XPTR"), vm.$("TPTR"), vm.$("TMVAL"), vm.$("ZEROCL"), vm.$("CHRCL"), vm.$("XPTR") ];
  } ], [ "CONPP", "GETSIZ", function () {
    return [ vm.$("XSIZ"), vm.$("XPTR") ];
  } ], [ null, "GETSIZ", function () {
    return [ vm.$("YSIZ"), vm.$("YPTR") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("TSIZ"), vm.$("XSIZ"), vm.$("YSIZ") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("TSIZ"), vm.$("P") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("TSIZ") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ZPTR"), vm.$("TPTR") ];
  } ], [ null, "LVALUE", function () {
    return [ vm.$("TVAL"), vm.$("YPTR") ];
  } ], [ null, "CPYPAT", function () {
    return [ vm.$("TPTR"), vm.$("XPTR"), vm.$("TVAL"), vm.$("ZEROCL"), vm.$("XSIZ"), vm.$("XSIZ") ];
  } ], [ null, "CPYPAT", function () {
    return [ vm.$("TPTR"), vm.$("YPTR"), vm.$("ZEROCL"), vm.$("XSIZ"), vm.$("ZEROCL"), vm.$("YSIZ") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTZPTR") ];
  } ], [ "CONPV", "LOCSP", function () {
    return [ vm.$("TSP"), vm.$("YPTR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("TMVAL"), vm.$("TSP") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("BLOCK"), vm.$("LNODSZ") ];
  } ], [ null, "MAKNOD", function () {
    return [ vm.$("YPTR"), vm.$("TPTR"), vm.$("TMVAL"), vm.$("ZEROCL"), vm.$("CHRCL"), vm.$("YPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("CONPP") ];
  } ], [ "IND", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("ARGVAL"), null, vm.$("FAIL") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("S"), null, vm.$("INDV") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("N"), null, vm.$("RTXNAM") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("I"), null, vm.$("GENVIX") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("K"), vm.$("INTR1"), vm.$("RTXNAM") ];
  } ], [ "INDV", "AEQLC", function () {
    return [ vm.$("XPTR"), 0, vm.$("RTXNAM"), vm.$("NONAME") ];
  } ], [ "KEYWRD", "PROC", function () {
    return [ null ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("OCICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("XPTR"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "TESTF", function () {
    return [ vm.$("XPTR"), vm.$("FNC"), null, vm.$("KEYC") ];
  } ], [ "KEYN", "LOCAPV", function () {
    return [ vm.$("XPTR"), vm.$("KNATL"), vm.$("XPTR"), vm.$("KEYV") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("XPTR"), vm.$("K") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTXNAM") ];
  } ], [ "KEYV", "LOCAPV", function () {
    return [ vm.$("ATPTR"), vm.$("KVATL"), vm.$("XPTR"), vm.$("UNKNKW") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("ATPTR"), vm.$("DESCR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTZPTR") ];
  } ], [ "KEYC", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("INVOKE"), [ vm.$("XPTR") ], [ vm.$("FAIL"), vm.$("KEYN"), vm.$("NEMO") ] ];
  } ], [ "KEYT", "PROC", function () {
    return [ vm.$("KEYWRD") ];
  } ], [ null, "POP", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("KEYN") ];
  } ], [ "LIT", "PROC", function () {
    return [ null ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("OCICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("ZPTR"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTZPTR") ];
  } ], [ "NAME", "PROC", function () {
    return [ null ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("OCICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("ZPTR"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "TESTF", function () {
    return [ vm.$("ZPTR"), vm.$("FNC"), vm.$("RTZPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("INVOKE"), vm.$("ZPTR"), [ vm.$("FAIL"), vm.$("RTZPTR"), vm.$("NEMO") ] ];
  } ], [ "NMD", "PROC", function () {
    return [ null ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("TCL"), vm.$("NHEDCL") ];
  } ], [ "NMD1", "ACOMP", function () {
    return [ vm.$("TCL"), vm.$("NAMICL"), vm.$("INTR13"), vm.$("RTN2") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("TPTR"), vm.$("NBSPTR"), vm.$("TCL") ];
  } ], [ null, "GETSPC", function () {
    return [ vm.$("TSP"), vm.$("TPTR"), vm.$("DESCR") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("TVAL"), vm.$("TPTR"), vm.$("DESCR") + vm.$("SPEC") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("XCL"), vm.$("TSP") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("XCL"), vm.$("MLENCL"), vm.$("INTR8") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("TVAL"), vm.$("E"), null, vm.$("NAMEXN") ];
  } ], [ "NMD5", "VEQLC", function () {
    return [ vm.$("TVAL"), vm.$("K"), null, vm.$("NMDIC") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("VVAL"), vm.$("GENVAR"), [ vm.$("TSPPTR") ] ];
  } ], [ "NMD4", "PUTDC", function () {
    return [ vm.$("TVAL"), vm.$("DESCR"), vm.$("VVAL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("OUTSW"), 0, null, vm.$("NMD3") ];
  } ], [ null, "LOCAPV", function () {
    return [ vm.$("ZPTR"), vm.$("OUTATL"), vm.$("TVAL"), vm.$("NMD3") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("ZPTR"), vm.$("ZPTR"), vm.$("DESCR") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("PUTOUT"), [ vm.$("ZPTR"), vm.$("VVAL") ] ];
  } ], [ "NMD3", "ACOMPC", function () {
    return [ vm.$("TRAPCL"), 0, null, vm.$("NMD2"), vm.$("NMD2") ];
  } ], [ null, "LOCAPT", function () {
    return [ vm.$("ATPTR"), vm.$("TVALL"), vm.$("TVAL"), vm.$("NMD2") ];
  } ], [ null, "PUSH", function () {
    return [ [ vm.$("TCL"), vm.$("NAMICL"), vm.$("NHEDCL") ] ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("NHEDCL"), vm.$("NAMICL") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TRPHND"), vm.$("ATPTR") ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("NHEDCL"), vm.$("NAMICL"), vm.$("TCL") ] ];
  } ], [ "NMD2", "INCRA", function () {
    return [ vm.$("TCL"), vm.$("DESCR") + vm.$("SPEC") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("NMD1") ];
  } ], [ "NMDIC", "SPCINT", function () {
    return [ vm.$("VVAL"), vm.$("TSP"), vm.$("INTR1"), vm.$("NMD4") ];
  } ], [ "NAMEXN", "RCALL", function () {
    return [ vm.$("TVAL"), vm.$("EXPEVL"), vm.$("TVAL"), [ vm.$("FAIL"), vm.$("NMD5"), vm.$("NEMO") ] ];
  } ], [ "STR", "PROC", function () {
    return [ null ];
  } ], [ null, "SUM", function () {
    return [ vm.$("ZPTR"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("CODSKP"), [ vm.$("ONECL") ] ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("ZPTR"), vm.$("E") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTZPTR") ];
  } ], [ null, "TITLE", function () {
    return [ "Other Predicates" ];
  } ], [ "DIFFER", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("XYARGS"), null, vm.$("FAIL") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("XPTR"), vm.$("YPTR"), vm.$("RETNUL"), vm.$("FAIL") ];
  } ], [ "IDENT", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("XYARGS"), null, vm.$("FAIL") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("XPTR"), vm.$("YPTR"), vm.$("FAIL"), vm.$("RETNUL") ];
  } ], [ "LGT", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("XPTR"), 0, null, vm.$("FAIL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("YPTR"), 0, null, vm.$("RETNUL") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("YSP"), vm.$("YPTR") ];
  } ], [ null, "LEXCMP", function () {
    return [ vm.$("XSP"), vm.$("YSP"), vm.$("RETNUL"), vm.$("FAIL"), vm.$("FAIL") ];
  } ], [ "NEG", "PROC", function () {
    return [ null ];
  } ], [ null, "PUSH", function () {
    return [ [ vm.$("OCBSCL"), vm.$("OCICL") ] ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("ARGVAL"), null, [ null, vm.$("FAIL") ] ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("OCICL"), vm.$("OCBSCL") ] ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("CODSKP"), [ vm.$("ONECL") ], vm.$("RETNUL") ];
  } ], [ "QUES", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("ARGVAL"), null, [ vm.$("FAIL"), vm.$("RETNUL") ] ];
  } ], [ null, "TITLE", function () {
    return [ "Other Functions" ];
  } ], [ "APPLY", "PROC", function () {
    return [ null ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("XCL"), vm.$("INCL") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("XCL"), 1 ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("XCL"), 1, null, null, vm.$("ARGNER") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XCL") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ vm.$("XCL") ];
  } ], [ null, "LOCAPV", function () {
    return [ vm.$("XPTR"), vm.$("FNCPL"), vm.$("XPTR"), vm.$("UNDF") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("INCL"), vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ null, "SETVA", function () {
    return [ vm.$("INCL"), vm.$("XCL") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("INVOKE"), [ vm.$("INCL") ], [ vm.$("FAIL"), null, vm.$("RTZPTR") ] ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("XPTR"), vm.$("ZPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTXNAM") ];
  } ], [ "ARG", "PROC", function () {
    return [ null ];
  } ], [ null, "PUSH", function () {
    return [ [ vm.$("ONECL"), vm.$("DEFCL") ] ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARG1") ];
  } ], [ "ARGINT", "PROC", function () {
    return [ vm.$("ARG") ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("XPTR"), vm.$("XCL") ] ];
  } ], [ null, "PUSH", function () {
    return [ [ vm.$("ONECL"), vm.$("DEFCL") ] ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARG2") ];
  } ], [ "LOCAL", "PROC", function () {
    return [ vm.$("ARG") ];
  } ], [ null, "PUSH", function () {
    return [ [ vm.$("ONECL"), vm.$("ZEROCL"), vm.$("DEFCL") ] ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARG1") ];
  } ], [ "FIELDS", "PROC", function () {
    return [ vm.$("ARG") ];
  } ], [ null, "PUSH", function () {
    return [ [ vm.$("ZEROCL"), vm.$("ZEROCL"), vm.$("DATCL") ] ];
  } ], [ "ARG1", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XCL"), vm.$("INTVAL"), null, vm.$("FAIL") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("ZEROCL"), vm.$("XCL"), vm.$("FAIL"), vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ vm.$("XPTR") ];
  } ], [ "ARG2", "LOCAPV", function () {
    return [ vm.$("XPTR"), vm.$("FNCPL"), vm.$("XPTR"), vm.$("INTR30") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("YCL"), vm.$("XPTR"), 0 ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("ZCL"), vm.$("ALCL") ] ];
  } ], [ null, "AEQL", function () {
    return [ vm.$("YCL"), vm.$("ZCL"), vm.$("INTR30") ];
  } ], [ null, "MULTC", function () {
    return [ vm.$("XCL"), vm.$("XCL"), vm.$("DESCR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("XCL"), 2 * vm.$("DESCR") ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("YCL"), vm.$("YCL") ];
  } ], [ null, "MULTC", function () {
    return [ vm.$("YCL"), vm.$("YCL"), vm.$("DESCR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("ALCL"), 0, null, vm.$("ARG4") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("YCL"), 2 * vm.$("DESCR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ZCL"), vm.$("YCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ARG5") ];
  } ], [ "ARG4", "GETSIZ", function () {
    return [ vm.$("ZCL"), vm.$("XPTR") ];
  } ], [ null, "POP", function () {
    return [ vm.$("ALCL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("ALCL"), 0, null, vm.$("ARG5") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("XCL"), vm.$("XCL"), vm.$("YCL") ];
  } ], [ "ARG5", "ACOMP", function () {
    return [ vm.$("XCL"), vm.$("ZCL"), vm.$("FAIL") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), vm.$("XCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTZPTR") ];
  } ], [ "CLEAR", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("ARGVAL"), null, vm.$("FAIL") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("DMPPTR"), vm.$("OBLIST") - vm.$("DESCR") ];
  } ], [ "CLEAR1", "ACOMP", function () {
    return [ vm.$("DMPPTR"), vm.$("OBEND"), vm.$("RETNUL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("DMPPTR"), vm.$("DESCR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YPTR"), vm.$("DMPPTR") ];
  } ], [ "CLEAR2", "GETAC", function () {
    return [ vm.$("YPTR"), vm.$("YPTR"), vm.$("LNKFLD") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("YPTR"), 0, null, vm.$("CLEAR1") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("YPTR"), vm.$("DESCR"), vm.$("NULVCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("CLEAR2") ];
  } ], [ "COLECT", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("INTVAL"), null, vm.$("FAIL") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("XPTR"), 0, null, null, vm.$("LENERR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("GC"), [ vm.$("XPTR") ], vm.$("FAIL") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("ZPTR"), vm.$("I") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTZPTR") ];
  } ], [ "COPY", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("ARGVAL"), null, vm.$("FAIL") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("S"), null, vm.$("INTR1") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("I"), null, vm.$("INTR1") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("R"), null, vm.$("INTR1") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("N"), null, vm.$("INTR1") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("K"), null, vm.$("INTR1") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("E"), null, vm.$("INTR1") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("T"), null, vm.$("INTR1") ];
  } ], [ null, "GETSIZ", function () {
    return [ vm.$("XCL"), vm.$("XPTR") ];
  } ], [ null, "MOVV", function () {
    return [ vm.$("XCL"), vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("BLOCK"), vm.$("XCL") ];
  } ], [ null, "MOVBLK", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), vm.$("XCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTZPTR") ];
  } ], [ "CNVRT", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("ARGVAL"), null, vm.$("FAIL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("ZPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ vm.$("ZPTR") ];
  } ], [ null, "LOCAPV", function () {
    return [ vm.$("XPTR"), vm.$("DTATL"), vm.$("YPTR"), vm.$("INTR1") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("XPTR"), vm.$("XPTR"), vm.$("DESCR") ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("DTCL"), vm.$("ZPTR") ];
  } ], [ null, "MOVV", function () {
    return [ vm.$("DTCL"), vm.$("XPTR") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("IVDTP"), null, vm.$("CNVIV") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("VCDTP"), null, vm.$("RECOMP") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("VEDTP"), null, vm.$("CONVE") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("VRDTP"), null, vm.$("CONVR") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("RIDTP"), null, vm.$("CONRI") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("IRDTP"), null, vm.$("CONIR") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("VIDTP"), null, vm.$("CNVVI") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("ATDTP"), null, vm.$("CNVAT") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("DTCL"), vm.$("TADTP"), null, vm.$("CNVTA") ];
  } ], [ null, "VEQL", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR"), null, vm.$("RTZPTR") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("S"), vm.$("FAIL"), vm.$("CNVRTS") ];
  } ], [ "RECOMP", "SETAC", function () {
    return [ vm.$("SCL"), 1 ];
  } ], [ "RECOMJ", "LOCSP", function () {
    return [ vm.$("TEXTSP"), vm.$("ZPTR") ];
  } ], [ "RECOMT", "GETLG", function () {
    return [ vm.$("OCALIM"), vm.$("TEXTSP") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("OCALIM"), 0, null, vm.$("RECOMN") ];
  } ], [ null, "MULTC", function () {
    return [ vm.$("OCALIM"), vm.$("OCALIM"), vm.$("DESCR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("OCALIM"), 6 * vm.$("DESCR") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("OCALIM"), vm.$("C") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("CMBSCL"), vm.$("BLOCK"), vm.$("OCALIM") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("OCLIM"), vm.$("CMBSCL"), vm.$("OCALIM") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("OCLIM"), 6 * vm.$("DESCR") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("CMOFCL"), 0 ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("ESAICL"), 0 ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("CMBSCL") ];
  } ], [ null, "SELBRA", function () {
    return [ vm.$("SCL"), [ null, vm.$("CONVEX") ] ];
  } ], [ "RECOM1", "LEQLC", function () {
    return [ vm.$("TEXTSP"), 0, null, vm.$("RECOM2") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("CMPILE"), null, [ vm.$("RECOMF"), null, vm.$("RECOM1") ] ];
  } ], [ "RECOM2", "SETAC", function () {
    return [ vm.$("SCL"), 3 ];
  } ], [ "RECOMQ", "INCRA", function () {
    return [ vm.$("CMOFCL"), vm.$("DESCR") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("CMBSCL"), vm.$("CMOFCL"), vm.$("ENDCL") ];
  } ], [ null, "POP", function () {
    return [ vm.$("ZPTR") ];
  } ], [ "RECOMZ", "SUM", function () {
    return [ vm.$("CMBSCL"), vm.$("CMBSCL"), vm.$("CMOFCL") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("SPLIT"), [ vm.$("CMBSCL") ] ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("OCLIM"), 0 ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("LPTR"), 0 ];
  } ], [ null, "ZERBLK", function () {
    return [ vm.$("COMREG"), vm.$("COMDCT") ];
  } ], [ null, "SELBRA", function () {
    return [ vm.$("SCL"), [ vm.$("FAIL"), vm.$("INTR10"), vm.$("RTZPTR") ] ];
  } ], [ "RECOMF", "SETAC", function () {
    return [ vm.$("SCL"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RECOMQ") ];
  } ], [ "RECOMN", "SETSP", function () {
    return [ vm.$("TEXTSP"), vm.$("BLSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RECOMT") ];
  } ], [ "CODER", "PROC", function () {
    return [ vm.$("CNVRT") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("VARVAL"), null, [ vm.$("FAIL"), vm.$("RECOMP") ] ];
  } ], [ "CONVE", "PROC", function () {
    return [ vm.$("CNVRT") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 2 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RECOMJ") ];
  } ], [ "CONVEX", "RCALL", function () {
    return [ vm.$("FORMND"), vm.$("EXPR"), null, vm.$("FAIL") ];
  } ], [ null, "LEQLC", function () {
    return [ vm.$("TEXTSP"), 0, vm.$("FAIL") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TREPUB"), vm.$("FORMND") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ZPTR"), vm.$("CMBSCL") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("ZPTR"), vm.$("E") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCL"), 3 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RECOMZ") ];
  } ], [ "CONVR", "LOCSP", function () {
    return [ vm.$("ZSP"), vm.$("ZPTR") ];
  } ], [ null, "SPCINT", function () {
    return [ vm.$("ZPTR"), vm.$("ZSP"), null, vm.$("CONIR") ];
  } ], [ null, "SPREAL", function () {
    return [ vm.$("ZPTR"), vm.$("ZSP"), vm.$("FAIL"), vm.$("RTZPTR") ];
  } ], [ "CONIR", "INTRL", function () {
    return [ vm.$("ZPTR"), vm.$("ZPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTZPTR") ];
  } ], [ "CONRI", "RLINT", function () {
    return [ vm.$("ZPTR"), vm.$("ZPTR"), vm.$("FAIL"), vm.$("RTZPTR") ];
  } ], [ "CNVIV", "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("GNVARI"), vm.$("ZPTR"), vm.$("RTZPTR") ];
  } ], [ "CNVVI", "LOCSP", function () {
    return [ vm.$("ZSP"), vm.$("ZPTR") ];
  } ], [ null, "SPCINT", function () {
    return [ vm.$("ZPTR"), vm.$("ZSP"), null, vm.$("RTZPTR") ];
  } ], [ null, "SPREAL", function () {
    return [ vm.$("ZPTR"), vm.$("ZSP"), vm.$("FAIL"), vm.$("CONRI") ];
  } ], [ "CNVRTS", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("DTREP"), vm.$("ZPTR") ];
  } ], [ null, "GETSPC", function () {
    return [ vm.$("ZSP"), vm.$("XPTR"), 0 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("GENVRZ") ];
  } ], [ "CNVTA", "MOVD", function () {
    return [ vm.$("YPTR"), vm.$("ZPTR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YCL"), vm.$("ZEROCL") ];
  } ], [ "CNVTA7", "GETSIZ", function () {
    return [ vm.$("XCL"), vm.$("YPTR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("WPTR"), vm.$("YPTR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ZCL"), vm.$("XCL") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("XCL"), 3 * vm.$("DESCR") ];
  } ], [ "CNVTA1", "GETD", function () {
    return [ vm.$("WCL"), vm.$("WPTR"), vm.$("XCL") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("WCL"), vm.$("NULVCL"), null, vm.$("CNVTA2") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("YCL"), 1 ];
  } ], [ "CNVTA2", "AEQLC", function () {
    return [ vm.$("XCL"), vm.$("DESCR"), null, vm.$("CNVTA6") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("XCL"), 2 * vm.$("DESCR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("CNVTA1") ];
  } ], [ "CNVTA6", "GETD", function () {
    return [ vm.$("YPTR"), vm.$("YPTR"), vm.$("ZCL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("YPTR"), 1, vm.$("CNVTA7") ];
  } ], [ "CNVTA4", "AEQLC", function () {
    return [ vm.$("YCL"), 0, null, vm.$("FAIL") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("WPTR"), vm.$("ZPTR") ];
  } ], [ null, "MULTC", function () {
    return [ vm.$("XCL"), vm.$("YCL"), 2 * vm.$("DESCR") ];
  } ], [ null, "INTSPC", function () {
    return [ vm.$("YSP"), vm.$("YCL") ];
  } ], [ null, "SETLC", function () {
    return [ vm.$("PROTSP"), 0 ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("YSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("CMASP") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("WCL"), vm.$("ZEROCL") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("WCL"), 2 ];
  } ], [ null, "INTSPC", function () {
    return [ vm.$("XSP"), vm.$("WCL") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("PROTSP"), vm.$("XSP") ];
  } ], [ null, "SETSP", function () {
    return [ vm.$("XSP"), vm.$("PROTSP") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("TPTR"), vm.$("GENVAR"), vm.$("XSPPTR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ZCL"), vm.$("XCL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("XCL"), 4 * vm.$("DESCR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("BLOCK"), vm.$("XCL") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("ZPTR"), vm.$("A") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ATPRCL"), vm.$("TPTR") ];
  } ], [ null, "SETVA", function () {
    return [ vm.$("ATEXCL"), vm.$("YCL") ];
  } ], [ null, "MOVBLK", function () {
    return [ vm.$("ZPTR"), vm.$("ATRHD"), vm.$("FRDSCL") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YPTR"), vm.$("ZPTR") ];
  } ], [ null, "MULTC", function () {
    return [ vm.$("YCL"), vm.$("YCL"), vm.$("DESCR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("YPTR"), 5 * vm.$("DESCR") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("TPTR"), vm.$("YPTR"), vm.$("YCL") ];
  } ], [ "CNVTA8", "GETSIZ", function () {
    return [ vm.$("WCL"), vm.$("WPTR") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("WCL"), 2 * vm.$("DESCR") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("WCL"), vm.$("WPTR"), vm.$("WCL") ];
  } ], [ "CNVTA3", "GETDC", function () {
    return [ vm.$("TCL"), vm.$("WPTR"), vm.$("DESCR") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("TCL"), vm.$("NULVCL"), null, vm.$("CNVTA5") ];
  } ], [ null, "PUTDC", function () {
    return [ vm.$("TPTR"), 0, vm.$("TCL") ];
  } ], [ null, "MOVDIC", function () {
    return [ vm.$("YPTR"), 0, vm.$("WPTR"), 2 * vm.$("DESCR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("YPTR"), vm.$("DESCR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("TPTR"), vm.$("DESCR") ];
  } ], [ "CNVTA5", "INCRA", function () {
    return [ vm.$("WPTR"), 2 * vm.$("DESCR") ];
  } ], [ null, "AEQL", function () {
    return [ vm.$("WCL"), vm.$("WPTR"), vm.$("CNVTA3") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("WPTR"), vm.$("WCL"), 2 * vm.$("DESCR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("WPTR"), 1, vm.$("CNVTA8") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("TPTR"), 0 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTZPTR") ];
  } ], [ "CNVAT", "GETDC", function () {
    return [ vm.$("XCL"), vm.$("ZPTR"), 2 * vm.$("DESCR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YPTR"), vm.$("ZPTR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("XCL"), 2, vm.$("FAIL") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("XCL"), vm.$("ZPTR"), 3 * vm.$("DESCR") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XCL"), 2, vm.$("FAIL") ];
  } ], [ null, "GETSIZ", function () {
    return [ vm.$("XCL"), vm.$("ZPTR") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("XCL"), 2 * vm.$("DESCR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("BLOCK"), vm.$("XCL") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("XPTR"), vm.$("T") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("YCL"), vm.$("ZPTR"), 4 * vm.$("DESCR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("ZPTR"), vm.$("XPTR") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("XPTR"), vm.$("XCL"), vm.$("ONECL") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("XCL"), vm.$("DESCR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("TCL"), vm.$("EXTVAL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("TCL"), 2 * vm.$("DESCR") ];
  } ], [ null, "PUTD", function () {
    return [ vm.$("XPTR"), vm.$("XCL"), vm.$("TCL") ];
  } ], [ null, "SETAV", function () {
    return [ vm.$("YCL"), vm.$("YCL") ];
  } ], [ null, "MULTC", function () {
    return [ vm.$("YCL"), vm.$("YCL"), vm.$("DESCR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("YPTR"), 5 * vm.$("DESCR") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("WPTR"), vm.$("YPTR"), vm.$("YCL") ];
  } ], [ "CNVAT2", "MOVDIC", function () {
    return [ vm.$("XPTR"), vm.$("DESCR"), vm.$("WPTR"), 0 ];
  } ], [ null, "MOVDIC", function () {
    return [ vm.$("XPTR"), 2 * vm.$("DESCR"), vm.$("YPTR"), 0 ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("YCL"), vm.$("DESCR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("YCL"), 0, null, vm.$("RTZPTR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("XPTR"), 2 * vm.$("DESCR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("WPTR"), vm.$("DESCR") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("YPTR"), vm.$("DESCR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("CNVAT2") ];
  } ], [ "DATE", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("ARGVAL"), null, vm.$("FAIL") ];
  } ], [ null, "DATE", function () {
    return [ vm.$("ZSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("GENVRZ") ];
  } ], [ "DT", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("A2PTR"), vm.$("ARGVAL"), null, vm.$("FAIL") ];
  } ], [ null, "MOVV", function () {
    return [ vm.$("DT1CL"), vm.$("A2PTR") ];
  } ], [ null, "LOCAPT", function () {
    return [ vm.$("A3PTR"), vm.$("DTATL"), vm.$("DT1CL"), vm.$("DTEXTN") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("A3PTR"), vm.$("A3PTR"), 2 * vm.$("DESCR") ];
  } ], [ "DTRTN", "RRTURN", function () {
    return [ vm.$("A3PTR"), 3 ];
  } ], [ "DTEXTN", "MOVD", function () {
    return [ vm.$("A3PTR"), vm.$("EXTPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DTRTN") ];
  } ], [ "DMP", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("INTVAL"), null, vm.$("FAIL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("XPTR"), 0, null, vm.$("RETNUL") ];
  } ], [ "DUMP", "PROC", function () {
    return [ vm.$("DMP") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("WPTR"), vm.$("OBLIST") - vm.$("DESCR") ];
  } ], [ "DMPB", "ACOMP", function () {
    return [ vm.$("WPTR"), vm.$("OBEND"), vm.$("RETNUL") ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("WPTR"), vm.$("DESCR") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YPTR"), vm.$("WPTR") ];
  } ], [ "DMPA", "GETAC", function () {
    return [ vm.$("YPTR"), vm.$("YPTR"), vm.$("LNKFLD") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("YPTR"), 0, null, vm.$("DMPB") ];
  } ], [ null, "GETDC", function () {
    return [ vm.$("XPTR"), vm.$("YPTR"), vm.$("DESCR") ];
  } ], [ null, "DEQL", function () {
    return [ vm.$("XPTR"), vm.$("NULVCL"), null, vm.$("DMPA") ];
  } ], [ null, "SETLC", function () {
    return [ vm.$("DMPSP"), 0 ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("YSP"), vm.$("YPTR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("YCL"), vm.$("YSP") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("YCL"), vm.$("BUFLEN"), vm.$("DMPOVR"), vm.$("DMPOVR") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("DMPSP"), vm.$("YSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("DMPSP"), vm.$("BLEQSP") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("S"), null, vm.$("DMPV") ];
  } ], [ null, "VEQLC", function () {
    return [ vm.$("XPTR"), vm.$("I"), null, vm.$("DMPI") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("A1PTR"), vm.$("DTREP"), vm.$("XPTR") ];
  } ], [ null, "GETSPC", function () {
    return [ vm.$("YSP"), vm.$("A1PTR"), 0 ];
  } ], [ "DMPX", "GETLG", function () {
    return [ vm.$("XCL"), vm.$("YSP") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("YCL"), vm.$("YCL"), vm.$("XCL") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("YCL"), vm.$("BUFLEN"), vm.$("DMPOVR") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("DMPSP"), vm.$("YSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DMPRT") ];
  } ], [ "DMPV", "LOCSP", function () {
    return [ vm.$("YSP"), vm.$("XPTR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("XCL"), vm.$("YSP") ];
  } ], [ null, "SUM", function () {
    return [ vm.$("YCL"), vm.$("YCL"), vm.$("XCL") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("YCL"), vm.$("BUFLEN"), vm.$("DMPOVR") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("DMPSP"), vm.$("QTSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("DMPSP"), vm.$("YSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("DMPSP"), vm.$("QTSP") ];
  } ], [ "DMPRT", "STPRNT", function () {
    return [ vm.$("IOKEY"), vm.$("OUTBLK"), vm.$("DMPSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DMPA") ];
  } ], [ "DMPI", "INTSPC", function () {
    return [ vm.$("YSP"), vm.$("XPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DMPX") ];
  } ], [ "DMPOVR", "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("PRTOVF") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("DMPA") ];
  } ], [ "DMK", "PROC", function () {
    return [ null ];
  } ], [ null, "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("PKEYF") ];
  } ], [ null, "GETSIZ", function () {
    return [ vm.$("XCL"), vm.$("KNLIST") ];
  } ], [ "DMPK1", "GETD", function () {
    return [ vm.$("XPTR"), vm.$("KNLIST"), vm.$("XCL") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("XCL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("YPTR"), vm.$("KNLIST"), vm.$("XCL") ];
  } ], [ null, "INTSPC", function () {
    return [ vm.$("YSP"), vm.$("YPTR") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "SETLC", function () {
    return [ vm.$("DMPSP"), 0 ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("DMPSP"), vm.$("AMPSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("DMPSP"), vm.$("XSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("DMPSP"), vm.$("BLEQSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("DMPSP"), vm.$("YSP") ];
  } ], [ null, "STPRNT", function () {
    return [ vm.$("IOKEY"), vm.$("OUTBLK"), vm.$("DMPSP") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("XCL"), vm.$("DESCR") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("XCL"), 0, vm.$("DMPK1"), vm.$("RTN1") ];
  } ], [ "DUPL", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("INTVAL"), null, vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("YPTR"), 0, null, vm.$("RETNUL"), vm.$("FAIL") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("XCL"), vm.$("XSP") ];
  } ], [ null, "MULT", function () {
    return [ vm.$("XCL"), vm.$("XCL"), vm.$("YPTR"), vm.$("AERROR") ];
  } ], [ null, "ACOMP", function () {
    return [ vm.$("XCL"), vm.$("MLENCL"), vm.$("INTR8") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("CONVAR"), vm.$("XCL") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("TSP"), vm.$("ZPTR") ];
  } ], [ null, "SETLC", function () {
    return [ vm.$("TSP"), 0 ];
  } ], [ "DUPL1", "APDSP", function () {
    return [ vm.$("TSP"), vm.$("XSP") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("YPTR"), 1 ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("YPTR"), 0, vm.$("DUPL1"), vm.$("GENVSZ") ];
  } ], [ "OPSYN", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("YPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("INTVAL"), null, vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("YPTR"), vm.$("XPTR") ] ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("XPTR"), 0, null, vm.$("NONAME") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("ZPTR"), 1, null, vm.$("UNYOP") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("ZPTR"), 2, null, vm.$("BNYOP") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("ZPTR"), 0, vm.$("INTR30") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("FINDEX"), vm.$("XPTR") ];
  } ], [ "UNBF", "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("FINDEX"), vm.$("YPTR") ];
  } ], [ "OPPD", "MOVDIC", function () {
    return [ vm.$("XPTR"), 0, vm.$("YPTR"), 0 ];
  } ], [ null, "MOVDIC", function () {
    return [ vm.$("XPTR"), vm.$("DESCR"), vm.$("YPTR"), vm.$("DESCR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RETNUL") ];
  } ], [ "UNYOP", "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "LEQLC", function () {
    return [ vm.$("XSP"), 1, vm.$("UNAF") ];
  } ], [ null, "SETSP", function () {
    return [ vm.$("ZSP"), vm.$("PROTSP") ];
  } ], [ null, "SETLC", function () {
    return [ vm.$("ZSP"), 0 ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("ZSP"), vm.$("XSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("ZSP"), vm.$("LPRNSP") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("TSP"), vm.$("ZSP"), vm.$("UNOPTB"), vm.$("UNAF"), vm.$("UNAF") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("XPTR"), vm.$("STYPE") ];
  } ], [ "UNCF", "LOCSP", function () {
    return [ vm.$("YSP"), vm.$("YPTR") ];
  } ], [ null, "LEQLC", function () {
    return [ vm.$("YSP"), 1, vm.$("UNBF") ];
  } ], [ null, "SETSP", function () {
    return [ vm.$("ZSP"), vm.$("PROTSP") ];
  } ], [ null, "SETLC", function () {
    return [ vm.$("ZSP"), 0 ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("ZSP"), vm.$("YSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("ZSP"), vm.$("LPRNSP") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("TSP"), vm.$("ZSP"), vm.$("UNOPTB"), vm.$("UNBF"), vm.$("UNBF") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YPTR"), vm.$("STYPE") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("OPPD") ];
  } ], [ "UNAF", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("FINDEX"), vm.$("XPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("UNCF") ];
  } ], [ "BNYOP", "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "LCOMP", function () {
    return [ vm.$("XSP"), vm.$("EQLSP"), vm.$("BNAF") ];
  } ], [ null, "SETSP", function () {
    return [ vm.$("ZSP"), vm.$("PROTSP") ];
  } ], [ null, "SETLC", function () {
    return [ vm.$("ZSP"), 0 ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("ZSP"), vm.$("XSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("ZSP"), vm.$("BLSP") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("TSP"), vm.$("ZSP"), vm.$("BIOPTB"), vm.$("BNAF"), vm.$("BNAF") ];
  } ], [ null, "LEQLC", function () {
    return [ vm.$("ZSP"), 0, vm.$("BNAF") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("XPTR"), vm.$("STYPE") ];
  } ], [ "BNCF", "LOCSP", function () {
    return [ vm.$("YSP"), vm.$("YPTR") ];
  } ], [ null, "LCOMP", function () {
    return [ vm.$("YSP"), vm.$("EQLSP"), vm.$("BNBF") ];
  } ], [ null, "SETSP", function () {
    return [ vm.$("ZSP"), vm.$("PROTSP") ];
  } ], [ null, "SETLC", function () {
    return [ vm.$("ZSP"), 0 ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("ZSP"), vm.$("YSP") ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("ZSP"), vm.$("BLSP") ];
  } ], [ null, "STREAM", function () {
    return [ vm.$("TSP"), vm.$("ZSP"), vm.$("BIOPTB"), vm.$("BNBF"), vm.$("BNBF") ];
  } ], [ null, "LEQLC", function () {
    return [ vm.$("ZSP"), 0, vm.$("BNBF") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YPTR"), vm.$("STYPE") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("OPPD") ];
  } ], [ "BNAF", "LEXCMP", function () {
    return [ vm.$("XSP"), vm.$("BLSP"), null, vm.$("BNCN") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("FINDEX"), vm.$("XPTR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("BNCF") ];
  } ], [ "BNCN", "MOVD", function () {
    return [ vm.$("XPTR"), vm.$("CONCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("BNCF") ];
  } ], [ "BNBF", "LEXCMP", function () {
    return [ vm.$("YSP"), vm.$("BLSP"), vm.$("UNBF"), null, vm.$("UNBF") ];
  } ], [ null, "MOVD", function () {
    return [ vm.$("YPTR"), vm.$("CONCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("OPPD") ];
  } ], [ "RPLACE", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("XPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("YPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("YPTR") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "POP", function () {
    return [ [ vm.$("YPTR"), vm.$("XPTR") ] ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("XPTR"), 0, null, vm.$("RTXPTR") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("YSP"), vm.$("YPTR") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("ZSP"), vm.$("ZPTR") ];
  } ], [ null, "LCOMP", function () {
    return [ vm.$("ZSP"), vm.$("YSP"), vm.$("FAIL"), null, vm.$("FAIL") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("YPTR"), 0, null, vm.$("FAIL") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("XCL"), vm.$("XSP") ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("CONVAR"), vm.$("XCL") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("TSP"), vm.$("ZPTR") ];
  } ], [ null, "SETLC", function () {
    return [ vm.$("TSP"), 0 ];
  } ], [ null, "APDSP", function () {
    return [ vm.$("TSP"), vm.$("XSP") ];
  } ], [ null, "RPLACE", function () {
    return [ vm.$("TSP"), vm.$("YSP"), vm.$("ZSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("GENVSZ") ];
  } ], [ "SIZE", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("XSP"), vm.$("XPTR") ];
  } ], [ null, "GETLG", function () {
    return [ vm.$("ZPTR"), vm.$("XSP") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("ZPTR"), vm.$("I") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTZPTR") ];
  } ], [ "TIME", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("ARGVAL"), null, vm.$("FAIL") ];
  } ], [ null, "MSTIME", function () {
    return [ vm.$("ZPTR") ];
  } ], [ null, "SUBTRT", function () {
    return [ vm.$("ZPTR"), vm.$("ZPTR"), vm.$("ETMCL") ];
  } ], [ null, "SETVC", function () {
    return [ vm.$("ZPTR"), vm.$("I") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("RTZPTR") ];
  } ], [ "TRIM", "PROC", function () {
    return [ null ];
  } ], [ null, "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("VARVAL"), null, vm.$("FAIL") ];
  } ], [ null, "LOCSP", function () {
    return [ vm.$("ZSP"), vm.$("XPTR") ];
  } ], [ null, "TRIMSP", function () {
    return [ vm.$("ZSP"), vm.$("ZSP") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("GENVRZ") ];
  } ], [ null, "TITLE", function () {
    return [ "Common Code" ];
  } ], [ "DATA", "LHERE", function () {
    return [ null ];
  } ], [ "RT1NUL", "RRTURN", function () {
    return [ vm.$("NULVCL"), 1 ];
  } ], [ "RTN1", "LHERE", function () {
    return [ null ];
  } ], [ "FAIL", "RRTURN", function () {
    return [ null, 1 ];
  } ], [ "RETNUL", "RRTURN", function () {
    return [ vm.$("NULVCL"), 3 ];
  } ], [ "RTN2", "RRTURN", function () {
    return [ null, 2 ];
  } ], [ "RTN3", "LHERE", function () {
    return [ null ];
  } ], [ "RTNUL3", "RRTURN", function () {
    return [ null, 3 ];
  } ], [ "RTXNAM", "RRTURN", function () {
    return [ vm.$("XPTR"), 2 ];
  } ], [ "RTXPTR", "RRTURN", function () {
    return [ vm.$("XPTR"), 3 ];
  } ], [ "RTYPTR", "RRTURN", function () {
    return [ vm.$("YPTR"), 3 ];
  } ], [ "ARTN", "INCRA", function () {
    return [ vm.$("ARTHCL"), 1 ];
  } ], [ "RTZPTR", "RRTURN", function () {
    return [ vm.$("ZPTR"), 3 ];
  } ], [ "A5RTN", "RRTURN", function () {
    return [ vm.$("A5PTR"), 1 ];
  } ], [ "TSALF", "BRANCH", function () {
    return [ vm.$("SALF"), vm.$("SCNR") ];
  } ], [ "TSALT", "BRANCH", function () {
    return [ vm.$("SALT"), vm.$("SCNR") ];
  } ], [ "TSCOK", "BRANCH", function () {
    return [ vm.$("SCOK"), vm.$("SCNR") ];
  } ], [ "GENVSZ", "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("GNVARS"), vm.$("XCL"), vm.$("RTZPTR") ];
  } ], [ "GENVRZ", "RCALL", function () {
    return [ vm.$("ZPTR"), vm.$("GENVAR"), vm.$("ZSPPTR"), vm.$("RTZPTR") ];
  } ], [ "GENVIX", "RCALL", function () {
    return [ vm.$("XPTR"), vm.$("GNVARI"), vm.$("XPTR"), vm.$("RTXNAM") ];
  } ], [ null, "TITLE", function () {
    return [ "Termination" ];
  } ], [ "END", "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("NRMEND"), [ vm.$("LVLCL") ] ];
  } ], [ null, "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("LASTSF"), [ vm.$("STNOCL") ] ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLEN2") ];
  } ], [ "FTLEND", "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("FTLCF"), [ vm.$("ERRTYP"), vm.$("STNOCL"), vm.$("LVLCL") ] ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("INICOM"), 0, vm.$("FTLEN3") ];
  } ], [ null, "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("ALOCFL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("ENDALL") ];
  } ], [ "FTLEN3", "MULTC", function () {
    return [ vm.$("YCL"), vm.$("ERRTYP"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("YCL"), vm.$("MSGNO"), vm.$("YCL") ];
  } ], [ null, "GETSPC", function () {
    return [ vm.$("TSP"), vm.$("YCL"), 0 ];
  } ], [ null, "STPRNT", function () {
    return [ vm.$("IOKEY"), vm.$("OUTBLK"), vm.$("TSP") ];
  } ], [ "FTLEN2", "ISTACK", function () {
    return [ null ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("ETMCL"), 0, vm.$("FTLEN4") ];
  } ], [ null, "MSTIME", function () {
    return [ vm.$("ETMCL") ];
  } ], [ null, "SUBTRT", function () {
    return [ vm.$("TIMECL"), vm.$("ETMCL"), vm.$("TIMECL") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("ETMCL"), 0 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLEN1") ];
  } ], [ "FTLEN4", "MSTIME", function () {
    return [ vm.$("XCL") ];
  } ], [ null, "SUBTRT", function () {
    return [ vm.$("ETMCL"), vm.$("XCL"), vm.$("ETMCL") ];
  } ], [ "FTLEN1", "AEQLC", function () {
    return [ vm.$("DMPCL"), 0, null, vm.$("END1") ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("NODPCL"), 0, vm.$("DMPNO") ];
  } ], [ null, "ORDVST", function () {
    return [ null ];
  } ], [ null, "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("STDMP") ];
  } ], [ null, "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("NVARF") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("DUMP"), null, [ vm.$("INTR10"), vm.$("INTR10"), vm.$("DMPK") ] ];
  } ], [ "DMPNO", "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("INCGCF") ];
  } ], [ null, "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("NODMPF") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("END1") ];
  } ], [ "DMPK", "RCALL", function () {
    return [ null, vm.$("DMK") ];
  } ], [ "END1", "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("STATHD") ];
  } ], [ null, "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("CMTIME"), [ vm.$("TIMECL") ] ];
  } ], [ null, "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("INTIME"), [ vm.$("ETMCL") ] ];
  } ], [ null, "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("EXNO"), [ vm.$("EXNOCL"), vm.$("FALCL") ] ];
  } ], [ null, "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("ARTHNO"), [ vm.$("ARTHCL") ] ];
  } ], [ null, "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("SCANNO"), [ vm.$("SCNCL") ] ];
  } ], [ null, "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("STGENO"), [ vm.$("GCNO") ] ];
  } ], [ null, "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("READNO"), [ vm.$("RSTAT") ] ];
  } ], [ null, "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("WRITNO"), [ vm.$("WSTAT") ] ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("EXNOCL"), 0, vm.$("END2") ];
  } ], [ null, "INTRL", function () {
    return [ vm.$("FCL"), vm.$("ZEROCL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("AVTIME") ];
  } ], [ "END2", "INTRL", function () {
    return [ vm.$("EXNOCL"), vm.$("EXNOCL") ];
  } ], [ null, "INTRL", function () {
    return [ vm.$("XCL"), vm.$("ETMCL") ];
  } ], [ null, "DVREAL", function () {
    return [ vm.$("FCL"), vm.$("XCL"), vm.$("EXNOCL") ];
  } ], [ "AVTIME", "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("TIMEPS"), [ vm.$("FCL") ] ];
  } ], [ "ENDALL", "ENDEX", function () {
    return [ vm.$("ABNDCL") ];
  } ], [ "SYSCUT", "OUTPUT", function () {
    return [ vm.$("OUTPUT"), vm.$("SYSCMT"), [ vm.$("STNOCL"), vm.$("LVLCL") ] ];
  } ], [ null, "AEQLC", function () {
    return [ vm.$("CUTNO"), 0, vm.$("ENDALL") ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("CUTNO"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLEN2") ];
  } ], [ null, "TITLE", function () {
    return [ "Error Handling" ];
  } ], [ "AERROR", "SETAC", function () {
    return [ vm.$("ERRTYP"), 2 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLTST") ];
  } ], [ "ALOC2", "SETAC", function () {
    return [ vm.$("ERRTYP"), 20 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLEND") ];
  } ], [ "ARGNER", "SETAC", function () {
    return [ vm.$("ERRTYP"), 25 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLEND") ];
  } ], [ "INTR10", "LHERE", function () {
    return [ null ];
  } ], [ "INTR13", "LHERE", function () {
    return [ null ];
  } ], [ "COMP3", "SETAC", function () {
    return [ vm.$("ERRTYP"), 17 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLEND") ];
  } ], [ "COMP5", "SETAC", function () {
    return [ vm.$("ERRTYP"), 11 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLTST") ];
  } ], [ "COMP7", "SETAC", function () {
    return [ vm.$("ERRTYP"), 27 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLEND") ];
  } ], [ "COMP9", "SETAC", function () {
    return [ vm.$("ERRTYP"), 26 ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("ESAICL"), vm.$("DESCR") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLEND") ];
  } ], [ "EROR", "SETAC", function () {
    return [ vm.$("ERRTYP"), 28 ];
  } ], [ null, "INCRA", function () {
    return [ vm.$("OCICL"), vm.$("DESCR") ];
  } ], [ null, "GETD", function () {
    return [ vm.$("STNOCL"), vm.$("OCBSCL"), vm.$("OCICL") ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLEND") ];
  } ], [ "EXEX", "SETAC", function () {
    return [ vm.$("ERRTYP"), 22 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLEND") ];
  } ], [ "INTR1", "SETAC", function () {
    return [ vm.$("ERRTYP"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLTST") ];
  } ], [ "INTR4", "SETAC", function () {
    return [ vm.$("ERRTYP"), 24 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLEND") ];
  } ], [ "INTR5", "SETAC", function () {
    return [ vm.$("ERRTYP"), 19 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLEND") ];
  } ], [ "INTR8", "SETAC", function () {
    return [ vm.$("ERRTYP"), 15 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLTST") ];
  } ], [ "INTR27", "SETAC", function () {
    return [ vm.$("ERRTYP"), 13 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLTST") ];
  } ], [ "INTR30", "SETAC", function () {
    return [ vm.$("ERRTYP"), 10 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLTST") ];
  } ], [ "INTR31", "SETAC", function () {
    return [ vm.$("ERRTYP"), 16 ];
  } ], [ null, "SETAC", function () {
    return [ vm.$("SCERCL"), 3 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTERST") ];
  } ], [ "LENERR", "SETAC", function () {
    return [ vm.$("ERRTYP"), 14 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLTST") ];
  } ], [ "MAIN1", "SETAC", function () {
    return [ vm.$("ERRTYP"), 18 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLEND") ];
  } ], [ "NEMO", "SETAC", function () {
    return [ vm.$("ERRTYP"), 8 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLTST") ];
  } ], [ "NONAME", "SETAC", function () {
    return [ vm.$("ERRTYP"), 4 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLTST") ];
  } ], [ "NONARY", "SETAC", function () {
    return [ vm.$("ERRTYP"), 3 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLTST") ];
  } ], [ "OVER", "SETAC", function () {
    return [ vm.$("ERRTYP"), 21 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLEND") ];
  } ], [ "PROTER", "SETAC", function () {
    return [ vm.$("ERRTYP"), 6 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLTST") ];
  } ], [ "SCDTER", "SETAC", function () {
    return [ vm.$("ERRTYP"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCERST") ];
  } ], [ "SCLENR", "SETAC", function () {
    return [ vm.$("ERRTYP"), 14 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCERST") ];
  } ], [ "SCLNOR", "SETAC", function () {
    return [ vm.$("ERRTYP"), 15 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCERST") ];
  } ], [ "SCNAME", "SETAC", function () {
    return [ vm.$("ERRTYP"), 4 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCERST") ];
  } ], [ "SCNEMO", "SETAC", function () {
    return [ vm.$("ERRTYP"), 8 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("SCERST") ];
  } ], [ "SIZERR", "SETAC", function () {
    return [ vm.$("ERRTYP"), 23 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLEND") ];
  } ], [ "UNDF", "SETAC", function () {
    return [ vm.$("ERRTYP"), 5 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLTST") ];
  } ], [ "UNDFFE", "SETAC", function () {
    return [ vm.$("ERRTYP"), 9 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLTST") ];
  } ], [ "UNKNKW", "SETAC", function () {
    return [ vm.$("ERRTYP"), 7 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLTST") ];
  } ], [ "UNTERR", "SETAC", function () {
    return [ vm.$("ERRTYP"), 12 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTLTST") ];
  } ], [ "SCERST", "SETAC", function () {
    return [ vm.$("SCERCL"), 1 ];
  } ], [ null, "BRANCH", function () {
    return [ vm.$("FTERST") ];
  } ], [ "FTLTST", "SETAC", function () {
    return [ vm.$("SCERCL"), 2 ];
  } ], [ "FTERST", "ACOMPC", function () {
    return [ vm.$("ERRLCL"), 0, null, vm.$("FTLEND"), vm.$("FTLEND") ];
  } ], [ null, "DECRA", function () {
    return [ vm.$("ERRLCL"), 1 ];
  } ], [ null, "ACOMPC", function () {
    return [ vm.$("TRAPCL"), 0, null, vm.$("FTERBR"), vm.$("FTERBR") ];
  } ], [ null, "LOCAPT", function () {
    return [ vm.$("ATPTR"), vm.$("TKEYL"), vm.$("ERRTKY"), vm.$("FTERBR") ];
  } ], [ null, "PUSH", function () {
    return [ vm.$("SCERCL") ];
  } ], [ null, "RCALL", function () {
    return [ null, vm.$("TRPHND"), vm.$("ATPTR") ];
  } ], [ null, "POP", function () {
    return [ vm.$("SCERCL") ];
  } ], [ "FTERBR", "SELBRA", function () {
    return [ vm.$("SCERCL"), [ vm.$("TSALF"), vm.$("FAIL"), vm.$("RTNUL3") ] ];
  } ], [ null, "TITLE", function () {
    return [ "Data" ];
  } ], [ "DTLIST", "DESCR", function () {
    return [ vm.$("DTLIST"), vm.$("TTL") + vm.$("MARK"), vm.$("DTLEND") - (vm.$("DTLIST") - vm.$("DESCR")) ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, vm.$("S") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("VARSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, vm.$("I") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("INTGSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, vm.$("P") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("PATSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, vm.$("A") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ARRSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, vm.$("R") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("RLSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, vm.$("C") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("CODESP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, vm.$("N") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("NAMESP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, vm.$("K") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("NAMESP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, vm.$("E") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("EXPSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, vm.$("T") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ASSCSP"), 0, 0 ];
  } ], [ "DTLEND", "LHERE", function () {
    return [ null ];
  } ], [ "KNLIST", "DESCR", function () {
    return [ vm.$("KNLIST"), vm.$("TTL") + vm.$("MARK"), vm.$("KNEND") - (vm.$("KNLIST") - vm.$("DESCR")) ];
  } ], [ "TRIMCL", "DESCR", function () {
    return [ 0, 0, vm.$("I") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("TRMSP"), 0, 0 ];
  } ], [ "TRAPCL", "DESCR", function () {
    return [ 0, 0, vm.$("I") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("TRCESP"), 0, 0 ];
  } ], [ "EXLMCL", "DESCR", function () {
    return [ 5e4, 0, vm.$("I") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("STLMSP"), 0, 0 ];
  } ], [ "OUTSW", "DESCR", function () {
    return [ 1, 0, vm.$("I") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("OUTSP"), 0, 0 ];
  } ], [ "MLENCL", "DESCR", function () {
    return [ 5e3, 0, vm.$("I") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MAXLSP"), 0, 0 ];
  } ], [ "INSW", "DESCR", function () {
    return [ 1, 0, vm.$("I") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("INSP"), 0, 0 ];
  } ], [ "FULLCL", "DESCR", function () {
    return [ 0, 0, vm.$("I") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("FULLSP"), 0, 0 ];
  } ], [ "TRACL", "DESCR", function () {
    return [ 0, 0, vm.$("I") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("FTRCSP"), 0, 0 ];
  } ], [ "ERRLCL", "DESCR", function () {
    return [ 0, 0, vm.$("I") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ERRLSP"), 0, 0 ];
  } ], [ "DMPCL", "DESCR", function () {
    return [ 0, 0, vm.$("I") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("DUMPSP"), 0, 0 ];
  } ], [ "RETCOD", "DESCR", function () {
    return [ 0, 0, vm.$("I") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("CODESP"), 0, 0 ];
  } ], [ "ANCCL", "DESCR", function () {
    return [ 0, 0, vm.$("I") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ANCHSP"), 0, 0 ];
  } ], [ "ABNDCL", "DESCR", function () {
    return [ 0, 0, vm.$("I") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ABNDSP"), 0, 0 ];
  } ], [ "KNEND", "LHERE", function () {
    return [ null ];
  } ], [ "KVLIST", "DESCR", function () {
    return [ vm.$("KVLIST"), vm.$("TTL") + vm.$("MARK"), vm.$("KVEND") - (vm.$("KVLIST") - vm.$("DESCR")) ];
  } ], [ "ERRTYP", "DESCR", function () {
    return [ 0, 0, vm.$("I") ];
  } ], [ "ERRTKY", "DESCR", function () {
    return [ vm.$("ERRTSP"), 0, 0 ];
  } ], [ "ARBPAT", "DESCR", function () {
    return [ vm.$("ARBPT"), 0, vm.$("P") ];
  } ], [ "ARBKY", "DESCR", function () {
    return [ vm.$("ARBSP"), 0, 0 ];
  } ], [ "BALPAT", "DESCR", function () {
    return [ vm.$("BALPT"), 0, vm.$("P") ];
  } ], [ "BALKY", "DESCR", function () {
    return [ vm.$("BALSP"), 0, 0 ];
  } ], [ "FNCPAT", "DESCR", function () {
    return [ vm.$("FNCEPT"), 0, vm.$("P") ];
  } ], [ "FNCEKY", "DESCR", function () {
    return [ vm.$("FNCESP"), 0, 0 ];
  } ], [ "ABOPAT", "DESCR", function () {
    return [ vm.$("ABORPT"), 0, vm.$("P") ];
  } ], [ "ABRTKY", "DESCR", function () {
    return [ vm.$("ABORSP"), 0, 0 ];
  } ], [ "FALPAT", "DESCR", function () {
    return [ vm.$("FAILPT"), 0, vm.$("P") ];
  } ], [ "FAILKY", "DESCR", function () {
    return [ vm.$("FAILSP"), 0, 0 ];
  } ], [ "REMPAT", "DESCR", function () {
    return [ vm.$("REMPT"), 0, vm.$("P") ];
  } ], [ "REMKY", "DESCR", function () {
    return [ vm.$("REMSP"), 0, 0 ];
  } ], [ "SUCPAT", "DESCR", function () {
    return [ vm.$("SUCCPT"), 0, vm.$("P") ];
  } ], [ "SUCCKY", "DESCR", function () {
    return [ vm.$("SUCCSP"), 0, 0 ];
  } ], [ "FALCL", "DESCR", function () {
    return [ 0, 0, vm.$("I") ];
  } ], [ "FALKY", "DESCR", function () {
    return [ vm.$("STFCSP"), 0, 0 ];
  } ], [ "LSTNCL", "DESCR", function () {
    return [ 0, 0, vm.$("I") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("LSTNSP"), 0, 0 ];
  } ], [ "RETPCL", "DESCR", function () {
    return [ 0, 0, vm.$("S") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("RTYPSP"), 0, 0 ];
  } ], [ "STNOCL", "DESCR", function () {
    return [ 0, 0, vm.$("I") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("STNOSP"), 0, 0 ];
  } ], [ "ALPHVL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ALNMSP"), 0, 0 ];
  } ], [ "EXNOCL", "DESCR", function () {
    return [ 0, 0, vm.$("I") ];
  } ], [ "STCTKY", "DESCR", function () {
    return [ vm.$("STCTSP"), 0, 0 ];
  } ], [ "LVLCL", "DESCR", function () {
    return [ 0, 0, vm.$("I") ];
  } ], [ "FNCLKY", "DESCR", function () {
    return [ vm.$("FNCLSP"), 0, 0 ];
  } ], [ "KVEND", "LHERE", function () {
    return [ null ];
  } ], [ "INLIST", "DESCR", function () {
    return [ vm.$("INLIST"), vm.$("TTL") + vm.$("MARK"), 2 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("INPUT") - vm.$("DESCR"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("INSP"), 0, 0 ];
  } ], [ "OTLIST", "DESCR", function () {
    return [ vm.$("OTLIST"), vm.$("TTL") + vm.$("MARK"), 4 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("OUTPUT") - vm.$("DESCR"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("OUTSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("PUNCH") - vm.$("DESCR"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("PNCHSP"), 0, 0 ];
  } ], [ "OTSATL", "DESCR", function () {
    return [ vm.$("OTSATL"), vm.$("TTL") + vm.$("MARK"), 4 * vm.$("DESCR") ];
  } ], [ "OUTPUT", "DESCR", function () {
    return [ vm.$("UNITO"), 0, vm.$("I") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("OUTPSP"), 0, 0 ];
  } ], [ "PUNCH", "DESCR", function () {
    return [ vm.$("UNITP"), 0, vm.$("I") ];
  } ], [ "PCHFST", "DESCR", function () {
    return [ vm.$("CRDFSP"), 0, 0 ];
  } ], [ "INSATL", "DESCR", function () {
    return [ vm.$("INSATL"), vm.$("TTL") + vm.$("MARK"), 2 * vm.$("DESCR") ];
  } ], [ "INPUT", "DESCR", function () {
    return [ vm.$("UNITI"), 0, vm.$("I") ];
  } ], [ "DFLSIZ", "DESCR", function () {
    return [ 80, 0, vm.$("I") ];
  } ], [ "TRLIST", "DESCR", function () {
    return [ vm.$("TRLIST"), vm.$("TTL") + vm.$("MARK"), 10 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("TVALL"), 0, 0 ];
  } ], [ "VALTRS", "DESCR", function () {
    return [ vm.$("VALSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("TLABL"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("TRLASP"), 0, 0 ];
  } ], [ "TFNCLP", "DESCR", function () {
    return [ vm.$("TFENTL"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("TRFRSP"), 0, 0 ];
  } ], [ "TFNRLP", "DESCR", function () {
    return [ vm.$("TFEXTL"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("RETSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("TKEYL"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("TRKYSP"), 0, 0 ];
  } ], [ "TRCBLK", "DESCR", function () {
    return [ vm.$("TRCBLK"), vm.$("TTL") + vm.$("MARK"), 5 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ 0, vm.$("FNC"), 2 ];
  } ], [ "LIT1CL", "DESCR", function () {
    return [ vm.$("LITFN"), vm.$("FNC"), 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("LITFN"), vm.$("FNC"), 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ATRHD", "DESCR", function () {
    return [ vm.$("ATPRCL") - vm.$("DESCR"), 0, 0 ];
  } ], [ "ATPRCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 2, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 1, 0, 2 ];
  } ], [ "ATEXCL", "DESCR", function () {
    return [ 1, 0, 0 ];
  } ], [ "ATDTP", "DESCR", function () {
    return [ vm.$("A"), 0, vm.$("T") ];
  } ], [ "IIDTP", "DESCR", function () {
    return [ vm.$("I"), 0, vm.$("I") ];
  } ], [ "IPDTP", "DESCR", function () {
    return [ vm.$("I"), 0, vm.$("P") ];
  } ], [ "IRDTP", "DESCR", function () {
    return [ vm.$("I"), 0, vm.$("R") ];
  } ], [ "IVDTP", "DESCR", function () {
    return [ vm.$("I"), 0, vm.$("S") ];
  } ], [ "PIDTP", "DESCR", function () {
    return [ vm.$("P"), 0, vm.$("I") ];
  } ], [ "PPDTP", "DESCR", function () {
    return [ vm.$("P"), 0, vm.$("P") ];
  } ], [ "PVDTP", "DESCR", function () {
    return [ vm.$("P"), 0, vm.$("S") ];
  } ], [ "RIDTP", "DESCR", function () {
    return [ vm.$("R"), 0, vm.$("I") ];
  } ], [ "RPDTP", "DESCR", function () {
    return [ vm.$("R"), 0, vm.$("P") ];
  } ], [ "RRDTP", "DESCR", function () {
    return [ vm.$("R"), 0, vm.$("R") ];
  } ], [ "RVDTP", "DESCR", function () {
    return [ vm.$("R"), 0, vm.$("S") ];
  } ], [ "TADTP", "DESCR", function () {
    return [ vm.$("T"), 0, vm.$("A") ];
  } ], [ "VCDTP", "DESCR", function () {
    return [ vm.$("S"), 0, vm.$("C") ];
  } ], [ "VEDTP", "DESCR", function () {
    return [ vm.$("S"), 0, vm.$("E") ];
  } ], [ "VIDTP", "DESCR", function () {
    return [ vm.$("S"), 0, vm.$("I") ];
  } ], [ "VPDTP", "DESCR", function () {
    return [ vm.$("S"), 0, vm.$("P") ];
  } ], [ "VRDTP", "DESCR", function () {
    return [ vm.$("S"), 0, vm.$("R") ];
  } ], [ "VVDTP", "DESCR", function () {
    return [ vm.$("S"), 0, vm.$("S") ];
  } ], [ "ARTHCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "CSTNCL", "DESCR", function () {
    return [ 0, 0, vm.$("I") ];
  } ], [ "RSTAT", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "SCNCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "WSTAT", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "TIMECL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ALCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ARRMRK", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "CUTNO", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "CNSLCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "DATACL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "FNVLCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "INICOM", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "LENFCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "LISTCL", "DESCR", function () {
    return [ 1, 0, 0 ];
  } ], [ "LLIST", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "NAMGCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "SCERCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ARBSIZ", "DESCR", function () {
    return [ 8 * vm.$("NODESZ"), 0, 0 ];
  } ], [ "CHARCL", "DESCR", function () {
    return [ 1, 0, 0 ];
  } ], [ "CNDSIZ", "DESCR", function () {
    return [ vm.$("CNODSZ"), 0, vm.$("B") ];
  } ], [ "CODELT", "DESCR", function () {
    return [ 200 * vm.$("DESCR"), 0, vm.$("C") ];
  } ], [ "DSCRTW", "DESCR", function () {
    return [ 2 * vm.$("DESCR"), 0, 0 ];
  } ], [ "EOSCL", "DESCR", function () {
    return [ vm.$("EOSTYP"), 0, 0 ];
  } ], [ "ESALIM", "DESCR", function () {
    return [ vm.$("ESASIZ") * vm.$("DESCR"), 0, 0 ];
  } ], [ "EXTVAL", "DESCR", function () {
    return [ vm.$("EXTSIZ") * 2 * vm.$("DESCR"), 0, 0 ];
  } ], [ "FBLKRQ", "DESCR", function () {
    return [ vm.$("FBLKSZ"), 0, vm.$("B") ];
  } ], [ "GOBRCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "GTOCL", "DESCR", function () {
    return [ vm.$("FGOTYP"), 0, 0 ];
  } ], [ "IOBLSZ", "DESCR", function () {
    return [ 2 * vm.$("DESCR"), 0, vm.$("B") ];
  } ], [ "LNODSZ", "DESCR", function () {
    return [ vm.$("NODESZ") + vm.$("DESCR"), 0, vm.$("P") ];
  } ], [ "NODSIZ", "DESCR", function () {
    return [ vm.$("NODESZ"), 0, vm.$("P") ];
  } ], [ "OBEND", "DESCR", function () {
    return [ vm.$("OBLIST") + vm.$("DESCR") * vm.$("OBOFF"), 0, 0 ];
  } ], [ "OCALIM", "DESCR", function () {
    return [ vm.$("OCASIZ") * vm.$("DESCR"), 0, vm.$("C") ];
  } ], [ "ONECL", "DESCR", function () {
    return [ 1, 0, 0 ];
  } ], [ "OUTBLK", "DESCR", function () {
    return [ vm.$("OUTPUT") - vm.$("DESCR"), 0, 0 ];
  } ], [ "SIZLMT", "DESCR", function () {
    return [ vm.$("SIZLIM"), 0, 0 ];
  } ], [ "SNODSZ", "DESCR", function () {
    return [ vm.$("NODESZ"), 0, vm.$("P") ];
  } ], [ "STARSZ", "DESCR", function () {
    return [ 11 * vm.$("DESCR"), 0, vm.$("P") ];
  } ], [ "ZEROCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "TRSKEL", "DESCR", function () {
    return [ vm.$("TRCBLK"), 0, 0 ];
  } ], [ "COMDCT", "DESCR", function () {
    return [ 14 * vm.$("DESCR"), 0, 0 ];
  } ], [ "COMREG", "DESCR", function () {
    return [ vm.$("ELEMND"), 0, 0 ];
  } ], [ "ARBACK", "DESCR", function () {
    return [ vm.$("ARBAK"), 0, vm.$("P") ];
  } ], [ "ARHEAD", "DESCR", function () {
    return [ vm.$("ARHED"), 0, vm.$("P") ];
  } ], [ "ARTAIL", "DESCR", function () {
    return [ vm.$("ARTAL"), 0, vm.$("P") ];
  } ], [ "STRPAT", "DESCR", function () {
    return [ vm.$("STARPT"), 0, vm.$("P") ];
  } ], [ "ANYCCL", "DESCR", function () {
    return [ vm.$("ANYCFN"), vm.$("FNC"), 3 ];
  } ], [ "ASGNCL", "DESCR", function () {
    return [ vm.$("ASGNFN"), vm.$("FNC"), 2 ];
  } ], [ "ATOPCL", "DESCR", function () {
    return [ vm.$("ATOPFN"), vm.$("FNC"), 3 ];
  } ], [ "BASECL", "DESCR", function () {
    return [ vm.$("BASEFN"), vm.$("FNC"), 0 ];
  } ], [ "BRKCCL", "DESCR", function () {
    return [ vm.$("BRKCFN"), vm.$("FNC"), 3 ];
  } ], [ "CHRCL", "DESCR", function () {
    return [ vm.$("CHRFN"), vm.$("FNC"), 3 ];
  } ], [ "CONCL", "DESCR", function () {
    return [ vm.$("CONFN"), vm.$("FNC"), 0 ];
  } ], [ "DNMECL", "DESCR", function () {
    return [ vm.$("DNMEFN"), vm.$("FNC"), 2 ];
  } ], [ "DNMICL", "DESCR", function () {
    return [ vm.$("DNMIFN"), vm.$("FNC"), 2 ];
  } ], [ "ENDCL", "DESCR", function () {
    return [ vm.$("ENDFN"), vm.$("FNC"), 0 ];
  } ], [ "ENMECL", "DESCR", function () {
    return [ vm.$("ENMEFN"), vm.$("FNC"), 3 ];
  } ], [ "ENMICL", "DESCR", function () {
    return [ vm.$("ENMIFN"), vm.$("FNC"), 3 ];
  } ], [ "ERORCL", "DESCR", function () {
    return [ vm.$("ERORFN"), vm.$("FNC"), 1 ];
  } ], [ "FNCFCL", "DESCR", function () {
    return [ vm.$("FNCFFN"), vm.$("FNC"), 2 ];
  } ], [ "FNMECL", "DESCR", function () {
    return [ vm.$("FNMEFN"), vm.$("FNC"), 2 ];
  } ], [ "GOTGCL", "DESCR", function () {
    return [ vm.$("GOTGFN"), vm.$("FNC"), 1 ];
  } ], [ "GOTLCL", "DESCR", function () {
    return [ vm.$("GOTLFN"), vm.$("FNC"), 1 ];
  } ], [ "GOTOCL", "DESCR", function () {
    return [ vm.$("GOTOFN"), vm.$("FNC"), 1 ];
  } ], [ "INITCL", "DESCR", function () {
    return [ vm.$("INITFN"), vm.$("FNC"), 1 ];
  } ], [ "ITEMCL", "DESCR", function () {
    return [ vm.$("AREFN"), vm.$("FNC"), 0 ];
  } ], [ "LITCL", "DESCR", function () {
    return [ vm.$("LITFN"), vm.$("FNC"), 0 ];
  } ], [ "LNTHCL", "DESCR", function () {
    return [ vm.$("LNTHFN"), vm.$("FNC"), 3 ];
  } ], [ "NMECL", "DESCR", function () {
    return [ vm.$("NMEFN"), vm.$("FNC"), 2 ];
  } ], [ "NNYCCL", "DESCR", function () {
    return [ vm.$("NNYCFN"), vm.$("FNC"), 3 ];
  } ], [ "POSICL", "DESCR", function () {
    return [ vm.$("POSIFN"), vm.$("FNC"), 3 ];
  } ], [ "RPSICL", "DESCR", function () {
    return [ vm.$("RPSIFN"), vm.$("FNC"), 3 ];
  } ], [ "RTBCL", "DESCR", function () {
    return [ vm.$("RTBFN"), vm.$("FNC"), 3 ];
  } ], [ "SCANCL", "DESCR", function () {
    return [ vm.$("SCANFN"), vm.$("FNC"), 2 ];
  } ], [ "SCFLCL", "DESCR", function () {
    return [ vm.$("SCFLFN"), vm.$("FNC"), 2 ];
  } ], [ "SCOKCL", "DESCR", function () {
    return [ vm.$("SCOKFN"), vm.$("FNC"), 2 ];
  } ], [ "SCONCL", "DESCR", function () {
    return [ vm.$("SCONFN"), vm.$("FNC"), 2 ];
  } ], [ "SJSRCL", "DESCR", function () {
    return [ vm.$("SJSRFN"), vm.$("FNC"), 3 ];
  } ], [ "SPNCCL", "DESCR", function () {
    return [ vm.$("SPNCFN"), vm.$("FNC"), 3 ];
  } ], [ "SUCFCL", "DESCR", function () {
    return [ vm.$("SUCFFN"), vm.$("FNC"), 2 ];
  } ], [ "TBCL", "DESCR", function () {
    return [ vm.$("TBFN"), vm.$("FNC"), 3 ];
  } ], [ "INITB", "DESCR", function () {
    return [ vm.$("ABNDB"), 0, 0 ];
  } ], [ "INITE", "DESCR", function () {
    return [ vm.$("DTEND") + vm.$("DESCR"), 0, 0 ];
  } ], [ "A4PTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "A5PTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "A6PTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "A7PTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "BRTYPE", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "CMOFCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "DATSEG", "DESCR", function () {
    return [ 0, 0, 100 ];
  } ], [ "DMPPTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "DTCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "DT1CL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "EMSGCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ERRBAS", "DESCR", function () {
    return [ vm.$("CARDSZ") + (vm.$("STNOSZ") - vm.$("SEQSIZ")), 0, 0 ];
  } ], [ "ESAICL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ETMCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "FCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "NEXFCL", "DESCR", function () {
    return [ vm.$("FBLKSZ"), 0, 0 ];
  } ], [ "FRTNCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "GOGOCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "INCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "IOKEY", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "MAXLEN", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "MSGNO", "DESCR", function () {
    return [ vm.$("MSGLST"), 0, 0 ];
  } ], [ "NAMICL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "NHEDCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "NMOVER", "DESCR", function () {
    return [ vm.$("NAMLSZ") * vm.$("SPDR"), 0, vm.$("B") ];
  } ], [ "NULVCL", "DESCR", function () {
    return [ 0, 0, vm.$("S") ];
  } ], [ "OCICL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "PATICL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "PDLEND", "DESCR", function () {
    return [ vm.$("PDLBLK") + (vm.$("SPDLDR") - vm.$("NODESZ")), 0, 0 ];
  } ], [ "PDLPTR", "DESCR", function () {
    return [ vm.$("PDLBLK"), 0, 0 ];
  } ], [ "SCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "STKPTR", "DESCR", function () {
    return [ vm.$("STACK"), 0, 0 ];
  } ], [ "STYPE", "DESCR", function () {
    return [ 0, vm.$("FNC"), 0 ];
  } ], [ "TBLFNC", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "UNIT", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "VARSYM", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "DATCL", "DESCR", function () {
    return [ vm.$("DEFDAT"), vm.$("FNC"), 0 ];
  } ], [ "DEFCL", "DESCR", function () {
    return [ vm.$("DEFFNC"), vm.$("FNC"), 0 ];
  } ], [ "FLDCL", "DESCR", function () {
    return [ vm.$("FIELD"), 0, 1 ];
  } ], [ "LODCL", "DESCR", function () {
    return [ vm.$("LNKFNC"), vm.$("FNC"), 0 ];
  } ], [ "PDLHED", "DESCR", function () {
    return [ vm.$("PDLBLK"), 0, 0 ];
  } ], [ "UNDFCL", "DESCR", function () {
    return [ vm.$("UNDF"), vm.$("FNC"), 0 ];
  } ], [ "DPSPTR", "DESCR", function () {
    return [ vm.$("DPSP"), 0, 0 ];
  } ], [ "XSPPTR", "DESCR", function () {
    return [ vm.$("XSP"), 0, 0 ];
  } ], [ "YSPPTR", "DESCR", function () {
    return [ vm.$("YSP"), 0, 0 ];
  } ], [ "ZSPPTR", "DESCR", function () {
    return [ vm.$("ZSP"), 0, 0 ];
  } ], [ "TSPPTR", "DESCR", function () {
    return [ vm.$("TSP"), 0, 0 ];
  } ], [ "KNATL", "DESCR", function () {
    return [ vm.$("KNLIST"), 0, 0 ];
  } ], [ "KVATL", "DESCR", function () {
    return [ vm.$("KVLIST"), 0, 0 ];
  } ], [ "TRATL", "DESCR", function () {
    return [ vm.$("TRLIST"), 0, 0 ];
  } ], [ "BLNSP", "SPEC", function () {
    return [ vm.$("BLNBUF"), 0, 0, 0, vm.$("STNOSZ") ];
  } ], [ "ERRSP", "SPEC", function () {
    return [ vm.$("ERRBUF"), 0, 0, 0, vm.$("CARDSZ") + (vm.$("STNOSZ") - (vm.$("SEQSIZ") + 1)) ];
  } ], [ "INBFSP", "SPEC", function () {
    return [ vm.$("INBUF"), 0, 0, vm.$("STNOSZ"), vm.$("CARDSZ") ];
  } ], [ "LNBFSP", "SPEC", function () {
    return [ vm.$("INBUF"), 0, 0, 0, vm.$("CARDSZ") + (vm.$("DSTSZ") + 1) ];
  } ], [ "NEXTSP", "SPEC", function () {
    return [ vm.$("INBUF"), 0, 0, vm.$("STNOSZ"), vm.$("CARDSZ") - vm.$("SEQSIZ") ];
  } ], [ "LNOSP", "SPEC", function () {
    return [ vm.$("INBUF"), 0, 0, 0, vm.$("STNOSZ") ];
  } ], [ "RNOSP", "SPEC", function () {
    return [ vm.$("INBUF"), 0, 0, vm.$("CARDSZ") + (vm.$("STNOSZ") + 1), vm.$("STNOSZ") ];
  } ], [ "ALPHSP", "SPEC", function () {
    return [ vm.$("ALPHA"), 0, 0, 0, vm.$("ALPHSZ") ];
  } ], [ "AMPSP", "SPEC", function () {
    return [ vm.$("AMPST"), 0, 0, 0, 1 ];
  } ], [ "CERRSP", "SPEC", function () {
    return [ vm.$("ANYSP"), 0, 0, 0, 0 ];
  } ], [ "COLSP", "SPEC", function () {
    return [ vm.$("COLSTR"), 0, 0, 0, 2 ];
  } ], [ "DMPSP", "SPEC", function () {
    return [ vm.$("ANYSP"), 0, 0, 0, 0 ];
  } ], [ "DTARSP", "SPEC", function () {
    return [ vm.$("DTARBF"), 0, 0, 0, vm.$("ARRLEN") + 9 ];
  } ], [ "PROTSP", "SPEC", function () {
    return [ vm.$("ANYSP"), 0, 0, 0, 0 ];
  } ], [ "QTSP", "SPEC", function () {
    return [ vm.$("QTSTR"), 0, 0, 0, 1 ];
  } ], [ "REALSP", "SPEC", function () {
    return [ vm.$("REALBF"), 0, 0, 0, 10 ];
  } ], [ "TRACSP", "SPEC", function () {
    return [ vm.$("ANYSP"), 0, 0, 0, 0 ];
  } ], [ "ARRSP", "STRING", function () {
    return [ "ARRAY" ];
  } ], [ "ASSCSP", "STRING", function () {
    return [ "TABLE" ];
  } ], [ "BLSP", "STRING", function () {
    return [ " " ];
  } ], [ "BLEQSP", "STRING", function () {
    return [ " = " ];
  } ], [ "CMASP", "STRING", function () {
    return [ "," ];
  } ], [ "EJCTSP", "STRING", function () {
    return [ "EJECT" ];
  } ], [ "EQLSP", "STRING", function () {
    return [ "= " ];
  } ], [ "ETIMSP", "STRING", function () {
    return [ ",TIME = " ];
  } ], [ "EXDTSP", "STRING", function () {
    return [ "EXTERNAL" ];
  } ], [ "LEFTSP", "STRING", function () {
    return [ "LEFT" ];
  } ], [ "LISTSP", "STRING", function () {
    return [ "LIST" ];
  } ], [ "LPRNSP", "STRING", function () {
    return [ "(" ];
  } ], [ "OFSP", "STRING", function () {
    return [ " OF " ];
  } ], [ "RPRNSP", "STRING", function () {
    return [ ")" ];
  } ], [ "STARSP", "STRING", function () {
    return [ "*** " ];
  } ], [ "TRCLSP", "STRING", function () {
    return [ " CALL OF " ];
  } ], [ "TRLVSP", "STRING", function () {
    return [ "LEVEL " ];
  } ], [ "TRSTSP", "STRING", function () {
    return [ "    STATEMENT " ];
  } ], [ "UNLSP", "STRING", function () {
    return [ "UNLIST" ];
  } ], [ "XFERSP", "STRING", function () {
    return [ "TRANSFER TO" ];
  } ], [ "BLNBUF", "BUFFER", function () {
    return [ vm.$("STNOSZ") ];
  } ], [ "DTARBF", "BUFFER", function () {
    return [ vm.$("ARRLEN") + 7 ];
  } ], [ "ERRBUF", "BUFFER", function () {
    return [ vm.$("CARDSZ") + (vm.$("STNOSZ") - (vm.$("SEQSIZ") + 1)) ];
  } ], [ "INBUF", "BUFFER", function () {
    return [ vm.$("CARDSZ") + (vm.$("DSTSZ") + 1) ];
  } ], [ "REALBF", "BUFFER", function () {
    return [ 36 ];
  } ], [ "ICLBLK", "DESCR", function () {
    return [ vm.$("ICLBLK"), vm.$("TTL") + vm.$("MARK"), vm.$("ICLEND") - (vm.$("ICLBLK") - vm.$("DESCR")) ];
  } ], [ "DTATL", "DESCR", function () {
    return [ vm.$("DTLIST"), 0, 0 ];
  } ], [ "FNCPL", "DESCR", function () {
    return [ vm.$("FNLIST"), 0, 0 ];
  } ], [ "INATL", "DESCR", function () {
    return [ vm.$("INLIST"), 0, 0 ];
  } ], [ "OUTATL", "DESCR", function () {
    return [ vm.$("OTLIST"), 0, 0 ];
  } ], [ "TVALL", "DESCR", function () {
    return [ vm.$("TVALPL"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("VLTRFN"), vm.$("FNC"), 2 ];
  } ], [ "TLABL", "DESCR", function () {
    return [ vm.$("TLABPL"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("LABTFN"), vm.$("FNC"), 1 ];
  } ], [ "TFENTL", "DESCR", function () {
    return [ vm.$("TFENPL"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("FNTRFN"), vm.$("FNC"), 2 ];
  } ], [ "TFEXTL", "DESCR", function () {
    return [ vm.$("TFEXPL"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("FXTRFN"), vm.$("FNC"), 2 ];
  } ], [ "TKEYL", "DESCR", function () {
    return [ vm.$("TKEYPL"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("KEYTFN"), vm.$("FNC"), 1 ];
  } ], [ "A1PTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "A2PTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "A3PTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ATPTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "F1PTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "F2PTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "IO2PTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "IO1PTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "LPTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "NVAL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "IO3PTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "IO4PTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "TBLCS", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "TMVAL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "TPTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "TCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "TSIZ", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "TVAL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "VVAL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "WCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "WPTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "XCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "XPTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "XSIZ", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "YCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "YPTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "YSIZ", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ZCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ZPTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ZSIZ", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "BOSCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "CMBSCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "NBSPTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "FBLOCK", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "OCBSCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "OCLIM", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "OCSVCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "PATBCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "SCBSCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "SRNCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ELEMND", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ELEXND", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ELEYND", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "EXELND", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "EXEXND", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "EXOPCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "EXOPND", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "EXPRND", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "FGOND", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "FORMND", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "FRNCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "GOTOND", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "PATND", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "SGOND", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "SUBJND", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "DFLFST", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ENDPTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "EXTPTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "FRETCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "NRETCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "RETCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "FUNTCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "DPSP", "SPEC", function () {
    return [ 0, 0, 0, 0, 0 ];
  } ], [ "HEADSP", "SPEC", function () {
    return [ 0, 0, 0, 0, 0 ];
  } ], [ "IOSP", "SPEC", function () {
    return [ 0, 0, 0, 0, 0 ];
  } ], [ "TAILSP", "SPEC", function () {
    return [ 0, 0, 0, 0, 0 ];
  } ], [ "TEXTSP", "SPEC", function () {
    return [ 0, 0, 0, 0, 0 ];
  } ], [ "TSP", "SPEC", function () {
    return [ 0, 0, 0, 0, 0 ];
  } ], [ "TXSP", "SPEC", function () {
    return [ 0, 0, 0, 0, 0 ];
  } ], [ "VSP", "SPEC", function () {
    return [ 0, 0, 0, 0, 0 ];
  } ], [ "XSP", "SPEC", function () {
    return [ 0, 0, 0, 0, 0 ];
  } ], [ "YSP", "SPEC", function () {
    return [ 0, 0, 0, 0, 0 ];
  } ], [ "ZSP", "SPEC", function () {
    return [ 0, 0, 0, 0, 0 ];
  } ], [ "ARG1CL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "BUKPTR", "DESCR", function () {
    return [ 0, vm.$("PTR"), vm.$("S") ];
  } ], [ "LSTPTR", "DESCR", function () {
    return [ 0, vm.$("PTR"), vm.$("S") ];
  } ], [ "AXPTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "SPECR1", "SPEC", function () {
    return [ 0, 0, 0, 0, 0 ];
  } ], [ "SPECR2", "SPEC", function () {
    return [ 0, 0, 0, 0, 0 ];
  } ], [ "ICLEND", "LHERE", function () {
    return [ null ];
  } ], [ "BK1CL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "BKDX", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "BKDXU", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "BKLTCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "BKPTR", "DESCR", function () {
    return [ 0, vm.$("PTR"), vm.$("S") ];
  } ], [ "BLOCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "CONVSW", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "CPYCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "DESCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "EQUVCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "FRDSCL", "DESCR", function () {
    return [ 4 * vm.$("DESCR"), 0, 0 ];
  } ], [ "GCBLK", "DESCR", function () {
    return [ vm.$("GCXTTL"), 0, 0 ];
  } ], [ "GCNO", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "GCMPTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "GCREQ", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "GCGOT", "DESCR", function () {
    return [ 0, 0, vm.$("I") ];
  } ], [ "LCPTR", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "MVSGPT", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "NODPCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "OBPTR", "DESCR", function () {
    return [ vm.$("OBLIST"), vm.$("PTR"), vm.$("S") ];
  } ], [ "OFSET", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "PRMDX", "DESCR", function () {
    return [ vm.$("PRMSIZ"), 0, 0 ];
  } ], [ "PRMPTR", "DESCR", function () {
    return [ vm.$("PRMTBL"), 0, 0 ];
  } ], [ "ST1PTR", "DESCR", function () {
    return [ 0, vm.$("PTR"), vm.$("S") ];
  } ], [ "ST2PTR", "DESCR", function () {
    return [ 0, vm.$("PTR"), vm.$("S") ];
  } ], [ "TEMPCL", "DESCR", function () {
    return [ 0, vm.$("PTR"), 0 ];
  } ], [ "TOPCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "TTLCL", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "TWOCL", "DESCR", function () {
    return [ 2 * vm.$("DESCR"), 0, vm.$("B") ];
  } ], [ "FRSGPT", "DESCR", function () {
    return [ 0, vm.$("PTR"), 0 ];
  } ], [ "HDSGPT", "DESCR", function () {
    return [ 0, vm.$("PTR"), 0 ];
  } ], [ "TLSGP1", "DESCR", function () {
    return [ 0, vm.$("PTR"), 0 ];
  } ], [ "GCXTTL", "DESCR", function () {
    return [ vm.$("GCXTTL"), vm.$("TTL") + vm.$("MARK"), vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "COPY", function () {
    return [ vm.$("MDATA") ];
  } ], [ "FTABLE", "DESCR", function () {
    return [ vm.$("FTABLE"), vm.$("TTL") + vm.$("MARK"), vm.$("FTBLND") - (vm.$("FTABLE") - vm.$("DESCR")) ];
  } ], [ "ANYFN", "DESCR", function () {
    return [ vm.$("ANY"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "APLYFN", "DESCR", function () {
    return [ vm.$("APPLY"), vm.$("FNC"), 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ARBOFN", "DESCR", function () {
    return [ vm.$("ARBNO"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ARGFN", "DESCR", function () {
    return [ vm.$("ARG"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ARRAFN", "DESCR", function () {
    return [ vm.$("ARRAY"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ASSCFN", "DESCR", function () {
    return [ vm.$("ASSOC"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "BACKFN", "DESCR", function () {
    return [ vm.$("BKSPCE"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "BREAFN", "DESCR", function () {
    return [ vm.$("BREAK"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "CLEAFN", "DESCR", function () {
    return [ vm.$("CLEAR"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "CODEFN", "DESCR", function () {
    return [ vm.$("CODER"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "COLEFN", "DESCR", function () {
    return [ vm.$("COLECT"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "CNVRFN", "DESCR", function () {
    return [ vm.$("CNVRT"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "COPYFN", "DESCR", function () {
    return [ vm.$("COPY"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "DATFN", "DESCR", function () {
    return [ vm.$("DATE"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "DATDFN", "DESCR", function () {
    return [ vm.$("DATDEF"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "DEFIFN", "DESCR", function () {
    return [ vm.$("DEFINE"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "DIFFFN", "DESCR", function () {
    return [ vm.$("DIFFER"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "DTCHFN", "DESCR", function () {
    return [ vm.$("DETACH"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "DTFN", "DESCR", function () {
    return [ vm.$("DT"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "DUMPFN", "DESCR", function () {
    return [ vm.$("DMP"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "DUPLFN", "DESCR", function () {
    return [ vm.$("DUPL"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ENDFFN", "DESCR", function () {
    return [ vm.$("ENFILE"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "EQFN", "DESCR", function () {
    return [ vm.$("EQ"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "EVALFN", "DESCR", function () {
    return [ vm.$("EVAL"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "FLDSFN", "DESCR", function () {
    return [ vm.$("FIELDS"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "GEFN", "DESCR", function () {
    return [ vm.$("GE"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "GTFN", "DESCR", function () {
    return [ vm.$("GT"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "IDENFN", "DESCR", function () {
    return [ vm.$("IDENT"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "INTGFN", "DESCR", function () {
    return [ vm.$("INTGER"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ITEMFN", "DESCR", function () {
    return [ vm.$("ITEM"), vm.$("FNC"), 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "LEFN", "DESCR", function () {
    return [ vm.$("LE"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "LENFN", "DESCR", function () {
    return [ vm.$("LEN"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "LGTFN", "DESCR", function () {
    return [ vm.$("LGT"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "LOADFN", "DESCR", function () {
    return [ vm.$("LOAD"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "LOCFN", "DESCR", function () {
    return [ vm.$("LOCAL"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "LTFN", "DESCR", function () {
    return [ vm.$("LT"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "NEFN", "DESCR", function () {
    return [ vm.$("NE"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "NOTAFN", "DESCR", function () {
    return [ vm.$("NOTANY"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "OPSYFN", "DESCR", function () {
    return [ vm.$("OPSYN"), 0, 3 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "POSFN", "DESCR", function () {
    return [ vm.$("POS"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "PRINFN", "DESCR", function () {
    return [ vm.$("PRINT"), 0, 3 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "PROTFN", "DESCR", function () {
    return [ vm.$("PROTO"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "REMDFN", "DESCR", function () {
    return [ vm.$("REMDR"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "RPLAFN", "DESCR", function () {
    return [ vm.$("RPLACE"), 0, 3 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "READFN", "DESCR", function () {
    return [ vm.$("READ"), 0, 3 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "REWNFN", "DESCR", function () {
    return [ vm.$("REWIND"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "RPOSFN", "DESCR", function () {
    return [ vm.$("RPOS"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "RTABFN", "DESCR", function () {
    return [ vm.$("RTAB"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "SIZEFN", "DESCR", function () {
    return [ vm.$("SIZE"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "SPANFN", "DESCR", function () {
    return [ vm.$("SPAN"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "STPTFN", "DESCR", function () {
    return [ vm.$("STOPTR"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "TABFN", "DESCR", function () {
    return [ vm.$("TAB"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "TIMFN", "DESCR", function () {
    return [ vm.$("TIME"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "TRCEFN", "DESCR", function () {
    return [ vm.$("TRACE"), 0, 4 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "TRIMFN", "DESCR", function () {
    return [ vm.$("TRIM"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "UNLDFN", "DESCR", function () {
    return [ vm.$("UNLOAD"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "VALFN", "DESCR", function () {
    return [ vm.$("FIELD"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("VALBLK"), 0, 0 ];
  } ], [ "FTBLND", "LHERE", function () {
    return [ null ];
  } ], [ "INITLS", "DESCR", function () {
    return [ vm.$("INITLS"), vm.$("TTL") + vm.$("MARK"), 8 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("DTLIST"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("FNLIST"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("INLIST"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("KNLIST"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("KVLIST"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("OTLIST"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("OTSATL"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("TRLIST"), 0, 0 ];
  } ], [ "FNLIST", "DESCR", function () {
    return [ vm.$("FNLIST"), vm.$("TTL") + vm.$("MARK"), vm.$("FNCPLE") - (vm.$("FNLIST") - vm.$("DESCR")) ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ANYFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ANYSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("APLYFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("APLYSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ARBOFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ARBNSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ARGFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ARGSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ARRAFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ARRSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("BACKFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("BACKSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("BREAFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("BRKSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("CLEAFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("CLERSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("CODEFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("CODESP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("COLEFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("CLSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("CNVRFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("CNVTSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("COPYFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("COPYSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("DATDFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("DATASP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("DATFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("DATSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("DEFIFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("DEFISP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("DIFFFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("DIFFSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("DTCHFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("DTCHSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("DTFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("DTSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("DUMPFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("DUMPSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("DUPLFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("DUPLSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ENDFFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ENDFSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("EQFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("EQSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("EVALFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("EVALSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("FLDSFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("FLDSSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("GEFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("GESP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("GTFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("GTSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("IDENFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("IDENSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("READFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("INSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("INTGFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("INTGSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ITEMFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ITEMSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("LENFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("LENSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("LEFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("LESP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("LGTFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("LGTSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("LOADFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("LOADSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("LOCFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("LOCSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("LTFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("LTSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("NEFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("NESP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("NOTAFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("NNYSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("OPSYFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("OPSNSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("PRINFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("OUTSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("POSFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("POSSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("PROTFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("PRTSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("REMDFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("REMDSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("REWNFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("REWNSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("RPLAFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("RPLCSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("RPOSFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("RPOSSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("RTABFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("RTABSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("SIZEFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("SIZESP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("SPANFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("SPANSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("STPTFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("STPTSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("TABFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("TABSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ASSCFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ASSCSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("TIMFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("TIMSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("TRCEFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("TRCESP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("TRIMFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("TRMSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("UNLDFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("UNLDSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("VALFN"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("VALSP"), 0, 0 ];
  } ], [ null, "ARRAY", function () {
    return [ 10 * 2 ];
  } ], [ "FNCPLE", "LHERE", function () {
    return [ null ];
  } ], [ "OPTBL", "DESCR", function () {
    return [ vm.$("OPTBL"), vm.$("TTL") + vm.$("MARK"), vm.$("OPTBND") - (vm.$("OPTBL") - vm.$("DESCR")) ];
  } ], [ "ADDFN", "DESCR", function () {
    return [ vm.$("ADD"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 30, 0, 29 ];
  } ], [ "BIAMFN", "DESCR", function () {
    return [ vm.$("UNDF"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 5, 0, 4 ];
  } ], [ "BIATFN", "DESCR", function () {
    return [ vm.$("UNDF"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 25, 0, 24 ];
  } ], [ "BINGFN", "DESCR", function () {
    return [ vm.$("UNDF"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 70, 0, 70 ];
  } ], [ "BIPDFN", "DESCR", function () {
    return [ vm.$("UNDF"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 35, 0, 34 ];
  } ], [ "BIPRFN", "DESCR", function () {
    return [ vm.$("UNDF"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 45, 0, 44 ];
  } ], [ "BIQSFN", "DESCR", function () {
    return [ vm.$("UNDF"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 70, 0, 69 ];
  } ], [ "CONFN", "DESCR", function () {
    return [ vm.$("CON"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 20, 0, 19 ];
  } ], [ "DIVFN", "DESCR", function () {
    return [ vm.$("DIV"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 40, 0, 39 ];
  } ], [ "DOLFN", "DESCR", function () {
    return [ vm.$("DOL"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 60, 0, 59 ];
  } ], [ "EXPFN", "DESCR", function () {
    return [ vm.$("EXP"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 50, 0, 50 ];
  } ], [ "MPYFN", "DESCR", function () {
    return [ vm.$("MPY"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 42, 0, 41 ];
  } ], [ "NAMFN", "DESCR", function () {
    return [ vm.$("NAM"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 60, 0, 59 ];
  } ], [ "ORFN", "DESCR", function () {
    return [ vm.$("OR"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 10, 0, 9 ];
  } ], [ "SUBFN", "DESCR", function () {
    return [ vm.$("SUB"), 0, 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 30, 0, 29 ];
  } ], [ "AROWFN", "DESCR", function () {
    return [ vm.$("UNDF"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ATFN", "DESCR", function () {
    return [ vm.$("ATOP"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "BARFN", "DESCR", function () {
    return [ vm.$("UNDF"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "DOTFN", "DESCR", function () {
    return [ vm.$("NAME"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "INDFN", "DESCR", function () {
    return [ vm.$("IND"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "KEYFN", "DESCR", function () {
    return [ vm.$("KEYWRD"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "MNSFN", "DESCR", function () {
    return [ vm.$("MNS"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "NEGFN", "DESCR", function () {
    return [ vm.$("NEG"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "PDFN", "DESCR", function () {
    return [ vm.$("UNDF"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "PLSFN", "DESCR", function () {
    return [ vm.$("PLS"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "PRFN", "DESCR", function () {
    return [ vm.$("UNDF"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "QUESFN", "DESCR", function () {
    return [ vm.$("QUES"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "SLHFN", "DESCR", function () {
    return [ vm.$("UNDF"), vm.$("FNC"), 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "STRFN", "DESCR", function () {
    return [ vm.$("STR"), 0, 1 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "OPTBND", "LHERE", function () {
    return [ null ];
  } ], [ "AREFN", "DESCR", function () {
    return [ vm.$("ITEM"), vm.$("FNC"), 1 ];
  } ], [ "ASGNFN", "DESCR", function () {
    return [ vm.$("ASGN"), 0, 2 ];
  } ], [ "BASEFN", "DESCR", function () {
    return [ vm.$("BASE"), 0, 0 ];
  } ], [ "ENDAFN", "DESCR", function () {
    return [ vm.$("ARGNER"), 0, 0 ];
  } ], [ "ENDFN", "DESCR", function () {
    return [ vm.$("END"), 0, 0 ];
  } ], [ "ERORFN", "DESCR", function () {
    return [ vm.$("EROR"), 0, 1 ];
  } ], [ "FNTRFN", "DESCR", function () {
    return [ vm.$("FENTR"), 0, 2 ];
  } ], [ "FXTRFN", "DESCR", function () {
    return [ vm.$("FNEXTR"), 0, 2 ];
  } ], [ "GOTGFN", "DESCR", function () {
    return [ vm.$("GOTG"), 0, 1 ];
  } ], [ "GOTLFN", "DESCR", function () {
    return [ vm.$("GOTL"), 0, 1 ];
  } ], [ "GOTOFN", "DESCR", function () {
    return [ vm.$("GOTO"), 0, 1 ];
  } ], [ "INITFN", "DESCR", function () {
    return [ vm.$("INIT"), 0, 1 ];
  } ], [ "KEYTFN", "DESCR", function () {
    return [ vm.$("KEYTR"), 0, 2 ];
  } ], [ "LABTFN", "DESCR", function () {
    return [ vm.$("LABTR"), 0, 2 ];
  } ], [ "LITFN", "DESCR", function () {
    return [ vm.$("LIT"), 0, 1 ];
  } ], [ "SCANFN", "DESCR", function () {
    return [ vm.$("SCAN"), 0, 2 ];
  } ], [ "SJSRFN", "DESCR", function () {
    return [ vm.$("SJSR"), 0, 3 ];
  } ], [ "VLTRFN", "DESCR", function () {
    return [ vm.$("VALTR"), 0, 2 ];
  } ], [ "ANYCFN", "DESCR", function () {
    return [ vm.$("ANYC"), 0, 3 ];
  } ], [ "ARBFFN", "DESCR", function () {
    return [ vm.$("ARBF"), 0, 2 ];
  } ], [ "ARBNFN", "DESCR", function () {
    return [ vm.$("ARBN"), 0, 2 ];
  } ], [ "ATOPFN", "DESCR", function () {
    return [ vm.$("ATP"), 0, 3 ];
  } ], [ "CHRFN", "DESCR", function () {
    return [ vm.$("CHR"), 0, 3 ];
  } ], [ "BALFN", "DESCR", function () {
    return [ vm.$("BAL"), 0, 2 ];
  } ], [ "BALFFN", "DESCR", function () {
    return [ vm.$("BALF"), 0, 2 ];
  } ], [ "BRKCFN", "DESCR", function () {
    return [ vm.$("BRKC"), 0, 3 ];
  } ], [ "DNMEFN", "DESCR", function () {
    return [ vm.$("DNME"), 0, 2 ];
  } ], [ "DNMIFN", "DESCR", function () {
    return [ vm.$("DNME1"), 0, 2 ];
  } ], [ "EARBFN", "DESCR", function () {
    return [ vm.$("EARB"), 0, 2 ];
  } ], [ "DSARFN", "DESCR", function () {
    return [ vm.$("DSAR"), 0, 3 ];
  } ], [ "ENMEFN", "DESCR", function () {
    return [ vm.$("ENME"), 0, 3 ];
  } ], [ "ENMIFN", "DESCR", function () {
    return [ vm.$("ENMI"), 0, 3 ];
  } ], [ "FARBFN", "DESCR", function () {
    return [ vm.$("FARB"), 0, 2 ];
  } ], [ "FNMEFN", "DESCR", function () {
    return [ vm.$("FNME"), 0, 2 ];
  } ], [ "LNTHFN", "DESCR", function () {
    return [ vm.$("LNTH"), 0, 3 ];
  } ], [ "NMEFN", "DESCR", function () {
    return [ vm.$("NME"), 0, 2 ];
  } ], [ "NNYCFN", "DESCR", function () {
    return [ vm.$("NNYC"), 0, 3 ];
  } ], [ "ONARFN", "DESCR", function () {
    return [ vm.$("ONAR"), 0, 2 ];
  } ], [ "ONRFFN", "DESCR", function () {
    return [ vm.$("ONRF"), 0, 2 ];
  } ], [ "POSIFN", "DESCR", function () {
    return [ vm.$("POSI"), 0, 3 ];
  } ], [ "RPSIFN", "DESCR", function () {
    return [ vm.$("RPSI"), 0, 3 ];
  } ], [ "RTBFN", "DESCR", function () {
    return [ vm.$("RTB"), 0, 3 ];
  } ], [ "SALFFN", "DESCR", function () {
    return [ vm.$("SALF"), 0, 2 ];
  } ], [ "SCFLFN", "DESCR", function () {
    return [ vm.$("FAIL"), 0, 2 ];
  } ], [ "SCOKFN", "DESCR", function () {
    return [ vm.$("SCOK"), 0, 2 ];
  } ], [ "SCONFN", "DESCR", function () {
    return [ vm.$("SCON"), 0, 2 ];
  } ], [ "SPNCFN", "DESCR", function () {
    return [ vm.$("SPNC"), 0, 3 ];
  } ], [ "STARFN", "DESCR", function () {
    return [ vm.$("STAR"), 0, 3 ];
  } ], [ "TBFN", "DESCR", function () {
    return [ vm.$("TB"), 0, 3 ];
  } ], [ "ABORFN", "DESCR", function () {
    return [ vm.$("RTNUL3"), 0, 3 ];
  } ], [ "FNCEFN", "DESCR", function () {
    return [ vm.$("FNCE"), 0, 2 ];
  } ], [ "FNCFFN", "DESCR", function () {
    return [ vm.$("RTNUL3"), 0, 2 ];
  } ], [ "SUCFFN", "DESCR", function () {
    return [ vm.$("SUCF"), 0, 2 ];
  } ], [ "ABNDSP", "STRING", function () {
    return [ "ABEND" ];
  } ], [ "ABORSP", "STRING", function () {
    return [ "ABORT" ];
  } ], [ "ALNMSP", "STRING", function () {
    return [ "ALPHABET" ];
  } ], [ "ANCHSP", "STRING", function () {
    return [ "ANCHOR" ];
  } ], [ "ANYSP", "STRING", function () {
    return [ "ANY" ];
  } ], [ "APLYSP", "STRING", function () {
    return [ "APPLY" ];
  } ], [ "ARBSP", "STRING", function () {
    return [ "ARB" ];
  } ], [ "ARBNSP", "STRING", function () {
    return [ "ARBNO" ];
  } ], [ "ARGSP", "STRING", function () {
    return [ "ARG" ];
  } ], [ "BACKSP", "STRING", function () {
    return [ "BACKSPACE" ];
  } ], [ "BALSP", "STRING", function () {
    return [ "BAL" ];
  } ], [ "BRKSP", "STRING", function () {
    return [ "BREAK" ];
  } ], [ "TRFRSP", "STRING", function () {
    return [ "CALL" ];
  } ], [ "CLERSP", "STRING", function () {
    return [ "CLEAR" ];
  } ], [ "CODESP", "STRING", function () {
    return [ "CODE" ];
  } ], [ "CLSP", "STRING", function () {
    return [ "COLLECT" ];
  } ], [ "CNVTSP", "STRING", function () {
    return [ "CONVERT" ];
  } ], [ "COPYSP", "STRING", function () {
    return [ "COPY" ];
  } ], [ "DATSP", "STRING", function () {
    return [ "DATE" ];
  } ], [ "DATASP", "STRING", function () {
    return [ "DATA" ];
  } ], [ "DEFISP", "STRING", function () {
    return [ "DEFINE" ];
  } ], [ "DIFFSP", "STRING", function () {
    return [ "DIFFER" ];
  } ], [ "DTCHSP", "STRING", function () {
    return [ "DETACH" ];
  } ], [ "DTSP", "STRING", function () {
    return [ "DATATYPE" ];
  } ], [ "DUMPSP", "STRING", function () {
    return [ "DUMP" ];
  } ], [ "DUPLSP", "STRING", function () {
    return [ "DUPL" ];
  } ], [ "ENDSP", "STRING", function () {
    return [ "END" ];
  } ], [ "ENDFSP", "STRING", function () {
    return [ "ENDFILE" ];
  } ], [ "EQSP", "STRING", function () {
    return [ "EQ" ];
  } ], [ "ERRLSP", "STRING", function () {
    return [ "ERRLIMIT" ];
  } ], [ "ERRTSP", "STRING", function () {
    return [ "ERRTYPE" ];
  } ], [ "EVALSP", "STRING", function () {
    return [ "EVAL" ];
  } ], [ "EXPSP", "STRING", function () {
    return [ "EXPRESSION" ];
  } ], [ "FAILSP", "STRING", function () {
    return [ "FAIL" ];
  } ], [ "FNCESP", "STRING", function () {
    return [ "FENCE" ];
  } ], [ "FLDSSP", "STRING", function () {
    return [ "FIELD" ];
  } ], [ "FNCLSP", "STRING", function () {
    return [ "FNCLEVEL" ];
  } ], [ "FRETSP", "STRING", function () {
    return [ "FRETURN" ];
  } ], [ "FTRCSP", "STRING", function () {
    return [ "FTRACE" ];
  } ], [ "FULLSP", "STRING", function () {
    return [ "FULLSCAN" ];
  } ], [ "FUNTSP", "STRING", function () {
    return [ "FUNCTION" ];
  } ], [ "GESP", "STRING", function () {
    return [ "GE" ];
  } ], [ "GTSP", "STRING", function () {
    return [ "GT" ];
  } ], [ "IDENSP", "STRING", function () {
    return [ "IDENT" ];
  } ], [ "INSP", "STRING", function () {
    return [ "INPUT" ];
  } ], [ "INTGSP", "STRING", function () {
    return [ "INTEGER" ];
  } ], [ "ITEMSP", "STRING", function () {
    return [ "ITEM" ];
  } ], [ "TRKYSP", "STRING", function () {
    return [ "KEYWORD" ];
  } ], [ "TRLASP", "STRING", function () {
    return [ "LABEL" ];
  } ], [ "LSTNSP", "STRING", function () {
    return [ "LASTNO" ];
  } ], [ "LENSP", "STRING", function () {
    return [ "LEN" ];
  } ], [ "LESP", "STRING", function () {
    return [ "LE" ];
  } ], [ "LGTSP", "STRING", function () {
    return [ "LGT" ];
  } ], [ "LOADSP", "STRING", function () {
    return [ "LOAD" ];
  } ], [ "LOCSP", "STRING", function () {
    return [ "LOCAL" ];
  } ], [ "LTSP", "STRING", function () {
    return [ "LT" ];
  } ], [ "MAXLSP", "STRING", function () {
    return [ "MAXLNGTH" ];
  } ], [ "NAMESP", "STRING", function () {
    return [ "NAME" ];
  } ], [ "NESP", "STRING", function () {
    return [ "NE" ];
  } ], [ "NNYSP", "STRING", function () {
    return [ "NOTANY" ];
  } ], [ "NRETSP", "STRING", function () {
    return [ "NRETURN" ];
  } ], [ "OPSNSP", "STRING", function () {
    return [ "OPSYN" ];
  } ], [ "OUTSP", "STRING", function () {
    return [ "OUTPUT" ];
  } ], [ "PATSP", "STRING", function () {
    return [ "PATTERN" ];
  } ], [ "POSSP", "STRING", function () {
    return [ "POS" ];
  } ], [ "PRTSP", "STRING", function () {
    return [ "PROTOTYPE" ];
  } ], [ "PNCHSP", "STRING", function () {
    return [ "PUNCH" ];
  } ], [ "RLSP", "STRING", function () {
    return [ "REAL" ];
  } ], [ "REMSP", "STRING", function () {
    return [ "REM" ];
  } ], [ "REMDSP", "STRING", function () {
    return [ "REMDR" ];
  } ], [ "RETSP", "STRING", function () {
    return [ "RETURN" ];
  } ], [ "REWNSP", "STRING", function () {
    return [ "REWIND" ];
  } ], [ "RPLCSP", "STRING", function () {
    return [ "REPLACE" ];
  } ], [ "RPOSSP", "STRING", function () {
    return [ "RPOS" ];
  } ], [ "RTABSP", "STRING", function () {
    return [ "RTAB" ];
  } ], [ "RTYPSP", "STRING", function () {
    return [ "RTNTYPE" ];
  } ], [ "SIZESP", "STRING", function () {
    return [ "SIZE" ];
  } ], [ "SPANSP", "STRING", function () {
    return [ "SPAN" ];
  } ], [ "STCTSP", "STRING", function () {
    return [ "STCOUNT" ];
  } ], [ "STFCSP", "STRING", function () {
    return [ "STFCOUNT" ];
  } ], [ "STLMSP", "STRING", function () {
    return [ "STLIMIT" ];
  } ], [ "STPTSP", "STRING", function () {
    return [ "STOPTR" ];
  } ], [ "STNOSP", "STRING", function () {
    return [ "STNO" ];
  } ], [ "VARSP", "STRING", function () {
    return [ "STRING" ];
  } ], [ "SUCCSP", "STRING", function () {
    return [ "SUCCEED" ];
  } ], [ "TABSP", "STRING", function () {
    return [ "TAB" ];
  } ], [ "TIMSP", "STRING", function () {
    return [ "TIME" ];
  } ], [ "TRCESP", "STRING", function () {
    return [ "TRACE" ];
  } ], [ "TRMSP", "STRING", function () {
    return [ "TRIM" ];
  } ], [ "UNLDSP", "STRING", function () {
    return [ "UNLOAD" ];
  } ], [ "VALSP", "STRING", function () {
    return [ "VALUE" ];
  } ], [ "CRDFSP", "STRING", function () {
    return [ "(80A1)" ];
  } ], [ "OUTPSP", "STRING", function () {
    return [ "(1X,132A1)" ];
  } ], [ "ABNDB", "LHERE", function () {
    return [ null ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ALPHSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ALPHVL"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("CRDFSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("DFLFST"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("EXDTSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("EXTPTR"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ENDSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ENDPTR"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("FRETSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("FRETCL"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("FUNTSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("FUNTCL"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("NRETSP"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("NRETCL"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("RETSP"), 0, 0 ];
  } ], [ "DTEND", "DESCR", function () {
    return [ vm.$("RETCL"), 0, 0 ];
  } ], [ "BUFEXT", "EQU", function () {
    return [ vm.$("DTEND") - vm.$("ANYSP") ];
  } ], [ "BUFLEN", "EQU", function () {
    return [ vm.$("BUFEXT") * vm.$("CPA") ];
  } ], [ "PRMTBL", "DESCR", function () {
    return [ vm.$("PRMTBL"), vm.$("TTL") + vm.$("MARK"), vm.$("PRMSIZ") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("DTLIST"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("FNLIST"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("FTABLE"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ICLBLK"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("KNLIST"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("KVLIST"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("OPTBL"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("STACK"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("INLIST"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("OTLIST"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("INSATL"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("OTSATL"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("TFENPL"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("TFEXPL"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("TKEYPL"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("TLABPL"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("TRLIST"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("TVALPL"), 0, 0 ];
  } ], [ "PRMTRM", "LHERE", function () {
    return [ null ];
  } ], [ "PRMSIZ", "EQU", function () {
    return [ vm.$("PRMTRM") - (vm.$("PRMTBL") - vm.$("DESCR")) ];
  } ], [ "OBLOCK", "DESCR", function () {
    return [ vm.$("OBLOCK"), vm.$("TTL") + vm.$("MARK"), vm.$("OBARY") * vm.$("DESCR") ];
  } ], [ null, "ARRAY", function () {
    return [ 3 ];
  } ], [ "OBSTRT", "ARRAY", function () {
    return [ vm.$("OBSIZ") ];
  } ], [ "OBLIST", "EQU", function () {
    return [ vm.$("OBSTRT") - vm.$("LNKFLD") ];
  } ], [ "PDLBLK", "DESCR", function () {
    return [ vm.$("PDLBLK"), vm.$("TTL") + vm.$("MARK"), vm.$("SPDLSZ") * vm.$("DESCR") ];
  } ], [ null, "ARRAY", function () {
    return [ vm.$("SPDLSZ") ];
  } ], [ "STACK", "DESCR", function () {
    return [ vm.$("STACK"), vm.$("TTL") + vm.$("MARK"), vm.$("STSIZE") * vm.$("DESCR") ];
  } ], [ null, "ARRAY", function () {
    return [ vm.$("STSIZE") ];
  } ], [ "ABORPT", "DESCR", function () {
    return [ vm.$("ABORPT"), vm.$("TTL") + vm.$("MARK"), 3 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ABORFN"), vm.$("FNC"), 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ARBAK", "DESCR", function () {
    return [ vm.$("ARBAK"), vm.$("TTL") + vm.$("MARK"), 6 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ONARFN"), vm.$("FNC"), 2 ];
  } ], [ null, "DESCR", function () {
    return [ 3 * vm.$("DESCR"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ONRFFN"), vm.$("FNC"), 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ARBPT", "DESCR", function () {
    return [ vm.$("ARBPT"), vm.$("TTL") + vm.$("MARK"), 9 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("SCOKFN"), vm.$("FNC"), 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 3 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("SCOKFN"), vm.$("FNC"), 2 ];
  } ], [ null, "DESCR", function () {
    return [ 6 * vm.$("DESCR"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("FARBFN"), vm.$("FNC"), 2 ];
  } ], [ null, "DESCR", function () {
    return [ 6 * vm.$("DESCR"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ARHED", "DESCR", function () {
    return [ vm.$("ARHED"), vm.$("TTL") + vm.$("MARK"), 12 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("SCOKFN"), vm.$("FNC"), 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 3 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("SCOKFN"), vm.$("FNC"), 2 ];
  } ], [ null, "DESCR", function () {
    return [ 6 * vm.$("DESCR"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ARBNFN"), vm.$("FNC"), 2 ];
  } ], [ null, "DESCR", function () {
    return [ 9 * vm.$("DESCR"), 0, 12 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("ARBFFN"), vm.$("FNC"), 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "ARTAL", "DESCR", function () {
    return [ vm.$("ARTAL"), vm.$("TTL") + vm.$("MARK"), 6 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("EARBFN"), vm.$("FNC"), 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 3 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("SCOKFN"), vm.$("FNC"), 2 ];
  } ], [ null, "DESCR", function () {
    return [ 6 * vm.$("DESCR"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "BALPT", "DESCR", function () {
    return [ vm.$("BALPT"), vm.$("TTL") + vm.$("MARK"), 9 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("SCOKFN"), vm.$("FNC"), 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 3 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("BALFN"), vm.$("FNC"), 2 ];
  } ], [ null, "DESCR", function () {
    return [ 6 * vm.$("DESCR"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("BALFFN"), vm.$("FNC"), 2 ];
  } ], [ null, "DESCR", function () {
    return [ 6 * vm.$("DESCR"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "FAILPT", "DESCR", function () {
    return [ vm.$("FAILPT"), vm.$("TTL") + vm.$("MARK"), 3 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("SALFFN"), vm.$("FNC"), 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "FNCEPT", "DESCR", function () {
    return [ vm.$("FNCEPT"), vm.$("TTL") + vm.$("MARK"), 3 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("FNCEFN"), vm.$("FNC"), 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "REMPT", "DESCR", function () {
    return [ vm.$("REMPT"), vm.$("TTL") + vm.$("MARK"), 4 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("RTBFN"), vm.$("FNC"), 3 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, vm.$("I") ];
  } ], [ "STARPT", "DESCR", function () {
    return [ vm.$("STARPT"), vm.$("TTL") + vm.$("MARK"), 11 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("STARFN"), vm.$("FNC"), 3 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 4 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ 1, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("SCOKFN"), vm.$("FNC"), 2 ];
  } ], [ null, "DESCR", function () {
    return [ 7 * vm.$("DESCR"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("DSARFN"), vm.$("FNC"), 3 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 4 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "SUCCPT", "DESCR", function () {
    return [ vm.$("SUCCPT"), vm.$("TTL") + vm.$("MARK"), 3 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("SUCFFN"), vm.$("FNC"), 2 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "TVALPL", "DESCR", function () {
    return [ vm.$("TVALPL"), vm.$("TTL") + vm.$("MARK"), 2 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "TLABPL", "DESCR", function () {
    return [ vm.$("TLABPL"), vm.$("TTL") + vm.$("MARK"), 2 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "TFENPL", "DESCR", function () {
    return [ vm.$("TFENPL"), vm.$("TTL") + vm.$("MARK"), 2 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "TFEXPL", "DESCR", function () {
    return [ vm.$("TFEXPL"), vm.$("TTL") + vm.$("MARK"), 2 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "TKEYPL", "DESCR", function () {
    return [ vm.$("TKEYPL"), vm.$("TTL") + vm.$("MARK"), 2 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "VALBLK", "DESCR", function () {
    return [ vm.$("VALBLK"), vm.$("TTL") + vm.$("MARK"), 6 * vm.$("DESCR") ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, vm.$("S") ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, vm.$("N") ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, vm.$("K") ];
  } ], [ null, "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ "MSGLST", "DESCR", function () {
    return [ 0, 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG1"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG2"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG3"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG4"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG5"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG6"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG7"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG8"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG9"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG10"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG11"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG12"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG13"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG14"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG15"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG16"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG17"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG18"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG19"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG20"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG21"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG22"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG23"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG24"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG25"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG26"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG27"), 0, 0 ];
  } ], [ null, "DESCR", function () {
    return [ vm.$("MSG28"), 0, 0 ];
  } ], [ "MSG1", "STRING", function () {
    return [ "ILLEGAL DATA TYPE" ];
  } ], [ "MSG2", "STRING", function () {
    return [ "ERROR IN ARITHMETIC OPERATION" ];
  } ], [ "MSG3", "STRING", function () {
    return [ "ERRONEOUS ARRAY OR TABLE REFERENCE" ];
  } ], [ "MSG4", "STRING", function () {
    return [ "NULL STRING IN ILLEGAL CONTEXT" ];
  } ], [ "MSG5", "STRING", function () {
    return [ "UNDEFINED FUNCTION OR OPERATION" ];
  } ], [ "MSG6", "STRING", function () {
    return [ "ERRONEOUS PROTOTYPE" ];
  } ], [ "MSG7", "STRING", function () {
    return [ "UNKNOWN KEYWORD" ];
  } ], [ "MSG8", "STRING", function () {
    return [ "VARIABLE NOT PRESENT WHERE REQUIRED" ];
  } ], [ "MSG9", "STRING", function () {
    return [ "ENTRY POINT OF FUNCTION NOT LABEL" ];
  } ], [ "MSG10", "STRING", function () {
    return [ "ILLEGAL ARGUMENT TO PRIMITIVE FUNCTION" ];
  } ], [ "MSG11", "STRING", function () {
    return [ "READING ERROR" ];
  } ], [ "MSG12", "STRING", function () {
    return [ "ILLEGAL I/O UNIT" ];
  } ], [ "MSG13", "STRING", function () {
    return [ "LIMIT ON DEFINED DATA TYPES EXCEEDED" ];
  } ], [ "MSG14", "STRING", function () {
    return [ "NEGATIVE NUMBER IN ILLEGAL CONTEXT" ];
  } ], [ "MSG15", "STRING", function () {
    return [ "STRING OVERFLOW" ];
  } ], [ "MSG16", "STRING", function () {
    return [ "OVERFLOW DURING PATTERN MATCHING" ];
  } ], [ "MSG17", "STRING", function () {
    return [ "ERROR IN SNOBOL4 SYSTEM" ];
  } ], [ "MSG18", "STRING", function () {
    return [ "RETURN FROM LEVEL ZERO" ];
  } ], [ "MSG19", "STRING", function () {
    return [ "FAILURE DURING GOTO EVALUATION" ];
  } ], [ "MSG20", "STRING", function () {
    return [ "INSUFFICIENT STORAGE TO CONTINUE" ];
  } ], [ "MSG21", "STRING", function () {
    return [ "STACK OVERFLOW" ];
  } ], [ "MSG22", "STRING", function () {
    return [ "LIMIT ON STATEMENT EXECUTION EXCEEDED" ];
  } ], [ "MSG23", "STRING", function () {
    return [ "OBJECT EXCEEDS SIZE LIMIT" ];
  } ], [ "MSG24", "STRING", function () {
    return [ "UNDEFINED OR ERRONEOUS GOTO" ];
  } ], [ "MSG25", "STRING", function () {
    return [ "INCORRECT NUMBER OF ARGUMENTS" ];
  } ], [ "MSG26", "STRING", function () {
    return [ "LIMIT ON COMPILATION ERRORS EXCEEDED" ];
  } ], [ "MSG27", "STRING", function () {
    return [ "ERRONEOUS END STATEMENT" ];
  } ], [ "MSG28", "STRING", function () {
    return [ "EXECUTION OF STATEMENT WITH COMPILATION ERROR" ];
  } ], [ "EMSG1", "STRING", function () {
    return [ "ERRONEOUS LABEL" ];
  } ], [ "EMSG2", "STRING", function () {
    return [ "PREVIOUSLY DEFINED LABEL" ];
  } ], [ "EMSG3", "STRING", function () {
    return [ "ERRONEOUS SUBJECT" ];
  } ], [ "EMSG14", "STRING", function () {
    return [ "ERROR IN GOTO" ];
  } ], [ "ILCHAR", "STRING", function () {
    return [ "ILLEGAL CHARACTER IN ELEMENT" ];
  } ], [ "ILLBIN", "STRING", function () {
    return [ "BINARY OPERATOR MISSING OR IN ERROR" ];
  } ], [ "ILLBRK", "STRING", function () {
    return [ "ERRONEOUS OR MISSING BREAK CHARACTER" ];
  } ], [ "ILLDEC", "STRING", function () {
    return [ "ERRONEOUS REAL NUMBER" ];
  } ], [ "ILLEOS", "STRING", function () {
    return [ "IMPROPERLY TERMINATED STATEMENT" ];
  } ], [ "ILLINT", "STRING", function () {
    return [ "ERRONEOUS INTEGER" ];
  } ], [ "OPNLIT", "STRING", function () {
    return [ "UNCLOSED LITERAL" ];
  } ], [ "ALOCFL", "FORMAT", function () {
    return [ "(40H0INSUFFICIENT STORAGE FOR INITIALIZATION)" ];
  } ], [ "ARTHNO", "FORMAT", function () {
    return [ "(1H0,I15,32H ARITHMETIC OPERATIONS PERFORMED)" ];
  } ], [ "CMTIME", "FORMAT", function () {
    return [ "(1H0,I15,21H MS. COMPILATION TIME)" ];
  } ], [ "EJECTF", "FORMAT", function () {
    return [ "(1H1)" ];
  } ], [ "ERRCF", "FORMAT", function () {
    return [ "(34H0ERRORS DETECTED IN SOURCE PROGRAM/1H1)" ];
  } ], [ "EXNO", "FORMAT", function () {
    return [ "(1H0,I15,21H STATEMENTS EXECUTED,,I8,7H FAILED)" ];
  } ], [ "FTLCF", "FORMAT", function () {
    return [ "(6H1ERROR,I3,13H IN STATEMENT,I5,9H AT LEVEL,I3)" ];
  } ], [ "INCGCF", "FORMAT", function () {
    return [ "(33H1INCOMPLETE STORAGE REGENERATION.)" ];
  } ], [ "INTIME", "FORMAT", function () {
    return [ "(1H0,I15,19H MS. EXECUTION TIME)" ];
  } ], [ "LASTSF", "FORMAT", function () {
    return [ "(28H LAST STATEMENT EXECUTED WAS,I5)" ];
  } ], [ "NODMPF", "FORMAT", function () {
    return [ "(28H1TERMINAL DUMP NOT POSSIBLE.)" ];
  } ], [ "NRMEND", "FORMAT", function () {
    return [ "(28H1NORMAL TERMINATION AT LEVEL,I3)" ];
  } ], [ "NVARF", "FORMAT", function () {
    return [ "(18H0NATURAL VARIABLES,/1H )" ];
  } ], [ "PKEYF", "FORMAT", function () {
    return [ "(21H0UNPROTECTED KEYWORDS/1H )" ];
  } ], [ "PRTOVF", "FORMAT", function () {
    return [ "(29H ***PRINT REQUEST TOO LONG***)" ];
  } ], [ "READNO", "FORMAT", function () {
    return [ "(1H0,I15,16H READS PERFORMED)" ];
  } ], [ "SCANNO", "FORMAT", function () {
    return [ "(1H0,I15,26H PATTERN MATCHES PERFORMED)" ];
  } ], [ "SOURCF", "FORMAT", function () {
    return [ "(42H0BELL TELEPHONE LABORATORIES, INCORPORATED,/1H1)" ];
  } ], [ "STATHD", "FORMAT", function () {
    return [ "(28H1SNOBOL4 STATISTICS SUMMARY-)" ];
  } ], [ "STDMP", "FORMAT", function () {
    return [ "(33H1DUMP OF VARIABLES AT TERMINATION/1H )" ];
  } ], [ "STGENO", "FORMAT", function () {
    return [ "(1H0,I15,33H REGENERATIONS OF DYNAMIC STORAGE)" ];
  } ], [ "SUCCF", "FORMAT", function () {
    return [ "(37H0NO ERRORS DETECTED IN SOURCE PROGRAM/1H1)" ];
  } ], [ "SYSCMT", "FORMAT", function () {
    return [ "(27H0CUT BY SYSTEM IN STATEMENT,I5,9H AT LEVEL,I3)" ];
  } ], [ "TIMEPS", "FORMAT", function () {
    return [ "(1H0,F15.2,35H MS. AVERAGE PER STATEMENT EXECUTED/1H1)" ];
  } ], [ "TITLEF", "FORMAT", function () {
    return [ "(37H1SNOBOL4 (VERSION 3.11, MAY 19, 1975)/8H+_______)" ];
  } ], [ "WRITNO", "FORMAT", function () {
    return [ "(1H0,I15,17H WRITES PERFORMED)" ];
  } ] ];
};
