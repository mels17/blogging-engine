const Database = require('../app/Database.js');
const Sequelize = require('sequelize');
const sinon = require('sinon');

describe("Isolation tests for Database", function () {
    // Mock sequelize
    const factory = {
        createTables: () => {
        },
        eraseDBIfExists: () => {
        },
    };

    // Call database with mock sequelize
    var db = new Database(factory);

    const blogTable = {
        create: () => {
        },
        findAll: () => {
        },
        findOne: () => {
        }
    };

    const commentTable = {
        create: () => {
        },
        findAll: () => {
        },
        belongsTo: () => {
        }
    };

    // Mock blog and comment table
    const blogTableMock = sinon.mock(blogTable);

    const commentTableMock = sinon.mock(commentTable);

    it("Database initialized successfully", function (done) {

        sinon.stub(factory, 'createTables').withArgs().returns([blogTable, commentTable]);
        sinon.stub(factory, 'eraseDBIfExists').withArgs().returns(Promise.resolve());

        const database = new Database(factory);

        database.init()
            .then(res => {
                expect(res).toBeUndefined();
                factory.createTables.restore();
                factory.eraseDBIfExists.restore();
                done();
            })
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

        const blogOnePromise = Promise.resolve(blogOne);
        const blogTwoPromise = Promise.resolve(blogTwo);

        beforeEach(function (done) {

            sinon.stub(factory, 'createTables').withArgs().returns([blogTable, commentTable]);
            sinon.stub(factory, 'eraseDBIfExists').withArgs().returns(Promise.resolve());

            db = new Database(factory);

            db.init();
            done();
        });

        afterEach( function (done) {
            factory.createTables.restore();
            factory.eraseDBIfExists.restore();
            commentTableMock.restore();
            blogTableMock.restore();
            done();
        });

        describe("testing creating blog function", function () {
            it("createBlog function returns blog promise", function (done) {
                sinon.stub(blogTable, 'findOne').withArgs({where: {slug: blogOne.slug}}).returns(Promise.resolve());
                sinon.stub(blogTable, 'create').withArgs(blogOne).returns(blogOnePromise);

                db.createBlog(blogOne)
                    .then((result) => {
                        expect(result).toBe(blogOne);
                        blogTable.findOne.restore();
                        blogTable.create.restore();
                        done();
                    })
            });

            it("throws error when createBlog is called with a duplicate post", function (done) {
                sinon.stub(blogTable, 'findOne').withArgs({where: {slug: blogOne.slug}}).returns(blogOnePromise);

                var rejectedPromise = db.createBlog(blogOne);

                rejectedPromise.catch(err => {
                    expect(err.message).toBe('Duplicate post');
                    blogTable.findOne.restore();
                    done();
                });
            });
        });



        it("listBlogs function returns blog list promise", function (done) {
            blogTableMock.expects('findAll').once().withArgs().returns(Promise.resolve([blogOne]));

            db.listBlogs()
                .then((result) => {
                    expect(result[0]).toBe(blogOne);
                    done();
                })
        });

        it("updateBlog returns the updated blog promise", function (done) {

            const blog = {
                title: "example title one",
                bodyTxt: "example text one",
                slug: "exampleOne",
                update: () => {
                }
            };

            sinon.stub(blogTable, 'findOne').withArgs({where: {slug: blog.slug}}).returns(Promise.resolve(blog));

            sinon.stub(blog, 'update').withArgs(blogTwo).returns(blogTwoPromise);

            db.updateBlog(blog.slug, blogTwo)
                .then(result => {
                    expect(result).toBe(blogTwo);
                    blogTable.findOne.restore();
                    blog.update.restore();
                    done();
                })
        });

        it("getBlog returns the blog promise", function (done) {
            sinon.stub(blogTable, 'findOne').withArgs({where: {slug: blogOne.slug}}).returns(blogOnePromise);
            db.getBlog(blogOne.slug)
                .then(result => {
                    expect(result).toBe(blogOne);
                    blogTable.findOne.restore();
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
            sinon.stub(blogTable, 'findOne').withArgs({where: {slug: blog.slug}}).returns(Promise.resolve(blog));
            sinon.stub(blog, 'destroy').withArgs({force: true}).returns(Promise.resolve());

            db.deleteBlog(blog.slug)
                .then((res) => {
                    expect(res).toBeUndefined();
                    blogTable.findOne.restore();
                    blog.destroy.restore();
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

        const commentPromise = Promise.resolve(comment);
        const blogOnePromise = Promise.resolve(blogOne);

        beforeEach( function (done) {
            sinon.stub(blogTable, 'findOne').withArgs({where: {slug: blogOne.slug}}).returns(blogOnePromise);
            done();
        });

        afterEach(function (done) {
            blogTable.findOne.restore();
            done();
        });

        it("create comment returns comment promise", function (done) {


            sinon.stub(commentTable, 'create').withArgs(comment).returns(commentPromise);

            db.createComment(blogOne.slug, comment)
                .then((res) => {
                    expect(res).toBe(comment);
                    commentTable.create.restore();
                    done();
                })
        });

        it("get comment returns comment object", function (done) {
            const commentGet = {
                dateCreated: "2018-03-03",
                author: "example author",
                text: "example comment text",
                slug: blogOne.slug
            };

            sinon.stub(commentTable, 'findAll').withArgs({where: {slug: blogOne.slug}}).returns(Promise.resolve([commentGet]));

            db.getComments(blogOne.slug)
                .then(result => {
                    expect(result[0]).toBe(commentGet);
                    commentTable.findAll.restore();
                    done();
                })
        });

        it("deletes comment returns undefined promise", function (done) {
            const commentDelete = {
                dateCreated: "2018-03-03",
                author: "example author",
                text: "example comment text",
                slug: blogOne.slug,
                destroy: () => {
                }
            };
            sinon.stub(commentTable, 'findAll').withArgs({where: {slug: blogOne.slug}}).returns(Promise.resolve([commentDelete]));
            sinon.stub(commentDelete, 'destroy').withArgs({force: true}).returns(Promise.resolve());


            db.deleteComments(blogOne.slug)
                .then(result => {
                    expect(result).toBeUndefined();
                    commentTable.findAll.restore();
                    commentDelete.destroy.restore();
                    done();
                })

        })
    });


});
