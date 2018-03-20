const Sequelize = require('sequelize');

class DatabaseInitFactory{
    constructor(sequelize) {
        this.sequelize = sequelize;
    }

    // Establishing a one-to-one relation between the two tables. this will automatically create blogSlug field
    // which is the foreign key, in the comments table.
    establishRelationBetweenTables(blogs, comments) {
        comments.belongsTo( blogs );
        return [blogs, comments];
    }

    createTables() {
        const comments = this.createCommentTable();
        const blogs = this.createBlogTable();

        console.log("Blogs and comments table created");

        console.log("Establish relation between Blogs and Comments");

        return this.establishRelationBetweenTables(blogs, comments);
    }

    createBlogTable() {
        return this.sequelize.define('blogs', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            slug: {
                type: Sequelize.STRING,
                allowNull: false,
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

    createCommentTable( ) {
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
            },
            slug: {
                type: Sequelize.STRING,
                allowNull: false,
            }
        })
    }

    eraseDBIfExists() {
        return this.sequelize.authenticate()
            .then(() => {
                console.log("Erasing database...");
                return this.sequelize.sync({
                    force: true
                })
            });
    }
}

module.exports = DatabaseInitFactory;