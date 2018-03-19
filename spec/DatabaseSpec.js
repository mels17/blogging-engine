const Database = require('../app/Database.js');
const Sequelize = require('sequelize');
const sinon = require('sinon');

describe("Isolation tests for Database", function () {
    // Mock sequelize
    const seq = {
        define: () => {},
        authenticate: () => {},
        sync: () => {}
    };

    const seqMock = sinon.mock(seq);

    // Call database with mock sequelize
    var db = new Database(seqMock);

    // Mock blog and comment table
    const blogTable = {
        create: () => {},
        findAll: () => {},
        findOne: () => {}
    };

    const blogTableMock = sinon.mock(blogTable);

    const commentTable = {
        create: () => {},
        findAll: () => {},
        belongsTo: () => {}
    };

    const commentTableMock = sinon.mock(commentTable);

    it("Database object instantiated successfully", function (done) {
        expect(db).toBeDefined();
        done();
    });

    it("Database initialized successfully", function (done) {
        const database = new Database(seq);

        database.Blog = blogTable;
        database.Comments = commentTable;

        sinon.stub(database, "createBlogModel").withArgs().returns(blogTable);
        sinon.stub(database, "createCommentModel").withArgs().returns(commentTable);

        sinon.stub(commentTable, "belongsTo").withArgs(blogTable).returns();

        seqMock.expects('authenticate').once().withArgs().returns(Promise.resolve());
        seqMock.expects('sync').once().withArgs({force: true}).returns(Promise.resolve());

        const syncCompleted = {};
        seq.authenticate = () => Promise.resolve();
        seq.sync = () => Promise.resolve(syncCompleted);
        database.init()
            .then(result => {
                expect(result).toBe(syncCompleted);
                // seqMock.verify();
                database.createBlogModel.restore();
                database.createCommentModel.restore();
                commentTable.belongsTo.restore();
                // seqMock.restore();
                done();
            })
    });

    beforeEach(function () {
        db = new Database(seqMock);
        db.Blog = blogTable;
        db.Comments = commentTable;
        seqMock.restore();
        commentTableMock.restore();
        blogTableMock.restore();
    });

    describe("Blog table", function () {
        const blogOne = {
            title: "example title one",
            bodyTxt: "example text one",
            slug: "exampleOne"
        };

        const blogTwo = {
            title: "example title two",
            bodyTxt: "example text two",
            slug: "exampleTwo"
        };

        it("listBlogs function returns blog list promise", function (done) {
            blogTableMock.expects('findAll').once().withArgs().returns(Promise.resolve([blogOne]));

            db.listBlogs()
                .then(() => {
                    blogTableMock.verify();
                    done();
                })
        });

        it("createBlog function returns blog promise", function (done) {
            const blogPromise = Promise.resolve(blogOne);

            sinon.stub(db, 'getBlog').withArgs(blogOne.slug).returns(Promise.resolve());

            blogTableMock.expects('create').once().withArgs(blogOne).returns(blogPromise);

            db.createBlog(blogOne)
                .then(() => {
                    blogTableMock.verify();
                    db.getBlog.restore();
                    done();
                })
        });

        it("throws error when createBlog is called with a duplicate post", function (done) {
            const blogPromise = Promise.resolve(blogOne);

            sinon.stub(db.Blog, 'findOne').withArgs(blogOne.slug).returns(blogPromise);

            var rejectedPromise = db.createBlog(blogOne);

            rejectedPromise.catch(err => {
                expect(err.message).toBe('Duplicate post');
                // expect(rejectedPromise.isFulfilled()).toBeFalsy();
                db.Blog.findOne.restore();
                done();
            });


            // return db.createBlog(blogOne).catch((e)=> {
            //     console.log(e);
            //     db.getBlog.restore();
            //     done();
            // })
        });

        it("updateBlog returns the updated blog promise", function (done) {

            const blog = {
                title: "example title one",
                bodyTxt: "example text one",
                slug: "exampleOne",
                update: () => {
                }
            };

            const blogMock = sinon.mock(blog);


            sinon.stub(db, 'getBlog').withArgs(blog.slug).returns(Promise.resolve(blog));

            db.updateBlog(blog.slug, blogTwo).then((res) => {
                console.log("Here");
                blogMock.restore();
                db.getBlog.restore();
                done();
            });
        });

        it("getBlog returns the blog promise", function (done) {
            const blogPromise = Promise.resolve(blogOne);

            blogTableMock.expects('findOne').once().withArgs({where: {slug: blogOne.slug}})
                .returns(blogPromise);

            db.getBlog(blogOne.slug)
                .then((res) => {
                    expect(res).toBe(blogOne);
                    blogTableMock.verify();
                    blogTable.restore();
                    done();
                })
        });

        it("deleteBlog returns an empty promise", function (done) {
            const blog = {
                title: "example title one",
                bodyTxt: "example text one",
                slug: "exampleOne",
                destroy: () => {
                }
            };

            // const blogMock = sinon.mock(blog);

            sinon.stub(db, 'getBlog').withArgs(blog.slug).returns(Promise.resolve(blog));

            db.deleteBlog(blog.slug)
                .then((res) => {
                    expect(res).toBeUndefined();
                    db.getBlog.restore();
                    // blogMock.restore();
                    done();
                })
        })
    });

    describe('Comments table', function () {
        const comment = {
            dateCreated: "2018-03-03",
            author: "example author",
            text: "example comment text"
        };

        const blogOne = {
            title: "example title one",
            bodyTxt: "example text one",
            slug: "exampleOne"
        };

        it("create comment returns comment promise", function (done) {
            sinon.stub(db, 'getBlog').withArgs(blogOne.slug)
                .returns(Promise.resolve(blogOne));

            commentTableMock.expects("create").withArgs(comment)
                .returns(Promise.resolve(comment));

            db.createComment(blogOne.slug, comment)
                .then((res) => {
                    expect(res).toBe(comment);
                    commentTableMock.verify();
                    db.getBlog.restore();
                    done();
                })
        });

        it("get comment returns comment promise", function (done) {
            const commentNew = {
                dateCreated: "2018-03-03",
                author: "example author",
                text: "example comment text",
                blogSlug: blogOne.slug
            };
            sinon.stub(db, 'getBlog').withArgs(blogOne.slug)
                .returns(Promise.resolve(blogOne));

            commentTableMock.expects("findAll").withArgs({where: {blogSlug: blogOne.slug}})
                .returns(Promise.resolve([commentNew]));

            db.getComments(blogOne.slug)
                .then((res) => {
                    expect(res[0]).toBe(commentNew);
                    commentTableMock.verify();
                    db.getBlog.restore();
                    done();
                })
        });

        it("deletes comment returns undefined promise", function (done) {
            const comments = [{
                dateCreated: "2018-03-03",
                author: "example author",
                text: "example comment text",
                blogSlug: blogOne.slug,
                destroy: () => {
                }
            }];

            sinon.stub(db, 'getComments').withArgs(blogOne.slug)
                .returns(Promise.resolve(comments));

            db.deleteComments(blogOne.slug)
                .then((res) => {
                    expect(res).toBeUndefined();
                    db.getComments.restore();
                    done();
                })
        })
    });


});
