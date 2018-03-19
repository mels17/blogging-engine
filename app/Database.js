const Sequelize = require( 'sequelize' );

class Database {
    constructor(sequelize) {
        this.sequelize = sequelize;
        console.log("Database instantiated");
    }

    init(factory) {
        console.log("Initializing database...");
        // this.createBlogModel();
        // this.Blog = factory.buildBlog
        this.Blog = this.createBlogModel();
        this.Comments = this.createCommentModel();
        this.Comments.belongsTo(this.Blog);
        console.log("Blogs and comments table created");
        // Establishing a relation between the two tables. this will automatically create blogSlug field
        // which is the foreign key, in the comments table.
        // this.Comments.belongsTo( this.Blog );
        console.log("Established relation between Blogs and Comments");
        // console.log(this.sequelize.authenticate());
        return this.sequelize.authenticate()
            .then(() => {
                console.log("Erasing database...");
                return this.sequelize.sync({
                    force: true
                })
            });
    }

    createBlogModel() {
        return this.sequelize.define('blogs', {
            slug: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            bodyTxt: {
                type: Sequelize.TEXT,
                allowNull: false
            }
        });
    }

    createCommentModel( ) {
        return this.sequelize.define( 'comments', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            dateCreated: {
                type: Sequelize.STRING,
                allowNull: false
            },
            author: {
                type: Sequelize.STRING,
                allowNull: false
            },
            text: {
                type: Sequelize.TEXT,
                allowNull: false
            }
        })
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
                    comment.blogSlug = slug;
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
                            blogSlug: slug
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