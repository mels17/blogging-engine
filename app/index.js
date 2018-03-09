const Sequelize = require( 'sequelize' );
const Database = require( './Database');
const App = require( './App');

let connectionString = `postgres://postgres:postgres@localhost:5432/postgres`;
const seq = new Sequelize( connectionString );

const db = new Database( seq );

const app = new App( db );

db.init().then(()=>{
    app.init();
    app.start();
});
