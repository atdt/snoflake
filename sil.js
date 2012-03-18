//
//  sil.js
//  ======
//  A JavaScript implementation of SIL (SNOBOL4 Implementation Language).
//
//  Copyright (C) 2012 Ori Livneh
//  Copyright (C) 2012 Meir Livneh
//

(function () {

    //
    // State
    // =====
    // The heap and the stack are represented as arrays. JavaScript arrays have
    // .push() and .pop() methods so they can be used as LIFO queues.
    //

    var heap = [];
    var stack = [];

    //
    // Misc Helper Functions
    // =====================
    // Not part of SNOBOL / SIL specs but useful for us.
    //

    // If `num` is positive, return 1; if negative, return -1; if zero, zero.
    function signOf(num) {
        return num > 0 ? 1 : num !== 0 ? -1 : 0;
    }

    //
    // Constructors
    // ============
    // Constructors are functions that create new objects. They are invoked
    // using the 'new' keyword. Inside the constructor, 'this' refers to the
    // object being constructed. Constructors automatically return 'this'.
    //

    // Descriptors are used to represent all pointers, integers, and real
    // numbers. A descriptor may be thought of as the basic "word" of SNOBOL4. 
    function Descriptor(address, flag, value) {
        this.address = address;
        this.flag = flag;
        this.value = value;
    }


    // Specifiers are used to refer to character strings. Almost all operations
    // performed on character strings are handled through operations on
    // specifiers.
    function Specifier(address, flag, value, offset, length) {
        this.address = address;
        this.flag = flag;
        this.value = value;
        this.offset = offset;
        this.length = length;
    }


    //
    // SIL Subroutines
    // ===============
    // This is where the actual implementations of SIL happens.
    //

    // ACOMP is used to compare the address fields of two descriptors. The
    // comparison is arithmetic with A1 and A2 being considered as signed
    // integers. If A1 > A2, transfer is to GTLOC. If A1 = A2, transfer is to
    // EQLOC. If A1 < A2, transfer is to LTLOC.

    var ACOMP = function (A, B, GTLOC, EQLOC, LTLOC) {
        switch (signOf(A.address - B.address)) {
        case 0:
            stack.push(EQLOC);
            break;
        case 1:
            stack.push(GTLOC);
            break;
        case -1:
            stack.push(LTLOC);
            break;
        }
    };


    // ACOMPC is used to compare the address field of a descriptor to
    // a constant. The comparison is arithmetic with A being considered as
    // a signed integer. If A > N, transfer is to GTLOC. If A = N, transfer is
    // to EQLOC. If A < N, transfer is to LTLOC.
    var ACOMPC = function (A, N, GTLOC, EQLOC, LTLOC) {
        switch signOf(A.address - N) {
        case 0:
            stack.push(EQLOC);
            break;
        case 1:
            stack.push(GTLOC);
            break;
        case -1:
            stack.push(LTLOC);
            break;
        }
    };


    // ADDLG is used to add an integer to the length of a specifier.
    var ADDLG = function (S, D) {
        S.length += D.value;
    };

    // ADDSIB is used to add a tree node as a sibling to another node.
    var ADDSIB = function (A, B) {
        // TODO
    };

    // ADDSON is used to add a tree node as a son to another node.
    var ADDSON = function (A, B) {
        // TODO
    };

    // ADJUST is used to adjust the address field of a descriptor.
    var ADJUST = function (A, B, C) {
        // TODO
    };

    // ADREAL is used to add two real numbers. If the result is out of the
    // range available for real numbers, transfer is to FLOC. Otherwise
    // transfer is to SLOC.
    var ADREAL = function (A, B, C, FLOC, SLOC) {
        // TODO
    };

    // AEQL is used to compare the address fields of two descriptors. The
    // comparison is arithmetic with A1 and A2 being considered as signed
    // integers: If A1 = A2, transfer is to EQLOC. Otherwise transfer is to
    // NELOC.
    var AEQL = function (A, B, NELOC, EQLOC) {
        stack.push(A.address === B.address ? EQLOC : NELOC);
    }

    // AEQLC is used to compare the address field of a descriptor to
    // a constant. The comparison is arithmetic with A being considered as
    // a signed integer. If A = N, transfer is to EQLOC. Otherwise transfer is
    // to NELOC.
    var AEQLC = function (A, N, NELOC, EQLOC) {
        stack.push(A.address === N ? EQLOC : NELOC);
    }
    
    // AEQLIC is used to compare an indirectly specified address field of
    // a descriptor to a constant. The comparison is arithmetic with A1 being
    // considered as a signed integer. If A2 = N2, transfer is to EQLOC.
    // Otherwise transfer is to NELOC.
    var AEQLIC = function (A, N1, N2, NELOC, EQLOC) {
        // TODO
    };

}());
