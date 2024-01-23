import { Schema, Model, model } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import { isURL } from 'validator';
import { URL_REGEXP } from '../constants/common';
import { IUser } from '../types/user';

interface IUserModel extends Model<IUser> {
  createUser(): void;
}

const UserScheme = new Schema<IUser, IUserModel>(
  {
    email: {
      type: String,
      minlength: 3,
      maxlength: 30,
      required: true,
      unique: true,
      index: true,
      validate(input: string) {
        return isEmail(input);
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 300,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
      validate(input: string) {
        return isURL(input) && URL_REGEXP.test(input);
      },
    },
  },
);
UserScheme.statics.createUser = function (user: IUser) {
  return this.create<IUser>(user);
};
export default model<IUser>('user', UserScheme);
