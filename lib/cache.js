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
        var cached = this.get( filename );
        if ( cached ) {
            console.log( 'returning cached' );
            return cached;
        }

        this.cache.push({
            filename: filename,
            contents: file
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

        return Promise.resolve( item.contents );
    }

};
