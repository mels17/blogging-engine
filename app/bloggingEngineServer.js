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
	partial_url[ i ] = '/posts/' + (file.posts[ i ]).slug;
}

app.use( function ( req, res, next ) {
	var index = partial_url.indexOf( req.url );
	if ( index != -1 ) {
		res.status( 200 );
		res.contentType( 'application/json' ).json( file.posts[ index ] );
	} else if ( req.url == '/posts' ) {
		res.status( 200 );
		res.contentType('application/json').json( listOfPosts );
	} else {
		  res.status( 404 );

		  // respond with json
		  if ( req.accepts( 'json' ) ) {
		    res.send({ error: 'Not found' });
		    return;
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