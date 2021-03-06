const Sequelize = require( 'sequelize' );
const Database = require( './Database.js');
const App = require( './App.js');
const DatabaseInitFactory = require('./DatabaseInitFactory.js');

let connectionString = `postgres://postgres:postgres@localhost:5432/postgres`;
const seq = new Sequelize( connectionString );

const dbInit = new DatabaseInitFactory(seq);

const db = new Database( dbInit );

const app = new App( db );

db.init().then(()=>{
    app.init();
    app.start();
});
