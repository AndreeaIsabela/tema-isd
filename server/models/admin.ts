import { Document, Schema, Model, model } from "mongoose";
const SHA256 = require('crypto-js/sha256');

interface IAdmin {
  password: string
}

export interface IAdminModel extends IAdmin, Document {
  comparePassword: Function
};

export const adminSchema: Schema = new Schema({
  password: {
    required: true,
    type: String
  },
});

adminSchema.pre('save', function (next) {
  const adminUser = this as IAdminModel;

  // only hash the password if it has been modified (or is new)
  if (!adminUser.isModified('password')) {
    return next();
  }
  // hash the password
  const hash = SHA256(adminUser.password);
  adminUser.password = hash;
  next();
});

adminSchema.methods.comparePassword = function (candidatePassword) {
  try {
    return SHA256(candidatePassword) == this.password; // eslint-disable-line eqeqeq
  }
  catch (err) {
    console.log(err);
  }
};

export const adminModel: Model<IAdminModel> = model<IAdminModel>('Admin', adminSchema);
export type AdminModel = typeof adminModel;
