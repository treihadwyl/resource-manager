/**
 * Manages the project resources
 * Copyright © 2014 Matt Styles <matt@veryfizzyjelly.com>
 * Licensed under the ISC license
 * ---
 *
 */


var Promise = require( 'es6-promise' ).Promise,
    extend = require( 'lodash-node/modern/objects/assign' ),
    find = require( 'lodash-node/modern/collections/find' ),
    remove = require( 'lodash-node/modern/arrays/remove' ),
    is = require( 'lodash-node/modern/objects' ),

    atlas = require( './atlas-loader' );


module.exports = (function() {

    // @todo extract to its own file, this will also make testing easier
    var cache = {

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


    /**
     * Default options for the resource manager
     */
    var opts = {
        caching: true
    };


    // API
    return {

        //@todo use Object.defineProp?
        setOptions: function( options ) {
            if ( !is.isObject( options ) ) {
                throw new Error( 'Options passed to ResourceManager must be an object' );
            };

            extend( opts, options );
        },

        getOptions: function() {
            return opts;
        },

        /**
         * Get resources
         */
         get: {

            /**
             * Gets the data describing a texture atlas
             * @param filename {String} file to load, expects .json
             * @return {Promise} resolves to texture atlas data
             */
            atlas: function( filename ) {

                if ( opts.caching ) {
                    if ( cache.get( filename ) ) {
                        return cache.get( filename ).contents;
                    };

                    if ( cache.getPending( filename ) ) {
                        return cache.storePending( filename );
                    };

                    cache.storePending( filename );
                }

                return atlas.get( filename )
                    .then( function( file ) {
                        cache.store( filename, file );
                        return file;
                    })
                    .catch( function( err ) {
                        cache.clearPending( filename );
                        console.log( 'error fetching texture atlas', err );
                    });
            }
         }
     }

})();
