"use strict";

var SNOBOL = require( './base' ),
    assert = require( 'assert' );

var D = 3,
    S = 2 * D,
    CPD = 3;  // Characters per descriptor

var TIMER, sil = {};

var titles = [];  // Seen titles. Used to prevent infinite loops.

function stackPopper( dataType ) {
    return function ( ARGs ) {
        var src, dst, arg;

        if ( !Array.isArray( ARGs ) ) {
            ARGs = [ ARGs ];
        }
        var A = this.CSTACK.addr;

        for ( var i = 0; i < ARGs.length; i++ ) {
            dst = this[ dataType ]( ARGs[i] );
            if ( this.CSTACK.addr - dst.width < this.STACK ) {
                throw new RangeError( 'Stack underflow' );
            }
            src = this[ dataType ]( this.CSTACK.addr );
            this.CSTACK.addr -= dst.width;
            dst.read( src );
        }
        assert.equal( this.CSTACK.addr, A - ( ARGs.length * dst.width ) );
    }
}

function stackPusher( dataType ) {
    return function ( ARGs ) {
        var src, dst;

        if ( !Array.isArray( ARGs ) ) {
            ARGs = [ ARGs ];
        }

        // Are we iterating in the right direction here?
        for ( var i = 0; i < ARGs.length; i++ ) {
            src = this[ dataType ]( ARGs[i] );
            // XXX: Should `D` below be 'src.width`?
            if ( this.CSTACK.addr + src.width > this.STACK + ( D * this.STSIZE ) ) {
                throw new RangeError( 'Stack overflow' );
            }
            // XXX: Should `D` below be 'src.width`?
            this.CSTACK.addr += src.width;
            dst = this[ dataType ]( this.CSTACK.addr );
            dst.read( src );
        }
    };
}


//     ACOMP is used to compare  the  address  fields  of  two
// descriptors.   The  comparison  is arithmetic with A1 and A2
// being considered as signed integers.  If A1 >  A2,  transfer
// is to GTLOC.  If A1 = A2, transfer is to EQLOC.  If A1 < A2,
// transfer is to LTLOC.
//      Data Input to ACOMP:
//               +-------+-------+-------+
//      DESCR1   |  A1                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR2   |  A2                   |
//               +-----------------------+
// Programming Notes:
// 1.  A1 and A2 may be relocatable addresses.
// 2.  See also LCOMP, ACOMPC, AEQL, AEQLC, and AEQLIC.

sil.ACOMP = function ( $DESCR1, $DESCR2, GTLOC, EQLOC, LTLOC ) {
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        A1 = DESCR1.addr,
        A2 = DESCR2.addr;

    if ( A1 > A2 ) {
        this.jmp( GTLOC );
    } else if ( A1 < A2 ) {
        this.jmp( LTLOC );
    } else {
        this.jmp( EQLOC );
    }
};

//     ACOMPC is used  to  compare  the  address  field  of  a
// descriptor to a constant.  The comparison is arithmetic with
// A being considered as a signed integer.  If A > N,  transfer
// is  to  GTLOC.   If  A = N, transfer is to EQLOC.  If A < N,
// transfer is to LTLOC.
//      Data Input to ACOMPC:
//               +-------+-------+-------+
//      DESCR    |   A                   |
//               +-----------------------+
// Programming Notes:
// 1.  A may be a relocatable address.
// 2.  N is never negative.
// 3.  N is often 0.
// 4.  See also ACOMP, AEQL, AEQLC, and AEQLIC.
sil.ACOMPC = function ( $DESCR, N, GTLOC, EQLOC, LTLOC ) {
    var DESCR = this.d( $DESCR ),
        A = DESCR.addr;

    assert( N >= 0 );
    if ( A > N ) {
        this.jmp( GTLOC );
    } else if ( A < N ) {
        this.jmp( LTLOC );
    } else {
        this.jmp( EQLOC );
    }
};

//     ADDLG is used to add an integer  to  the  length  of  a
// specifier.
//      Data Input to ADDLG:
//               +-------+-------+-------+-------+-------+
//      SPEC     |                                   L   |
//               +---------------------------------------+
//               +-------+-------+-------+
//      DESCR    |   I                   |
//               +-----------------------+
//      Data Altered by ADDLG:
//               +-------+-------+-------+-------+-------+
//      SPEC     |                                  L+I  |
//               +---------------------------------------+
// Programming Notes:
// 1.  I is always positive.
sil.ADDLG = function ( $SPEC, $DESCR ) {
    var SPEC = this.s( $SPEC ),
        DESCR = this.d( $DESCR );

    assert( DESCR.addr > 0 );
    SPEC.length += DESCR.addr;
};

//     ADDSIB  is  used  to  add  a  tree node as a sibling to
// another node.
//      Data Input to ADDSIB:
//               +-------+-------+-------+
//      DESCR1   |  A1                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR2   |  A2      F2      V2   |
//               +-----------------------+
//                +-------+-------+-------+
//      A1+FATHER |  A3      F3      V3   |
//                +-----------------------+
//               +-------+-------+-------+
//      A1+RSIB  |  A4      F4      V4   |
//               +-----------------------+
//               +-------+-------+-------+
//      A3+CODE  |                   I   |
//               +-----------------------+
//      Data Altered by ADDSIB:
//               +-------+-------+-------+
//      A2+RSIB  |  A4      F4      V4   |
//               +-----------------------+
//                +-------+-------+-------+
//      A2+FATHER |  A3      F3      V3   |
//                +-----------------------+
//               +-------+-------+-------+
//      A1+RSIB  |  A2      F2      V2   |
//               +-----------------------+
//               +-------+-------+-------+
//      A3+CODE  |                  I+1  |
//               +-----------------------+
// Programming Notes:
// 1.  ADDSIB is only used by compilation procedures.
// 2.  FATHER, RSIB, and CODE are symbols defined in the source
// program.
// 3.  See also ADDSON and INSERT.
sil.ADDSIB = function ( $DESCR1, $DESCR2 ) {
    // add sibling to tree node
    var FATHER = this.$( 'FATHER' ),
        LSON   = this.$( 'LSON' ),
        RSIB   = this.$( 'RSIB' ),
        CODE   = this.$( 'CODE' ),

        DESCR1 = this.d( $DESCR1 ),
        A1 = DESCR1.addr,

        DESCR2 = this.d( $DESCR2 ),
        A2 = DESCR2.addr,
        F2 = DESCR2.flags,
        V2 = DESCR2.value,

        A1_FATHER = this.d( A1 + FATHER ),
        A3 = A1_FATHER.addr,
        F3 = A1_FATHER.flags,
        V3 = A1_FATHER.value,

        A1_RSIB = this.d( A1 + RSIB ),
        A4 = A1_RSIB.addr,
        F4 = A1_RSIB.flags,
        V4 = A1_RSIB.value,

        A3_CODE = this.d( A3 + CODE ),
        I = A3_CODE.value,

        A2_RSIB = this.d( A2 + RSIB ),
        A2_FATHER = this.d( A2 + FATHER );

    A2_RSIB.update( A4, F4, V4 );
    A2_FATHER.update( A3, F3, V3 );
    A1_RSIB.update( A2, F2, V2 );
    A3_CODE.value = I + 1;
};

//     ADDSON  is  used to add a tree node as a son to another
// node.
//      Data Input to ADDSON:
//               +-------+-------+-------+
//      DESCR1   |  A1      F1      V1   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR2   |  A2      F2      V2   |
//               +-----------------------+
//               +-------+-------+-------+
//      A1+LSON  |  A3      F3      V3   |
//               +-----------------------+
//               +-------+-------+-------+
//      A1+CODE  |                   I   |
//               +-----------------------+
//      Data Altered by ADDSON:
//                +-------+-------+-------+
//      A2+FATHER |  A1      F1      V1   |
//                +-----------------------+
//               +-------+-------+-------+
//      A2+RSIB  |  A3      F3      V3   |
//               +-----------------------+
//                          .
//                          .
//                          .
//               +-------+-------+-------+
//      A1+LSON  |  A2      F2      V2   |
//               +-----------------------+
//               +-------+-------+-------+
//      A1+CODE  |                  I+1  |
//               +-----------------------+
// Programming Notes:
// 1.  ADDSON is only used by compilation procedures.
// 2.  FATHER, LSON,RSIB, and CODE are symbols defined  in  the
// source program.
// 3.  See also ADDSIB and INSERT.
sil.ADDSON = function ( $DESCR1, $DESCR2 ) {
    // add son to tree node
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        father = this.resolve( 'FATHER' ),
        lson = this.resolve( 'LSON' ),
        rsib = this.resolve( 'RSIB' ),
        code = this.resolve( 'CODE' ),
        a1_lson = this.d( DESCR1.addr + lson ),
        a1_code = this.d( DESCR1.addr + code ),
        a2_father = this.d( DESCR2.addr + father ),
        a2_rsib = this.d( DESCR2.addr + rsib );

    a2_father.read( DESCR1 );
    a2_rsib.read( a1_lson );
    a1_lson.read( DESCR2 );
    a1_code.value++;
};

//     ADJUST  is  used  to  adjust  the  address  field  of a
// descriptor.
//      Data Input to ADJUST:
//               +-------+-------+-------+
//      DESCR2   |  A2                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR3   |  A3                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A2       |  A4                   |
//               +-----------------------+
//      Data Altered by ADJUST:
//               +-------+-------+-------+
//      DESCR1   | A3+A4                 |
//               +-----------------------+
// Programming Notes:
// 1.  A3 is always an address integer.
sil.ADJUST = function ( $DESCR1, $DESCR2, $DESCR3 ) {
    // compute adjusted address
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        DESCR3 = this.d( $DESCR3 ),
        DESCR_A2 = this.d( DESCR2.addr ),
        A3 = DESCR3.addr,
        A4 = DESCR_A2.addr;

    DESCR1.addr = A3 + A4;
};

//     ADREAL is used to add two real numbers.  If the  result
// is  out of the range available for real numbers, transfer is
// to FLOC.  Otherwise transfer is to SLOC.
//      Data Input to ADREAL:
//               +-------+-------+-------+
//      DESCR2   |  R2      F2      V2   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR3   |  R3                   |
//               +-----------------------+
//      Data Altered by ADREAL:
//               +-------+-------+-------+
//      DESCR1   | R2+R3    F2      V2   |
//               +-----------------------+
// Programming Notes:
// 1.  See also DVREAL, EXREAL, MNREAL, MPREAL, and SBREAL.
sil.ADREAL = function ( $DESCR1, $DESCR2, $DESCR3, FLOC, SLOC ) {
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        DESCR3 = this.d( $DESCR3 );

    try {
        DESCR1.raddr = DESCR2.raddr + DESCR3.raddr;
        DESCR1.flags = DESCR2.flags;
        DESCR1.value = DESCR2.value;
        this.jmp( SLOC );
    } catch ( e ) {
        if ( e instanceof RangeError ) {
            this.jmp( FLOC );
        }
    }
};

//     AEQL is used to  compare  the  address  fields  of  two
// descriptors.   The  comparison  is arithmetic with A1 and A2
// being considered as signed integers: If A1 = A2, transfer is
// to EQLOC.  Otherwise transfer is to NELOC.
//      Data Input to AEQL:
//               +-------+-------+-------+
//      DESCR1   |  A1                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR2   |  A2                   |
//               +-----------------------+
// Programming Notes:
// 1.  A1 and A2 may be relocatable addresses.
// 2.  See  also VEQL, AEQLC, LEQLC, AEQLIC, ACOMP, and ACOMPC.
sil.AEQL = function ( $DESCR1, $DESCR2, NELOC, EQLOC ) {
    // addresses equal test
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 );

    if ( DESCR1.addr === DESCR2.addr ) {
        this.jmp( EQLOC );
    } else {
        this.jmp( NELOC );
    }
};

//     AEQLC is  used  to  compare  the  address  field  of  a
// descriptor to a constant.  The comparison is arithmetic with
// A being considered as a signed integer.  If A = N,  transfer
// is to EQLOC.  Otherwise transfer is to NELOC.
//      Data Input to AEQLC:
//               +-------+-------+-------+
//      DESCR    |   A                   |
//               +-----------------------+
// Programming Notes:
// 1.  A may be a relocatable address.
// 2.  N is never negative.
// 3.  N is often 0.
// 4.  See also LEQLC, AEQL, AEQLIC, ACOMP, and ACOMPC.
sil.AEQLC = function ( $DESCR, N, NELOC, EQLOC ) {
    // address equal to constant test
    var DESCR = this.d( $DESCR ),
        A = DESCR.addr;

    assert( N >= 0 );
    if ( A === N ) {
        this.jmp( EQLOC );
    } else {
        this.jmp( NELOC );
    }
};

//     AEQLIC  is  used  to  compare  an  indirectly specified
// address field of a descriptor to a constant.  The comparison
// is  arithmetic with A1 being considered as a signed integer.
// If A2 = N2, transfer is to EQLOC.  Otherwise transfer is  to
// NELOC.
//      Data Input to AEQLIC:
//               +-------+-------+-------+
//      DESCR    |  A1                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A1+N1    |  A2                   |
//               +-----------------------+
// Programming Notes:
// 1.  A2 may be a relocatable address.
// 2.  N2 is never negative.
// 3.  N1 is always zero.
//     XXX: This is patently false! I think the documentation mixed up
//     N1 and N2. N2 is indeed always zero. --OL
// 4.  See also AEQL, AEQLC, LEQLC, ACOMP, and ACOMPC.
sil.AEQLIC = function ( $DESCR, N1, N2, NELOC, EQLOC ) {
    var DESCR = this.d( $DESCR ),
        A1 = DESCR.addr,
        DESCR_indirect = this.d( A1 + N1 ),
        A2 = DESCR_indirect.addr;

    assert( N2 === 0 );
    assert( N1 >= 0 );
    if ( A2 === N2 ) {
        this.jmp( EQLOC );
    } else {
        this.jmp( NELOC );
    }
};

//     APDSP is used to append one specified string to another
// specified string.
//      Data Input to APDSP:
//               +-------+-------+-------+-------+-------+
//      SPEC1    |  A1                      O1      L1   |
//               +---------------------------------------+
//               +-------+-------+-------+-------+-------+
//      SPEC2    |  A2                      O2      L2   |
//               +---------------------------------------+
//               +-------+-------+-------+
//      A1+O1    |  C11     ...    C1L1  |
//               +-----------------------+
//               +-------+-------+-------+
//      A2+O2    |  C21     ...    C2L2  |
//               +-----------------------+
//      Data Altered by APDSP:
//               +-------+-------+-------+-------+-------+
//      SPEC1    |  A1                      O1     L1+L2 |
//               +---------------------------------------+
//               +------+-----+------+-----+------+-----+
//      A1+O1    | C11   ...    C1L1   C21   ...   C2L2 |
//               +--------------------------------------+
// Programming Notes:
// 1.  If L1 = 0, C21 is placed at A1+O1.
// 2.  The  storage  following  C1L1  is  always  adequate  for
// C21...C2L2.
sil.APDSP = function ( $SPEC1, $SPEC2 ) {
    // append specifier
    var SPEC1 = this.s( $SPEC1 ),
        SPEC2 = this.s( $SPEC2 ),
        A1 = SPEC1.addr,
        O1 = SPEC1.offset,
        L1 = SPEC1.length,
        A2 = SPEC2.addr,
        O2 = SPEC2.offset,
        L2 = SPEC2.length;

    for ( var i = 0; i < SPEC2.length; i++ ) {
        // XXX: is '-1' really correct?!
        this.mem[ A1 + O1 + L1 + i - 1 ] = this.mem[ A2 + O2 + i ];
    }
    SPEC1.length = SPEC1.length + SPEC2.length;
};

//     ARRAY is used to assemble an array of descriptors.
//      Data Assembled by ARRAY:
//               +-------+-------+-------+
//      L        |   0       0       0   |
//               +-----------------------+
//                          .
//                          .
//                          .
//                +-------+-------+-------+
//      L+(N-1)*D |   0       0       0   |
//                +-----------------------+
// Programming Notes:
// 1.  All fields of all descriptors assembled by ARRAY must be
// zero when program execution begins.
sil.ARRAY = function ( N ) {
    return this.alloc( N * D );
};

//     BKSIZE is used to determine the amount of storage occu-
// pied  by a block or string structure.  The flag field of the
// descriptor at A distinguishes between string structures  and
// blocks.  If F contains the flag STTL, then
//      F(V)=D*(4+[(V-1)/CPD+1])
// where  [V] is the integer part of V and CPD is the number of
// characters stored per descriptor.   The  constant  4  occurs
// because  there  are 4 descriptors (including the title) in a
// string structure in addition  to  the  string  itself.   The
// expression  in brackets represents the number of descriptors
// required for a string of V characters.  If F does  not  con-
// tain the flag STTL, then F(V) = V+D.
//      Data Input to BKSIZE:
//               +-------+-------+-------+
//      DESCR2   |   A                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A        |           F       V   |
//               +-----------------------+
//      Data Altered by BKSIZE:
//               +-------+-------+-------+
//      DESCR1   | F(V)      0       0   |
//               +-----------------------+
// Programming Notes:
// 1.  See also GETLTH.
sil.BKSIZE = function ( $DESCR1, $DESCR2 ) {
    // get block size
    var STTL = this.$( 'STTL' ),
        DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        A = this.d( DESCR2.addr ),
        V = A.value,
        F = A.flags;

    if ( F & STTL ) {
        DESCR1.addr = D * ( 4 + Math.floor( ( V - 1 ) / CPD + 1 ) );
    } else {
        DESCR1.addr = V + D;
    }
    DESCR1.flags = 0;
    DESCR1.value = 0;
};

//     BKSPCE  is  used  to  back space one record on the file
// associated with unit reference number I.
//      Data Input to BKSPCE:
//               +-------+-------+-------+
//      DESCR    |   I                   |
//               +-----------------------+
// Programming Notes:
// 1.  See also ENFILE and REWIND.
// 2.  Refer to Section 2.1 for a discussion of unit  reference
// numbers.
sil.BKSPCE = function ( $DESCR ) {
    // backspace record
    var DESCR = this.d( $DESCR ),
        file = new SNOBOL.File( this, DESCR.addr );

    if ( file.pos > 0 ) {
        file.pos--;
        while ( file.pos > 0 && file.src.charAt( file.pos ) !== '\u001F' ) {
            file.pos--;
        }
    }
};

//     BRANCH  is used to alter the flow of program control by
// branching to LOC.  If PROC is given, it is the procedure  in
// which LOC occurs.  If PROC is omitted, LOC is in the current
// procedure.
// Programming Notes:
// 1.  See also PROC.
// XXX: How are LOCs local?!
sil.BRANCH = function ( LOC, PROC ) {
    // branch to program location
    this.jmp( LOC );
};

//     BRANIC is used to alter the flow of program control  by
// branching indirectly to the operation at LOC.
//      Data Input to BRANIC:
//               +-------+-------+-------+
//      DESCR    |   A                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A+N      |  LOC                  |
//               +-----------------------+
// Programming Notes:
// 1.  N is always zero
sil.BRANIC = function ( $DESCR, N ) {
    // branch indirect with offset constant
    var DESCR = this.d( $DESCR ),
        DESCR_indirect = this.d( DESCR.addr + N );

    assert( N === 0 );
    this.jmp( DESCR_indirect.addr );
};

//     BUFFER  is used to assemble a string of N blank charac-
// ters.
//      Data Assembled by BUFFER:
//               +-------+-------+-------+
//      LOC      |          ...          |
//               +-----------------------+
// Programming Notes:
// 1.  All characters of the string assembled by BUFFER must be
// blank (not zero) when program execution begins.
sil.BUFFER = function ( N ) {
    // assemble buffer of blank characters
    var ptr = this.mem.length;
    const BLANK = ' '.charCodeAt( 0 );
    for ( var i = 0; i < N; i++ ) {
        this.mem.push( BLANK );
    }
    return ptr;
};

//     CHKVAL is used to compare an integer to the length of a
// specifier plus another integer.  If L+I2 > I1,  transfer  is
// to  GTLOC.   If  L+I2 = I1, transfer is to EQLOC.  If L+I2 <
// I1, transfer is to LTLOC.
//      Data Input to CHKVAL:
//               +-------+-------+-------+-------+-------+
//      SPEC     |                                   L   |
//               +---------------------------------------+
//               +-------+-------+-------+
//      DESCR1   |  I1                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR2   |  I2                   |
//               +-----------------------+
// Programming Notes:
// 1.  I1, I2, and L are always positive integers.
// 2.  CHKVAL is used only in pattern matching.
sil.CHKVAL = function ( $DESCR1, $DESCR2, $SPEC, GTLOC, EQLOC, LTLOC ) {
    var DESCR1 = this.d( $DESCR1 ),
        I1 = DESCR1.addr,

        DESCR2 = this.d( $DESCR2 ),
        I2 = DESCR2.addr,

        SPEC = this.s( $SPEC ),
        L = SPEC.length;

    assert( I1 > 0 );
    assert( I2 > 0 );
    assert( L > 0 );

    if ( L + I2 > I1 ) {
        this.jmp( GTLOC );
    } else if ( L + I2 === I1 ) {
        this.jmp( EQLOC );
    } else {
        this.jmp( LTLOC );
    }
};

//     CLERTB is used to  set  the  indicator  fields  of  all
// entries  of a syntax table to a constant.  KEY may be one of
// four values:
//      CONTIN
//      ERROR
//      STOP
//      STOPSH
//      The indicator field of each entry of TABLE is set to  T
// where  T  is  the indicator that corresponds to the value of
// KEY.
//      Data Altered by CLERTB for ERROR, STOP, or STOPSH:
//               +-------+-------+-------+
//      TABLE    |           T           |
//               +-----------------------+
//                          .
//                          .
//                          .
//                +-------+-------+-------+
//      TABLE+Z*E |           T           |
//                +-----------------------+
//      Data Altered by CLERTB for CONTIN:
//               +-------+-------+-------+
//      TABLE    | TABLE     0           |
//               +-----------------------+
//                          .
//                          .
//                          .
//                +-------+-------+-------+
//      TABLE+Z*E | TABLE     0           |
//                +-----------------------+
// Programming Notes:
// 1.  See Section 4.2.
// 2.  See also PLUGTB.
sil.CLERTB = function ( TABLE, KEY ) {
    // clear syntax table
    for ( var i = 0; i < TABLE.length; i++ ) {
        TABLE[i][2] = KEY;
    }
};

//     COPY is used to copy a file of  machine-dependent  data
// into  the  source  program.   COPY occurs three times in the
// assembly:
//      COPY    MDATA
//      COPY    MLINK
//      COPY    PARMS
// MLINK and PARMS are copied at the beginning of  the  SNOBOL4
// assembly.  MDATA is copied in the data region.
// MDATA is a file of machine-dependent data.  It contains
// data used in  the  implementation  of  the  macros  and  for
// strings  that  depend  on the character set of an individual
// machine or that represent  other  problems  that  prevent  a
// machine-independent representation.  These are:
// 1.  ALPHA, a string that consists of all characters arranged
// in the order  of  their  internal  numerical  representation
// (collating sequence).
// 2.  AMPST,  a  string  consisting  of a single ampersand, or
// whatever character is used to represent the keyword operator
// in the source language.
// 3.  COLSTR, a string of two characters consisting of a colon
// followed by a blank.
// 4.  QTSTR, a string consisting of a single  quotation  mark,
// or  whatever character is used to represent a quotation mark
// in the source language.
// These strings of characters are pointed to by the specifiers
// ALPHSP, AMPSP, COLSP, and QTSP respectively.
// MLINK  is  a  file  of entry points and external symbol
// names that describe linkages used to access machine-language
// subroutines and I/O packages.
// PARMS is a file of machine-dependent constants (equiva-
// lences).  It contains constants used in  the  implementation
// of the macros and definitions of symbols.  These are:
// 1.  ALPHSZ,  the  number  of characters in the character set
// for the machine.  (ALPHSZ is 256 for the IBM System/360.)
// 2.  CPA, the number of  characters  per  machine  addressing
// unit.  (CPA is 1 for the IBM System/360, i.e., one character
// per byte.)
// 3.  DESCR, the address width of a descriptor.
// 4.  FNC, a flag used to identify function descriptors.
// 5.  MARK, a flag  used  to  identify  descriptors  that  are
// marked titles.
// 6.  PTR,  a  flag used to identify descriptors pointing into
// SNOBOL4 dynamic storage.
// 7.  SIZLIM, the value of the largest  integer  that  can  be
// stored in the value field of a descriptor.
// 8.  SPEC, the address width of a specifier.
// 9.  STTL,  a  flag  used  to  identify  descriptors that are
// titles of string structures.
// 10. TTL, a flag used to identify descriptors that are titles
// of blocks.
// 11. UNITI,  the number of the standard input unit.  UNITI is
// 5 for the IBM System/360 implementation.
// 12. UNITO, the number of the  standard  print  output  unit.
// UNITO is 6 for the IBM System/360 implementation.
// 13. UNITP,  the  number  of  the standard punch output unit.
// UNITP is 7 for the IBM System/360 implementation.
// CSTACK and OSTACK, the current end old stack  pointers,
// respectively,  should  be  defined in one of the COPY files.
// These pointers may either be in registers or in the  address
// fields of descriptors, depending on how the stack management
// macros are implemented (see PUSH and RCALL, e.g.).  If these
// pointers  are  implemented  as  registers,  they  should  be
// defined in PARMS.  If they are implemented in storage  loca-
// tions, they should be defined in MDATA.
// Programming Notes:
// 1.  COPY may be implemented in a variety of ways.  COPY may,
// for example, simply expand into the data required, depending
// on the value of its argument as given above.
// 2.  Any  of  the  COPY  segments  can be used to incorporate
// other machine-dependent data.
sil.COPY = function ( FILE ) {
    // pass
};

//     CPYPAT is used to copy a pattern.  First set
//      R1 = A1
//      R2 = A2
//      R3 = A6
// where R1, R2, and R3 are temporary locations.   Sections  of
// the  pattern  are copied for successive values of R1 and R2.
// After copying each section, set
//      R3 = R3-(1+V7)*D
// Then set
//      R1 = R1+(1+V7)*D
//      R2 = R2+(1+V7)*D
// If R3 > 0, continue, copying the  next  section.   Otherwise
// the  operation  is  complete.   The  final  value  of  R1 is
// inserted in the address field of DESCR1.
//      The functions F1 and F2 are defined as follows:
//      F1(X) = 0 if X = 0
//      F1(X) = X+A4 otherwise
//      F2(X) = A5 if X = 0
//      F2(X) = X+A4 otherwise
//      Initial Data Input to CPYPAT:
//               +-------+-------+-------+
//      DESCR1   |  A1                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR2   |  A2                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR3   |  A3                   |
//               +-----------------------+
//                          .
//                          .
//                          .
//               +-------+-------+-------+
//      DESCR4   |  A4                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR5   |  A5                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR6   |  A6                   |
//               +-----------------------+
//      Data Input to CPYPAT for Successive Values of R2:
//               +-------+-------+-------+
//      R2+D     |  A7      F7      V7   |
//               +-----------------------+
//               +-------+-------+-------+
//      R2+2D    |  A8       0      V8   |
//               +-----------------------+
//               +-------+-------+-------+
//      R2+3D    |  A9       0      V9   |
//               +-----------------------+
//      Data Altered by CPYPAT for Successive Values of R1:
//               +-------+-------+-------+
//      R1+D     |  A7      F7      V7   |
//               +-----------------------+
//               +--------+-------+--------+
//      R1+2D    | F1(A8)     0     F2(V8) |
//               +-------------------------+
//               +-------+-------+-------+
//      R1+3D    | A9+A3     0     V9+A3 |
//               +-----------------------+
//      Additional Data Input for Successive Values of R2 if V7 = 3:
//               +-------+-------+-------+
//      R2+4D    |  A10     F10     V10  |
//               +-----------------------+
//      Additional Data Altered for Successive Values of R1 if V7 = 3:
//               +-------+-------+-------+
//      R1+4D    |  A10     F10     V10  |
//               +-----------------------+
//      Data Altered when Copying is Complete:
//               +-------+-------+-------+
//      DESCR1   |  R1                   |
//               +-----------------------+
sil.CPYPAT = function ( $DESCR1, $DESCR2, $DESCR3, $DESCR4, $DESCR5, $DESCR6 ) {
    // copy pattern
    function F1(X) { return X === 0 ? 0 : ( X * A4 ); }
    function F2(X) { return X === 0 ? A5 : ( X + A4 ); }

    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        DESCR3 = this.d( $DESCR3 ),
        DESCR4 = this.d( $DESCR4 ),
        DESCR5 = this.d( $DESCR5 ),
        DESCR6 = this.d( $DESCR6 ),
        R1 = DESCR1.addr,
        R2 = DESCR2.addr,
        R3 = DESCR6.addr,
        A3 = DESCR3.addr,
        A4 = DESCR4.addr,
        A5 = DESCR5.addr,
        V7, src, dst;

    do {
        src = this.d( R2 + 3 );
        dst = this.d( R1 + 3 );
        dst.read( src );
        V7 = src.value;

        src = this.d( R2 + 6 );
        dst = this.d( R1 + 6 );
        dst.update( F1( dst.addr ), 0, F2( dst.value ) );

        src = this.d( R2 + 9 );
        dst = this.d( R1 + 9 );
        dst.update( src.addr + A3, 0, src.value + A3 );

        if ( V7 === 3 ) {
            src = this.d( R2 + 12 );
            dst = this.d( R1 + 12 );
            dst.read( src );
        }

        R3 -= 3 * ( V7 + 1 );
        R1 += 3 * ( V7 + 1 );
        R2 += 3 * ( V7 + 1 );
    } while ( R3 > 0 );

    DESCR1.addr = R1;
};

//     DATE is used to obtain the current date.   A  character
// representation of the current date is placed in BUFFER.
//      Data Altered by DATE:
//               +--------+-------+-------+-------+-------+
//      SPEC     | BUFFER     0       0       0       L   |
//               +----------------------------------------+
//               +-------+-------+-------+
//      BUFFER   |  C1      ...     CL   |
//               +-----------------------+
// Programming Notes:
// 1.  The  choice  of  representation  for  the  date  is  not
// important so far as the source language is concerned.  Thus
//      April 1, 1981
//      04/01/81
//      4:1:81
//      81.092
// are all acceptable.
// 2.  BUFFER is local to DATE and  its  old  contents  may  be
// overwritten by a subsequent use of DATE.
// 3.  DATE is used only in the SNOBOL4 DATE function.
// 4.  Implementation  of  DATE, as such, is not essential.  In
// this case, DATE should set the length of SPEC to zero and do
// nothing else.
sil.DATE = function ( $SPEC ) {
    // get date
    this.specify( new Date().toString(), $SPEC );
};

//     DECRA  is  used  to  decrement  the  address field of a
// descriptor.  A is considered as a signed integer.
//      Data Input to DECRA:
//               +-------+-------+-------+
//      DESCR    |   A                   |
//               +-----------------------+
//      Data Altered by DECRA:
//               +-------+-------+-------+
//      DESCR    |  A-N                  |
//               +-----------------------+
// Programming Notes:
// 1.  A maybe a relocatable address.
// 2.  N is always positive.
// 3.  N is often 1 or D.
// 4.  A-N may be negative.
// 5.  See also INCRA.
sil.DECRA = function ( $DESCR, N ) {
    // decrement address
    var DESCR = this.d( $DESCR );

    assert( N > 0 );
    DESCR.addr -= N;
};

//     DEQL is used to compare two descriptors.  If A1  =  A2,
// F1  =  F2,  and  V1  =  V2, transfer is to EQLOC.  Otherwise
// transfer is to NELOC.
//      Data Input to DEQL:
//               +-------+-------+-------+
//      DESCR1   |  A1      F1      V1   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR2   |  A2      F2      V2   |
//               +-----------------------+
// Programming Notes:
// 1.  All fields of the two descriptors must be identical  for
// transfer to EQLOC.
sil.DEQL = function ( $DESCR1, $DESCR2, NELOC, EQLOC ) {
    // descriptor equal test
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 );

    if ( DESCR1.isEqualTo( DESCR2 ) ) {
        this.jmp( EQLOC );
    } else {
        this.jmp( NELOC );
    }
};

//     DESCR  assembles  a  descriptor with specified address,
// flag, and value fields.
//      Data Assembled by DESCR:
//               +-------+-------+-------+
//      LOC      |   A       F       V   |
//               +-----------------------+
// Programming Notes:
// 1.  Any or all of A, F, and V may be omitted.  A zero  field
// must   be  assembled  when  the  corresponding  argument  is
// omitted.
sil.DESCR = function ( A, F, V ) {
    // assemble descriptor
    var DESCR = this.d( this.currentLabel );

    DESCR.addr  = A || 0;
    DESCR.flags = F || 0;
    DESCR.value = V || 0;

    return DESCR.ptr;
};

//     DIVIDE is used to divide one integer by  another.   Any
// remainder  is  discarded.  That is, the result is truncated,
// not rounded.  If I = 0,  transfer  is  to  FLOC.   Otherwise
// transfer is to SLOC.
//      Data Input to DIVIDE:
//               +-------+-------+-------+
//      DESCR2   |   A       F       V   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR3   |   I                   |
//               +-----------------------+
//      Data Altered by DIVIDE:
//               +-------+-------+-------+
//      DESCR1   |  A/I      F       V   |
//               +-----------------------+
// Programming Notes:
// 1.  A may be a relocatable address.
sil.DIVIDE = function ( $DESCR1, $DESCR2, $DESCR3, FLOC, SLOC ) {
    // divide integers
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        DESCR3 = this.d( $DESCR3 ),
        A = DESCR2.addr,
        I = DESCR3.addr;

    if ( I === 0 ) {
        this.jmp( FLOC );
    }

    DESCR1.addr = Math.floor( A / I );
    DESCR1.flags = DESCR2.flags;
    DESCR1.value = DESCR2.value;
    this.jmp( SLOC );
};

//     DVREAL  is  used  to divide one real number by another.
// If R3 = 0 or the result is out of the  range  available  for
// real numbers, transfer is to FLOC.  Otherwise transfer is to
// SLOC.
//      Data Input to DVREAL:
//               +-------+-------+-------+
//      DESCR2   |  R2      F2      V2   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR3   |  R3                   |
//               +-----------------------+
//      Data Altered by DVREAL:
//               +-------+-------+-------+
//      DESCR1   | R2/R3    F2      V2   |
//               +-----------------------+
// Programming Notes:
// 1.  In addition to use in source-language arithmetic, DVREAL
// is  used  in  the computation of statistics published at the
// end of a SNOBOL4 run.
// 2.  See also ADREAL, EXREAL, MNREAL, MPREAL, and SBREAL.
sil.DVREAL = function ( $DESCR1, $DESCR2, $DESCR3, FLOC, SLOC ) {
    // divide real numbers
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        DESCR3 = this.d( $DESCR3 );

    try {
        DESCR1.raddr = DESCR2.raddr / DESCR3.raddr;
        this.jmp( SLOC );
    } catch ( e ) {
        if ( e instanceof RangeError ) {
            this.jmp( FLOC );
        }
    }
};

//     END is used to terminate assembly of the  SNOBOL4  sys-
// tem.  It occurs only once and is the last card of the assem-
// bly.
sil.END = function () {
    // end assembly
};

//     ENDEX is used to terminate execution of a SNOBOL4  run.
// ENDEX  is  the  last instruction executed and is responsible
// for returning properly to the environment that initiated the
// SNOBOL4  run.   If  I is nonzero, a post-mortem dump of user
// core should be given.
//      Data Input to ENDEX:
//               +-------+-------+-------+
//      DESCR    |   I                   |
//               +-----------------------+
// Programming Notes:
// 1.  If a dump is not given, the keyword &ABEND will not have
// its specified effect.  Nothing else will be affected.
// 2.  On the IBM System/360, if I is nonzero, an abend dump is
// given with a user code of I.
// 3.  See also INIT.
sil.ENDEX = function ( $DESCR ) {
    // end execution of SNOBOL4 run
    var I = this.d( $DESCR ).addr;

    return I === 0;
};

//     ENFILE is used to write an end-of-file on  (close)  the
// file associated with unit reference number I.
//      Data Input to ENFILE:
//               +-------+-------+-------+
//      DESCR    |   I                   |
//               +-----------------------+
// Programming Notes:
// 1.  See also BKSPCE and REWIND.
// 2.  Refer  to Section 2.1 for a discussion of unit reference
// numbers.
sil.ENFILE = function ( $DESCR ) {
    // write end of file
    var DESCR = this.d( $DESCR );

    // fs.closeSync( DESCR.addr );
};

//     EQU is used to assign, at assembly time, the value of N
// to SYMBOL.
sil.EQU = function ( N ) {
    // define symbol equivalence
    return N;
};

//     EXPINT is used to raise an integer to an integer power.
// If I1 = 0 and I2 is not positive, or if the result is out of
// the range available for integers, transfer is to FLOC.  Oth-
// erwise transfer is to SLOC.
//      Data Input to EXPINT:
//               +-------+-------+-------+
//      DESCR2   |  I1       F       V   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR3   |  I2                   |
//               +-----------------------+
//      Data Altered by EXPINT:
//               +--------+-------+-------+
//      DESCR1   | I1**I2     F       V   |
//               +------------------------+
sil.EXPINT = function ( $DESCR1, $DESCR2, $DESCR3, FLOC, SLOC ) {
    // exponentiate integers
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        DESCR3 = this.d( $DESCR3 );

    try {
        DESCR1.addr = Math.pow( DESCR2.addr, DESCR3.addr );
        DESCR1.flags = DESCR2.flags;
        DESCR1.value = DESCR2.value;
        this.jmp( SLOC );
    } catch ( e ) {
        if ( e instanceof RangeError ) {
            this.jmp( FLOC );
        }
    }
};

//     EXREAL is used to raise a real number to a real  power.
// If  the  result  is not a real number or is out of the range
// available for real numbers, transfer is to FLOC.   Otherwise
// transfer is to SLOC.
//      Data Input to EXREAL:
//               +-------+-------+-------+
//      DESCR2   |  R1       F       V   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR3   |  R2                   |
//               +-----------------------+
//      Data Altered by EXREAL:
//               +--------+-------+-------+
//      DESCR1   | R1**R2     F       V   |
//               +------------------------+
sil.EXREAL = function ( $DESCR1, $DESCR2, $DESCR3, FLOC, SLOC ) {
    // exponentiate real numbers
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        DESCR3 = this.d( $DESCR3 );

    try {
        DESCR1.raddr = Math.pow( DESCR2.raddr, DESCR3.raddr );
        DESCR1.flags = DESCR2.flags;
        DESCR1.value = DESCR2.value;
        this.jmp( SLOC );
    } catch ( e ) {
        if ( e instanceof RangeError ) {
            this.jmp( FLOC );
        }
    }
};

//     FSHRTN  is  used  to  exclude initial characters from a
// string specification.
//      Data Input to FSHRTN:
//               +-------+-------+-------+-------+-------+
//      SPEC     |                           O       L   |
//               +---------------------------------------+
//      Data Altered by FSHRTN:
//               +-------+-------+-------+-------+-------+
//      SPEC     |                          O+N     L-N  |
//               +---------------------------------------+
// Programming Notes:
// 1. L-N is never negative.
// 2. See also REMSP.
sil.FSHRTN = function ( $SPEC, N ) {
    // foreshorten specifier
    var SPEC = this.s( $SPEC );

    SPEC.offset += N;
    SPEC.length -= N;
};

//     GETAC is used to get an address field  with  an  offset
// constant.
//      Data Input to GETAC:
//               +-------+-------+-------+
//      DESCR2   |  A2                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A2+N     |   A                   |
//               +-----------------------+
//      Data Altered by GETAC:
//               +-------+-------+-------+
//      DESCR1   |   A                   |
//               +-----------------------+
// Programming Notes:
// 1.  N may be negative.
// 2.  See also PUTAC, GETDC, and PUTDC.
sil.GETAC = function ( $DESCR1, $DESCR2, N ) {
    // get address with offset constant
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        A2 = DESCR2.addr,
        DESCR_indirect = this.d( A2 + N ),
        A = DESCR_indirect.addr;

    DESCR1.addr = A;
};

//     GETBAL  is  used to get the specification of a balanced
// substring.  The string starting at CL+1 and ending  at  CL+N
// is  examined  to  determine  the shortest balanced substring
// CL+1,...,CL+J.  J is determined according to  the  following
// rules:
// If CL+1 is not a parenthesis, then J = 1.
// If  CL+1  is a left parenthesis, then J is the least integer
// such that CL+1...CL+J is balanced with respect to  parenthe-
// ses in the usual algebraic sense.
// If  CL+1  is  a  right  parenthesis,  or if no such balanced
// string exists, transfer is to FLOC.  Otherwise SPEC is modi-
// fied as indicated and transfer is to SLOC.
//      Data Input to GETBAL:
//               +-------+-------+-------+-------+-------+
//      SPEC     |   A                       O       L   |
//               +---------------------------------------+
//               +-------+-------+-------+
//      DESCR    |   N                   |
//               +-----------------------+
//               +------+-----+-----+------+------+-----+
//      A+O      | C1    ...    CL    CL+1   ...   CL+N |
//               +--------------------------------------+
//      Data Altered by GETBAL:
//               +-------+-------+-------+-------+-------+
//      SPEC     |   A                       O      L+J  |
//               +---------------------------------------+
sil.GETBAL = function ( $SPEC, $DESCR, FLOC, SLOC ) {
    // get parenthesis balanced string
    var SPEC = this.s( $SPEC ),
        DESCR = this.d( $DESCR ),
        start = SPEC.addr + SPEC.offset + SPEC.length,
        stop = start + DESCR.addr,
        string = SNOBOL.str.decode( this.mem.slice( start, stop ) ),
        j,
        stack;

    switch ( string.charAt( 0 ) ) {
    case ')':
        // If  CL+1  is  a  right  parenthesis ... transfer is to FLOC.
        return this.jmp( FLOC );
    case '(':
        // If  CL+1  is a left parenthesis, then J is the least integer
        // such that CL+1...CL+J is balanced with respect to parenthe-
        // ses in the usual algebraic sense.
        stack = 1;
        for ( j = 1; j < string.length; j++ ) {
            switch ( string.charAt( j ) ) {
            case '(':
                stack++;
                break;
            case ')':
                stack--;
                if ( stack === 0 ) {
                    SPEC.length += j;
                    return this.jmp( SLOC );
                }
                break;
            }
        }
        // If no such balanced string exists, transfer is to FLOC.
        return this.jmp( FLOC );
    default:
        // If CL+1 is not a parenthesis, then J = 1.
        SPEC.length++;
        return this.jmp( SLOC );
    }
};

//     GETD is used to get a descriptor.
//      Data Input to GETD:
//               +-------+-------+-------+
//      DESCR2   |  A2                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR3   |  A3                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A2+A3    |   A       F       V   |
//               +-----------------------+
//      Data Altered by GETD:
//               +-------+-------+-------+
//      DESCR1   |   A       F       V   |
//               +-----------------------+
// Programming Notes:
// 1.  See also GETDC, PUTD, and PUTDC.
sil.GETD = function ( $DESCR1, $DESCR2, $DESCR3 ) {
    // get descriptor
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        A2 = DESCR2.addr,

        DESCR3 = this.d( $DESCR3 ),
        A3 = DESCR3.addr,

        DESCR_indirect = this.d( A2 + A3 );

    DESCR1.read( DESCR_indirect );
};

//     GETDC  is  used to get a descriptor with an offset con-
// stant.
//      Data Input to GETDC:
//               +-------+-------+-------+
//      DESCR2   |  A2                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A2+N     |   A       F       V   |
//               +-----------------------+
//      Data Altered by GETDC:
//               +-------+-------+-------+
//      DESCR1   |   A       F       V   |
//               +-----------------------+
// Programming Notes:
// 1.  See also GETD, PUTDC, and PUTD.
sil.GETDC = function ( $DESCR1, $DESCR2, N ) {
    // get descriptor with offset constant
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        A2 = DESCR2.addr,
        DESCR_indirect = this.d( A2 + N );

    DESCR1.read( DESCR_indirect );
};

//     GETLG is used to get the length of a specifier.
//      Data Input to GETLG:
//               +-------+-------+-------+-------+-------+
//      SPEC     |                                   L   |
//               +---------------------------------------+
//      Data Altered by GETLG:
//               +-------+-------+-------+
//      DESCR    |   L       0       0   |
//               +-----------------------+
// Programming Notes:
// 1.  See also PUTLG.
sil.GETLG = function ( $DESCR, $SPEC ) {
    // get length of specifier
    var DESCR = this.d( $DESCR ),
        SPEC  = this.s( $SPEC );

    DESCR.addr  = SPEC.length;
    DESCR.flags = 0;
    DESCR.value = 0;
};

//     GETLTH is used  to  determine  the  amount  of  storage
// required  for  a string structure.  The amount of storage is
// given by the formula
//      F(L)=D*(3+[(L-1)/CPD+1])
// where [L] is the integer part of L and CPD is the numbers of
// characters  stored  per descriptor.  The constant 3 accounts
// for the three descriptors in a string structure in  addition
// to the string itself.  The expression in brackets represents
// the number of descriptors required for a string of L charac-
// ters.
//      Data Input to GETLTH:
//               +-------+-------+-------+
//      DESCR2   |   L                   |
//               +-----------------------+
//      Data Altered by GETLTH:
//               +-------+-------+-------+
//      DESCR1   | F(L)      0       0   |
//               +-----------------------+
// Programming Notes:
// 1.  See also BKSIZE.
sil.GETLTH = function ( $DESCR1, $DESCR2 ) {
    // get length for string structure
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        L = DESCR2.addr;

    DESCR1.addr  = D * ( 3 + Math.floor( ( L - 1 ) / CPD + 1 ) );
    DESCR1.flags = 0;
    DESCR1.value = 0;
};

//     GETSIZ  is used to get the size from the value field of
// a title descriptor.
//      Data Input to GETSIZ:
//               +-------+-------+-------+
//      DESCR2   |   A                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A        |                   V   |
//               +-----------------------+
//      Data Altered by GETSIZ:
//               +-------+-------+-------+
//      DESCR1   |   V       0       0   |
//               +-----------------------+
// Programming Notes:
// 1.  See also SETSIZ.
sil.GETSIZ = function ( $DESCR1, $DESCR2 ) {
    // get size
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        DESCR_indirect = this.d( DESCR2.addr );

    DESCR1.addr  = DESCR_indirect.value;
    DESCR1.flags = 0;
    DESCR1.value = 0;
};

//     GETSPC is used to get a specifier.
//      Data Input to GETSPC:
//               +-------+-------+-------+
//      DESCR    |  A1                   |
//               +-----------------------+
//               +-------+-------+-------+-------+-------+
//      A1+N     |   A       F       V       O       L   |
//               +---------------------------------------+
//      Data Altered by GETSPC:
//               +-------+-------+-------+-------+-------+
//      SPEC     |   A       F       V       O       L   |
//               +---------------------------------------+
// Programming Notes:
// 1.  See also PUTSPC.
sil.GETSPC = function ( $SPEC, $DESCR, N ) {
    // get specifier with constant offset
    var DESCR = this.d( $DESCR ),
        A1    = DESCR.addr,

        SPEC = this.s( $SPEC ),
        SPEC_indirect = this.s( A1 + N );

    SPEC.read( SPEC_indirect );
};

//     INCRA is used to  increment  the  address  field  of  a
// descriptor.
//      Data Input to INCRA:
//               +-------+-------+-------+
//      DESCR    |   A                   |
//               +-----------------------+
//      Data Altered by INCRA:
//               +-------+-------+-------+
//      DESCR    |  A+N                  |
//               +-----------------------+
// Programming Notes:
// 1.  A may be a relocatable address.
// 2.  A is never negative.
// 3.  N is always positive.
// 4.  N is often 1 or D.
// 5.  See also DECRA and INCRV.
sil.INCRA = function ( $DESCR, N ) {
    // increment address
    var DESCR = this.d( $DESCR );

    assert( DESCR.addr >= 0 &&  N > 0 );
    DESCR.addr += N;
};

//     INCRV  is  used  to  increment  the  value  field  of a
// descriptor.  I is considered as  an  unsigned  (nonnegative)
// integer.
//      Data Input to INCRV:
//               +-------+-------+-------+
//      DESCR    |                   I   |
//               +-----------------------+
//      Data Altered by INCRV:
//               +-------+-------+-------+
//      DESCR    |                  I+N  |
//               +-----------------------+
// Programming Notes:
// 1.  N is always positive.
// 2.  N is often 1.
// 3.  See also INCRA.
sil.INCRV = function ( $DESCR, N ) {
    var DESCR = this.d( $DESCR );

    assert( N > 0 );
    DESCR.value += N;
};

//     INIT  is used to initialize a SNOBOL4 run.  INIT is the
// first instruction executed and is responsible for performing
// any  initialization necessary.  The operation is machine and
// system dependent.  Typically, INIT sets  program  masks  and
// the values of vertain registers.
//      In  addition  to any initialization required for a par-
// ticular system and machine, INIT also performs the following
// initialization  for  the SNOBOL4 system.  Dynamic storage is
// initialized.  The address fields of FRSGPT  and  HDSGPT  are
// set  to  point  to  the first descriptor in dynamic storage.
// The address field of TLSGP1 is set to the  first  descriptor
// past  the end of dynamic storage.  Space for dynamic storage
// may be preallocated or obtained from the operating system by
// INIT.   The  timer  is initialized for subsequent use by the
// MSTIME macro (q.v.).
// Programming Notes:
// 1.  See also ENDEX.
sil.INIT = function () {
    // initialize SNOBOL4 run
    var dynamicStorageSize = D * 5000,

        FRSGPT = this.d( 'FRSGPT' ),
        HDSGPT = this.d( 'HDSGPT' ),
        TLSGP1 = this.d( 'TLSGP1' );

    this.timeStart = new Date().getTime();
    FRSGPT.addr = this.alloc( dynamicStorageSize );
    HDSGPT.addr = FRSGPT.addr;
    TLSGP1.addr = this.alloc( dynamicStorageSize );
};

//     INSERT is used to insert  a  tree  node  above  another
// node.
//      Data Input to INSERT:
//               +-------+-------+-------+
//      DESCR1   |  A1      F1      V1   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR2   |  A2      F2      V2   |
//               +-----------------------+
//                +-------+-------+-------+
//      A1+FATHER |  A3      F3      V3   |
//                +-----------------------+
//               +-------+-------+-------+
//      A3+LSON  |  A4      F4      V4   |
//               +-----------------------+
//               +-------+-------+-------+
//      A2+CODE  |                   I   |
//               +-----------------------+
//      Data Altered by INSERT:
//                +-------+-------+-------+
//      A1+FATHER |  A2      F2      V2   |
//                +-----------------------+
//               +-------+-------+-------+
//      A4+RSIB  |  A2      F2      V2   |
//               +-----------------------+
//                +-------+-------+-------+
//      A2+FATHER |  A3      F3      V3   |
//                +-----------------------+
//               +-------+-------+-------+
//      A2+LSON  |  A1      F1      V1   |
//               +-----------------------+
//               +-------+-------+-------+
//      A2+CODE  |                  I+1  |
//               +-----------------------+
// Programming Notes:
// 1.  Since the fields of the descriptor at A1+FATHER are used
// in the data to be altered,  care  should  be  taken  not  to
// modify  this  descriptor  until  its former values have been
// used.
// 2.  INSERT is only used by compilation procedures.
// 3.  FATHER, LSON, RSIB, and CODE are symbols defined in  the
// source program.
// 4.  See also ADDSIB and ADDSON.
sil.INSERT = function ( $DESCR1, $DESCR2 ) {
    // insert node in tree
    var FATHER = this.$( 'FATHER' ),
        LSON   = this.$( 'LSON' ),
        RSIB   = this.$( 'RSIB' ),
        CODE   = this.$( 'CODE' ),

        DESCR1 = this.d( $DESCR1 ),
        A1 = DESCR1.addr,
        F1 = DESCR1.flags,
        V1 = DESCR1.value,

        DESCR2 = this.d( $DESCR2 ),
        A2 = DESCR2.addr,
        F2 = DESCR2.flags,
        V2 = DESCR2.value,

        A1_FATHER = this.d( A1 + FATHER ),
        A3 = A1_FATHER.addr,
        F3 = A1_FATHER.flags,
        V3 = A1_FATHER.value,

        A3_LSON = this.d( A3 + LSON ),
        A4 = A3_LSON.addr,
        F4 = A3_LSON.flags,
        V4 = A3_LSON.value,

        A2_CODE = this.d( A2 + CODE ),
        I = A2_CODE.value,

        A4_RSIB = this.d( A4 + RSIB );
        

    A1_FATHER.update( A2, F2, V2 );
    A4_RSIB.update( A2, F2, V2 );
    A2_FATHER.update( A3, F3, V3 );
    A2_LSON.update( A1, F1, V1 );
    A2_CODE.value = I + 1;
};

//     INTRL  is  used to convert a (signed) integer to a real
// number.  R(I) is the real number corresponding to I.
//      Data Input to INTRL:
//               +-------+-------+-------+
//      DESCR2   |   I                   |
//               +-----------------------+
//      Data Altered by INTRL:
//               +-------+-------+-------+
//      DESCR1   | R(I)      0       R   |
//               +-----------------------+
// Programming Notes:
// 1.  R is a symbol defined in the source program and  is  the
// code for the real data type.
sil.INTRL = function ( $DESCR1, $DESCR2 ) {
    // convert integer to real number
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 );

    DESCR1.raddr = DESCR2.addr;
    DESCR1.flags = 0;
    DESCR1.value = this.resolve( 'R' );
};

//     INTSPC is used to convert a (signed) integer to a spec-
// ified string.
//      Data Input to INTSPC:
//               +-------+-------+-------+
//      DESCR    |   I                   |
//               +-----------------------+
//      Data Altered by INTSPC:
//               +--------+-------+-------+-------+-------+
//      SPEC     | BUFFER     0       0       O       L   |
//               +----------------------------------------+
//               +-------+-------+-------+
//      BUFFER+O |  C1      ...     CL   |
//               +-----------------------+
// Programming Notes:
// 1.  C1...CL   should   be    a    `normalized'    string
// corresponding  to the integer I.  That is, it should contain
// no leading zeroes and should begin with a minus sign if I is
// negative.
// 2.  BUFFER  is  local  to  INTSPC  and  its  contents may be
// overwritten by a subsequent use of INTSPC.
// 3.  See also SPCINT.
sil.INTSPC = function ( $SPEC, $DESCR ) {
    // convert integer to specifier
    var SPEC = this.s( $SPEC ),
        DESCR = this.d( $DESCR ),
        I = DESCR.addr,
        I_enc = SNOBOL.str.encode( I.toString() ),
        idx;

    if ( !SPEC.addr ) {
        SPEC.addr = this.alloc( 255 );
    }

    assert( I_enc.length <= 255 );
    for ( idx = 0; idx < I_enc.length; idx++ ) {
        this.mem[ SPEC.addr + SPEC.offset + idx ] = I_enc[ idx ];
    }
    SPEC.length = I_enc.length;
};

//     ISTACK is used to initialize the system stack.
//      Data Altered by ISTACK:
//               +-------+-------+-------+
//      OSTACK   |   0                   |
//               +-----------------------+
//               +-------+-------+-------+
//      CSTACK   | STACK                 |
//               +-----------------------+
// Programming Notes:
// 1.  STACK is a program symbol whose value is the address  of
// the first descriptor of the system stack.
// 2.  See also PSTACK, RCALL, and RRTURN.
sil.ISTACK = function () {
    // initialize stack
    this.OSTACK.addr = 0;
    this.CSTACK.addr = this.$( 'STACK' );
};

//     LCOMP is used to compare the lengths of two specifiers.
// If L1 > L2, transfer is to GTLOC.  If L1 = L2,  transfer  is
// to EQLOC.  If L1 < L2, transfer is to LTLOC.
//      Data Input to LCOMP:
//               +-------+-------+-------+-------+-------+
//      SPEC1    |                                  L1   |
//               +---------------------------------------+
//               +-------+-------+-------+-------+-------+
//      SPEC2    |                                  L2   |
//               +---------------------------------------+
// Programming Notes:
// 1.  See also ACOMP, RCOMP, and LEQLC.
sil.LCOMP = function ( $SPEC1, $SPEC2, GTLOC, EQLOC, LTLOC ) {
    // length comparison
    var SPEC1 = this.s( $SPEC1 ),
        L1 = SPEC1.length,
        SPEC2 = this.s( $SPEC2 ),
        L2 = SPEC2.length;

    if ( L1 > L2 ) {
        this.jmp( GTLOC );
    } else if ( L1 === L2 ) {
        this.jmp( EQLOC );
    } else {
        this.jmp( LTLOC );
    }
};

//     LEQLC is used to compare the length of a specifier to a
// constant.  If L = N, transfer is to EQLOC.  Otherwise trans-
// fer is to NELOC.
//      Data Input to LEQLC:
//               +-------+-------+-------+-------+-------+
//      SPEC     |                                   L   |
//               +---------------------------------------+
// Programming Notes:
// 1.  L and N are never negative.
// 2.  See also LCOMP, AEQLC, and AEQLIC.
sil.LEQLC = function ( $SPEC, N, NELOC, EQLOC ) {
    // length equal to constant test
    var SPEC = this.s( $SPEC ), L = SPEC.length;

    assert( L >= 0 && N >= 0 );
    if ( L === N ) {
        this.jmp( EQLOC );
    } else {
        this.jmp( NELOC );
    }
};

//     LEXCMP is used to compare two strings lexicographically
// (i.e.   according  to  their  alphabetical  ordering).    If
// C11...C1N1 < C21...C2M, transfer is to GTLOC.  If C11...C1N1
// =  C21...C2M,  transfer  is  to  EQLOC.   If  C11...C1N1   >
// C21...C2M, transfer is to LTLOC.
//      Data Input to LEXCMP:
//               +-------+-------+-------+-------+-------+
//      SPEC1    |  A1                      O1       N   |
//               +---------------------------------------+
//               +-------+-------+-------+-------+-------+
//      SPEC2    |  A2                      O2       M   |
//               +---------------------------------------+
//               +-------+-------+-------+
//      A1+O1    |  C11     ...     C1N  |
//               +-----------------------+
//               +-------+-------+-------+
//      A2+O2    |  C21     ...     C2M  |
//               +-----------------------+
// Programming Notes:
// 1.  The lexicographical ordering is machine dependent and is
// determined  by  the  numerical   order   of   the   internal
// representation of the characters for a particular machine.
// 2.  A  string that is an initial substring of another string
// is lexicographically less than that string.  That is ABC  is
// less than ABCA.
// 3.  The  null (zero-length) string is lexicographically less
// than any other string.
// 4.  Two strings are equal if and only if  they  are  of  the
// same length and are identical character by character.
// 5.  By  far  the most frequent use of LEXCMP is to determine
// whether two strings are the same  or  different.   In  these
// cases GTLOC and LTLOC will specify the same location or both
// be omitted.  Because of the frequency of  such  use,  it  is
// desirable  to  handle  this case specially, since a test for
// equality usually can be performed more efficiently than  the
// general test.
sil.LEXCMP = function ( $SPEC1, $SPEC2, GTLOC, EQLOC, LTLOC ) {
    // lexical comparison of strings
    var SPEC1 = this.s( $SPEC1 ),
        SPEC2 = this.s( $SPEC2 );

    if ( SPEC1.specified === SPEC2.specified ) {
        this.jmp( EQLOC );
    } else if ( GTLOC === LTLOC || SPEC1.specified > SPEC2.specified ) {
        this.jmp( GTLOC );
    } else {
        this.jmp( LTLOC );
    }
};

//     LHERE  is  used  to establish the equivalence of LOC as
// the location of the next program instruction.
//      Programming Notes:
// 1.  LHERE is equivalent to the familiar EQU *.  Similarly
//      LOC  LHERE
//           OP
// is equivalent to
//      LOC  OP
sil.LHERE = function () {
    return this.instructionPointer + 1;
    // define location here
};

//     LINK is used to link to an external function.  A2 is  a
// pointer  to  an  argument  list of N descriptors.  A4 is the
// address of the external function to be called.   V1  is  the
// date  type  expected  for the resulting value.  The returned
// value is placed in DESCR1.  If the external function signals
// failure,  transfer  is  to  FLOC.   Otherwise transfer is to
// SLOC.
//      Data Input to LINK:
//               +-------+-------+-------+
//      DESCR1   |                  V1   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR2   |  A2                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR3   |   N                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR4   |  A4                   |
//               +-----------------------+
//      Data Altered by LINK:
//               +-------+-------+-------+
//      DESCR1   |   A       F       V   |
//               +-----------------------+
// Programming Notes:
// 1.  LINK is a system-dependent operation.
// 2.  LINK need not be implemented if LOAD is  not.   In  this
// case, LINK should branch to INTR10.
// 3.  See also LOAD and UNLOAD.
sil.LINK = function ( $DESCR1, $DESCR2, $DESCR3, $DESCR4, FLOC, SLOC ) {
    // link to external function
    this.jmp( 'INTR10' );  // Program error
};

//     LINKOR  links  through `or' (alternative) fields of
// pattern nodes until the end, indicated by a zero  field,  is
// reached.  This zero field is replaced by I.
//      Data Input to LINKOR:
//               +-------+-------+-------+
//      DESCR1   |   A                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR2   |   I                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A+2D     |  I1                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A+2D+I1  |  I2                   |
//               +-----------------------+
//                          .
//                          .
//                          .
//               +-------+-------+-------+
//      A+2D+IN  |   0                   |
//               +-----------------------+
//      Data Altered by LINKOR:
//               +-------+-------+-------+
//      A+2D+IN  |   I                   |
//               +-----------------------+
sil.LINKOR = function ( $DESCR1, $DESCR2 ) {
    // link ```or''' fields of pattern nodes
    var DESCR1 = this.d( $DESCR1 ),
        A = DESCR1.addr,
        DESCR2 = this.d( $DESCR2 ),
        I = DESCR2.addr,
        DESCR = this.d( A + ( 2 * D ) );

    while ( DESCR.addr !== 0 ) {
        DESCR = this.d( A + ( 2 * D ) + DESCR.addr );
    }

    DESCR.addr = I;
};

//     LOAD  is used to load an external function.  C11...C1L1
// is the name of the external function to  be  loaded  from  a
// library.   C21...C2L2 is the name of the library.  A3 is the
// address of the entry point.  If  the  external  function  is
// loaded, transfer is to SLOC.  Otherwise transfer is to FLOC.
//      Data Input to LOAD:
//               +-------+-------+-------+-------+-------+
//      SPEC1    |  A1                      O1      L1   |
//               +---------------------------------------+
//               +-------+-------+-------+-------+-------+
//      SPEC2    |  A2                      O2      L2   |
//               +---------------------------------------+
//               +-------+-------+-------+
//      A1+O1    |  C11     ...    C1L1  |
//               +-----------------------+
//               +-------+-------+-------+
//      A2+O2    |  C21     ...    C2L2  |
//               +-----------------------+
//      Data Altered by LOAD:
//               +-------+-------+-------+
//      DESCR    |  A3                   |
//               +-----------------------+
// Programming Notes:
// 1.  LOAD is a system-dependent operation.
// 2.  LOAD need not be implemented as such.  If it is not, the
// built-in  function  LOAD will not be available, and an error
// comment should be generated by branching to UNDF.
// 3.  On the IBM System/360, LOAD uses the OS  macro  LOAD  to
// bring  an external function from the library whose DDNAME is
// specified by C21...C2L2.
// 4.  See also LINK and UNLOAD.
sil.LOAD = function ( $DESCR, $SPEC1, $SPEC2, FLOC, SLOC ) {
    // load external function
    this.jmp( 'UNDF' );  // Not implemented
};

//     LOCAPT is used to locate the `type' descriptor of a
// descriptor  pair  on  an  attribute list.  Descriptors on an
// attribute list are in `type-value' pairs.   Odd-numbered
// descriptors  are  `type' descriptors.  The list starting
// at A+D is searched, comparing descriptors at A+D, A+3D,  ...
// for  the  first descriptor whose value is equal to the value
// of DESCR3.  If a descriptor equal to DESCR3  is  not  found,
// transfer is to FLOC.  Otherwise transfer is to SLOC.
//      Data Input to LOCAPT:
//               +-------+-------+-------+
//      DESCR2   |   A       F       V   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR3   |  A3      F3      V3   |
//               +-----------------------+
//               +-------+-------+-------+
//      A        |                 2K*D  |
//               +-----------------------+
//               +-------+-------+-------+
//      A+D      |  A11     F11     V11  |
//               +-----------------------+
//                          .
//                          .
//                          .
//               +-------+-------+-------+
//      A+D+2I*D |  A3      F3      V3   |
//               +-----------------------+
//                          .
//                          .
//                          .
//               +-------+-------+-------+
//      A+2K*D   |                       |
//               +-----------------------+
//      Data Altered by LOCAPT:
//               +--------+-------+-------+
//      DESCR1   | A+2I*D     F       V   |
//               +------------------------+
// Programming Notes:
// 1.  Note that the address of DESCR1 is set to one descriptor
// less then the descriptor that is located.
// 2.  See also LOCAPV.
sil.LOCAPT = function ( $DESCR1, $DESCR2, $DESCR3, FLOC, SLOC ) {
    // locate attribute pair by type
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        DESCR3 = this.d( $DESCR3 ),
        start = DESCR2.addr + 3;

    for ( var ptr = start; ptr < this.mem.length; ptr += 6 ) {
        if ( this.d( ptr ).value === DESCR3.value ) {
            DESCR1.addr = ptr - 3;
            DESCR1.flags = DESCR2.flags;
            DESCR1.value = DESCR2.value;
            return this.jmp( SLOC );
        }
    }
    this.jmp( FLOC );
};

//     LOCAPV is used to locate the `value' descriptor  of
// a  descriptor  pair on an attribute list.  Descriptors on an
// attribute list are in `type-value' pairs.  Even-numbered
// descriptors  are `value' descriptors.  The list starting
// at A+D is searched, comparing descriptors at A+2D, A+4D, ...
// for  the  first descriptor whose value is equal to the value
// of DESCR3.  If a descriptor equal to DESCR3  is  not  found,
// transfer is to FLOC.  Otherwise transfer is to SLOC.
//      Data Input to LOCAPV:
//               +-------+-------+-------+
//      DESCR2   |   A       F       V   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR3   |  A3      F3      V3   |
//               +-----------------------+
//               +-------+-------+-------+
//      A        |                 2K*D  |
//               +-----------------------+
//               +-------+-------+-------+
//      A+2D     |  A12     F12     V12  |
//               +-----------------------+
//                          .
//                          .
//                          .
//                +-------+-------+-------+
//      A+2D+2I*D |  A3      F3      V3   |
//                +-----------------------+
//                          .
//                          .
//                          .
//               +-------+-------+-------+
//      A+2K*D   |                       |
//               +-----------------------+
//      Data Altered by LOCAPV:
//               +--------+-------+-------+
//      DESCR1   | A+2I*D     F       V   |
//               +------------------------+
// Programming Notes:
// 1.  Note   that   the  address  of  DESCR1  is  set  to  two
// descriptors less than the descriptor that is located.
// 2.  See also LOCAPT.
sil.LOCAPV = function ( $DESCR1, $DESCR2, $DESCR3, FLOC, SLOC ) {
    // locate attribute pair by value
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        DESCR3 = this.d( $DESCR3 ),
        A = DESCR2.addr,
        stop = this.d( A ).value,
        ptr;

    for ( var i = 0; ; i++ ) {
        ptr = A + 6 + ( 6 * i );

        if ( this.d( ptr ).isEqualTo( DESCR3 ) ) {
            DESCR1.update( ptr - 6, DESCR2.flags, DESCR2.values );
            return this.jmp( SLOC );
        }

        if ( ptr === stop ) {
            break;
        }
    }

    this.jmp( FLOC );
};

//     LOCSP is used to obtain a specifier to a  string  given
// in  a string structure.  CPD is the number of characters per
// descriptor.
//      Data Input to LOCSP:
//               +-------+-------+-------+
//      DESCR    |   A       F       V   |
//               +-----------------------+
//               +-------+-------+-------+
//      A        |                   I   |
//               +-----------------------+
//      Data Altered by LOCSP if A != O:
//               +-------+-------+-------+-------+-------+
//      SPEC     |   A       F       V     4*CPD     I   |
//               +---------------------------------------+
//      Data Altered by LOCSP if A = O:
//               +-------+-------+-------+-------+-------+
//      SPEC     |                                   0   |
//               +---------------------------------------+
// Programming Notes:
// 1.  If A = O, the value of DESCR represents the null  (zero-
// length)   string  and  is  handled  as  a  special  case  as
// indicated.  The other fields of SPEC are unchanged  in  this
// case.
sil.LOCSP = function ( $SPEC, $DESCR ) {
    // locate specifier to string
    var DESCR = this.d( $DESCR ),
        A = DESCR.addr,
        I = this.d( A ).value,
        SPEC = this.s( $SPEC );


    if ( A !== 0 ) {
        SPEC.addr   = DESCR.addr;
        SPEC.flags  = DESCR.flags;
        SPEC.value  = DESCR.value;
        SPEC.offset = 4 * CPD;
        SPEC.length = I;
    } else {
        SPEC.length = 0;
    }
};

//     LVALUE is used to get the least value of address fields
// in a chain of pattern nodes.  The address field of DESCR1 is
// set to I where
//      I = min(I0,...,IK)
//      Data Input to LVALUE:
//               +-------+-------+-------+
//      DESCR2   |   A                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A+2D     |  N1                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A+3D     |  I0                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A+N1+2D  |  N2                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A+N1+3D  |  I1                   |
//               +-----------------------+
//                          .
//                          .
//                          .
//               +-------+-------+-------+
//      A+NK+2D  |   0                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A+NK+3D  |  IK                   |
//               +-----------------------+
//      Data Altered by LVALUE:
//               +-------+-------+-------+
//      DESCR1   |   I       0       0   |
//               +-----------------------+
// Programming Notes:
// 1.  I0,...,IK are all nonnegative.
// 2.  A is never zero, but N1 may be.
sil.LVALUE = function ( $DESCR1, $DESCR2 ) {
    // get least length value
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        start = DESCR2.addr,
        offset = 0,
        least = Infinity,
        node1, node2;

    do {
        node1 = this.d( start + offset + 6 );
        node2 = node1.next();
        offset = node1.addr;
        if ( node2.addr < least ) {
            least = node2.addr;
        }
    } while ( offset !== 0 );

    DESCR1.update( least, 0, 0 );
};

//     MAKNOD  is  used  to make a node for a pattern.  DESCR6
// may be omitted.  If it is, one less descriptor is  modified,
// but the two forms are otherwise the same.
//      Data Input to MAKNOD:
//               +-------+-------+-------+
//      DESCR2   |  A2      F2      V2   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR3   |  A3                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR4   |  A4                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR5   |  A5      F5      V5   |
//               +-----------------------+
//      Additional Data Input if DESCR6 is Given:
//               +-------+-------+-------+
//      DESCR6   |  A6      F6      V6   |
//               +-----------------------+
//      Data Altered by MAKNOD:
//               +-------+-------+-------+
//      DESCR1   |  A2      F2      V2   |
//               +-----------------------+
//               +-------+-------+-------+
//      A2+D     |  A5      F5      V5   |
//               +-----------------------+
//               +-------+-------+-------+
//      A2+2D    |  A4                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A2+3D    |  A3                   |
//               +-----------------------+
//      Additional Data Altered if DESCR6 is Given:
//               +-------+-------+-------+
//      A2+4D    |  A6      F6      V6   |
//               +-----------------------+
// Programming Notes:
// 1.  As  indicated, there are two forms of MAKNOD.  If DESCR6
// is  given,  an  additional  descriptor  if   modified,   but
// otherwise the two forms are the same.
// 2.  DESCR1  must  be  changed  last, since DESCR6 may be the
// same descriptor as DESCR1.
// 3.  MAKNOD is used only for constructing patterns.
sil.MAKNOD = function ( $DESCR1, $DESCR2, $DESCR3, $DESCR4, $DESCR5, $DESCR6 ) {
    // make pattern node
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        DESCR3 = this.d( $DESCR3 ),
        DESCR4 = this.d( $DESCR4 ),
        DESCR5 = this.d( $DESCR5 ),
        DESCR6 = this.d( $DESCR6 );

    this.d( DESCR2.addr + 3 ).read( DESCR5 );
    this.d( DESCR2.addr + 6 ).addr = DESCR4.addr;
    this.d( DESCR2.addr + 9 ).addr = DESCR3.addr;
    if ( DESCR6 !== undefined ) {
        this.d( DESCR2.addr + 12 ).read( DESCR6 );
    }
    DESCR1.read( DESCR2 );
};

//     MNREAL is used to change the sign of a real number.
//      Data Input to MNREAL:
//               +-------+-------+-------+
//      DESCR2   |   R       F       V   |
//               +-----------------------+
//      Data Altered by MNREAL:
//               +-------+-------+-------+
//      DESCR1   |  -R       F       V   |
//               +-----------------------+
// Programming Notes:
// 1.  R may be negative.
// 2.  See also MNSINT, ADREAL,  DVREAL,  EXREAL,  MPREAL,  and
// SBREAL.
sil.MNREAL = function ( $DESCR1, $DESCR2 ) {
    // minus real number
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 );

    DESCR1.read( DESCR2 );
    DESCR1.raddr *= -1;
};

//     MNSINT is used to change the sign of an integer.  If -I
// exceeds the maximum integer, transfer is to FLOC.  Otherwise
// transfer is to SLOC.
//      Data Input to MNSINT:
//               +-------+-------+-------+
//      DESCR2   |   I       F       V   |
//               +-----------------------+
//      Data Altered by MNSINT:
//               +-------+-------+-------+
//      DESCR1   |  -I       F       V   |
//               +-----------------------+
// Programming Notes:
// 1.  I may be negative.
// 2.  See also MNREAL.
sil.MNSINT = function ( $DESCR1, $DESCR2, FLOC, SLOC ) {
    // minus integer
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 );

    DESCR1.read( DESCR2 );
    try {
        DESCR1.addr *= -1;
        this.jmp( SLOC );
    } catch ( e ) {
        if ( e instanceof RangeError ) {
            this.jmp( FLOC );
        }
    }
};

//     MOVA is used to move an address field from one descrip-
// tor to another.
//      Data Input to MOVA:
//               +-------+-------+-------+
//      DESCR2   |   A                   |
//               +-----------------------+
//      Data Altered by MOVA:
//               +-------+-------+-------+
//      DESCR1   |   A                   |
//               +-----------------------+
// Programming Notes:
// 1.  See also MOVD and MOVV.
sil.MOVA = function ( $DESCR1, $DESCR2 ) {
    // move address
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 );

    DESCR2.addr = DESCR1.addr;
};

//     MOVBLK is used to move (copy) a block of descriptors.
//      Data Input to MOVBLK:
//               +-------+-------+-------+
//      DESCR1   |  A1                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR2   |  A2                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR3   |  D*N                  |
//               +-----------------------+
//               +-------+-------+-------+
//      A2+D     |  A21     F21     V21  |
//               +-----------------------+
//                          .
//                          .
//                          .
//               +-------+-------+-------+
//      A2+(D*N) | A2N      F2N     V2N  |
//               +-----------------------+
//      Data Altered by MOVBLK:
//
//               +-------+-------+-------+
//      A1+D     | A21      F21     V21  |
//               +-----------------------+
//                          .
//                          .
//                          .
//               +-------+-------+-------+
//      A1+(D*N) | A2N      F2N     V2N  |
//               +-----------------------+
// Programming Notes:
// 1.  Note that the descriptor A1 is not altered.
// 2.  The area into which the move is made may overlap the area
// from which the move is made. This only occurs when A1 is less
// than A2. Care must be taken to handle this case correctly.
sil.MOVBLK = function ( $DESCR1, $DESCR2, $DESCR3 ) {
    // move block of descriptors
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        DESCR3 = this.d( $DESCR3 ),
        block = this.mem.slice( DESCR2.addr + 3, DESCR2.addr + DESCR3.addr + 3 );

    block.unshift( DESCR1.addr + 3, block.length );
    Array.prototype.splice.apply( this.mem, block );
};

//     MOVD is used to move (copy) a descriptor from one loca-
// tion to another.
//      Data Input to MOVD:
//               +-------+-------+-------+
//      DESCR2   |   A       F       V   |
//               +-----------------------+
//      Data Altered by MOVD:
//               +-------+-------+-------+
//      DESCR1   |   A       F       V   |
//               +-----------------------+
// Programming Notes:
// 1.  See also MOVA and MOVV.
sil.MOVD = function ( $DESCR1, $DESCR2 ) {
    // move descriptor
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 );

    DESCR1.read( DESCR2 );
};

//     MOVDIC  is used to move a descriptor that is indirectly
// specified with an offset constant.
//      Data Input to MOVDIC:
//               +-------+-------+-------+
//      DESCR1   |  A1                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR2   |  A2                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A2+N2    |   A       F       V   |
//               +-----------------------+
//      Data Altered by MOVDIC:
//               +-------+-------+-------+
//      A1+N1    |   A       F       V   |
//               +-----------------------+
// Programming Notes:
// 1.  See also MOVD, GETDC, and PUTDC.
sil.MOVDIC = function ( $DESCR1, N1, $DESCR2, N2 ) {
    // move descriptor indirect with constant offset
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 );

    this.d( DESCR1.addr + N1 ).read( this.d( DESCR2.addr + N2 ) );
};

//     MOVV is used to move a value field from one  descriptor
// to another.
//      Data Input to MOVV:
//               +-------+-------+-------+
//      DESCR2   |                   V   |
//               +-----------------------+
//      Data Altered by MOVV:
//               +-------+-------+-------+
//      DESCR1   |                   V   |
//               +-----------------------+
// Programming Notes:
// 1.  See also MOVA and MOVD.
sil.MOVV = function ( $DESCR1, $DESCR2 ) {
    // move value field
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 );

    DESCR1.value = DESCR2.value;
};

//     MPREAL  is  used  to multiply two real numbers.  If the
// result is out of  the  range  available  for  real  numbers,
// transfer is to FLOC.  Otherwise transfer is to SLOC.
//      Data Input to MPREAL:
//               +-------+-------+-------+
//      DESCR2   |  R2      F2      V2   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR3   |  R3                   |
//               +-----------------------+
//      Data Altered by MPREAL:
//               +-------+-------+-------+
//      DESCR1   | R2*R3    F2      V2   |
//               +-----------------------+
// Programming Notes:
// 1.  See also ADREAL, DVREAL, EXREAL, MNREAL, and SBREAL.
sil.MPREAL = function ( $DESCR1, $DESCR2, $DESCR3, FLOC, SLOC ) {
    // multiply real numbers
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        DESCR3 = this.d( $DESCR3 );

    try {
        DESCR1.raddr = DESCR2.raddr * DESCR3.raddr;
        this.jmp( SLOC );
    } catch ( e ) {
        if ( e instanceof RangeError ) {
            this.jmp( FLOC );
        }
    }
};

//     MSTIME is used to get the millisecond time.
//      Data Altered by MSTIME:
//               +-------+-------+-------+
//      DESCR    | TIME      0       0   |
//               +-----------------------+
// Programming Notes:
// 1.  The origin with respect to which the time is obtained is
// not  important.   The  SNOBOL4  system   deals   only   with
// differences in times.
// 2.  The  time  units should be milliseconds, but accuracy is
// not critical.
// 3.  MSTIME is used in  program  tracing,  the  SNOBOL4  TIME
// function,  and  in  statistics printed upon termination of a
// SNOBOL4 run.
// 4.  It  is  not  critically   important   that   MSTIME   be
// implemented  as  such.   If  it is not, the address field of
// DESCR should be set to zero also.
// 5.  See also INIT.
sil.MSTIME = function ( $DESCR ) {
    // get millisecond time
    var DESCR = this.d( $DESCR ),
        timeCurrent = new Date();

    DESCR.addr = this.timeStart ? timeCurrent - this.timeStart : 0;
    DESCR.flags = 0;
    DESCR.value = 0;
};

//     MULT is used to multiply two integers.  In the event of
// overflow,  transfer  is  to FLOC.  Otherwise, transfer is to
// SLOC.
//      Data Input to MULT:
//               +-------+-------+-------+
//      DESCR2   |  I2      F2      V2   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR3   |  I3                   |
//               +-----------------------+
//      Data Altered by MULT:
//               +-------+-------+-------+
//      DESCR1   | I2*I3    F2      V2   |
//               +-----------------------+
// Programming Notes:
// 1.  The test for success and failure is  used  in  only  two
// calls  of  this  macro.  Hence the code to make the check is
// not needed in most cases.
// 2.  DESCR1 and DESCR2 are often the same.
// 3.  See also MULTC and DIVIDE.
sil.MULT = function ( $DESCR1, $DESCR2, $DESCR3, FLOC, SLOC ) {
    // multiply integers
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        DESCR3 = this.d( $DESCR3 );

    try {
        DESCR1.addr = DESCR2.addr * DESCR3.addr;
        DESCR1.flags = DESCR2.flags;
        DESCR1.value = DESCR2.value;
        this.jmp( SLOC );
    } catch ( e ) {
        if ( e instanceof RangeError ) {
            this.jmp( FLOC );
        }
    }
};

//     MULTC is used to multiply an integer by a constant.
//      Data Input to MULTC:
//               +-------+-------+-------+
//      DESCR2   |   I                   |
//               +-----------------------+
//      Data Altered by MULTC:
//               +-------+-------+-------+
//      DESCR1   |  I*N      0       0   |
//               +-----------------------+
// Programming Notes:
// 1.  I*N never exceeds the range available for integers.
// 2.  DESCR1 and DESCR2 are often the same.
// 3.  N is often D, which typically may be  implemented  by  a
// shift,  or simply by no operation if D is 1 for a particular
// machine.
// 4.  See also MULT.
sil.MULTC = function ( $DESCR1, $DESCR2, N ) {
    // multiply address by constant
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 );

    DESCR1.addr = DESCR2.addr * N;
};

//     ORDVST is used to  alphabetically  order  variables  in
// SNOBOL4  dynamic storage.  Variables are organized in a num-
// ber of bins, each bin containing a linked list of  variables
// as  shown below.  OBEND = OBSTRT+(OBSIZ-1)*D, where OBSIZ is
// the number of bins and is defined in the source program.
//      Bins of Variables:
//               +-------+-------+-------+
//      OBSTRT   |  A1                   |
//               +-----------------------+
//               +-------+-------+-------+
//      OBSTRT+D |  A2                   |
//               +-----------------------+
//                          .
//                          .
//                          .
//               +-------+-------+-------+
//      OBEND    |  AN                   |
//               +-----------------------+
// The addresses A1, A2, ..., AN point to the first variable in
// each bin.  A zero value for any of these addresses indicates
// there are no variables in that bin.  Within each bin,  vari-
// ables are linked together.
//      Relevant Parts of a Variable:
//               +-------+-------+-------+
//      A        |                   L   |
//               +-----------------------+
//               +-------+-------+-------+
//      A+3*D    |  A1                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A+4+D    |  C1      ...     ...  |
//               +-----------------------+
//                          .
//                          .
//                          .
//      L  is  the  length  of  the  string.  The string itself
// begins at A+4*D and occupies as many descriptor locations as
// are  necessary.   A1  is  a link to the next variable in the
// bin.  A zero value of A1 indicates the end of the chain  for
// that bin.
// Programming Notes:
// 1.  ORDVST   is  used  only  in  ordering  variables  for  a
// programmer-requested post-mortem dump of  variable  storage.
// ORDVST  need  not  be  implemented  as  such, but may simply
// perform no operation.  In this case,  the  post-mortem  dump
// will not be alphabetized, but will be otherwise correct.
// 2.  If  ORDVST  is  implemented,  it  is  easiest to put all
// variables in one long chain starting at OBSTRT.  The address
// fields  of  the  descriptors OBSTRT+D,...,OBSTRT+(OBSIZ-1)*D
// should then be set to zero.
// 3.  Since dynamic storage may contain many  variables,  some
// care  must  be taken to assure that the sorting procedure is
// not excessively slow.  Variables whose values are  the  null
// string  (zero  address  field and value field containing the
// program symbol S) should be omitted from the sort.
// 4.  Since any character may appear in a string, the value of
// I  must  be  used to determine the length of the string in a
// variable -- characters following  the  string  in  the  last
// descriptor are undefined.
sil.ORDVST = function () {
    // order variable storage
    return undefined;
};

//     OUTPUT  is  used to output a list of items according to
// FORMAT.  The output is put on the file associated with  unit
// reference number I.  The format C1...CL may specify literals
// and the conversion of integers and real numbers given in the
// address fields A1,...,AN.
//      Data Input to OUTPUT:
//               +-------+-------+-------+
//      DESCR    |   I                   |
//               +-----------------------+
//               +-------+-------+-------+
//      FORMAT   |  C1      ...     CL   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR1   |  A1                   |
//               +-----------------------+
//                          .
//                          .
//                          .
//               +-------+-------+-------+
//      DESCRN   |  AN                   |
//               +-----------------------+
// Programming Notes:
// 1.  See also STPRNT.
sil.OUTPUT = function ( $DESCR, FORMAT, ARGs ) {
    // output record
    var DESCR = this.d( $DESCR ),
        fmt = this.s( FORMAT ).specified;

    if ( !Array.isArray( ARGs ) ) {
        ARGs = [ ARGs ];
    }

    ARGs = ( Array.isArray( ARGs ) ? ARGs : [ ARGs ] ).map( this.d, this );
    console.log( SNOBOL.str.format( fmt, ARGs ) );
};

//     PLUGTB  is used to set selected indicator fields in the
// entries of a syntax table to a constant.  KEY may be one  of
// four values:
//      CONTIN
//      ERROR
//      STOP
//      STOPSH
// The  indicator  fields of entries corresponding to C1,...,CL
// are set to T where T is the indicator  that  corresponds  to
// the value of KEY.
//      Data Input to PLUGTB:
//               +-------+-------+-------+-------+-------+
//      SPEC     |   A                       O       L   |
//               +---------------------------------------+
//               +-------+-------+-------+
//      A+O      |  C1      ...     CL   |
//               +-----------------------+
//      Data Altered by PLUGTB for ERROR, STOP, or STOPSH:
//                 +-------+-------+-------+
//      TABLE+E*C1 |           T           |
//                 +-----------------------+
//                          .
//                          .
//                          .
//                 +-------+-------+-------+
//      TABLE+E*CL |           T           |
//                 +-----------------------+
//      Data Altered by PLUGTB for CONTIN:
//                 +-------+-------+-------+
//      TABLE+E*C1 | TABLE     0           |
//                 +-----------------------+
//                          .
//                          .
//                          .
//                 +-------+-------+-------+
//      TABLE+E*CL | TABLE     0           |
//                 +-----------------------+
// Programming Notes:
// 1.  See Section 4.2.
// 2.  See also CLERTB.
sil.PLUGTB = function ( TABLE, KEY, $SPEC ) {
    // plug syntax table
    var SPEC = this.s( $SPEC );
    for ( var i = 0; i < Math.min( SPEC.length, TABLE.length ); i++ ) {
        TABLE[i][2] = KEY;
    }
};

//     POP is used to pop a list of descriptors off the system
// stack.
//      Data Input to POP:
//               +-------+-------+-------+
//      CSTACK   |   A                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A        |  A1      F1      V1   |
//               +-----------------------+
//                          .
//                          .
//                          .
//                +-------+-------+-------+
//      A-D*(N-1) |  AN      FN      VN   |
//                +-----------------------+
//      Data Altered by POP:
//               +---------+-------+-------+
//      CSTACK   | A-(N*D)                 |
//               +-------------------------+
//               +-------+-------+-------+
//      DESCR1   |  A1      F1      V1   |
//               +-----------------------+
//                          .
//                          .
//                          .
//               +-------+-------+-------+
//      DESCRN   |  AN      FN      VN   |
//               +-----------------------+
// Programming Notes:
// 1.  If  A-(N*D)  <  STACK,  stack  underflow  occurs.   This
// condition    indicates    a   programming   error   in   the
// implementation  of  the  macro  language.   An   appropriate
// diagnostic  message  indicating  an error may be obtained by
// transferring to the program location INTR10 if the condition
// is detected.
sil.POP = stackPopper( 'd' );

//     PROC is used to identify a procedure entry point.  LOC2
// may be omitted, in which case LOC1 is the primary  procedure
// entry  point.   If  LOC2 is given, LOC1 is a secondary entry
// point in the procedure with primary entry point LOC2.
//      Programming Notes:
// 1.  Procedure entry points are referred to by RCALL, BRANIC,
// and BRANCH (in its two-argument form).
// 2.  In  most implementations, PROC has no functional use and
// may be implemented as  LHERE.   For  machines  that  have  a
// severely  limited  program  basing  range  (such  as the IBM
// System/360), PROC may be used  to  perform  required  basing
// operations.
sil.PROC = sil.LHERE;

//     PSTACK is used to post the current stack position.
//      Data Input to PSTACK:
//               +-------+-------+-------+
//      CSTACK   |   A                   |
//               +-----------------------+
//      Data Altered by PSTACK:
//               +-------+-------+-------+
//      DESCR    |  A-D      0       0   |
//               +-----------------------+
// Programming Notes:
// 1.  See also ISTACK.
sil.PSTACK = function ( $DESCR ) {
    // post stack position
    var DESCR = this.d( $DESCR ),
        CSTACK = this.CSTACK,
        A = CSTACK.addr;

    DESCR.addr  = A - D;
    DESCR.flags = 0;
    DESCR.value = 0;
};

//     PUSH  is  used  to  push a list of descriptors onto the
// system stack.
//      Data Input to PUSH:
//               +-------+-------+-------+
//      CSTACK   |   A                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR1   |  A1      F1      V1   |
//               +-----------------------+
//                          .
//                          .
//                          .
//               +-------+-------+-------+
//      DESCRN   |  AN      FN      VN   |
//               +-----------------------+
//      Data Altered by PUSH:
//               +---------+-------+-------+
//      CSTACK   | A+( D*N)                |
//               +-------------------------+
//               +-------+-------+-------+
//      A+D      |  A1      F1      V1   |
//               +-----------------------+
//                          .
//                          .
//                          .
//               +-------+-------+-------+
//      A+( D*N)  |  AN      FN      VN   |
//               +-----------------------+
// Programming Notes:
// 1.  If  A+( D*N)  >  STACK+STSIZE,  stack  overflow   occurs.
// Transfer  should be made to the program location OVER, which
// will result in an appropriate error termination.
// 2.  See also SPUSH, POP, and SPOP.
sil.PUSH = stackPusher( 'd' );

//     PUTAC is used to put an address field into a descriptor
// located at a constant offset.
//      Data Input to PUTAC:
//               +-------+-------+-------+
//      DESCR1   |  A1                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR2   |  A2                   |
//               +-----------------------+
//      Data Altered by PUTAC:
//               +-------+-------+-------+
//      A1+N     |  A2                   |
//               +-----------------------+
// Programming Notes:
// 1.  See also GETAC, PUTVC, PUTD, and PUTDC.
sil.PUTAC = function ( $DESCR1, N, $DESCR2 ) {
    // put address with offset constant
    var DESCR1 = this.d( $DESCR1 ),
        A1 = DESCR1.addr,
        DESCR2 = this.d( $DESCR2 ),
        A2 = DESCR2.addr;

    this.d( A1 + N ).addr = A2;
};

//     PUTD is used to put a descriptor.
//      Data Input to PUTD:
//               +-------+-------+-------+
//      DESCR1   |  A1                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR2   |  A2                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR3   |   A       F       V   |
//               +-----------------------+
//      Data Altered by PUTD:
//               +-------+-------+-------+
//      A1+A2    |   A       F       V   |
//               +-----------------------+
// Programming Notes:
// 1.  See also PUTDC, PUTAC, PUTVC, and GETD.
sil.PUTD = function ( $DESCR1, $DESCR2, $DESCR3 ) {
    // put descriptor
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        DESCR3 = this.d( $DESCR3 );

    this.d( DESCR1.addr + DESCR2.addr ).read( DESCR3 );
};

//     PUTDC  is used to put a descriptor at a location with a
// constant offset.
//      Data Input to PUTDC:
//               +-------+-------+-------+
//      DESCR1   |  A1                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR2   |   A       F       V   |
//               +-----------------------+
//      Data Altered by PUTDC:
//               +-------+-------+-------+
//      A1+N     |   A       F       V   |
//               +-----------------------+
// Programming Notes:
// 1.  See also PUTD, PUTAC, PUTVC, and GETD.
sil.PUTDC = function ( $DESCR1, N, $DESCR2 ) {
    // put descriptor with constant offset
    var DESCR1 = this.d( $DESCR1 ),
        A1 = DESCR1.addr,
        DESCR2 = this.d( $DESCR2 );

    this.d( A1 + N ).read( DESCR2 );
};

//     PUTLG is used to put a length into a specifier.
//      Data Input to PUTLG:
//               +-------+-------+-------+
//      DESCR    |   I                   |
//               +-----------------------+
//      Data Altered by PUTLG:
//               +-------+-------+-------+-------+-------+
//      SPEC     |                                   I   |
//               +---------------------------------------+
// Programming Notes:
// 1.  I is always nonnegative.
// 2.  See also GETLG.
sil.PUTLG = function ( $SPEC, $DESCR ) {
    // put specifier length
    var SPEC = this.s( $SPEC ),
        DESCR = this.d( $DESCR ),
        I = DESCR.addr;

    assert( I >= 0 );
    SPEC.length = I;
};

//     PUTSPC is used to put a specifier.
//      Data Input to PUTSPC:
//               +-------+-------+-------+
//      DESCR    |  A1                   |
//               +-----------------------+
//               +-------+-------+-------+-------+-------+
//      SPEC     |   A       F       V       O       L   |
//               +---------------------------------------+
//      Data Altered by PUTSPC:
//               +-------+-------+-------+-------+-------+
//      A1+N     |   A       F       V       O       L   |
//               +---------------------------------------+
// Programming Notes:
// 1.  See also SPEC.
sil.PUTSPC = function ( $DESCR, N, $SPEC ) {
    // put specifier with offset constant
    var DESCR = this.d( $DESCR ),
        A1 = DESCR.addr,
        SPEC = this.s( $SPEC ),
        SPEC_indirect = this.s( A1 + N );

    SPEC_indirect.read( SPEC );
};

//     PUTVC is used to put a value field into a descriptor at
// a location with a constant offset.
//      Data Input to PUTVC:
//               +-------+-------+-------+
//      DESCR1   |   A                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR2   |                   V   |
//               +-----------------------+
//      Data Altered by PUTVC:
//               +-------+-------+-------+
//      A+N      |                   V   |
//               +-----------------------+
// Programming Notes:
// 1.  See also PUTAC, PUTDC, and PUTD.
sil.PUTVC = function ( $DESCR1, N, $DESCR2 ) {
    // put value field with offset constant
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 );

    this.d( DESCR1.addr + N ).value = DESCR2.value;
};

//     RCALL  is  used  to perform a recursive call.  DESCR is
// the descriptor that receives the value upon return from  the
// call. PROC is the procedure being called.  DESCR1,...,DESCRN
// are  descriptors  whose   values   are   passed   to   PROC.
// LOC1,...,LOCM  are  locations  to  transfer  to  upon return
// according to  the  return  exit  signaled.   The  old  stack
// pointer  (A0)  is  saved  on  the  stack,  the current stack
// pointer becomes the old stack pointer,  and  a  new  current
// stack  pointer  is generated as indicated.  The return loca-
// tion LOC is saved on the stack so that  the  return  can  be
// properly    made.     The    values    of    the   arguments
// DESCR1,...,DESCRN are placed on the stack.  Note that  their
// order is the opposite of the order that would be obtained by
// using PUSH.
//      At the return location LOC, code similar to that  shown
// should  be  assembled.   OP  represents  an instruction that
// stores the value returned by PROC in DESCR.
//      Data Input to RCALL:
//               +-------+-------+-------+
//      CSTACK   |   A                   |
//               +-----------------------+
//               +-------+-------+-------+
//      OSTACK   |  A0                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR1   |  A1      F1      V1   |
//               +-----------------------+
//                          .
//                          .
//                          .
//               +-------+-------+-------+
//      DESCRN   |  AN      FN      VN   |
//               +-----------------------+
//      Data Altered by RCALL:
//               +-------+-------+-------+
//      A+D      |  A0       0       0   |
//               +-----------------------+
//               +-------+-------+-------+
//      A+2D     |  LOC      0       0   |
//               +-----------------------+
//               +-------+-------+-------+
//      A+3D     |  AN      FN      VN   |
//               +-----------------------+
//                          .
//                          .
//                          .
//                +-------+-------+-------+
//      A+D*(2+N) |  A1      F1      V1   |
//                +-----------------------+
//               +-----------+-------+-------+
//      CSTACK   | A+(2+N)*D                 |
//               +---------------------------+
//               +-------+-------+-------+
//      OSTACK   |   A                   |
//               +-----------------------+
//      Return Code at LOC:
//      LOC    OP        DESCR1
//             BRANCH    LOC1
//                .
//                .
//                .
//             BRANCH    LOCM
// Programming Notes:
// 1.  RCALL and RRTURN are  used  in  combination,  and  their
// relation  to  each  other  must  be thoroughly understood in
// order to implement them correctly.
// 2.  Ordinarily OP is  an  instruction  to  store  the  value
// returned by RRTURN.
// 3.  DESCR  sometimes  is  omitted.   In this case, any value
// returned by RRTURN is  ignored  and  OP  should  perform  no
// operation.
// 4.  (DESCR1,...,DESCRN)  sometimes  is entirely omitted.  In
// this case N should be taken to be zero in  interpreting  the
// figures.
// 5.  Any  of  the locations LOC1,...,LOCM may be omitted.  As
// in the case of operations with omitted conditional branches,
// control then passes to the operation following the RCALL.
// 6.  The return indicated by RRTURN may be M+1, in which case
// control is passed to the operation following the RCALL.
// 7.  The return indicated by RRTURN  is  never  greater  than
// M+1.
// 8.  RCALL typically must save program state information.  On
// the IBM System/360, this consists of the location LOC and  a
// base  register for the procedure containing the RCALL.  This
// information  is  pushed  onto   the   stack.    In   pushing
// information  onto  the  stack, care must be taken to observe
// the rules concerning the use of descriptors.   The  rest  of
// the  SNOBOL4 system treats the stack as descriptors, and the
// flag fields  of  descriptors  used  to  save  program  state
// information must be set to zero.
// 9.  See also SELBRA.
sil.RCALL = function ( $DESCR, $PROC, $DESCRs, $LOCs ) { // ( DESCR,PROC,( DESCR1,...,DESCRN),(LOC1,...,LOCM)) {
    // recursive call
    var retLoc = this.instructionPointer,
        DESCR;

    if ( $DESCR !== undefined ) {
        DESCR = this.d( $DESCR );
    }

    if ( !Array.isArray( $DESCRs ) ) {
        $DESCRs = [ $DESCRs ];
    }

    if ( !Array.isArray( $LOCs ) ) {
        $LOCs = [ $LOCs ];
    }

    this.mem[ this.CSTACK.addr ] = this.OSTACK.addr;

    // The old stack pointer (A0) is saved on the stack.
    // sil.PUSH
    this.d( this.CSTACK.addr + D ).read( this.OSTACK );

    // The current stack pointer becomes the old stack pointer.
    this.OSTACK.read( this.CSTACK );

    // A new current stack pointer is generated.
    this.CSTACK.addr += D;

    // XXX: We don't store LOC on the stack, but maybe sil expects it.
    // The specs say the new CSTACK is A+(2+N)*D. The 2 is 1 for the old stack
    // pointer and one for LOC.
    this.d( this.CSTACK.addr + D ).update( 0 );
    this.CSTACK.addr += D;


    // The return location LOC is saved on the stack so that the return can be
    // properly made.
    this.callbacks.push( function ( $DESCR_SRC, N ) {
        var DESCR_SRC;
        
        if ( $DESCR_SRC !== undefined ) {
            DESCR_SRC = this.d( $DESCR_SRC );
        }

        if ( DESCR && DESCR_SRC ) {
            DESCR.read( DESCR_SRC );
        }

        var A = this.OSTACK.addr;
        this.CSTACK.read( this.OSTACK );
        this.OSTACK.read( this.d( A + D ) );

        if ( N !== undefined && $LOCs[ N ] !== undefined ) {
            this.instructionPointer = $LOCs[ N - 1 ];
        } else {
            this.instructionPointer = retLoc + 1;
        }
    } );

    sil.PUSH.call( this, $DESCRs.reverse() );

    this.jmp( $PROC );
};

//     RCOMP is used to compare two real numbers.  If R1 > R2,
// transfer is to GTLOC.  If R1 = R2, transfer is to GTLOC.  If
// R1 < R2, transfer is to LTLOC.
//      Data Input to RCOMP:
//               +-------+-------+-------+
//      DESCR1   |  R1                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR2   |  R2                   |
//               +-----------------------+
// Programming Notes:
// 1.  See also ACOMP and LCOMP.
sil.RCOMP = function ( $DESCR1, $DESCR2, GTLOC, EQLOC, LTLOC ) {
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 );

    // real comparison
    if ( DESCR1.raddr > DESCR2.raddr ) {
        this.jmp( GTLOC );
    } else if ( DESCR1.raddr < DESCR2.raddr ) {
        this.jmp( LTLOC );
    } else {
        this.jmp( EQLOC );
    }
};

//     REALST  is  used to convert a real number into a speci-
// fied string.
//      Data Input to REALST:
//               +-------+-------+-------+
//      DESCR    |   R                   |
//               +-----------------------+
//      Data Altered by REALST:
//               +--------+-------+-------+-------+-------+
//      SPEC     | BUFFER     0       0       0       L   |
//               +----------------------------------------+
//               +-------+-------+-------+
//      BUFFER   |  C1      ...     CL   |
//               +-----------------------+
// Programming Notes:
// 1.  C1...CL should  represent  the  real  number  R  in  the
// SNOBOL4  fashion,  containing  a decimal point and having at
// least one digit before the decimal point, zeroes being added
// as  necessary.   If  R  is negative, the string should begin
// with a minus sign.  For compatibility with real literals and
// data  type  conversions,  the  real  number  should  not  be
// represented in exponent form, although very large  or  small
// real  numbers  may  require a large number of characters for
// their representation otherwise.
// 2.  The number of digits (and  hence  the  size  of  BUFFER)
// required  is  machine  dependent  and  depends  on the range
// available for real numbers.
// 3.  BUFFER is local  to  REALST  and  its  contents  may  be
// overwritten by a subsequent use of REALST.
// 4.  See also INTSPC and SPREAL.
sil.REALST = function ( $SPEC, $DESCR ) {
    // convert real number to string
    var DESCR = this.d( $DESCR );
    return this.specify( DESCR.raddr, $SPEC );
};

//     REMSP is used to obtain a remainder specifier resulting
// from the deletion of a specified length at the end.
//      Data Input to REMSP:
//               +-------+-------+-------+-------+-------+
//      SPEC2    |  A2      F2      V2      O2      L2   |
//               +---------------------------------------+
//               +-------+-------+-------+-------+-------+
//      SPEC3    |                                  L3   |
//               +---------------------------------------+
//      Data Altered by REMSP:
//               +-------+-------+-------+-------+-------+
//      SPEC1    |  A2      F2      V2     O2+L3   L2-L3 |
//               +---------------------------------------+
// Programming Notes:
// 1.  SPEC1 and SPEC3 may be the same.
// 2.  L2-L3 is never negative.
// 3.  See also FSHRTN.
sil.REMSP = function ( $SPEC1, $SPEC2, $SPEC3 ) {
    // specify remaining string
    var SPEC1 = this.s( $SPEC1 ),
        SPEC2 = this.s( $SPEC2 ),
        SPEC3 = this.s( $SPEC3 ),
        L3 = SPEC3.length;

    assert( SPEC2.length - SPEC3.length >= 0 );

    SPEC1.addr   = SPEC2.addr;
    SPEC1.flags  = SPEC2.flags;
    SPEC1.value  = SPEC2.value;
    SPEC1.offset = SPEC2.offset + L3;
    SPEC1.length = SPEC2.length - L3;
};

//     RESETF is used to reset (delete) a flag from a descrip-
// tor.
//      Data Input to RESETF:
//               +-------+-------+-------+
//      DESCR    |           F           |
//               +-----------------------+
//      Data Altered by RESETF:
//               +-------+--------+-------+
//      DESCR    |         F-FLAG         |
//               +------------------------+
// Programming Notes:
// 1.  Only  FLAG  is  removed  from the flags in F.  Any other
// flags are left unchanged.
// 2.  If F does not contain FLAG, no data is altered.
// 3.  See also RSETFI and SETFI.
sil.RESETF = function ( $DESCR, FLAG ) {
    // reset flag
    var DESCR = this.d( $DESCR );

    DESCR.flags &= ( ~FLAG );
};

//     REWIND is used to rewind the file associated  with  the
// unit reference number I.
//      Data Input to REWIND:
//               +-------+-------+-------+
//      DESCR    |   I                   |
//               +-----------------------+
// Programming Notes:
// 1.  Refer  to Section 2.1 for a discussion of unit reference
// numbers.
// 2.  See also BKSPCE and ENFILE.
sil.REWIND = function ( $DESCR ) {
    // rewind file
    var DESCR = this.d( $DESCR ),
        f = new SNOBOL.File( this, DESCR.addr );

    f.seek( 0 );
};

//     RLINT is used to convert a real number to  an  integer.
// If  the  magnitude of R exceeds the magnitude of the largest
// integer, transfer is to  FLOC.   Otherwise  transfer  is  to
// SLOC.
//      Data Input to RLINT:
//               +-------+-------+-------+
//      DESCR2   |   R                   |
//               +-----------------------+
//      Data Altered by RLINT:
//               +-------+-------+-------+
//      DESCR1   | I(R)      0       I   |
//               +-----------------------+
// Programming Notes:
// 1.  I(R) is the integer equivalent of the real number R.
// 2.  The fractional part of R is discarded.
// 3.  I  is  a symbol defined in the source program and is the
// code for the integer data type.
sil.RLINT = function ( $DESCR1, $DESCR2, FLOC, SLOC ) {
    // convert real number to integer
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 );

    try {
        DESCR1.addr = Math.floor( DESCR2.raddr );
        DESCR1.flags = 0;
        DESCR1.value = this.resolve( 'I' );
        this.jmp( SLOC );
    } catch ( e ) {
        if ( e instanceof RangeError ) {
            this.jmp( FLOC );
        }
    }
};

//     RPLACE is used  to  replace  characters  in  a  string.
// SPEC2  specifies  a set of characters to be replaced.  SPEC3
// specifies the replacement to  be  made  for  the  characters
// specified  by  SPEC2.   The  replacement is described by the
// following rules.  For I = 1,...,L
//      F(CI) = CI if CI != C2J for any J (1 <= J <= L2)
//      F(CI) = C3J if CI = C2J for some J (1 <= J <= L2)
//      Data Input to RPLACE:
//               +-------+-------+-------+-------+-------+
//      SPEC1    |  A1                      O1       L   |
//               +---------------------------------------+
//               +-------+-------+-------+-------+-------+
//      SPEC2    |  A2                      O2      L2   |
//               +---------------------------------------+
//               +-------+-------+-------+-------+-------+
//      SPEC3    |  A3                      O3      L2   |
//               +---------------------------------------+
//                          .
//                          .
//                          .
//               +-------+-------+-------+
//      A1+O1    |  C1      ...     CL   |
//               +-----------------------+
//               +-------+-------+-------+
//      A2+O2    |  C21     ...    C2L2  |
//               +-----------------------+
//               +-------+-------+-------+
//      A3+O3    |  C31     ...    C3L2  |
//               +-----------------------+
//      Data Altered by RPLACE:
//               +-------+-------+-------+
//      A1+O1    | F(C1)    ...    F(CL) |
//               +-----------------------+
// Programming Notes:
// 1.  L may be zero.
// 2.  If  there  are  duplicate  characters   in   C21...C2L2,
// replacement   should  be  made  corresponding  to  the  last
// instance of the character.  That is, if
//      C2I = C2J = ... = C2K  (I < J < K)
// then
//      F(CI) = C3K
// 3.  RPLACE is used only in the SNOBOL4 REPLACE function.  It
// is  not essential that RPLACE be implemented as such.  If it
// is not, RPLACE should transfer to UNDF to provide an  appro-
// priate error comment.
sil.RPLACE = function ( $SPEC1, $SPEC2, $SPEC3 ) {
    // replace characters
    throw new Error( 'RPLACE is undefined' );
    this.jmp( 'UNDF' );  // XXX
};

//     RRTURN  is used to return from a recursive call.  DESCR
// is the descriptor whose value is returned.  The stack point-
// ers  are  repositioned  as shown.  At the location LOC, code
// similar to that shown is assembled by the  RRCALL  to  which
// return  is to be made.  OP represents an instruction that is
// used by RRTURN to return the value  of  DESCR.   Control  is
// transferred  to LOCN corresponding to N given in the RRTURN.
//      Data Input to RRTURN:
//               +-------+-------+-------+
//      OSTACK   |   A                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A+D      |  A0                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A+2D     |  LOC                  |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR    |  A1      F1      V1   |
//               +-----------------------+
//      Data Altered by RRTURN:
//               +-------+-------+-------+
//      CSTACK   |   A                   |
//               +-----------------------+
//               +-------+-------+-------+
//      OSTACK   |  A0                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR1   |  A1      F1      V1   |
//               +-----------------------+
//      Return Code at LOC:
//      LOC      OP         DESCR1
//               BRANCH     LOC1
//                 .
//                 .
//                 .
//               BRANCH     LOCM
//      LOC
// Programming Notes:
// 1.  RCALL and RRTURN are  used  in  combination,  and  their
// relation  to  each  other  must  be thoroughly understood in
// order to implement them correctly.
// 2. DESCR may be omitted.  In  this  case, OP  should  not be
// executed.
sil.RRTURN = function ( $DESCR, N ) {
    // recursive return
    var callback = this.callbacks.pop();
    callback.call( this, $DESCR, N );
};

//     RSETFI is used to reset (delete) a flag from a descrip-
// tor that is specified indirectly.
//      Data Input to RSETFI:
//               +-------+-------+-------+
//      DESCR    |   A                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A        |           F           |
//               +-----------------------+
//      Data Altered by RSETFI:
//               +-------+--------+-------+
//      A        |         F-FLAG         |
//               +------------------------+
// Programming Notes:
// 1.  Only  FLAG  is  removed  from the flags in F.  Any other
// flags are left unchanged.
// 2.  If F does not contain FLAG, no data is altered.
// 3.  See also RESETF and SETFI.
sil.RSETFI = function ( $DESCR, FLAG ) {
    // reset flag indirect
    var DESCR = this.d( $DESCR );
    sil.RESETF.call( this, DESCR.addr, FLAG );
};

//     SBREAL  is  used  to  subtract  one  real  number  from
// another.   If  the  result is out of the range available for
// real numbers, transfer is to FLOC.  Otherwise transfer is to
// SLOC.
//      Data Input to SBREAL:
//               +-------+-------+-------+
//      DESCR2   |  R2      F2      V2   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR3   |  R3                   |
//               +-----------------------+
//      Data Altered by SBREAL:
//               +-------+-------+-------+
//      DESCR1   | R2-R3    F2      V2   |
//               +-----------------------+
// Programming Notes:
// 1.  See also ADREAL, DVREAL, EXREAL, MNREAL, and MPREAL.
sil.SBREAL = function ( $DESCR1, $DESCR2, $DESCR3, FLOC, SLOC ) {
    // subtract real numbers
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        DESCR3 = this.d( $DESCR3 );

    try {
        DESCR1.raddr = DESCR2.raddr - DESCR3.addr;
        this.jmp( SLOC );
    } catch ( e ) {
        if ( e instanceof RangeError ) {
            this.jmp( FLOC );
        }
    }
};

//     SELBRA  is used to alter the flow of program control by
// selecting a location  from  a  list  and  branching  to  it.
// Transfer is to LOCI corresponding to I.
//      Data Input to SELBRA:
//               +-------+-------+-------+
//      DESCR    |   I                   |
//               +-----------------------+
// Programming Notes:
// 1.  Any  of the locations may be omitted.  As in the case of
// operations with omitted conditional branches,  control  then
// passes to the operation following SELBRA.
// 2.  If I = N+1, control is passed to the operation following
// SELBRA.
// 3.  I is always in the range 1 <= I <= N+1.   For  debugging
// purposes,  it  may be useful to verify that I is within this
// range.
sil.SELBRA = function ( $DESCR, LOCI ) {
    // select branch point
    var DESCR = this.d( $DESCR ),
        I = DESCR.addr,
        N;

    assert( Array.isArray( LOCI ) );

    N = LOCI.length;
    assert( I >= 1 && I <= N + 1 )
    if ( I !== N + 1 ) {
        this.jmp( LOCI[ I - 1 ] );
    }
};

//     SETAC is used to set the address field of a  descriptor
// to a constant.
//      Data Altered by SETAC:
//               +-------+-------+-------+
//      DESCR    |   N                   |
//               +-----------------------+
// Programming Notes:
// 1.  N may be a relocatable address.
// 2.  N is often 0, 1, or D.
// 3.  N is never negative.
// 4.  See also SETVC, SETLC, and SETAV.
sil.SETAC = function ( $DESCR, N ) {
    // set address to constant
    var DESCR = this.d( $DESCR );

    assert( N >= 0 );
    DESCR.addr = N;
};

//     SETAV sets the address field of one descriptor from the
// value field of another.
//      Data Input to SETAV:
//               +-------+-------+-------+
//      DESCR2   |                   V   |
//               +-----------------------+
//      Data Altered by SETAV:
//               +-------+-------+-------+
//      DESCR1   |   V       0       0   |
//               +-----------------------+
// Programming Notes:
// 1.  See also SETAC
sil.SETAV = function ( $DESCR1, $DESCR2 ) {
    // set address from value field
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 );

    DESCR1.addr = DESCR2.value;
    DESCR1.flags = 0;
    DESCR1.value = 0;
};

//     SETF is used to set (add) a flag in the flag  field  of
// DESCR.
//      Data Input to SETF:
//               +-------+-------+-------+
//      DESCR    |           F           |
//               +-----------------------+
//      Data Altered by SETF:
//               +-------+--------+-------+
//      DESCR    |         F+FLAG         |
//               +------------------------+
// Programming Notes:
// 1.  FLAG  is  added  to the flags already present in F.  The
// other flags are left unchanged.
// 2.  If F already contains FLAG, no data is altered.
// 3.  See also SETFI.
sil.SETF = function ( $DESCR, FLAG ) {
    var DESCR = this.d( $DESCR );

    DESCR.flags |= FLAG;
};

//     SETFI is used to set (add) a flag in the flag field  of
// a descriptor specified indirectly.
//      Data Input to SETFI:
//               +-------+-------+-------+
//      DESCR    |   A                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A        |           F           |
//               +-----------------------+
//      Data Altered by SETFI:
//               +-------+--------+-------+
//      A        |         F+FLAG         |
//               +------------------------+
// Programming Notes:
// 1.  FLAG  is  added  to the flags already present in F.  The
// other flags are left unchanged.
// 2.  If F already contains FLAG, no data is altered.
// 3.  See also SETF and RSETFI.
sil.SETFI = function ( $DESCR, FLAG ) {
    // set flag indirect
    var DESCR = this.d( $DESCR );
    sil.SETF.call( this, DESCR.addr, FLAG );
};

//     SETLC is used to set the length of  a  specifier  to  a
// constant.
//      Data Altered by SETLC:
//               +-------+-------+-------+-------+-------+
//      SPEC     |                                   N   |
//               +---------------------------------------+
// Programming Notes:
// 1.  N is never negative.
// 2.  N is often 0.
// 3.  See also SETAC.
sil.SETLC = function ( $SPEC, N ) {
    // set length of specifier to constant
    var SPEC = this.s( $SPEC );

    assert( N >= 0 );
    SPEC.length = N;
};

//     SETSIZ  is used to set the size into the value field of
// a title descriptor.
//      Data Input to SETSIZ:
//               +-------+-------+-------+
//      DESCR1   |   A                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR2   |   I                   |
//               +-----------------------+
//      Data Altered by SETSIZ:
//               +-------+-------+-------+
//      A        |                   I   |
//               +-----------------------+
// Programming Notes:
// 1.  I is always positive and small enough to  fit  into  the
// value field.
// 2.  See also GETSIZ
sil.SETSIZ = function ( $DESCR1, $DESCR2 ) {
    // set size
    var DESCR1 = this.d( $DESCR1 ),
        A = DESCR1.addr,
        DESCR2 = this.d( $DESCR2 ),
        I = DESCR2.addr;

    assert( I > 0 );
    this.d( A ).value = I;
};

//     SETSP is used to set one specifier equal to another.
//      Data Input to SETSP:
//               +-------+-------+-------+-------+-------+
//      SPEC2    |   A       F       V       O       L   |
//               +---------------------------------------+
//      Data Altered by SETSP:
//               +-------+-------+-------+-------+-------+
//      SPEC1    |   A       F       V       O       L   |
//               +---------------------------------------+
sil.SETSP = function ( $SPEC1, $SPEC2 ) {
    // set specifier
    var SPEC1 = this.s( $SPEC1 ),
        SPEC2 = this.s( $SPEC2 );

    SPEC1.read( SPEC2 );
};

//     SETVA  is used to set the value field of one descriptor
// from the address field of another.
//      Data Input to SETVA:
//               +-------+-------+-------+
//      DESCR2   |   I                   |
//               +-----------------------+
//      Data Altered by SETVA:
//               +-------+-------+-------+
//      DESCR1   |                   I   |
//               +-----------------------+
// Programming Notes:
// 1.  I is always positive and small enough to  fit  into  the
// value field.
// 2.  See also SETVA and SETVC.
sil.SETVA = function ( $DESCR1, $DESCR2 ) {
    // set value field from address
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 );

    assert( DESCR2.addr > 0 );
    DESCR1.value = DESCR2.addr;
};

//     SETVC is used to set the value field of a descriptor to
// a constant.
//      Data Altered by SETVC:
//               +-------+-------+-------+
//      DESCR    |                   N   |
//               +-----------------------+
// Programming Notes:
// 1.  N is always positive and small enough to  fit  into  the
// value field.
// 2.  See also SETVA and SETAC.
sil.SETVC = function ( $DESCR, N ) {
    // set value to constant
    var DESCR = this.d( $DESCR );

    assert( N > 0 );
    DESCR.value = N;
};

//     SHORTN  is  used  to  shorten  the  specification  of a
// string.
//      Data Input to SHORTN:
//               +-------+-------+-------+-------+-------+
//      SPEC     |                                   L   |
//               +---------------------------------------+
//      Data Altered by SHORTN:
//               +-------+-------+-------+-------+-------+
//      SPEC     |                                  L-N  |
//               +---------------------------------------+
// Programming Notes:
// 1.  L-N is never negative.
sil.SHORTN = function ( $SPEC, N ) {
    // shorten specifier
    var SPEC = this.s( $SPEC );

    assert( SPEC.length - N >= 0 );
    SPEC.length -= N;
};

//     SPCINT is used to convert a specified string to a inte-
// ger.  I(S) is a signed integer resulting from the conversion
// of the string C1...CL.  If C1...CL  does  not  represent  an
// integer  or if the integer it represents is too large to fit
// the address field, transfer is to FLOC.  Otherwise  transfer
// is to SLOC.
//      Data Input to SPCINT:
//               +-------+-------+-------+-------+-------+
//      SPEC     |   A                       O       L   |
//               +---------------------------------------+
//               +-------+-------+-------+
//      A+O      |  C1      ...     CL   |
//               +-----------------------+
//      Data Altered by SPCINT:
//               +-------+-------+-------+
//      DESCR    | I(S)      0       I   |
//               +-----------------------+
// Programming Notes:
// 1.  I  is  a symbol defined in the source program and is the
// code for the integer data type.
// 2.  C1...CL may begin with a sign (plus or  minus)  and  may
// contain  indefinite  number  of leading zeros.  Consequently
// the value of L itself does not determine whether the integer
// represented is too large to fit into an address field.
// 3.  A sign alone is not a valid integer.
// 4.  If L = 0, I(S) should be the integer 0.
// 5.  See also INTSPC and SPREAL.
sil.SPCINT = function ( $DESCR, $SPEC, FLOC, SLOC ) {
    // convert specifier to integer
    var DESCR = this.d( $DESCR ),
        SPEC = this.s( $SPEC ),
        I = this.$( 'I' ),
        val = parseInt( SPEC.specified, 10 );

    DESCR.update( 0, 0, I );
    try {
        DESCR.addr = val;
        this.jmp( SLOC );
    } catch ( e ) {
        if ( e instanceof RangeError ) {
            DESCR.addr = 0;
            return this.jmp( FLOC );
        }
        throw( e );
    }
};

//     SPEC is used to assemble a specifier.
//      Data Assembled by SPEC:
//               +-------+-------+-------+-------+-------+
//      LOC      |   A       F       V       O       L   |
//               +---------------------------------------+
sil.SPEC = function ( A, F, V, O, L ) {
    // assemble specifier
    var SPEC = this.s( this.currentLabel ), ptr;

    if ( typeof A === 'string' ) {
        throw new Error('dead code');
        ptr = this.mem.length;
        this.mem = this.mem.concat( SNOBOL.str.encode( A ) );
        A = ptr;
    }
    
    SPEC.addr   = A || 0;
    SPEC.flags  = F || 0;
    SPEC.value  = V || 0;
    SPEC.offset = O || 0;
    SPEC.length = L || 0;

    return SPEC.ptr;
};

//     SPOP  is used to pop a list of specifiers from the sys-
// tem stack.
//      Data Input to SPOP:
//               +-------+-------+-------+
//      CSTACK   |   A                   |
//               +-----------------------+
//               +-------+-------+-------+-------+-------+
//      A+D-S    |  A1      F1      V1      O1      L1   |
//               +---------------------------------------+
//                          .
//                          .
//                          .
//                +-------+-------+-------+-------+-------+
//      A+D-(N*S) |  AN      FN      VN      ON      LN   |
//                +---------------------------------------+
//      Data Altered by SPOP:
//               +---------+-------+-------+
//      CSTACK   | A-(N*S)                 |
//               +-------------------------+
//               +-------+-------+-------+-------+-------+
//      SPEC1    |  A1      F1      V1      O1      L1   |
//               +---------------------------------------+
//                          .
//                          .
//                          .
//               +-------+-------+-------+-------+-------+
//      SPECN    |  AN      FN      VN      ON      LN   |
//               +---------------------------------------+
// Programming Notes:
// 1.  If  A-(N*S)  <  STACK,  stack  underflow  occurs.   This
// condition    indicates    a   programming   error   in   the
// implementation of the macro language.  An appropriate  error
// termination  for  this error may be obtained by transferring
// to the program location INTR10 if the condition is detected.
// 2.  See also POP, SPUSH, and PUSH.
sil.SPOP = stackPopper( 's' );

//     SPREAL  is  used  to  convert a specified string into a
// real number.  R(S) is a signed real  number  resulting  from
// the  conversion  of  the string S = C1.  If C1...CL does not
// represent a real number, or if the real number it represents
// is  out of the range available for real numbers, transfer is
// to FLOC.  Otherwise transfer is to SLOC.
//      Data Input to SPREAL:
//               +-------+-------+-------+-------+-------+
//      SPEC     |   A                       O       L   |
//               +---------------------------------------+
//               +-------+-------+-------+
//      A+O      |  C1      ...     CL   |
//               +-----------------------+
//      Data Altered by SPREAL:
//               +-------+-------+-------+
//      DESCR    | R(S)      0       R   |
//               +-----------------------+
// Programming Notes:
// 1.  R is a symbol defined in the source program and  is  the
// code for the real data type.
// 2.  C1,...,CL  may begin with a sign (plus or minus) and may
// contain an indefinite number of  leading  zeros.   C1,...,CL
// will contain a decimal point if it represents a real number,
// and have at least one digit before the decimal point.
// 3.  If L = 0, R(S) should be the real number 0.0.
// 4.  See also SPCINT and INTRL.
sil.SPREAL = function ( $DESCR, $SPEC, FLOC, SLOC ) {
    // convert specified string to real number
    var DESCR = this.d( $DESCR ),
        SPEC = this.s( $SPEC );

    if ( /^([+-]?0*\d+\.\d*|)$/.test( SPEC.specified ) ) {
        DESCR.raddr = parseFloat( SPEC.specified + '0', 10 );
        DESCR.flags = 0;
        DESCR.value = this.$( 'R' );
        this.jmp( SLOC );
    } else {
        this.jmp( FLOC );
    }
};

//     SPUSH is used to push a list  of  specifiers  onto  the
// system stack.
//      Data Input to SPUSH:
//               +-------+-------+-------+
//      CSTACK   |   A                   |
//               +-----------------------+
//               +-------+-------+-------+-------+-------+
//      SPEC1    |  A1      F1      V1      O1      L1   |
//               +---------------------------------------+
//                          .
//                          .
//                          .
//               +-------+-------+-------+-------+-------+
//      SPECN    |  AN      FN      VN      ON      LN   |
//               +---------------------------------------+
//      Data Altered by SPUSH:
//               +---------+-------+-------+
//      CSTACK   | A+(S*N)                 |
//               +-------------------------+
//               +-------+-------+-------+-------+-------+
//      A+D      |  A1      F1      V1      O1      L1   |
//               +---------------------------------------+
//                          .
//                          .
//                          .
//                +-------+-------+-------+-------+-------+
//      A+D+S*N-S |  AN      FN      VN      ON      LN   |
//                +---------------------------------------+
// Programming Notes:
// 1.  If   A+(S*N)  >  STACK+STSIZE,  stack  overflow  occurs.
// Transfer should be made to the program location OVER,  which
// will result in an appropriate error termination.
// 2.  See also PUSH, POP, and SPOP.
sil.SPUSH = stackPusher( 's' );

//     STPRNT is used to print a string.  The string C11...C1L
// is printed on the file associated with unit reference number
// I.   C21...C2M is the output format.  J is an integer speci-
// fying a condition signaled by the output routine.
//      Data Input to STPRNT:
//               +-------+-------+-------+
//      DESCR2   |   A                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A+D      |   I                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A+2D     |  A2                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A2       |                   M   |
//               +-----------------------+
//               +-------+-------+-------+
//      A2+4D    |  C21     ...     C2M  |
//               +-----------------------+
//               +-------+-------+-------+-------+-------+
//      SPEC     |  A1                      O1       L   |
//               +---------------------------------------+
//               +-------+-------+-------+
//      A1+O1    |  C11     ...     C1L  |
//               +-----------------------+
//      Data Altered by STPRNT:
//               +-------+-------+-------+
//      DESCR1   |   J                   |
//               +-----------------------+
// Programming Notes:
// 1.  The  format  C21...C2M  is  a  FORTRAN  IV   format   in
// `undigested' form.  See FORMAT.
// 2.  Both   C11...C1L   and  C21...C2M  begin  at  descriptor
// boundaries.
// 3.  The condition J set in the address field  of  DESCR1  is
// not used.
// 4.  See also OUTPUT and STREAD.
sil.STPRNT = function ( $DESCR1, $DESCR2, $SPEC ) {
    // string print
    var DESCR2 = this.d( $DESCR2 ),
        A = DESCR2.addr,
        I = this.d( A + D ).addr,
        A2 = this.d( A + ( 2 * D ) ).addr,
        M = this.d( A2 ).value,
        fmt = this.mem.slice( A2 + ( 4 * D ), A2 + ( 4 * D + M ) ),

        SPEC = this.s( $SPEC ),
        A1 = SPEC.addr,
        O1 = SPEC.offset,
        L = SPEC.length,
        item = this.mem.slice( A1 + O1, A1 + O1 + L );

    fmt = SNOBOL.str.decode( fmt );
    item = SNOBOL.str.decode( item );
    console.log( SNOBOL.str.format( fmt, item ) );
    this.d( $DESCR1 ).addr = 1;
};

//     STREAD is used to read a string.  The string C1...CL is
// read from the file associated with unit reference number  I.
// If  an end-of-file is encountered, transfer is to EOF.  If a
// reading error  occurs,  transfer  is  to  ERROR.   Otherwise
// transfer is to SLOC.
//      Data Input to STREAD:
//               +-------+-------+-------+
//      DESCR    |   I                   |
//               +-----------------------+
//               +-------+-------+-------+-------+-------+
//      SPEC     |   A                       O       L   |
//               +---------------------------------------+
//      Data Altered by STREAD:
//               +-------+-------+-------+
//      A+O      |  C1      ...     CL   |
//               +-----------------------+
// Programming Notes:
// 1.  Note  that  the  length  of  the  string  to  be read is
// specified by the data provided to  STREAD.   If  the  record
// read  is  not  of length L, FORTRAN IV conventions regarding
// truncation  or  reading  of  additional  records  should  be
// followed.
// 2.  See also STPRNT.
sil.STREAD = function ( $SPEC, $DESCR, EOF, ERROR, SLOC ) {
    // string read
    var SPEC = this.s( $SPEC ),
        DESCR = this.d( $DESCR ),
        I = DESCR.addr,
        file = new SNOBOL.File( this, I ),
        words, raw;

    if ( !file ) {
        // invalid file descriptor
        return this.jmp( ERROR );
    }

    words = file.read( SPEC.length );
    if ( !words.length ) {
        return this.jmp( EOF );
    }

    for ( var p = 0; p < SPEC.length; p++ ) {
        this.mem[ SPEC.addr + SPEC.offset + p ] = words.codePointAt( p ) || 0;
    }

    return this.jmp( SLOC );
};

//     STREAM  is  used  to  locate  a  syntactic token at the
// beginning of the string specified by SPEC2.  If there is  an
// I  (1 <= I <= L) such that TI is ERROR, STOP, or STOPSH, and
// J is the least such I, then if TJ is ERROR, transfer  is  to
// ERRROR, while if if TJ is STOPSH, transfer is to SLOC.  Oth-
// erwise transfer is to RUNOUT.
//      In the figures that follow, J is the least value  of  I
// for which TI is STOP or STOPSH.  P is the last value of P (1
// <= I <= J) that is nonzero (i.e. for which a PUT  is  speci-
// fied  in the syntax table description for the tables given).
// If no PUT is specified, P is zero.
//      Data Input to STREAM:
//               +-------+-------+-------+-------+-------+
//      SPEC2    |   A       F       V       O       L   |
//               +---------------------------------------+
//               +------+-----+-----+------+------+----+
//      A+O      | C1    ...    CJ    CJ+1   ...   CL  |
//               +-------------------------------------+
//                 +-------+-------+-------+
//      TABLE+E*C1 |  A2      T1      P1   |
//                 +-----------------------+
//               +-------+-------+-------+
//      A2+E*C2  |  A3      T2      P2   |
//               +-----------------------+
//                          .
//                          .
//                          .
//               +-------+-------+-------+
//      AL+E*CL  |          TL      PL   |
//               +-----------------------+
//      Data Altered by STREAM if Termination is STOP:
//               +-------+-------+-------+
//      STYPE    |   P                   |
//               +-----------------------+
//               +-------+-------+-------+-------+-------+
//      SPEC1    |   A       F       V       O       J   |
//               +---------------------------------------+
//               +-------+-------+-------+-------+-------+
//      SPEC2    |   A       F       V      O+J     L-J  |
//               +---------------------------------------+
//      Data Altered by STREAM if Termination is STOPSH:
//               +-------+-------+-------+
//      STYPE    |   P                   |
//               +-----------------------+
//               +-------+-------+-------+-------+-------+
//      SPEC1    |   A       F       V       O      J-1  |
//               +---------------------------------------+
//               +-------+-------+-------+-------+-------+
//      SPEC2    |   A       F       V     O+J-1   L-J+1 |
//               +---------------------------------------+
//      Data Altered by STREAM if Termination is ERROR:
//               +-------+-------+-------+
//      STYPE    |   0                   |
//               +-----------------------+
//               +-------+-------+-------+-------+-------+
//      SPEC1    |   A       F       V       O       L   |
//               +---------------------------------------+
//      Data Altered by STREAM if Termination is RUNOUT:
//               +-------+-------+-------+
//      STYPE    |   P                   |
//               +-----------------------+
//               +-------+-------+-------+-------+-------+
//      SPEC1    |   A       F       V       O       L   |
//               +---------------------------------------+
//               +-------+-------+-------+-------+-------+
//      SPEC2    |   A       F       V       O       0   |
//               +---------------------------------------+
// Programming Notes:
// 1.  Termination with STOP or STOPSH may occur  on  the  last
// character, CL.
// 2.  If  L  =  0  (i.e.  if SPEC2 specifies the null string),
// RUNOUT occurs.  In this case  the  address  field  of  STYPE
// should be set to 0.
// 3.  See Section 4.2.
//     STREAM  is  used  to  locate  a  syntactic token at the
// beginning of the string specified by SPEC2.  If there is  an
// I  (1 <= I <= L) such that TI is ERROR, STOP, or STOPSH, and
// J is the least such I, then if TJ is ERROR, transfer  is  to
// ERRROR, while if if TJ is STOPSH, transfer is to SLOC.  Oth-
// erwise transfer is to RUNOUT.
//      In the figures that follow, J is the least value  of  I
// for which TI is STOP or STOPSH.  P is the last value of P (1
// <= I <= J) that is nonzero (i.e. for which a PUT  is  speci-
// fied  in the syntax table description for the tables given).
// If no PUT is specified, P is zero.
sil.STREAM = function ( $SPEC1, $SPEC2, TABLE, ERROR, RUNOUT, SLOC ) {
    // stream for token
    var SPEC1 = this.s( $SPEC1 ),
        SPEC2 = this.s( $SPEC2 ),
        STYPE = this.d( 'STYPE' ), // Descriptor return by STREAM
        str = SPEC2.specified,     // The string that we're scanning
        I,  // The 1-based string index of the current character, between 1 and L)
        J,  // J is the smallest value of I for which TI is STOP or STOPSH
        ch, // The current character
        TI, // TI is what to do next (STOPSH, CONTIN, etc. or a table to GOTO)
        t;  // The table row (rule) index that we are currently applying

    var P = 0,
        A = SPEC2.addr,
        F = SPEC2.flags,
        V = SPEC2.value,
        O = SPEC2.offset,
        L = SPEC2.length;


    function getTableById( id ) {
        return SNOBOL.syntaxTables[ SNOBOL.tableNames[ id ] ];
    }

    var table = getTableById( TABLE );

    for ( I = 1; I <= str.length; I++ ) {
        J = I;
        ch = str.charAt( I - 1 );
        TI = 'RUNOUT';
        for ( t = 0; t < table.length; t++ ) {
            if ( SNOBOL.match( table[t][0], ch ) ) {
                // if table specifies a value to PUT(), assign it to P
                if ( table[t][1] !== null ) {
                    P = this.$( table[t][1] );
                }
                TI = table[t][2];
                break;
            }
        }

        console.log( `TI = ${TI}` );
        switch ( TI ) {
        case 'CONTIN':
            continue;

        case 'STOPSH':
            STYPE.addr = P;
            SPEC1.update( A, F, V, O, J - 1 );
            SPEC2.update( A, F, V, O + J - 1, L - J + 1 );
            this.jmp( SLOC );
            return;

        case 'STOP':
            STYPE.addr = P;
            SPEC1.update( A, F, V, O, J );
            SPEC2.update( A, F, V, O + J, L - J );
            this.jmp( RUNOUT );
            return;

        case 'ERROR':
            STYPE.addr = 0;
            SPEC1.update( A, F, V, O, L );
            this.jmp( ERROR );
            return;

        case 'RUNOUT':
            STYPE.addr = P;
            SPEC1.update( A, F, V, O, L );
            SPEC2.update( A, F, V, O, 0 );
            this.jmp( RUNOUT );
            return;

        default:
            // GOTO
            assert( TI in SNOBOL.syntaxTables );
            table = SNOBOL.syntaxTables[ TI ];
        }
    }
};

//     STRING  is used to assemble a string and a specifier to
// it.
//      Data Assembled by STRING:
//               +-------+-------+-------+-------+-------+
//      LOC      |   A       0       0       0       L   |
//               +---------------------------------------+
//               +-------+-------+-------+
//      A        |  C1      ...     CL   |
//               +-----------------------+
// Programming Notes:
// 1.  Note that LOC is the location of the specifier, not  the
// string.  The string may immediately follow the specifier, or
// it may be assembled at a remote location.
//
sil.STRING = function ( STR ) {
    // assemble specified string
    return this.specify( STR );
};

//     FORMAT  is used to assemble the characters of a format.
//      Data Assembled by FORMAT:
//               +-------+-------+-------+
//      LOC      |  C1      ...     CL   |
//               +-----------------------+
// Programming Notes:
// 1.  The characters assembled by FORMAT  are  treated  as  an
// `undigested' format by FORTRAN IV routines.
sil.FORMAT = sil.STRING;


//     SUBSP is used to specify  an  initial  substring  of  a
// specified string.  If L3 >= L2, transfer is to SLOC.  Other-
// wise transfer is to FLOC and SPEC1 is not altered.
//      Data Input to SUBSP:
//               +-------+-------+-------+-------+-------+
//      SPEC2    |                                  L2   |
//               +---------------------------------------+
//               +-------+-------+-------+-------+-------+
//      SPEC3    |  A3      F3      V3      O3      L3   |
//               +---------------------------------------+
//      Data Altered by SUBSP if L3 >= L2:
//               +-------+-------+-------+-------+-------+
//      SPEC1    |  A3      F3      V3      O3      L2   |
//               +---------------------------------------+
sil.SUBSP = function ( $SPEC1, $SPEC2, $SPEC3, FLOC, SLOC ) {
    // substring specification
    var SPEC1 = this.s( $SPEC1 ),
        SPEC2 = this.s( $SPEC2 ),
        SPEC3 = this.s( $SPEC3 );

    if ( SPEC3.length >= SPEC2.length ) {
        SPEC1.read( SPEC3 );
        SPEC1.length = SPEC2.length;
        this.jmp( SLOC );
    } else {
        this.jmp( FLOC );
    }
};

//     SUBTRT is used  to  subtract  one  address  field  from
// another.   A2  and A3 are considered as signed integers.  If
// A2-A3 is out of the range available for  integers,  transfer
// is to FLOC.  Otherwise transfer is to SLOC.
//      Data Input to SUBTRT:
//               +-------+-------+-------+
//      DESCR2   |  A2      F2      V2   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR3   |  A3                   |
//               +-----------------------+
//      Data Altered by SUBTRT:
//               +-------+-------+-------+
//      DESCR1   | A2-A3    F2      V2   |
//               +-----------------------+
// Programming Notes:
// 1.  A2 and A3 may be relocatable addresses.
// 2.  The  test  for  success  and failure is used in only one
// call of this macro.  Hence the code to make the check is not
// needed in most cases.
// 3.  DESCR1 and DESCR2 are often the same.
// 4.  See also SUM.
sil.SUBTRT = function ( $DESCR1, $DESCR2, $DESCR3, FLOC, SLOC ) {
    // subtract addresses
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        DESCR3 = this.d( $DESCR3 ),
        newAddr = DESCR2.addr - DESCR3.addr;

    if ( !SNOBOL.isInt32( newAddr ) ) {
        return this.jmp( FLOC );
    }

    DESCR1.addr  = newAddr;
    DESCR1.flags = DESCR2.flags;
    DESCR1.value = DESCR2.value;
    this.jmp( SLOC );
};

//     SUM  is  used  to  add two address fields.  A and I are
// considered as signed integers.  If A+I is out of  the  range
// available  for  integers,  transfer  is  to FLOC.  Otherwise
// transfer is to SLOC.
//      Data Input to SUM:
//               +-------+-------+-------+
//      DESCR2   |   A       F       V   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR3   |   I                   |
//               +-----------------------+
//      Data Altered by SUM:
//               +-------+-------+-------+
//      DESCR1   |  A+I      F       V   |
//               +-----------------------+
// Programming Notes:
// 1.  A may be a relocatable address.
// 2.  The test for success and failure is  used  in  only  one
// call of this macro.  Hence the code to make the check is not
// needed in most cases.
// 3.  DESCR1 and DESCR2 are often the same.
// 4.  See also SUBTRT.
sil.SUM = function ( $DESCR1, $DESCR2, $DESCR3, FLOC, SLOC ) {
    // sum addresses
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        DESCR3 = this.d( $DESCR3 );

    // XXX: Should F and V be set regardless of A+I overflows?
    DESCR1.flags = DESCR2.flags;
    DESCR1.value = DESCR2.value;
    if ( !SNOBOL.isInt32( DESCR2.addr + DESCR3.addr ) ) {
        return this.jmp( FLOC );
    }
    DESCR1.addr = DESCR2.addr + DESCR3.addr;
    return this.jmp( SLOC );
};

//     TESTF is used to test a flag field for the presence  of
// a flag.  If F contains FLAG, transfer is to SLOC.  Otherwise
// transfer is to FLOC.
//      Data Input to TESTF:
//               +-------+-------+-------+
//      DESCR    |           F           |
//               +-----------------------+
// Programming Notes:
// 1.  See also TESTFI.
sil.TESTF = function ( $DESCR, FLAG, FLOC, SLOC ) {
    // test flag
    var DESCR = this.d( $DESCR );

    if ( DESCR.flags & FLAG ) {
        this.jmp( SLOC );
    } else {
        this.jmp( FLOC );
    }
};

//     TESTFI is used to test  an  indirectly  specified  flag
// field  for  the  presence  of  a  flag.  If F contains FLAG,
// transfer is to SLOC.  Otherwise transfer is to FLOC.
//      Data Input to TESTFI:
//               +-------+-------+-------+
//      DESCR    |   A                   |
//               +-----------------------+
//               +-------+-------+-------+
//      A        |           F           |
//               +-----------------------+
// Programming Notes:
// 1.  See also TESTF.
sil.TESTFI = function ( $DESCR, FLAG, FLOC, SLOC ) {
    // test flag indirect
    var DESCR = this.d( $DESCR );
    sil.TESTF.call( this, DESCR.addr, FLAG, FLOC, SLOC );
};

//     TITLE is used at assembly time to  title  the  assembly
// listing  of  the  SNOBOL4 system.  TITLE should cause a page
// eject and title subsequent pages with C1...CN.
// Programming Notes:
// 1.  TITLE need not be implemented as such.   It  may  simply
// perform no operation.
sil.TITLE = function ( MSG ) {
    // title assembly listing
    if ( titles.includes( MSG ) ) {
        throw new Error( "Program loop detected." );
    }
    titles.push( MSG );
    if ( SNOBOL.DEBUG ) console.log( MSG );
};

sil.DBG = sil.TITLE; // nonstandard ;)

//     TOP  is  used  to get to the top of a block of descrip-
// tors.  Descriptors at A, A-D,...,A-(N*D) are  examined  suc-
// cessively for the first descriptor whose flag field contains
// the flag TTL.  Data is altered as indicated,  where  F3N  is
// the first field to contain TTL.
//      Data Input to TOP:
//               +-------+-------+-------+
//      DESCR3   |   A       F       V   |
//               +-----------------------+
//               +-------+-------+-------+
//      A-(N*D)  |          F3N          |
//               +-----------------------+
//                          .
//                          .
//                          .
//               +-------+-------+-------+
//      A-D      |          F31          |
//               +-----------------------+
//               +-------+-------+-------+
//      A        |          F30          |
//               +-----------------------+
//      Data Altered by TOP:
//               +---------+-------+-------+
//      DESCR1   | A-(N*D)     F       V   |
//               +-------------------------+
//               +-------+-------+-------+
//      DESCR2   |  N*D      0       0   |
//               +-----------------------+
// Programming Notes:
// 1.  N may be 0.  That is, F30 may contain TTL.
sil.TOP = function ( $DESCR1, $DESCR2, $DESCR3 ) {
    // get to top of block
    var TTL = this.resolve( 'TTL' ),
        DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        DESCR3 = this.d( $DESCR3 ),
        A = DESCR3.addr,
        DESCR_indirect,
        N;

    for ( N = 0; ; N++ ) {
        if ( ( A - ( N * D ) ) < 0 ) {
            throw new RangeError();
        }
        DESCR_indirect = this.d( A - ( N * D ) );
        if ( DESCR_indirect.flags & TTL ) {
            break;
        }
    }

    DESCR1.addr  = A - ( N * D );
    DESCR1.flags = DESCR3.flags;
    DESCR1.value = DESCR3.value;

    DESCR2.addr  = N * D,
    DESCR2.flags = 0;
    DESCR2.value = 0;
};

//     TRIMSP  is  used to obtain a specifier to the part of a
// specified string up to a trailing string of blanks.
//      Data Input to TRIMSP:
//               +-------+-------+-------+-------+-------+
//      SPEC2    |   A       F       V       O       L   |
//               +---------------------------------------+
//               +------+-----+-----+------+------+----+
//      A+O      | C1    ...    CJ    CJ+1   ...   CL  |
//               +-------------------------------------+
//      Data Altered by TRIMSP:
//               +-------+-------+-------+-------+-------+
//      SPEC1    |   A       F       V       O       J   |
//               +---------------------------------------+
// Programming Notes:
// 1.  If CL is not blank, J = L.
// 2.  If L = 0, TRIMSP is equivalent to SETSP.
sil.TRIMSP = function ( $SPEC1, $SPEC2 ) {
    // trim blanks from specifier
    var SPEC1 = this.s( $SPEC1 ),
        SPEC2 = this.s( $SPEC2 );

    SPEC1.read( SPEC2 );
    while ( /[\u0020\u0000]$/.test( SPEC1.specified ) ) {
        SPEC1.length--;
    }
};

//     UNLOAD is used to unload an external function.  C1...CL
// represents  the name of the function that is to be unloaded.
//      Data Input to UNLOAD:
//               +-------+-------+-------+-------+-------+
//      SPEC     |   A                       O       L   |
//               +---------------------------------------+
//               +-------+-------+-------+
//      A+O      |  C1      ...     CL   |
//               +-----------------------+
// Programming Notes:
// 1.  UNLOAD is a system-dependent operation.
// 2.  UNLOAD need not be implemented as such.  If it  is  not,
// it  should  perform  no operation, since the SNOBOL function
// UNLOAD, which uses the macro UNLOAD,  has  a  valid  use  in
// undefining existing, but non-external, functions.
// 3.  UNLOAD  should do nothing if the function C1...CL is not
// a LOADed function.
// 4.  See also LOAD and LINK.
sil.UNLOAD = function ( $SPEC ) {
    // unload external function
};

//     VARID is used to compute  two  variable  identification
// numbers from a specified string.  K and M are computed by
//      K = F1(C1...CL)
//      M = F2(C1...CL)
// where  F1  and F2 are two (different) functions that compute
// pseudo-random numbers from the characters C1...CL.  The num-
// bers computed should be in the ranges
//      0 <= K <= (OBSIZ-1)*D
//      0 <= M <= SIZLIM
// where  OBSIZ  is  a  program  symbol  defining the number of
// chains in variable storage and SIZLIM is  a  program  symbol
// defining the largest integer that can be stored in the value
// field of a descriptor.
//      Data Input to VARID:
//               +-------+-------+-------+-------+-------+
//      SPEC     |   A                       O       L   |
//               +---------------------------------------+
//               +-------+-------+-------+
//      A+O      |  C1      ...     CL   |
//               +-----------------------+
//
//      Data Altered by VARID:
//               +-------+-------+-------+
//      DESCR    |   K               M   |
//               +-----------------------+
//
// Programming Notes:
// 1.  K is used to select one of a number of chains in variable
// storage. The K are address offsets that must fall on
// descriptor boundaries.
// 2.  M is used to order variables (string structures) within a
// chain. See ORDVST.
// 3.  The values of K and M should have as little correlation
// as possible with the characters C1...CL, since the
// "randomness" of the results determines the efficiency of
// variable access.
// 4.  One simple algorithm consists of multiplying the first
// part of C1...CL by the last part, and separating the central
// portion of the result into K and M.
// 5. L is always greater than zero.
sil.VARID = function ( $DESCR, $SPEC ) {
    // compute variable identification numbers
    var DESCR = this.d( $DESCR ),
        SPEC = this.s( $SPEC ),
        str = SPEC.specified,

        K_MAX = ( this.$( 'OBSIZ' ) - 1 ) * D,
        K_HASH = SNOBOL.str.hash( 'K' + str ),
        K = Math.abs( K_HASH % ( K_MAX + 1 ) ),

        M_HASH = SNOBOL.str.hash( 'M' + str ),
        M = Math.abs( M_HASH % ( this.$( 'SIZLIM' ) + 1 ) );

    DESCR.addr  = K;
    DESCR.value = M;
};

//     VCMPIC  is  used  to  compare a value field, indirectly
// specified with an offset constant, with another value field.
// V1  and V2 are considered as unsigned integers.  If V1 > V2,
// transfer is to GTLOC.  If V1 = V2, transfer is to EQLOC.  If
// V1 < V2, transfer is to LTLOC.
//      Data Input to VCMPIC:
//               +-------+-------+-------+
//      DESCR1   |  A1                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR2   |                  V2   |
//               +-----------------------+
//               +-------+-------+-------+
//      A1+N     |                  V1   |
//               +-----------------------+
sil.VCMPIC = function ( $DESCR1, N, $DESCR2, GTLOC, EQLOC, LTLOC ) {
    // value field compare indirect with offset
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        A1 = DESCR1.addr,
        V2 = DESCR2.value,
        A1_N = this.d( A1 + N ),
        V1 = A1_N.value;

    if ( V1 > V2 ) {
        this.jmp( GTLOC );
    } else if ( V1 < V2 ) {
        this.jmp( LTLOC );
    } else {
        this.jmp( EQLOC );
    }
};

//     VEQL  is  used  to  compare  the  value  fields  of two
// descriptors.  V1 and V2 are considered as unsigned integers.
// If  V1 = V2, transfer is to EQLOC.  Otherwise transfer is to
// NELOC.
//      Data Input to VEQL:
//               +-------+-------+-------+
//      DESCR1   |                  V1   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR2   |                  V2   |
//               +-----------------------+
// Programming Notes:
// 1.  See also AEQL and VEQLC.
sil.VEQL = function ( $DESCR1, $DESCR2, NELOC, EQLOC ) {
    // value fields equal test
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 );

    if ( DESCR1.value === DESCR2.value ) {
        this.jmp( EQLOC );
    } else {
        this.jmp( NELOC );
    }
};

//     VEQLC is used to compare the value field of a  descrip-
// tor  to a constant.  V is considered as an unsigned integer.
// If V = N, transfer is to EQLOC.  Otherwise  transfer  is  to
// NELOC.
//      Data Input to VEQLC:
//               +-------+-------+-------+
//      DESCR    |                   V   |
//               +-----------------------+
// Programming Notes:
// 1.  N is never negative.
// 2.  See also AEQLC and VEQL.
sil.VEQLC = function ( $DESCR, N, NELOC, EQLOC ) {
    // value field equal to constant test
    var DESCR = this.d( $DESCR );

    assert( N >= 0 );
    this.jmp( DESCR.value === N ? EQLOC : NELOC );
};

//     ZERBLK is used to zero a block of I+1 descriptors.
//      Data Input to ZERBLK:
//               +-------+-------+-------+
//      DESCR1   |   A                   |
//               +-----------------------+
//               +-------+-------+-------+
//      DESCR2   |  D*I                  |
//               +-----------------------+
//      Data Altered by ZERBLK:
//               +-------+-------+-------+
//      A        |   0       0       0   |
//               +-----------------------+
//                          .
//                          .
//                          .
//               +-------+-------+-------+
//      A+( D*I)  |   0       0       0   |
//               +-----------------------+
// Programming Notes:
// 1.  I is always positive.
sil.ZERBLK = function ( $DESCR1, $DESCR2 ) {
    // zero block
    var DESCR1 = this.d( $DESCR1 ),
        DESCR2 = this.d( $DESCR2 ),
        ptr = DESCR1.addr,
        last = DESCR1.addr + DESCR2.addr;

    for ( var ptr = DESCR1.addr; ptr <= DESCR1.addr + DESCR2.addr; ptr += D ) {
        this.d( ptr ).update( 0, 0, 0 );
    }
};

SNOBOL.sil = sil;
