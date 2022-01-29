import * as jwt from "jsonwebtoken";
import { config } from '../config/config';
import { IAdminModel, AdminModel } from "../models/admin";


export class AdminController {
  model: AdminModel;
  constructor(adminModel: AdminModel) {
    this.model = adminModel;
  }

  jwtSignUser(user): String {
    const ONE_DAY: number = 60 * 60 * 24;
    return jwt.sign(user, config.authentification.jwtSecret, {
      expiresIn: ONE_DAY
    });
  }

  async getAdmins(): Promise<IAdminModel[]> {
    return await this.model.find();
  }

  async getAdminById(id): Promise<IAdminModel> {
    return await this.model.findById(id);
  }

  async addAdmin(admin): Promise<IAdminModel> {
    console.log(admin);
    const newAdmin: any = new this.model(admin);
    return await newAdmin.save();
  }

  async updateAdmin(id, admin): Promise<IAdminModel> {
    const updatedAdmin: any = new this.model(await this.model.findOneAndUpdate({ _id: id }, admin, { new: true }));
    return updatedAdmin.save();
  }

  async getAdmin(): Promise<IAdminModel> {
    return await this.model.findOne();
  }

  async deleteAdmin(id): Promise<IAdminModel> {
    return await this.model.findByIdAndRemove(id);
  }

}
