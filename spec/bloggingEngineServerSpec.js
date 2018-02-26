var request = require("request");
var bloggingEngine = require( "../app/bloggingEngineServer.js" );
var invalidBaseUrl = "http://localhost:8080/"
var postListURL = invalidBaseUrl + "posts";
var postOneURL = invalidBaseUrl + "posts/postone";
var postTwoURL = invalidBaseUrl + "posts/posttwo";


describe("Blogging Engine Server", function() {
  describe("GET /", function() {
    it("returns status code 404", function(done) {
      request.get(invalidBaseUrl, function(error, response, body) {
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
  });
});
