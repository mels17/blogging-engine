const express = require('express');
const bodyParser = require('body-parser');
const Utils = require( './utils.js' );

const base_url = "http://localhost:3000/";

const utils = new Utils( base_url );

class App {
    constructor( db ) {
        this.app = express();
        this.router = express.Router( );
        this.db = db;
    }

    init() {
        this.buildRouter();

        this.app.use( bodyParser.json( ) );
        this.app.use( '/posts', this.router );
    }

    start() {
        this.app.listen( 3000 );
    }

    buildRouter() {
        this.router.post('/', this.create.bind(this) );
        this.router.get('/:slug', this.get.bind(this) );
        this.router.get('/', this.list.bind(this) );
        this.router.put('/:slug', this.update.bind(this) );
        this.router.delete('/:slug', this.delete.bind(this) );

        this.router.post( '/:slug/comments', this.createComment.bind(this));
        this.router.get( '/:slug/comments', this.getComments.bind(this));
        this.router.delete( '/:slug/comments', this.deleteComments.bind(this));
    }

    createComment( req, res, next ) {
        const givenSlug = req.params.slug;
        const comment = req.body;
        this.db.createComment ( givenSlug, comment ).then((comment) => {
            res.status( 201 );
            const commentOb = { dateCreated: comment.dateCreated, text: comment.text, author:  comment.author };
            res.json( commentOb );
        })
    }

    getComments( req, res, next ) {
        const givenSlug = req.params.slug;
        this.db.getComments( givenSlug ).then( ( comments ) => {
            res.status( 200 );
            res.json( comments );
        })
    }

    deleteComments( req, res, next ) {
        const givenSlug = req.params.slug;
        this.db.deleteComments( givenSlug ).then( ( ) => {
            res.status( 204 ).end( );
        })
    }

    create(req, res, next) {
        const blog = req.body;
        this.db.createBlog( blog ).then((blog)=>{
            res.status(201);
            res.json( blog );
        })
    };

    get(req, res, next) {
        const slug = req.params.slug;
        this.db.getBlog( slug ).then((blog)=>{
            res.status( 200 );
            res.json( blog );
        });
    };

    list(req, res, next) {
        this.db.listBlogs().then((blogList)=>{
            const blogSlugs = blogList.map(blog => {
                return utils.urlForSlug( blog.slug );
            });

            res.status( 200 );
            res.json( blogSlugs );
        });
    };

    update(req,res,next) {
        const slug = req.params.slug;
        const update = req.body;
        this.db.updateBlog( slug, update ).then((blog)=>{
            res.status(200);
            res.json( blog );
        })

    };

    delete( req, res, next ) {
        const slug = req.params.slug;
        this.db.deleteBlog( slug ).then(()=>{
            res.status(204).end();
        });
    };
}

module.exports = App;