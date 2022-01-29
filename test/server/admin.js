const assert = require('chai').assert;
const mongoose = require('mongoose');
const AdminModel = require('../../build/server/models/admin.js').AdminModel;
const AdminController = require('../../build/server/controllers/admin.js').AdminController;
const AdminControllerIns = new AdminController(AdminModel);

describe('Admin Tests', function () {
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

  describe('AddAdmin()', function () {
    it('We add an admin and see how many are in the db', async () => {
      const admin = new AdminModel({
       password:'password1'
      });
     await AdminControllerIns.addAdmin(admin);
      const admins = await AdminControllerIns.getAdmins();
      assert.lengthOf(admins, 1);
    });
  });

  describe('GetAdminById()', function () {
    it('We add an admin and see if we can get it by id', async () => {
      const admin = new AdminModel({
        password:'password2'
      });
      const addedAdmin = await AdminControllerIns.addAdmin(admin);
      const returnedAdmin = await AdminControllerIns.getAdminById(addedAdmin._id);
      assert.equal(returnedAdmin._id.toString(), addedAdmin._id.toString());
    });
  });

  describe('DeleteAdmin()', function () {
    it('We add an admin object and delete it', async () => {
      const admin = new AdminModel({
        password:'password3'
      });
      const addedAdmin = await AdminControllerIns.addAdmin(admin);
      await AdminControllerIns.deleteAdmin(addedAdmin._id);
      const admins = await AdminControllerIns.getAdmins();
      //we added before 2 collections in the database
      assert.lengthOf(admins, 2);
    });
  });

  //After all tests are finished drop database and close connection
  after(function (done) {
    mongoose.connection.db.dropDatabase(function () {
      mongoose.connection.close(done);
    });
  });
});
