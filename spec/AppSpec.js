const request = require('supertest');
const Database = require('../app/Database.js');
const App = require('../app/App.js');
const sinon = require('sinon');

describe('Unit Test App', function () {
    const db = new Database();
    const app = new App(db);
    const dbMock = sinon.mock(db);

    beforeEach(function() {
        dbMock.restore();
    });

    describe( 'Blogs', function () {
        const blog = {
            slug: 'test',
            title: 'test title',
            bodyTxt: 'test body'
        };

        it( "add post successfully", function (done) {
            const res = {
                status: () => {},
                json: () => {}
            };

            const resMock = sinon.mock( res );

            const req = {
                body: blog
            };

            dbMock.expects( "createBlog" ).once().withArgs(blog).returns(Promise.resolve(blog));

            resMock.expects("status").once().withArgs(201);
            resMock.expects("json").once().withArgs(blog);

            app.create(req, res)
                .then(() => {
                    dbMock.verify();
                    resMock.verify();
                    done();
                });
        });


        it( "gets post successfully", function (done) {
            const slug = "example";

            const res = {
                status: () => {},
                json: () => {}
            };

            const resMock = sinon.mock( res );

            const req = {
                params: {
                    slug: slug
                }
            };

            dbMock.expects( "getBlog" ).once().withArgs(slug).returns(Promise.resolve());

            resMock.expects("status").once().withArgs(200);
            resMock.expects("json").once().withArgs();

            app.get(req, res)
                .then(() => {
                    dbMock.verify();
                    resMock.verify();
                    done();
                });
        });


        it( "gets list of posts successfully", function (done) {
            const bloglist = [ "http://localhost:3000/posts/undefined" ];

            const res = {
                status: () => {},
                json: () => {}
            };

            const resMock = sinon.mock( res );

            const req = {};

            dbMock.expects( "listBlogs" ).once().withArgs().returns(Promise.resolve(bloglist));


            resMock.expects("status").once().withArgs(200);
            resMock.expects("json").once().withArgs(bloglist);

            app.list(req, res)
                .then(() => {
                    dbMock.verify();
                    resMock.verify();
                    done();
                });
        });

        it( "updates post successfully", function(done) {
            const updatedBlog = {
                slug: 'test',
                title: 'test title',
                bodyTxt: 'test body'
            };

            const slug = "example";


            const res = {
                status: () => {},
                json: () => {}
            };

            const resMock = sinon.mock( res );

            const req = {
                params:{
                    slug: slug
                },
                body: updatedBlog
            };

            dbMock.expects( "updateBlog" ).once().withArgs( slug, updatedBlog ).returns(Promise.resolve(updatedBlog));

            resMock.expects( "status" ).once( ).withArgs( 200 );
            resMock.expects( "json" ).once( ).withArgs( updatedBlog );

            app.update(req, res)
                .then(() => {
                    dbMock.verify();
                    resMock.verify();
                    done();
                });
        });

        it ( "deletes post successfully", function(done) {

            const slug = "example";

            const res = {
                status: () => {},
                end: () => {}
            };

            const resMock = sinon.mock( res );

            const req = {
                params: {
                    slug: slug
                }
            };

            dbMock.expects( "deleteBlog" ).once().withArgs( slug ).returns(Promise.resolve());

            resMock.expects( "status" ).once( ).withArgs( 204 );
            resMock.expects( "end" ).once( ).withArgs();

            app.delete(req, res)
                .then(() => {
                    dbMock.verify();
                    resMock.verify();
                    done();
                });
        })
    });

    describe('Comments', function () {
        it('should get comments successfully', function (done) {
            const slug = "example";
            const comments = [
                {
                    dateCreated: "2018-03-03",
                    author: "example author",
                    text: "example comment text"
                }
            ];

            const res = {
                status: () => {},
                json: () => {}
            };

            const resMock = sinon.mock(res);

            const req = {
                params: {
                    slug: slug
                }
            };

            dbMock.expects("getComments").once().withArgs(slug).returns(Promise.resolve(comments));

            resMock.expects("status").once().withArgs(200);
            resMock.expects("json").once().withArgs(comments);

            app.getComments(req, res)
                .then(() => {
                    dbMock.verify();
                    resMock.verify();
                    done();
                });
        });


        it('should delete comments successfully', function (done) {
            const slug = "example";

            const res = {
                status: () => {},
                end: () => {}
            };

            const resMock = sinon.mock(res);

            const req = {
                params: {
                    slug: slug
                }
            };

            dbMock.expects("deleteComments").once().withArgs(slug).returns(Promise.resolve());

            resMock.expects("status").once().withArgs(204);
            resMock.expects("end").once().withArgs();

            app.deleteComments(req, res)
                .then(() => {
                    dbMock.verify();
                    resMock.verify();
                    done();
                });
        });

        it('should create comments successfully', function (done) {
            const slug = "example";

            const comment = [{
                dateCreated: "2018-03-03",
                author: "example author",
                text: "example comment text"
            }];

            const res = {
                status: () => {},
                json: () => {}
            };

            const resMock = sinon.mock(res);

            const req = {
                params: {
                    slug: slug
                },
                body: comment[0]
            };

            dbMock.expects("createComment").once().withArgs(slug, comment[0]).returns(Promise.resolve(comment));

            resMock.expects("status").once().withArgs(201);
            resMock.expects("json").once().withArgs(comment);

            app.createComment(req, res)
                .then(() => {
                    dbMock.verify();
                    resMock.verify();
                    done();
                });
        })
    } )
});