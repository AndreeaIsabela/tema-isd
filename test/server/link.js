const assert = require('chai').assert;
const mongoose = require('mongoose');
const LinkModel = require('../../build/server/models/link.js').LinkModel;
const LinkController = require('../../build/server/controllers/link.js').LinkController;
const LinkControllerIns = new LinkController(LinkModel);

describe('Link Tests', function () {
  //Before starting the test, create a sandboxed database connection
  //Once a connection is established invoke done()
  before(function (done) {
    mongoose.connect('mongodb://localhost/testDatabase');
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', function () {
      console.log('We are connected to test database!');
      done();
    });
  });

  describe('AddLink()', function () {
    it('We ada a link and see how many are in the db', async () => {
      const link = new LinkModel({
        email: 'emai@yahoo.com',
        date:
          'Mon Jul 23 2018 21:33:09 GMT+0300'
      });
     await LinkControllerIns.addLink(link);
      const links = await LinkControllerIns.getLinks();
      assert.lengthOf(links, 1);
    });
  });

  describe('GetLink()', function () {
    it('We add an object and see if we can get it by id', async () => {
      const link = new LinkModel({
        email: 'email@yahoo.com',
        date:
          'Mon Jul 22 2018 21:33:09 GMT+0300'
      });
      const addedLink = await LinkControllerIns.addLink(link);
      const returnedLink = await LinkControllerIns.getLink(addedLink._id);
      assert.equal(returnedLink._id.toString(), addedLink._id.toString());
    });
  });

  describe('DeleteLink()', function () {
    it('We add an object and delete it', async () => {
      const link = new LinkModel({
        email: 'email3@yahoo.com',
        date:
          'Mon Jul 24 2018 21:33:09 GMT+0300'
      });
      const addedLink = await LinkControllerIns.addLink(link);
      await LinkControllerIns.deleteLink(addedLink._id);
      const links = await LinkControllerIns.getLinks();
      //we added before 2 collections in the database
      assert.lengthOf(links, 2);
    });
  });

  describe('UpdateLink()', function () {
    it('We add an object and update it', async () => {
      const link = new LinkModel({
        email: 'email4@yahoo.com',
        date:
          'Mon Jul 25 2018 21:33:09 GMT+0300'
      });
      const addedLink = await LinkControllerIns.addLink(link);
      await LinkControllerIns.updateLink(addedLink._id,{updateDate:'Mon Jul 26 2018 21:33:09 GMT+0300',filePath:'path.zip'});
      const returnedLink = await LinkControllerIns.getLink(addedLink._id);
      assert.equal( returnedLink.filePath,'path.zip');
    });
  });

  //After all tests are finished drop database and close connection
  after(function (done) {
    mongoose.connection.db.dropDatabase(function () {
      mongoose.connection.close(done);
    });
  });
});
