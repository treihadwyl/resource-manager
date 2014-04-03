/**
 * Responsible for loading texture atlases from a json file describing the atlas
 * Copyright © 2014 Matt Styles <matt@veryfizzyjelly.com>
 * Licensed under the ISC license
 * ---
 *
 * Wraps PIXI.JsonLoader into a promise
 */



var Promise = require( 'es6-promise' ).Promise,
    PIXI = require( 'pixi.js' ),

    atlas = require( './atlas-loader' );



module.exports = {


    get: function( filename ) {
        var loader = new PIXI.JsonLoader( filename );

        return new Promise( function( resolve, reject ) {

            loader.on( 'loaded', function( event ) {
                resolve( event );
            });

            // @todo: jsonloader is broken pixi.js 1.5.2
            // it'll be easier to check in subsequent versions
            loader.on( 'error', function( err ) {
                reject( err );
            });

            loader.load();

        });
    }

};
