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

    /*--------------------------*
     * Members
     *--------------------------*/

    /**
     * The actual cache of results.
     * @type {Array} of {Promises} - resolves with file contents
     */
    cache: [],

    /**
     * Holds pending results.
     * Only one request is made per item, any subsequent requests for an item are
     * stored here and returned when the original request resolves.
     * @type {Array} of {Promises} - resolves with file contents
     */
    pending: [],

    /*--------------------------*
     * Methods
     *--------------------------*/

    /**
     * Stores results (as promises) in the cache.
     * Resolves any pending results.
     * @param filename {String} the ID of the resource.
     * @param file {String} the contents, usually a string.
     */
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

    /**
     * Gets a resource by ID.
     * @param filename {String} ID of resource to get from the cache.
     * @returns {Promise || Null} resolves with file contents.
     */
    get: function( filename ) {
        var item = find( this.cache, { filename: filename } );
        if ( !item ) {
            return false;
        }

        return item.promise.resolve( item.contents );
    },

    /**
     * Returns a result from the pending cache.
     * The returned promise should be resolved elsewhere before returning to the
     * caller (who will be expecting a thenable).
     * @param filename {String} ID.
     * @returns {Promise || null} resolves with file contents.
     */
    getPending: function( filename ) {
        return find( this.pending, { filename: filename } );
    },

    /**
     * Store a pending request as a promise.
     * Pending requests match a currently active request and are resolved when the
     * original request is resolved.
     * @param filename {String} ID.
     * @returns {Promise} this promise is resolvable.
     */
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

    /**
     * Clears the pending cache of items, rejecting each.
     * @param filename {String} ID.
     * @param err {Error} the error that caused the rejection.
     */
    clearPending: function( filename, err ) {
        var items = remove( this.pending, { filename: filename } );
        items.forEach( function( item ) {
            item.promise.reject( err );
        });
    }
};
