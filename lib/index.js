/**
 * Manages the project resources
 * Copyright © 2014 Matt Styles <matt@veryfizzyjelly.com>
 * Licensed under the ISC license
 * ---
 *
 */


var Promise = require( 'es6-promise' ).Promise,
    extend = require( 'lodash-node/modern/objects/assign' ),
    is = require( 'lodash-node/modern/objects' ),
    each = require( 'lodash-node/modern/collections/forEach' ),

    atlas = require( './atlas-loader' ),
    cache = require( './cache' ),
    tm = require( 'texture-manager' );


module.exports = (function() {

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

                function storeTextureFrame( file ) {
                    var frames = file.content.json.frames,
                        meta = file.content.json.meta;

                    each( frames, function( frame, framename ) {

                        tm.save.frame( filename, framename, {
                            offset: {
                                x: frame.offset.x,
                                y: frame.offset.y
                            }
                        });
                    });
                }

                if ( opts.caching ) {
                    if ( cache.get( filename ) ) {
                        return cache.get( filename );
                    };
                }

                return atlas.get( filename )
                    .then( function( file ) {
                        cache.store( filename, file );
                        storeTextureFrame( file );
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
