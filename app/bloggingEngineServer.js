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

// test route to make sure everything is working( accessed at GET http://localhost:8080/api)
router.get( '/', function( req, res ) {
	res.json( { message: 'Welcome to the Blogging Engine' } );
})


// ROUTE REGISTRATION ----------------------------------------------------------------------
// all of our routes will be prefixed with /api
app.use( '/api', router );

// START THE SERVER
// =========================================================================================
app.listen( port );
console.log( "Server running" );
console.log( "Port number:" + port );