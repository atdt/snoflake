// SIL Virtual Machine
// (C) Copyright 2012 by Ori Livneh

/*jslint white:true, vars:true, plusplus:true, forin:true */
/*globals ArrayBuffer, Float32Array, Int32Array, Uint32Array */

"use strict";

var STACKSIZE = 1024;

var Snoflake = require( './base' );

function TypeValidator() {

    // To test type conformance, we exploit the fact that typed arrays typecast
    // values assigned to them. If a value is not altered by being assigned to
    // a typed array, it is a valid instance of that type.

    var float32a = new Float32Array(1),
        int32a   = new Int32Array(1),
        uint32a  = new Uint32Array(1),
        string   = Snoflake.string,
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
    self.data = data;

    // We store all data as unsigned 32-bit integers and use ES5's ArrayBuffer
    // interface to handle conversion to and from additional datatypes.

    var buffer   = new ArrayBuffer(4),
        float32a = new Float32Array(buffer),
        int32a   = new Int32Array(buffer),
        uint32a  = new Uint32Array(buffer),
        abs      = Math.abs;

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

        if ( abs(float32a[0] - value) > 1 ) {
            throw new RangeError( 'Invalid real ' + value );
        }
        data[ ptr ] = uint32a[0];
    }

    
    function Descriptor( ptr ) {
        Object.defineProperty( this, 'ptr', { value: ptr } );
        Object.seal( this );
    }

    Descriptor.prototype = Object.create( null, {

        constructor: { value: Descriptor },
        width:       { value: 3 },
        
        next: {
            value: function () {
                var ptr = this.ptr + this.width;
                return new this.constructor( ptr );
            }
        },
        copyTo: {
            value: function ( obj ) {
                var attr;
                for ( attr in this ) {
                    if ( attr !== 'ptr' ) {
                        obj[ attr ] = this[ attr ];
                    }
                }
            }
        },
        eq: {
            value: function ( other ) {
                var attr;
                for ( attr in this ) {
                    if ( attr !== 'ptr' && this[ attr ] !== other[ attr ] ) {
                        return false;
                    }
                }
                return true;
            }
        },

        addr: {
            enumerable: true,
            get: function () { return getInt( this.ptr ); },
            set: function ( n ) { setInt( this.ptr, n ); }
        },
        raddr: {
            enumerable: true,
            get: function () { return getReal( this.ptr ); },
            set: function ( n ) { setReal( this.ptr, n ); }
        },
        flags: {
            enumerable: true,
            get: function () { return getUint( this.ptr + 1 ); },
            set: function ( n ) { setUint( this.ptr + 1, n ); }
        },
        value: {
            enumerable: true,
            get: function () { return getUint( this.ptr + 2 ); },
            set: function ( n ) { setUint( this.ptr + 2, n ); }
        }
    } );

    function Specifier( ptr ) {
        Descriptor.call( this, ptr );
    }

    Specifier.prototype = Object.create( Descriptor.prototype, {

        constructor: { value: Specifier },
        width:       { value: 6 },

        offset: {
            enumerable: true,
            get: function ()  { return getUint( this.ptr + 3); },
            set: function ( n ) { setUint( this.ptr + 3, n ); }
        },
        length: {
            enumerable: true,
            get: function ()  { return getUint( this.ptr + 4); },
            set: function ( n ) { setUint( this.ptr + 4, n ); }
        }
    } );

    // Allocate and zero-fill `size` words
    self.alloc = function ( size ) {
        var ptr = data.length;
        while ( size-- ) {
            data.push(0);
        }
        return ptr;
    };

    self.resolve = function ( key ) {
        if ( typeof key === 'number' ) {
            return key;
        }

        var ptr = symbols[ key ];

        if ( ptr === undefined ) {
            throw new ReferenceError( key );
        }
        return ptr;
    };

    self.assign = function ( assignee, value ) {
        var key;

        if ( typeof assignee !== 'object' ) {
            symbols[ assignee ] = value.ptr || value;
        } else {
            for ( key in assignee ) {
                value = assignee[ key ];
                symbols[ key ] = value.ptr || value;
            }
        }
    };

    self.getDescriptor = function ( ptr ) {
        if ( typeof ptr === 'string' ) {
            ptr = self.resolve( ptr );
        }
        return new Descriptor( ptr );
    };

    self.createDescriptor = function ( addr, flags, value ) {
        var desc = new Descriptor( self.alloc(3) );

        desc.addr  = addr || 0;
        desc.flags = flags || 0;
        desc.value = value || 0;

        return desc;
    };

    self.getSpecifier = function ( ptr ) {
        if ( typeof ptr === 'string' ) {
            ptr = self.resolve( ptr );
        }
        return new Specifier( ptr );
    };

    self.createSpecifier = function ( addr, flags, value, offset, length ) {
        var spec = new Specifier( self.alloc(6) );

        spec.addr  = addr || 0;
        spec.flags = flags || 0;
        spec.value = value || 0;
        spec.offset = offset || 0;
        spec.length = length || 0;
    };

    self.puts = function ( s ) {
        var ptr = data.length;
        data.push( string.encode( s ) );
        return ptr;
    };

    self.gets = function ( start, stop ) {
        var encoded = data.slice( start, stop );
        return string.decode( encoded );
    };

    self.alloc(STACKSIZE * 3);

    Object.freeze( self );
}

Snoflake.Runtime = function ( sil, loader ) {

    var self = this,
        data = new Memory(),
        callstack = loader( data.resolve, sil ),
        ip = 0;

    self.data = data;
    self.stack = [];

    // Shortcuts
    self.getd = self.data.getDescriptor;
    self.gets = self.data.getSpecifier;

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
        var end = callstack.length;

        console.log(' --- PROGRAM START --- ');
        for ( ip = 0; ip !== end; ip++ ) {
            exec.apply( null, callstack[ ip ] );
        }
        console.log(' ---  PROGRAM END  --- ');
    };
}

/*
if ( require.main === module ) {
    var parser = require( './parser.js' ),
        loader = parser.compile( '../test/dummy/sum.sil' ),
        sil    = require( '../test/dummy/sil.js' ),
        snobol = new Runtime( sil, loader );
    snobol.run();
}
*/
// var str = require( './string.js' );
