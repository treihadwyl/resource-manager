/**
 * Manages the project resources
 * Copyright © 2014 Matt Styles <matt@veryfizzyjelly.com>
 * Licensed under the ISC license
 * ---
 *
 * Handles the cache of results
 */



var find = require( 'lodash-node/modern/collections/find' ),
    remove = require( 'lodash-node/modern/arrays/remove' ),
    Promise = require( 'es6-promise' ).Promise;



module.exports = {

    cache: [],
    pending: [],

    store: function( filename, file ) {

        // Needs to be stored as a promise
        // @todo: tidy and refactor
        var res = null,
            rej = null,
            promise = new Promise( function( resolve, reject ) {
                res = resolve;
                rej = reject;
            });

        this.cache.push({
            filename: filename,
            contents: file,
            promise: {
                resolve: res,
                reject: rej
            }
        });

        // Grab any pending requests and resolve
        remove( this.pending, { filename: filename } ).forEach( function( item ) {
            console.log( 'calling promise resolve:', file, file.content.json.meta.image );
            item.promise.resolve( file );
        });
    },

    get: function( filename ) {
        var item = find( this.cache, { filename: filename } );
        if ( !item ) {
            return false;
        }

        return item.promise.resolve( item.contents );
    },

    getPending: function( filename ) {
        return find( this.pending, { filename: filename } );
    },

    storePending: function( filename ) {

        // @todo refactor/tidy
        var res = null,
            rej = null,
            promise = new Promise( function( resolve, reject ) {
                res = resolve;
                rej = reject;
            });

        this.pending.push({
            filename: filename,
            promise: {
                resolve: res,
                reject: rej
            }
        });

        return promise;
    },

    clearPending: function( filename, err ) {
        var items = remove( this.pending, { filename: filename } );
        items.forEach( function( item ) {
            item.promise.reject( err );
        });
    }
};
