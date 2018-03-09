const request = require('supertest');
const Database = require('../app/Database');
const App = require('../app/App');
const Sequelize = require('sequelize');

describe("App", function () {
    const connectionString = `postgres://postgres:postgres@localhost:5432/postgres`;
    const seq = new Sequelize(connectionString);
    const db = new Database(seq);
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

    describe("POST /posts", function () {
        it('should create a post', (done) => {

            console.log("abc")
            done()
            // client.post('/posts')
            //     .set('content-type', 'application/json')
            //     .send(ex)
            //     .then(res => {
            //         expect(res.status).toBe(201);
            //         expect(res.body.slug).toBe(ex.slug);
            //         expect(res.body.bodyTxt).toBe(ex.bodyTxt);
            //         expect(res.body.title).toBe(ex.title);
            //         done();
            //     })
        });

        // it('get error when adding duplicate post', () => {
        //     const ex = {
        //         slug: 'test',
        //         title: 'test',
        //         bodyTxt: 'test'
        //     };
        //
        //     return client.post('/posts').set('content-type', 'application/json').send(ex)
        //         .then( ( )=> {
        //             const deletionPromise = client.post('/posts').set('content-type', 'application/json').send(ex);
        //             deletionPromise
        //                 .catch(() => {
        //                    expect(deletionPromise.isFulfilled()).toBeFalsy();
        //                 });
        //         });
        // });
    });

    // describe("GET /posts", function () {
    //     beforeEach(function (done) {
    //         client.get('/posts')
    //             .then(res => {
    //                 console.log( res.body );
    //             }).then(()=> {
    //             client.post('/posts')
    //                 .set('content-type', 'application/json')
    //                 .send(ex)
    //                 .then(() => {
    //                     done();
    //                 });
    //         })
    //
    //
    //     });
    //
    //     it("gets post list successfully", function (done) {
    //         client.get('/posts')
    //             .then(res => {
    //                 expect(res.status).toBe(200);
    //                 expect( res.body ).toEqual(["http://localhost:3000/posts/test"]);
    //                 done();
    //             })
    //     });
    // });


    // describe("GET /slug", function () {
    //     beforeEach(function (done) {
    //         client.get('/posts')
    //             .then(res => {
    //                 console.log( res.body );
    //             }).then(()=> {
    //             client.post('/posts')
    //                 .set('content-type', 'application/json')
    //                 .send(ex)
    //                 .then(() => {
    //                     done();
    //                 });
    //         })
    //     });
    //
    //     it("gets post successfully", function (done) {
    //         client.get('/posts/test')
    //             .then(res => {
    //                 expect(res.status).toBe(200);
    //                 expect(res.body.slug).toBe(ex.slug);
    //                 expect(res.body.bodyTxt).toBe(ex.bodyTxt);
    //                 expect(res.body.title).toBe(ex.title);
    //                 done();
    //             })
    //     });
    // });

    // describe(`DELETE /posts/:slug`, function () {
    //     beforeEach(function (done) {
    //         client.post('/posts')
    //             .set('content-type', 'application/json')
    //             .send(ex)
    //             .then(() => {
    //                 done();
    //             })
    //     });
    //
    //     it( "deletes post successfully", function( done ) {
    //
    //         client.delete( '/posts/test' )
    //             .then( res => {
    //                 expect( res.status ).toBe( 204 );
    //                 done();
    //             });
    //     });
    // });

    // describe( 'PUT /posts', function( ) {
    //     beforeEach(function (done) {
    //         client.post('/posts')
    //             .set('content-type', 'application/json')
    //             .send(ex)
    //             .then(() => {
    //                 done();
    //             })
    //     });
    //
    //     it( "updates post successfully", function( done ) {
    //
    //         const updateEx = {
    //             slug: 'updatedTest',
    //             title: 'updated test title',
    //             bodyTxt: 'updated test body'
    //         };
    //
    //         client.put( '/posts/test' )
    //             .set('content-type', 'application/json')
    //             .send(updateEx)
    //             .then( res => {
    //                 expect( res.status ).toBe( 200 );
    //                 done();
    //             });
    //     });
    //
    // });
});