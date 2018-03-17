const Utils = require( '../app/utils.js' );

const baseURL = "http://localhost:3000/";

describe( "Utils Class", function() {

    it( "object instantiated successfully", function(done) {
        const utils = new Utils( baseURL );
        expect( utils ).toBeDefined();
        done();
    });

    it( "return URL for slug successfully", function(done) {
        const utils = new Utils( baseURL );
        expect( utils.urlForSlug( "test" ) ).toBe( "http://localhost:3000/posts/test");
        done();
    });

    it( "returns URL for list of posts successfully", function(done) {
        const utils = new Utils( baseURL );
        expect( utils.urlForAllPosts( ) ).toBe( "http://localhost:3000/posts/" );
        done();
    });
});