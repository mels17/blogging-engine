const Sequelize = require( 'sequelize' );
const DatabaseInitFactory = require('./DatabaseInitFactory');

class Database {
    constructor(databaseInitFactory) {
        this.factory = databaseInitFactory;
        console.log("Database instantiated");
    }

    init() {
        console.log("Initializing database...");

        [this.Blog, this.Comments] = this.factory.createModels();

        return this.factory.eraseDBIfExists();
    }


    //#---------------#
    //# BLOG METHODS  #
    //#---------------#
    createBlog(blog) {
        return this.getBlog( blog.slug ).then( b =>
            {
                if (b) {
                    throw new Error( "Duplicate post" );
                }

                return this.Blog.create(blog);
            }
        );
    }

    listBlogs() {
        return this.Blog.findAll();
    }

    updateBlog(slug, updatedBlog) {
        return this.getBlog(slug)
            .then(blog => {
                // return blog.get(updatedBlog.slug);
                // blog.slug = updatedBlog.slug;
                return blog.update(updatedBlog);
            })
    }

    getBlog(slug) {
        return this.Blog.findOne({
            where: {
                slug: slug
            }
        });
    }

    deleteBlog(slug) {
        return this.getBlog(slug)
            .then(blog => {
                return blog.destroy({  force: true });
            });
    }

    //#------------------#
    //# COMMENT METHODS  #
    //#------------------#


    createComment (slug, comment) {
        return this.getBlog(slug)
            .then( blog => {
                if (blog) {
                    comment.slug = slug;
                    return this.Comments.create( comment );
                }
            });
    }

    getComments( slug ) {
        return this.getBlog( slug )
            .then( blog => {
                if ( blog ) {
                    // Get all the comments of this blog
                    return this.Comments.findAll({
                        where: {
                            slug: slug
                        }
                    })
                }
            })
    }

    deleteComments( slug ) {
        return this.getComments( slug )
            .then( comments => {
                return comments.forEach( function(comment){
                    comment.destroy( { force: true } );
                })
            })
    }
}

module.exports = Database;