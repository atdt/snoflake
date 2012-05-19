// SIL Virtual Machine
// (C) Copyright 2012 by Ori Livneh

/*jslint white:true, vars:true, plusplus:true, forin:true */
/*globals ArrayBuffer, Float32Array, Int32Array, Uint32Array */

"use strict";

var STACKSIZE = 1024;

var Snoflake = require( './base' );

function Descriptor( ptr ) {
    if ( ptr === undefined ) {
        ptr = alloc( this.width );
    }
    Object.defineProperty( this, 'ptr', ptr );
    Object.freeze( this );
}

function Specifier( ptr ) {
    Descriptor.call( this, ptr );
}

Descriptor.prototype = Object.create( null, {
    
    constructor : { value: Descriptor },
    width       : { value: 3 },
    
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

function getd( ptr ) {
    if ( typeof ptr === 'string' ) {
        ptr = self.resolve( ptr );
    }
    return new Descriptor( ptr );
}

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
