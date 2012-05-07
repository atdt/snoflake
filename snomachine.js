// SIL Virtual Machine
// (C) Copyright 2012 by Ori Livneh

/*jslint white:true, vars:true, plusplus:true */
/*globals ArrayBuffer, Float32Array, Int32Array, Uint32Array */

"use strict";

var parser = require( './sil.peg.js' ),
    loader = parser.compile( 'sum.sil' ),
    sil    = require('./dummy.sil.js' );

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
        if ( typeof identifier === 'number' ) {
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

    var self  = this,
        data  = new Memory(),
        stack = loader( data.resolve, sil ),
        ip    = 0;

    function evaluate( deferred ) {
        return deferred.call( self );
    }

    function exec( label, op, deferred_operands ) {
        var operands = evaluate( deferred_operands ),
            returned = op.apply( self, operands );

        if ( label !== null ) {
            if ( returned !== undefined ) {
                data.assign( label, returned );
            } else {
                data.assign( label, ip );
            }
        }
    }

    self.jump = function ( loc ) {
        if ( loc !== undefined ) {
            ip = data.resolve( loc ) - 1;
        }
    };

    self.run = function () {
        var end = stack.length;

        console.log(' --- PROGRAM START --- ');
        for ( ip = 0; ip !== end; ip++ ) {
            exec.apply( null, stack[ ip ] );
        }
        console.log(' ---  PROGRAM END  --- ');
    };
}

var snobol = new SnoMachine();

snobol.run();
