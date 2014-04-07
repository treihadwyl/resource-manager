



/**
 * Note that testing does not currently work as these tests need to be stubbed
 * out to run in a browser environment
 */


var window = {};

var should = require( 'chai' ).should(),

    rm = require( '../main' );

suite.skip( 'Testing getting atlas data: ', function() {

    test( 'expects getOptions to return an object', function() {

        rm.getOptions().should.be.a( 'object' );

    });



});
