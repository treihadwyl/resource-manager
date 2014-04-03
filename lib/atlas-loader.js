/**
 * Responsible for loading texture atlases from a json file describing the atlas
 * Copyright © 2014 Matt Styles <matt@veryfizzyjelly.com>
 * Licensed under the ISC license
 * ---
 *
 * Wraps PIXI.JsonLoader into a promise
 */



var Promise = require( 'es6-promise' ).Promise,

    atlas = require( './atlas-loader' );



module.exports = {


    get: function( filename ) {
        var loader = new PIXI.JsonLoader( filename );

        return new Promise( function( resolve, reject ) {

            loader.on( 'loaded', function( event ) {
                resolve( event );
            });

            loader.on( 'error', function( err ) {
                reject( err );
            });

            loader.load();

        });
    }

}
