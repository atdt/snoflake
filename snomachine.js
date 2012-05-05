// SIL Virtual Machine
// (C) Copyright 2012 by Ori Livneh

/*jslint white:true, vars:true, plusplus:true */
/*jshint plusplus:false, laxbreak: true */
/*globals ArrayBuffer, Float32Array, Int32Array, Uint32Array */

"use strict";

var sil = {
    EQU: function ( val ) {
        return val;
    },
    SUM: function ( a, b ) {
        return a + b;
    },
    LOG: function ( s ) {
        console.log( s );
    }
};

function load( resolve, sil ) {
    var $ = resolve;
    return [
        [ "A",       sil.EQU,    function() { return [ 5 ]; } ],
        [ "B",       sil.EQU,    function() { return [ $("A") + 3 ]; } ],
        [ "RET",     sil.SUM,    function() { return [ $("A"), $("B") ]; } ],
        [ null,      sil.LOG,    function() { return [ $("RET") ]; } ]
    ];
}
/*
var snobol = require('./v311.js'),
    sil = require('./sil.js');
*/


function setter( obj, prop ) {
    return function( n ) {
        obj[ prop ] = n;
    };
}

function TypeValidator() {

    // To test type conformance, we exploit the fact that typed arrays typecast
    // values assigned to them. If a value is not altered by being assigned to
    // a typed array, it is a valid instance of that type.

    var float32a = new Float32Array(1),
        int32a   = new Int32Array(1),
        uint32a  = new Uint32Array(1),
        abs      = Math.abs;

    this.real = function ( n ) {
        float32a[0] = n;
        return abs( float32a[0] - n ) < 1;
    };

    this.int = function ( n ) {
        int32a[0] = n;
        return int32a[0] === n;
    };

    this.uint = function ( n ) {
        uint32a[0] = n;
        return uint32a[0] === n;
    };

    Object.freeze( this );
}

function Memory() {

    var self    = this,
        data    = [],
        symbols = {};

    self.symbols = symbols;

    // We store all data as unsigned 32-bit integers and use ES5's ArrayBuffer
    // interface to handle conversion to and from additional datatypes.

    var buffer   = new ArrayBuffer(4),
        float32a = new Float32Array(buffer),
        int32a   = new Int32Array(buffer),
        uint32a  = new Uint32Array(buffer),
        abs      = Math.abs;

    // Allocate and zero-fill `size` words
    function malloc( size ) {
        var ptr = data.length;
        while ( size-- ) {
            data.push(0);
        }
        return ptr;
    }

    // Unsigned Integers

    function getUint( ptr ) {
        return data[ ptr ];
    }

    function setUint( ptr, value ) {
        uint32a[0] = value;
        if ( uint32a[0] !== value ) {
            throw new RangeError( 'Invalid unsigned integer ' + value );
        }
        data[ ptr ] = uint32a[0];
    }

    // Signed integers

    function getInt( ptr ) {
        uint32a[0] = data[ ptr ];
        return int32a[0];
    }

    function setInt( ptr, value ) {
        int32a[0] = value;
        if ( int32a[0] !== value ) {
            throw new RangeError( 'Invalid integer ' + value );
        }
        data[ ptr ] = uint32a[0];
    }

    // Real numbers (binary32)

    function getReal( ptr ) {
        uint32a[0] = data[ ptr ];
        return float32a[0];
    }

    function setReal( ptr, value ) {
        float32a[0] = value;

        if ( abs( float32a[0] - value ) > 1 ) {
            throw new RangeError( 'Invalid real ' + value );
        }
        data[ptr] = uint32a[0];
    }

    function Descriptor( ptr ) {
        Object.defineProperty( this, 'ptr', { value: ptr } );
        Object.seal( this );
    }

    Descriptor.prototype = Object.create( null, {
        addr: {
            get: function () { return getInt( this.ptr ); },
            set: function ( n ) { setInt( this.ptr, n ); }
        },
        raddr: {
            get: function () { return getReal( this.ptr ); },
            set: function ( n ) { setReal( this.ptr, n ); }
        },
        flags: {
            get: function () { return getUint( this.ptr + 1 ); },
            set: function ( n ) { setUint( this.ptr + 1, n ); }
        },
        value: {
            get: function () { return getUint( this.ptr + 2); },
            set: function ( n ) { setUint( this.ptr + 2, n ); }
        }
    } );

    function Specifier( ptr ) {
        this.ptr = ptr;
        Object.seal( this );
    }

    Specifier.prototype = Object.create( Descriptor.prototype, {
        offset: {
            get: function ()  { return getUint( this.ptr + 3); },
            set: function ( n ) { setUint( this.ptr + 3, n ); }
        },
        length: {
            get: function ()  { return getUint( this.ptr + 4); },
            set: function ( n ) { setUint( this.ptr + 3, 4 ); }
        }
    } );

    self.resolve = function ( identifier ) {
        if ( typeof identifier !== 'string' ) {
            return identifier;
        }

        var ptr = symbols[ identifier ];

        if ( ptr === undefined ) {
            throw new ReferenceError( identifier );
        }
        return ptr;
    };

    self.assign = function ( identifier, value ) {
        symbols[ identifier ] = value.ptr || value;
    };

    self.getDescriptor = function ( ptr ) {
        if ( typeof ptr === 'string' ) {
            ptr = self.resolve( ptr );
        }
        return new Descriptor( ptr );
    };

    self.createDescriptor = function () {
        return new Descriptor( malloc(3) );
    };

    self.getSpecifier = function ( ptr ) {
        if ( typeof ptr === 'string' ) {
            ptr = self.resolve( ptr );
        }
        return new Specifier( ptr );
    };

    self.createSpecifier = function () {
        return new Specifier( malloc(6) );
    };

    Object.freeze( self );
}

module.exports = new Memory();

function SnoMachine() {

    var self   = this,
        data   = new Memory(),
        stack  = load( data.resolve, sil ),
        dest   = '',
        end    = stack.length,
        next   = 0,
        jump   = next,
        labels = {};

    self.return = function ( val ) {
        data.assign( dest, val );
    };

    self.jmp = function ( loc ) {
        next = isNaN( loc )
            ? labels[ loc ]
            : loc;
    };

    self.run = function () {
        console.log(' --- PROGRAM START --- ');
        do {
            execute.apply( next, stack[ next++ ] );
        } while ( next !== end );
        console.log(' ---  PROGRAM END  --- ');
    };

    function execute( label, op, deferred_params ) {
        var here   = this,
            params = deferred_params.call( self ),
            retval = op.apply( self, params );

        if ( label !== null ) {
            labels[ label ] = here;
            data.assign( label, retval );
        }
    }
}

var snobol = new SnoMachine();

snobol.run();
