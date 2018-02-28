var request = require("request");
var bloggingEngine = require( "../app/bloggingEngineServer.js" );
var invalidBaseUrl = "http://localhost:8080/posts/abcd"
var baseURL = "http://localhost:8080/"
var postListURL = baseURL + "posts";
var postOneURL = baseURL + "posts/postone";
var postTwoURL = baseURL + "posts/posttwo";
var postThreeURL = baseURL + "posts/postthree";
var postFourURL = baseURL + "posts/postfour";
var posts_obj = require( "../app/seedPosts.json" );
var err_obj = { message: "URL not found."};
var postlist = [ postOneURL, postTwoURL ];
var postListNew = [ postOneURL, postTwoURL, postThreeURL, postFourURL ];
var addPostURL = baseURL + "posts/addPost";

var validParamsOne = { title: "abc", bodyTxt: "def", slug: "postthree" };
var validParamsTwo = { title: "gef", bodyTxt: "hgf", slug: "postfour" };

var invalidParamsOne = { title: "gef", bodyTxt: "def" };
var validParamsThree = { title: "plm", bodyTxt: "ijn", slug: "postfive" };

describe("Blogging Engine Server", function() {
  describe("GET /", function() {
    it("returns status code 404", function(done) {
      request.get(baseURL, function(error, response, body) {
        expect(response.statusCode).toBe(404);
        done();
      });
    });

    it("returns status code 200", function(done) {
      request.get(postListURL, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("returns status code 200", function(done) {
      request.get(postOneURL, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("returns status code 200", function(done) {
      request.get(postTwoURL, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it ( "returns post list", function( done ) {
      request.get(postListURL, function( error, response, body ) {
        expect( body ).toBe( JSON.stringify( postlist ) );
        done( );
      });
    });

    it ( "returns post one", function( done ) {
      request.get( postOneURL, function( error, response, body ) {
        expect( body ).toBe( JSON.stringify( posts_obj.posts[ 0 ] ) );
        done( );
      });
    });

    it ( "returns post two", function( done ) {
      request.get( postTwoURL, function( error, response, body ) {
        expect( body ).toBe( JSON.stringify( posts_obj.posts[ 1 ] ) );
        done( );
      });
    });

    it ( "returns error message", function( done ) {
      request.get( invalidBaseUrl, function( error, response, body ) {
        expect( body ).toBe( JSON.stringify( err_obj ) );
        done( );
      });
    });

    it('should fail on POST', function (done) {
        request.post( postListURL, {json: true, body: {}}, function (error, response) {
            expect(response.statusCode).toEqual(404);
            done();
        });
      });
    });

  describe( "POST /addPost and GET post", function( ) {
    it ( "returns code 201", function( done ) {
      request.post( addPostURL, {json: true, body: validParamsOne}, function (error, response) {
        expect(response.statusCode).toEqual(201);
        done();
      });
    });

    it ( "returns duplicate post string", function( done ) {
      request.post( addPostURL, {json: true, body: validParamsOne}, function (error, response) {
        expect( response.body ).toEqual( "Duplicate post." );
        done();
      });
    });

    it ( "returns post added string", function( done ) {
      request.post( addPostURL, {json: true, body: validParamsTwo}, function (error, response) {
        expect( response.body ).toEqual( "Post added at /postfour" );
        done();
      });
    });

    it ( "returns blog post list for new posts", function( done ) {
      request.get( postListURL, function (error, response, body) {
        expect( response.body ).toBe( JSON.stringify( postListNew ) );
        done();
      });
    });

    it ( "returns blog post", function( done ) {
      request.get( postListURL+"/postthree", function (error, response, body) {
        expect( response.body ).toBe( JSON.stringify( validParamsOne ) );
        done();
      });
    });

    it ( "no slug returns 404", function( done ) {
      request.post( addPostURL, {json: true, body: invalidParamsOne}, function (error, response) {
        expect( response.statusCode ).toEqual( 404 );
        done();
      });
    });

    it ( "returns post added string without title", function( done ) {
      request.post( addPostURL, {json: true, body: validParamsThree}, function (error, response) {
        expect( response.body ).toEqual( "Post added at /postfive" );
        done();
      });
    });
  });
});
