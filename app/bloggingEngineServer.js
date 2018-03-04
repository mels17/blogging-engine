// bloggingEngineServer.js

// SETUP
// ========================================================================================

// set our port
var port = process.env.PORT || 8080;

// Import PostgressSQL
var pg = require( 'pg' );


// import the packages we want
var express = require( 'express' );
// define app
var app = express( );
var bodyParser = require( 'body-parser' );
const Utils = require('./utils');

utils = new Utils(`http://localhost:${port}`);

// configure app to use bodyParser( )
// this will let us get the data from a POST
// app.use(bodyParser.text({
//     type: ['text/plain']
// }));
app.use( bodyParser.json( ) );



// API ROUTES
// ========================================================================================
// get an instance of the express router
var router = express.Router( );

//var seedPosts = require( "./seedPosts.json" ).posts;
var posts = {};
//seedPosts.forEach(seedPost => posts[seedPost.slug] = seedPost);

// ROUTE FOR DELETE ALL
router.delete( '', function( req, res, next ) {
    posts = {};
    res.status( 204 ).end();
});

// ROUTE FOR GET
// ==========================================================================================
router.get( '/:slug', function( req, res, next ) {
    const post = posts[req.params.slug];
	if ( post ) {
		res.status( 200 );
		res.contentType('application/json').json( post );
	} else {
		res.status( 404 );
		res.contentType('application/json').json( { message: "URL not found."} );
	}
});

router.get( '', function( req, res, next ) {
	res.status( 200 );
	res.contentType('application/json').json( Object.keys(posts).map(slug => utils.urlForSlug(slug)) );
});

// ROUTE FOR POST - The following code is for adding a post to the list of posts when the body
//                  of the request has an object containing a title, body and slug.
// ==========================================================================================
router.post( '', function( req, res ) {
		console.log("Entered post.");
		var invalidSlug = req.body.slug == undefined || req.body.slug == null;
        var invalidTitle = req.body.title == undefined || req.body.title == null;
        var invalidBody = req.body.bodyTxt == undefined || req.body.bodyTxt == null;
		var invalidReq = req.body == undefined || req.body == null;
    let validationFailed = invalidReq || invalidSlug || invalidBody || invalidTitle;
    if ( validationFailed ) {
			res.status( 400 );
			res.contentType( 'application/json' ).json( { message: "Invalid params." } );
		} else {
		    if (posts[req.body.slug]) {
                res.status( 400 );
                res.contentType('application/json').json( "Duplicate post." );
            } else {
		        posts[req.body.slug] = req.body;
                res.status( 201 );
                res.contentType('application/json').json( "Post added at " + "/" + req.body.slug );
            }
		}
	});

// ROUTE FOR DELETE - The following code is for deleting a post with just the slug as input.
// ==========================================================================================
// router.delete( '/deletePost', function( req, res ) {
//     console.log( "Delete post." );
//     res.send( "Post deleted successfully." );
//     res.contentType('application/json').json( { message: "Post deleted successfully." } );
// });

// ROUTE FOR PUT - The following code is for updating a post with title, body and slug as
// input.
// ==========================================================================================
router.delete( '/:slug', function( req, res ) {
    const post = posts[req.params.slug];
    if (post) {
        delete posts[req.params.slug];
        res.status(204).end();
    } else {
        res.status(404).end();
    }
});

router.put( '/:slug', function( req, res ) {
    delete posts[ req.params.slug ];
    posts[ req.body.slug ] = req.body;

    // postsRepository.updatePost(slug).with(req);

    res.status(200).end( );
});

// ROUTE REGISTRATION ----------------------------------------------------------------------
// all of our routes will be prefixed with /api
app.use( '/posts', router );

// START THE SERVER
// =========================================================================================
app.listen( port );
console.log( "Server running ..." );
console.log( "Port number:" + port );