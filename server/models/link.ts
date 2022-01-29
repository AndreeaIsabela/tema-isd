import { Document, Schema, Model, model } from "mongoose";
const moment = require('moment');

interface ILink {
  email: string,
  date: string,
  filePath?: string,
  updateDate?: string
}

export interface ILinkModel extends ILink, Document {
  expiredForUser: boolean;
};

export const linkSchema: Schema = new Schema({
  email: {
    type: String,
    validate: {
      validator: function (email) {
        const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const gmailReg = /^(.+?)\++(.+?)@gmail.com/;
        return emailReg.test(email) || gmailReg.test(email);
      },
      message: 'not a valid email'
    },
    required: [true, 'User email required']
  },
  date: {
    required: true,
    type: String
  },
  filePath: {
    type: String
  },
  updateDate: {
    type: String
  }
});

linkSchema.virtual('expiredForUser').get(function () {
  if (this.date) {
    const date = moment(this.date);
    const now = moment();
    const diffInDays = now.diff(date, 'days');
    const response = (diffInDays >= 7) || (typeof this.filePath != 'undefined');
    return response;
  }
  else {
    return true;
  }
});
export const linkModel: Model<ILinkModel> = model<ILinkModel>('Link', linkSchema);
export type LinkModel = typeof linkModel;
