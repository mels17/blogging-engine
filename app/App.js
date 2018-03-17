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

    createComment( req, res ) {
        const givenSlug = req.params.slug;
        const givenComment = req.body;
        return this.db.createComment ( givenSlug, givenComment ).then((comment) => {
            res.status( 201 );
            res.json( comment );
        })
    }

//     it('something', () => {
//         db = mock()
//         when(db.createComment).thenReturn(Promise -> (comment))
//         app = new App(db)
//     req = mock()
//     res = mock()
//     app.createComment(req, res)
//     expect(res).toReceive(status).with(201)
// })


    getComments( req, res ) {
        const givenSlug = req.params.slug;
        return this.db.getComments( givenSlug ).then( ( comments ) => {
            res.status( 200 );
            res.json( comments );
        })
    }

    deleteComments( req, res ) {
        const givenSlug = req.params.slug;
        return this.db.deleteComments( givenSlug ).then( ( ) => {
            res.status( 204 );
            res.end( );
        })
    }

    create(req, res ) {
        const blog = req.body;
        return this.db.createBlog( blog ).then((blog)=>{
            res.status(201);
            res.json( blog );
        })
    };

    get(req, res ) {
        const slug = req.params.slug;
        return this.db.getBlog( slug ).then((blog)=>{
            res.status( 200 );
            res.json( blog );
        });
    };

    list(req, res ) {
        return this.db.listBlogs().then((blogList)=>{
            const blogSlugs = blogList.map(blog => {
                return utils.urlForSlug( blog.slug );
            });

            res.status( 200 );
            res.json( blogSlugs );
        });
    };

    update( req, res ) {
        const slug = req.params.slug;
        const update = req.body;
        return this.db.updateBlog( slug, update ).then((blog)=>{
            res.status(200);
            res.json( blog );
        })

    };

    delete( req, res ) {
        const slug = req.params.slug;
        return this.db.deleteBlog( slug ).then(()=>{
            res.status(204);
            res.end();
        });
    };
}

module.exports = App;