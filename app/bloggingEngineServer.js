// bloggingEngineServer.js

// SETUP
// ========================================================================================

// import the packages we want
var express = require( 'express' );
// define app
var app = express( );
var bodyParser = require( 'body-parser' );

// configure app to use bodyParser( )
// this will let us get the data from a POST
app.use( bodyParser.urlencoded({extended: true}));
app.use( bodyParser.json( ) );

// set our port
var port = process.env.PORT || 8080;

// API ROUTES
// ========================================================================================
// get an instance of the express router
var router = express.Router( );

var file = require( "./seedPosts.json" );


var url = "http://localhost:8080/posts/"
var listOfPosts = [];
var partial_url = [];
for ( var i = 0; i <= Object.keys( file ).length; i++ ) {
	listOfPosts[ i ] = url + (file.posts[ i ]).slug;
	partial_url[ i ] = ( file.posts[ i ] ).slug;
}

// app.post( '/addPost', function( req, res, next ) {
// 	res.setHeader( 'Content-Type', 'application/json' );
// 	res.status( 201 );
// 	res.send( { error: "iINT"});
// });
//var new_posts = [];

router.get( '/:id', function( req, res, next ) {
	var index = partial_url.indexOf( req.params.id );
	if ( index != -1 ) {
		res.status( 200 )
		res.contentType('application/json').json( file.posts[ index ] );
	} else {
		res.status( 404 );
		res.contentType('application/json').json( { message: "URL not found."} );
	}
	next( );
});

router.get( '', function( req, res, next ) {
	res.status( 200 );
	res.contentType('application/json').json( listOfPosts );
});

router.route( '/addPost' ).post( function( req, res ) {
		console.log("Entered post.");
		var invalidSlug = req.body.slug == undefined || req.body.slug == null;
		var invalidReq = req.body == undefined || req.body == null;
		if ( invalidReq || invalidSlug ) {
			res.status( 404 );
			res.contentType( 'application/json' ).json( { message: "Invalid params." } );
		} else {
				var index = partial_url.indexOf( req.body.slug );
				if ( index != -1 ){
					res.status( 201 );
					res.contentType('application/json').json( "Duplicate post." );			
				} else {
					(file.posts).push( req.body );
					listOfPosts.push ( url + req.body.slug );
					partial_url.push( req.body.slug );
					res.status( 201 );
					res.contentType('application/json').json( "Post added at " + "/"+req.body.slug );
				}	
		}
	});

// ROUTE REGISTRATION ----------------------------------------------------------------------
// all of our routes will be prefixed with /api
app.use( '/posts', router );

// START THE SERVER
// =========================================================================================
app.listen( port );
console.log( "Server running ..." );
console.log( "Port number:" + port );