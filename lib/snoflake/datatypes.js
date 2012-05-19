// SIL Virtual Machine
// (C) Copyright 2012 by Ori Livneh

function Descriptor( ptr ) {
    if ( ptr === undefined ) {
        ptr = alloc( this.width );
    } else if ( typeof ptr === 'string' ) {
        ptr = resolve ( ptr );
    }
    Object.defineProperty( this, 'ptr', ptr );
    Object.freeze( this );
}

function Specifier( ptr ) {
    Descriptor.call( this, ptr );
}

var datum = Object.create( {}, {
    
    constructor : { value : Descriptor },
    width       : { value : 3 },

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

datum.eq = function ( other ) {
    if ( !( this.width ) || this.width !== other.width ) {
        return false;
    }
    for ( var i = 0; i < this.width; i++ ) {
        if ( mem[ this.ptr + i ] !== mem[ other.ptr + i ] ) {
            return false;
        }
    }
    return true;
};

datum.next = function () {
    return new this.constructor( this.ptr + this.width );
};

datum.read = function ( src ) {
    for ( var i = 0; i < this.width; i++ ) {
        mem[ this.ptr + i ] = mem[ src.ptr + i ];
    }
};

Descriptor.prototype = datum;

Specifier.prototype = Object.create( datum, {

    constructor: { value: Specifier },
    width:       { value: 6 },

    offset: {
        enumerable: true,
        get: function ()  { return getUint( this.ptr + 3 ); },
        set: function ( n ) { setUint( this.ptr + 3, n ); }
    },

    length: {
        enumerable: true,
        get: function ()  { return getUint( this.ptr + 4 ); },
        set: function ( n ) { setUint( this.ptr + 4, n ); }
    }

} );

function getd( ptr ) {
    return new Descriptor( ptr );
}

function gets( ptr ) {
    return new Specifier( ptr );
}
