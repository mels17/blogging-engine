// bloggingEngineServer.js

// SETUP
// ========================================================================================

// set our port
var port = process.env.PORT || 8080;

// import the packages we want
var express = require( 'express' );
// define app
var app = express( );
var bodyParser = require( 'body-parser' );

const Utils = require('../utils');
utils = new Utils(`http://localhost:${port}`);

const BlogRepo = require( './blogRepo.js' );
db = new BlogRepo();


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
    db.deleteAllPosts();
    res.status( 204 ).end();
});

// ROUTE FOR GET
// ==========================================================================================
// router.get( '/:slug', function( req, res, next ) {
//     const post = posts[req.params.slug];
// 	if ( post ) {
// 		res.status( 200 );
// 		res.contentType('application/json').json( post );
// 	} else {
// 		res.status( 404 );
// 		res.contentType('application/json').json( { message: "URL not found."} );
// 	}
// });

router.get( '/:slug', function( req, res, next ) {
    let post = db.getBlogPost( req.params.slug );
	if ( post ) {
		res.status( 200 );
		res.contentType('application/json').json( post );
	} else {
		res.status( 404 );
		res.contentType('application/json').json( { message: "URL not found."} );
	}
});

// HASHMAP
// router.get( '', function( req, res, next ) {
// 	res.status( 200 );
// 	res.contentType('application/json').json( Object.keys(posts).map(slug => utils.urlForSlug(slug)) );
// });



// DATABASE
router.get( '', function( req, res, next ) {
    res.status( 200 );
    res.contentType('application/json').json( db.getAllBlogSlugs());
});

function isInvalid( blog ) {
    let invalidSlug = blog.slug == undefined || blog.slug == null;
    let invalidTitle = blog.title == undefined || blog.title == null;
    let invalidBody = blog.bodyTxt == undefined || blog.bodyTxt == null;
    let invalidReq = blog == undefined || blog == null;

    return invalidReq || invalidSlug || invalidBody || invalidTitle;
}
// ROUTE FOR POST - The following code is for adding a post to the list of posts when the body
//                  of the request has an object containing a title, body and slug.
// This method is when the list of posts is a hashmap.
// ==========================================================================================
// router.post( '', function( req, res ) {
//     console.log("Entered post.");
//
//     if ( isInvalid( req.body ) ) {
//         res.status( 400 );
//         res.contentType( 'application/json' ).json( { message: "Invalid params." } );
//     } else {
//         if (posts[req.body.slug]) {
//             res.status( 400 );
//             res.contentType('application/json').json( "Duplicate post." );
//         } else {
//             posts[req.body.slug] = req.body;
//             res.status( 201 );
//             res.contentType('application/json').json( "Post added at " + "/" + req.body.slug );
//         }
//     }
// });


// ROUTE FOR POST - The following code is for adding a post to the list of posts when the body
//                  of the request has an object containing a title, body and slug.
// This method is when the list of posts is a database.
// ==========================================================================================
router.post( '', function( req, res ) {
    console.log("Entered post.");

    if ( isInvalid( req.body ) ) {
        res.status( 400 );
        res.contentType( 'application/json' ).json( { message: "Invalid params." } );
    } else {
        if ( !db.addBlogPost( req.body ) ) {
            res.status( 400 );
            res.contentType('application/json').json( "Duplicate post." );
        } else {
            res.status( 201 );
            res.contentType('application/json').json( "Post added at " + "/" + req.body.slug );
        }
    }
});





// ROUTE FOR DELETE - The following code is for deleting a post with just the slug as input.
// ==========================================================================================
// router.delete( '/:slug', function( req, res ) {
//     const post = posts[req.params.slug];
//     if (post) {
//         delete posts[req.params.slug];
//         res.status(204).end();
//     } else {
//         res.status(404).end();
//     }
// });

// ROUTE FOR DELETE - The following code is for deleting a post with just the slug as input.
// DATABASE
// ==========================================================================================
router.delete( '/:slug', function( req, res ) {
    if ( db.deleteBlogPost( slug ) ) {
        res.status(204).end();
    } else {
        res.status(404).end();
    }
});

// ROUTE FOR PUT - The following code is for updating a post with title, body and slug as
// input.
// ==========================================================================================
// router.put( '/:slug', function( req, res ) {
//     delete posts[ req.params.slug ];
//     posts[ req.body.slug ] = req.body;
//
//     // postsRepository.updatePost(slug).with(req);
//
//     res.status(200).end( );
// });


// ROUTE FOR PUT - The following code is for updating a post with title, body and slug as
// input.
// DATABASE
// ==========================================================================================
router.put( '/:slug', function( req, res ) {
    db.updateBlogPost( req.body, slug );
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