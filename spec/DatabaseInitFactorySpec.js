const DatabaseInitFactory = require('../app/DatabaseInitFactory');
const Sequelize = require('sequelize');
const sinon = require('sinon');

describe( "Isolation tests for creating database models", function() {
    var database = 'initial value';
    const seq = {
        define: () => {},
        authenticate: () => {},
        sync:  () => {}
    };

    const blogTableStructure = {
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
    };

    const commentTableStructure = {
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
    };

    const blog = {};

    const comment = {belongsTo: () => {}};

    beforeEach(function (done) {
        database = new DatabaseInitFactory(seq);
        done();
    });

    it( "Factory initialisation successful", function(done){
        expect(database).toBeDefined();
        expect(database != 'initial value');
        done();
    });

    it( "models created successfully", function(done) {

        var stubDefine = sinon.stub( seq, 'define');
        stubDefine.withArgs('blogs', blogTableStructure).returns(blog).onCall(0);
        stubDefine.withArgs('comments', commentTableStructure).returns(comment).onCall(1);

        sinon.stub(comment, 'belongsTo').withArgs(blog).returns(comment);

        var returnBlog = {}, returnComment = {};

        [returnBlog, returnComment] = database.createTables();

        expect(returnBlog).toBe(blog);
        expect(returnComment).toBe(comment);

        comment.belongsTo.restore();
        stubDefine.restore();

        done();

    });

    it( "creates the blog table successfully", function (done) {


        sinon.stub(seq, 'define').withArgs('blogs', blogTableStructure).returns('blogs');

        expect(database.createBlogTable()).toBe('blogs');

        seq.define.restore();

        done();
    });

    it( "creates the comment table successfully", function (done) {

        sinon.stub(seq, 'define').withArgs('comments', commentTableStructure).returns('comments');

        expect(database.createCommentTable()).toBe('comments');

        seq.define.restore();

        done();

    });

    it("erases database if it exists", function(done) {
        sinon.stub(seq, 'authenticate').withArgs().returns(Promise.resolve(database));
        sinon.stub(seq,'sync').withArgs({force: true}).returns(Promise.resolve(true));

        database.eraseDBIfExists()
            .then((res) => {
                expect(res).toBeTruthy();
                seq.authenticate.restore();
                seq.sync.restore();
                done();
            })
    });

    it("does nothing when database does not exist", function(done) {
        sinon.stub(seq, 'authenticate').withArgs().returns(Promise.resolve());

        database.eraseDBIfExists()
            .then((res) => {
                expect(res).toBeUndefined();
                seq.authenticate.restore();
                done();
            })
    })
});