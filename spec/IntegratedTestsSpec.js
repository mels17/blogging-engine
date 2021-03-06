const request = require('supertest');
const Database = require('../app/Database.js');
const App = require('../app/App.js');
const Sequelize = require('sequelize');
const DatabaseInitFactory = require('../app/DatabaseInitFactory.js');

describe("App", function () {
    const connectionString = `postgres://postgres:postgres@localhost:5432/postgres`;
    const seq = new Sequelize(connectionString);
    const dbInit = new DatabaseInitFactory(seq);
    const db = new Database(dbInit);
    const app = new App(db);
    let client;


    const ex = {
        slug: 'test',
        title: 'test title',
        bodyTxt: 'test body'
    };


    beforeEach(function (done) {
        db.init()
            .then(() => {
                app.init();
                client = request(app.app);
                done();
            });
    });

    describe( "Blog", function( ) {
        describe("POST /posts", function () {
            it('should create a post', (done) => {
                client.post('/posts')
                    .set('content-type', 'application/json')
                    .send(ex)
                    .then(res => {
                        expect(res.status).toBe(201);
                        expect(res.body.slug).toBe(ex.slug);
                        expect(res.body.bodyTxt).toBe(ex.bodyTxt);
                        expect(res.body.title).toBe(ex.title);
                        done();
                    })
            });

            it('get error when adding duplicate post', (done) => {
                const ex = {
                    slug: 'test',
                    title: 'test',
                    bodyTxt: 'test'
                };

                client.post('/posts').set('content-type', 'application/json').send(ex)
                    .then( ( )=> {
                        const deletionPromise = client.post('/posts').set('content-type', 'application/json').send(ex);
                        deletionPromise
                            .catch(() => {
                                expect(deletionPromise.isFulfilled()).toBeFalsy();
                            });
                        done( );
                    });
            });
        });

        describe("GET /posts", function () {
            beforeEach(function (done) {
                client.post('/posts')
                    .set('content-type', 'application/json')
                    .send(ex)
                    .then(done);
            });

            it("gets post list successfully", function (done) {
                client.get('/posts')
                    .then(res => {
                        console.log(res);
                        expect(res.status).toBe(200);
                        expect( res.body ).toEqual(["http://localhost:3000/posts/test"]);
                        done();
                    })
            });
        });


        describe("GET /slug", function () {
            beforeEach(function (done) {
                client.post('/posts')
                    .set('content-type', 'application/json')
                    .send(ex)
                    .then(() => done());
            });

            it("gets post successfully", function (done) {
                client.get('/posts/test')
                    .then(res => {
                        expect(res.status).toBe(200);
                        expect(res.body.slug).toBe(ex.slug);
                        expect(res.body.bodyTxt).toBe(ex.bodyTxt);
                        expect(res.body.title).toBe(ex.title);
                        done();
                    })
            });
        });

        describe(`DELETE /posts/:slug`, function () {
            beforeEach(function (done) {
                client.post('/posts')
                    .set('content-type', 'application/json')
                    .send(ex)
                    .then(() => done());
            });

            it( "returns 204 after deleting post", function( done ) {

                client.delete( '/posts/test' )
                    .then( res => {
                        expect( res.status ).toBe( 204 );
                        done();
                    });
            });
        });

        describe( 'PUT /posts', function( ) {
            beforeEach(function (done) {
                client.post('/posts')
                    .set('content-type', 'application/json')
                    .send(ex)
                    .then(() => done());
            });

            it( "updates post successfully", function( done ) {

                const updateEx = {
                    slug: 'updatedTest',
                    title: 'updated test title',
                    bodyTxt: 'updated test body'
                };

                client.put( '/posts/test' )
                    .set('content-type', 'application/json')
                    .send(updateEx)
                    .then( res => {
                        expect( res.status ).toBe( 200 );
                        done();
                    });
            });

        });
    });

    describe( "Comments", function() {
        const commentEx = {
            dateCreated: "2018-03-03",
            author: "example author",
            text: "example comment text"
        };

        const commentExTwo = {
            dateCreated: "2018-03-28",
            author: "author two",
            text: "example text two"
        };

        describe( "POST /posts/:slug/comments", function( ) {
            beforeEach(function (done) {
                client.post('/posts')
                    .set('content-type', 'application/json')
                    .send(ex)
                    .then(() => done());
            });

            it("adds comment successfully", function (done) {
                client.post('/posts/test/comments')
                    .set( 'content-type', 'application/json' )
                    .send( commentEx )
                    .then(res => {
                        expect(res.status).toBe(201);
                        expect( res.body.author ).toBe( commentEx.author );
                        expect( res.body.text ).toBe( commentEx.text );
                        expect( res.body.dateCreated ).toBe( commentEx.dateCreated );
                        done();
                    })
            });
        });

        describe( "GET /posts/:slug/comments", function( ) {
            beforeEach(function (done) {
                client.post('/posts')
                    .set('content-type', 'application/json')
                    .send(ex)
                    .then(() => done());
            });

            it( "gets comments for a blog post successfully", function( done ) {
                client.post( '/posts/test/comments' )
                    .set( 'content-type', 'application/json' )
                    .send( commentEx )
                    .then(() => {
                        return client.post( '/posts/test/comments' )
                            .set( 'content-type', 'application/json' )
                            .send( commentExTwo );
                    })
                    .then(()=> {
                        return client.get( '/posts/test/comments' )
                    })
                    .then( res => {
                        expect( res.status ).toBe( 200 );
                        expect( res.body.length ).toBe( 2 );
                        expect( res.body[0].author ).toBe( commentEx.author );
                        expect( res.body[0].text ).toBe( commentEx.text );
                        expect( res.body[0].dateCreated ).toBe( commentEx.dateCreated );
                        expect( res.body[1].author ).toBe( commentExTwo.author );
                        expect( res.body[1].text ).toBe( commentExTwo.text );
                        expect( res.body[1].dateCreated ).toBe( commentExTwo.dateCreated );
                        done();
                    });
            });
        });

        describe( "DELETE /posts/:slug/comments", function( ) {
            beforeEach(function (done) {
                client.post('/posts')
                    .set('content-type', 'application/json')
                    .send(ex)
                    .then(() => done());
            });

            it( "deletes comments successfully", function( done ) {
                client.post( '/posts/test/comments' )
                    .set('content-type', 'application/json' )
                    .send( commentEx )
                    .then(() => {
                        //expect(res.body.length).toBe(1);
                        // console.log(res.body.length);
                        return client.delete( '/posts/test/comments' )
                    })
                    .then( res => {
                        expect( res.status ).toBe( 204 );
                        return client.get("/posts/test/comments" )
                    })
                    .then( comment => {
                        expect(comment.body.length).toBe(0);
                    })
                    .then(() => done());
            })
        })
    });
});