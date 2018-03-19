const Database = require('../app/Database.js');
const Sequelize = require('sequelize');
const sinon = require('sinon');

describe("Isolation tests for Database", function () {
    const connectionString = `postgres://postgres:postgres@localhost:5432/postgres`;
    const seq = new Sequelize(connectionString);
    var seqMock = sinon.mock(seq);
    var db = null;


    describe("Database initialized successfully", function () {
        beforeEach(function () {
            db = new Database(seqMock);
        });

        it("database object instantiated successfully", function (done) {
            expect(db).toBeDefined();
            done();
        });

        xit("initializes database successfully", function (done) {
            var spyCreateblog = sinon.spy(db, "createBlogModel");
            var spyCreateComment = sinon.spy(db, "createCommentModel");
            //
            // // var spyBelongs = sinon.spy( db.Comments, "belongsTo" ).withArgs( db.Blog );
            var spyAuth = sinon.spy(seq, "authenticate");
            var spySync = sinon.spy(seq, "sync").withArgs({force: true});

            sinon.stub(db.Comments, 'belongsTo').withArgs(db.Blog).returns();

            db.init().then(() => console.log("Here"));
            // console.log(res);
            expect(spyCreateblog.calledOnce).toBeTruthy();
            expect(spyCreateComment.calledOnce).toBeTruthy();
            // // expect( spyBelongs.calledOnce ).toBeTruthy();
            expect(spyAuth.calledOnce).toBeTruthy();
            expect(spySync.calledOnce).toBeTruthy();


            done();
        });
    });

    describe("Database functions run successfully", function () {
        const blogOne = {
            title: "example title",
            bodyTxt: "example text",
            slug: "example"
        };

        const blogTwo = {
            title: "example title",
            bodyTxt: "example text",
            slug: "test"
        };

        beforeEach(function (done) {
            db = new Database(seqMock);
            // done();
            db.init().then(done);
        });

        it("calls sequelize define once for Blogs", function (done) {
            // var spyDefineBlog = sinon.spy(seqMock, "define");

            seqMock.expects("define").once().withArgs('blogs', {
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
            }).returns('blogs');

            db.createBlogModel().then(() => {
                seqMock.verify();
                seqMock.restore();
                done();
            });

            // expect(spyDefineBlog.calledOnce).toBeTruthy();
            //
            // seqMock.define.restore();
            // done();

        });

        xit("calls sequelize define once for Blogs", function (done) {
            var spyDefineComment = sinon.spy(seqMock, "define");

            db.createCommentModel();

            expect(spyDefineComment.calledOnce).toBeTruthy();

            seqMock.define.restore();
            done();
        });

        xit("creates blog by calling sequelize's create", function (done) {
            sinon.stub(db.Blog, 'create').withArgs(blogOne).returns(blogOne);
            sinon.stub(db, 'getBlog').withArgs(blogOne.slug).returns(Promise.resolve());


            db.createBlog(blogOne).then((result) => {
                expect(result).toBe(blogOne);
                done();
            });
        });

        xit("throws error when duplicate post", function (done) {

            sinon.stub(db.Blog, 'create').withArgs(blogOne).returns(blogOne);
            sinon.stub(db, 'getBlog').withArgs(blogOne.slug).returns(Promise.resolve(blogOne));

            var rejectedPromise = db.createBlog(blogOne);
            rejectedPromise.catch(() => {
                expect(rejectedPromise.isFulfilled).toBeFalsy();
                done();
            });
        });

        xit("listBlogs returns a list of blog promises", function (done) {
            const result = [Promise.resolve(blogOne), Promise.resolve(blogTwo)];
            sinon.stub(db.Blog, 'findAll').returns(result);
            expect(db.listBlogs()).toBe(result);
            done();
        });

        xit("updateBlog returns updated blog", function (done) {
            const blogPromise = Promise.resolve(blogOne);
            sinon.stub(db, 'getBlog').withArgs(blogOne.slug).returns(blogOne);
            sinon.stub(blogPromise, 'update').withArgs(blogTwo).returns(blogTwo);

            db.updateBlog(blogOne.slug, blogTwo).then((res) => {
                expect(res).toBe(blogTwo);
                done();
            })

        });

        xit("getBlog returns blog successfully", function (done) {
            sinon.stub(db.Blog, 'findOne').withArgs({where: {slug: blogOne.slug}}).returns(Promise.resolve(blogOne));

            db.getBlog(blogOne.slug).then((res) => {
                expect(res).toBe(blogOne);
                done();
            })
        });

        xit("deleteBlog calls dest", function (done) {
            const blogPromise = Promise.resolve(blogOne);
            sinon.stub(db, 'getBlog').withArgs(blogOne.slug).returns(blogPromise);
            sinon.stub(blogPromise, 'destroy').withArgs({force: true}).returns(Promise.resolve(undefined));
            db.deleteBlog(blogOne.slug).then((res) => {
                expect(res).toBe(undefined);
                done();
            })
        })
    });


});
