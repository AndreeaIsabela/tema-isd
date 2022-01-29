import { Router } from "express";
const adminRoutes: Router = Router();
import { AdminController } from "../controllers/admin";
import { adminModel, IAdminModel } from "../models/admin";

const jwtService = require('../middleware/authentificationMiddleware');

// injecting the admin model in the controller instance
const adminController: AdminController = new AdminController(adminModel);

adminRoutes.post('/login', async (req, res) => {
  try {
    const admin: IAdminModel = await adminController.getAdmin();

    if (admin.comparePassword(req.body.password) === true) {
      const adminJson: JSON = admin.toJSON();
      res.send({
        token: adminController.jwtSignUser(adminJson)
      });
      return res.status(200).end();
    }
    return res.status(401).end();
  }
  catch (err) {
    console.error(err);
    return res.status(500).end();
  }
});

adminRoutes.get('/', jwtService.authentication, async (req, res) => {
  try {
    const admins: IAdminModel[] = await adminController.getAdmins();
    res.json(admins);
  } catch (err) {
    return res.status(500).end();
  }
});

adminRoutes.get('/:id', jwtService.authentication, async (req, res) => {
  try {
    const admin: IAdminModel = await adminController.getAdminById(req.params.id);
    res.json(admin);
  }
  catch (err) {
    console.error(err);
    return res.status(500).end();
  }
});

adminRoutes.post('/', async (req, res) => {
  try {

    await adminController.addAdmin(req.body);
    return res.status(200).end();
  } catch (err) {
    return res.status(500).end();
  }
});

adminRoutes.put('/:id', jwtService.authentication, async (req, res) => {
  try {
    const updatedAdmin: IAdminModel = await adminController.updateAdmin(req.params.id, req.body);
    const updatedAdminJson: string = updatedAdmin.toJSON();
    res.send({
      user: updatedAdminJson,
      token: adminController.jwtSignUser(updatedAdminJson)
    });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

adminRoutes.delete('/:id', jwtService.authentication, async (req, res) => {
  try {
    await adminController.deleteAdmin(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

module.exports = adminRoutes;
