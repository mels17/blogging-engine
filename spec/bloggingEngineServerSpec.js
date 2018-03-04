var request = require("request");
var bloggingEngine = require( "../app/bloggingEngineServer.js" );
const Utils = require('../app/utils');
var baseURL = "http://localhost:8080";
utils = new Utils(baseURL);


describe("Blogging Engine Server", function() {

    beforeEach( function( done ){
        request.delete( utils.urlForAllPosts( ), done );
    });

  describe("GET /posts", function() {
      beforeEach( function( done ){
          request.post( utils.urlForAllPosts( ), {json:true, body:{ title:"abc", bodyTxt:"def", slug:"plm"}}, done);
      });
      it("returns status code 200", function (done) {
          request.get(utils.urlForAllPosts(), function (error, response, body) {
              expect(response.statusCode).toBe(200);
              done();
          });
      });

      it ( "returns post list", function( done ) {
          request.get(utils.urlForAllPosts(), function( error, response, body ) {
              expect( body ).toBe( JSON.stringify( [ utils.urlForSlug("plm")] ) );
              done( );
          });
      });
  });

  describe("GET /posts/:slug", function () {
      beforeEach( function( done ){
          request.post( utils.urlForAllPosts( ), {json:true, body:{ title:"abc", bodyTxt:"def", slug:"plm"}}, done);
      });
      describe("successfully getting a post", function () {

          it("returns status code 200", function (done) {
              request.get(utils.urlForSlug("plm"), function (error, response, body) {
                  expect(response.statusCode).toBe(200);
                  done();
              });
          });

          it("returns post one", function (done) {
              request.get(utils.urlForSlug("plm"), function (error, response, body) {
                  expect(body).toBe(JSON.stringify( {title:"abc", bodyTxt:"def", slug:"plm"}));
                  done();
              });
          });

      });

      describe("getting a post that does not exist", function () {
          it("returns error message", function (done) {
              request.get(utils.urlForSlug("abcd"), function (error, response, body) {
                  expect(body).toBe(JSON.stringify( { message: "URL not found."} ));
                  done();
              });
          });
      });
  });

  describe( "POST /posts", function( ) {
      describe( "Successfully add a post", function( ){
          it ( "returns code 201", function( done ) {
              request.post( utils.urlForAllPosts(), {json: true, body: { title:"abc", bodyTxt:"def", slug:"plm"}}, function (error, response) {
                  expect(response.statusCode).toEqual(201);
                  done();
              });
          });

          it ( "returns post added string", function( done ) {
              request.post( utils.urlForAllPosts(), {json: true, body: { title:"abc", bodyTxt:"def", slug:"plm"}}, function (error, response) {
                  expect( response.body ).toEqual( "Post added at /plm" );
                  done();
              });
          });

          describe( "After adding a post", function( ){

              beforeEach( function( done ){
                  request.post( utils.urlForAllPosts( ), {json:true, body:{ title:"abc", bodyTxt:"def", slug:"plm"}}, done);
              });

              it ( "Post can be retrieved", function( done ) {
                  request.get( utils.urlForSlug("plm"), function (error, response, body) {
                      expect( response.body ).toBe( JSON.stringify( { title:"abc", bodyTxt:"def", slug:"plm"} ) );
                      done();
                  });
              });

              it ( "New post gets added to the list of posts", function( done ) {
                  request.get( utils.urlForAllPosts(), function (error, response, body) {
                      expect( response.body ).toBe( JSON.stringify( [utils.urlForSlug("plm")] ) );
                      done();
                  });
              });
          });

      });


      describe( "Post that already exists", function( ){
          beforeEach( function( done ){
              request.put( utils.urlForSlug("plm"), {json: true, body:{ title:"abc", bodyTxt:"defyhb", slug:"ijn"}}, done );
          });
          it ( "returns duplicate post string", function( done ) {
              request.post( utils.urlForAllPosts(), {json: true, body: { title:"abc", bodyTxt:"defyhb", slug:"ijn"}}, function (error, response) {
                  expect( response.body ).toEqual( "Duplicate post." );
                  done();
              });
          });
      });

      describe( "Invalid requests", function( ) {
          it ( "no slug returns 400", function( done ) {
              request.post( utils.urlForAllPosts(), {json: true, body: { title:"abc", bodyTxt:"defyhb"}}, function (error, response) {
                  expect( response.statusCode ).toEqual( 400 );
                  done();
              });
          });

          it ( "returns invalid param for missing title", function( done ) {
              request.post( utils.urlForAllPosts(), {json: true, body: {bodyTxt:"defyhb", slug:"ijn"}}, function (error, response) {
                  expect( response.body ).toEqual( { message: "Invalid params." } );
                  done();
              });
          });

          it ( "returns invalid param for missing body", function( done ) {
              request.post( utils.urlForAllPosts(), {json: true, body: { title:"abc", slug:"ijn"}}, function (error, response) {
                  expect( response.body ).toEqual( { message: "Invalid params." } );
                  done();
              });
          });
      });


  });

    describe( `DELETE /posts/:slug`, function( ){

      var slug;

      beforeEach(function (done) {
          slug = Math.random().toString();
          var body = {
              slug,
                title: 'Some title',
              bodyTxt: 'Some body'
          };
         request.post(utils.urlForAllPosts(), {json: true, body}, function (error, response) {
             if (error) {
                 fail();
             }
            done();
         });
      });

      it( "returns 204", function ( done ) {
          request.delete( utils.urlForSlug(slug), function ( error, response ) {
              expect( response.statusCode ).toBe( 204 );
              done( );
          });
      });

      it( "deletes the post", function ( done ) {
          request.delete( utils.urlForSlug(slug), function ( error, response ) {
              request.get(utils.urlForSlug(slug), function (errorGet, responseGet) {
                 expect(responseGet.statusCode).toBe(404);
                 done();
              });
          });
      });

      it( "returns invalid param when slug is not passed", function ( done ) {
          request.delete( utils.urlForSlug('nonexistent'), function ( error, response ) {
              expect(response.statusCode).toBe(404);
              done( );
          });
      });
    });





  describe( "PUT /posts/:slug", function( ){
      beforeEach( function( done ){
          request.post( utils.urlForAllPosts( ), {json:true, body:{ title:"abc", bodyTxt:"def", slug:"plm"}}, done);
      });

      describe( "Successfully updating post", function( ){
          it( "returns 200", function ( done ) {
              request.put( utils.urlForSlug("plm"), {json: true, body:{ title:"abc", bodyTxt:"defyhb", slug:"plm"} },
                  function ( error, response, body ) {
                      expect( response.statusCode ).toBe( 200 );
                      done( );
                  });
          });
      });

        describe( "After updating post", function(){

            beforeEach( function( done ){
                request.put( utils.urlForSlug("plm"), {json: true, body:{ title:"abc", bodyTxt:"defyhb", slug:"ijn"}}, done );
            });

            it( "Get the post from the url", function ( done ) {

                request.get( utils.urlForSlug("ijn"), function ( error, response, body ) {
                        expect( response.body ).toBe( JSON.stringify({ title:"abc", bodyTxt:"defyhb", slug:"ijn"}) );
                        done( );
                    });
            });

            it( "Old slug returns 404", function ( done ) {

                request.get( utils.urlForSlug("plm"), function ( error, response, body ) {
                    expect( response.statusCode ).toBe(404);
                    done( );
                });
            });

            it( "Updated post list", function ( done ) {

                request.get( utils.urlForAllPosts(), function ( error, response, body ) {
                    expect( response.body ).toBe(JSON.stringify([utils.urlForSlug("ijn")]));
                    done( );
                });
            });
        });


    });
});
