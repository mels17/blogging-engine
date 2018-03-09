let promise = require('bluebird');
let options = {
    // Initialization Options
    promiseLib: promise
};

// Import PostgreSQL promise
let pgp = require('pg-promise')(options);

let port = 8080;

const Utils = require('../utils');

utils = new Utils(`http://localhost:${port}`);

// Default post number for database is 5432
let pgPort = 5432;

// Provide connection
let connectionString = `postgres://blog:password@localhost:${pgPort}/blogPosts`;

// Instantiate client
let db = pgp( connectionString );


class BlogRepo {
    getAllBlogSlugs( ) {
        // Initialise array for slugs
        let slugArray = [];
        db.any( 'SELECT * from blogs' ).then( function( data ){
            data.forEach( function( slug ) {
                slugArray.push( utils.urlForSlug( slug.slug ) );
            });
        });
        return slugArray;
    }

    getBlogPost( givenSlug ) {
        db.any( `SELECT * from blogs where slug = ${givenSlug}` ).then( function( data ){
            if ( data.length !== 0 ) {
                return data;
            } else {
                return false;
            }
        });
    };

    addBlogPost( blogPost ) {
        console.log("Entered addBlogPost");
        const text = 'INSERT INTO blogs(slug, title, bodyTxt) VALUES ($1,$2,$3) RETURNING *';
        const values = [ blogPost.slug, blogPost.title, blogPost.bodyTxt ];
        // promise
        db.query(text, values)
            .then(res => {
                console.log(res.rows[0])
            })
            .catch(e => console.error(e.stack))
        console.log("Outside");
        return true ;
    };

    updateBlogPost( newBlogPost, oldSlug ) {
        db.query( `UPDATE blogs SET slug = ${newBlogPost.slug}, title = ${newBlogPost.title}, 
            bodyTxt = ${newBlogPost.bodyTxt} WHERE slug = ${oldSlug}`, function( err, result ){
            if (err) {
                return false;
            } else {
                return true;
            }
        });
    };

    deleteBlogPost( deleteSlug ) {
        db.query( `DELETE from blogs WHERE slug = ${deleteSlug}`, function (err, result) {
            if (err) {
                return true;
            } else {
                return false;
            }
        })
    };

    deleteAllPosts( ) {
        db.query( `DELETE from blogs`, function (err, result) {
            if (err) {
                return true;
            } else {
                return false;
            }
        })
    };
}



module.exports = BlogRepo;





