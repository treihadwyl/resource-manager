/**
 * Manages the project resources
 * Copyright © 2014 Matt Styles <matt@veryfizzyjelly.com>
 * Licensed under the ISC license
 * ---
 *
 */


var Promise = require( 'es6-promise' ).Promise,

    atlas = require( './atlas-loader' );


module.exports = {

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

            return atlas.get( filename )
        }
     }

};
