import { Model, model, Schema } from 'mongoose';
import { IUser } from '../types/user';
import {
  USER_ABOUT_MAX_LENGTH,
  USER_ABOUT_MIN_LENGTH,
  USER_EMAIL_MAX_LENGTH,
  USER_EMAIL_MIN_LENGTH,
  USER_NAME_MAX_LENGTH,
  USER_NAME_MIN_LENGTH,
} from '../constants/user';
import {
  MONGOOSE_EMAIL_VALIDATOR,
  MONGOOSE_URL_VALIDATOR,
} from '../utils/validation/common';

interface IUserModel extends Model<IUser> {
  createUser(): void;
}

const UserScheme = new Schema<IUser, IUserModel>(
  {
    email: {
      type: String,
      minlength: USER_EMAIL_MIN_LENGTH,
      maxlength: USER_EMAIL_MAX_LENGTH,
      required: true,
      unique: true,
      index: true,
      validate: MONGOOSE_EMAIL_VALIDATOR,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      minlength: USER_NAME_MIN_LENGTH,
      maxlength: USER_NAME_MAX_LENGTH,
      required: true,
    },
    about: {
      type: String,
      minlength: USER_ABOUT_MIN_LENGTH,
      maxlength: USER_ABOUT_MAX_LENGTH,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
      validate: MONGOOSE_URL_VALIDATOR,
    },
  },
);
UserScheme.statics.createUser = function createUser(user: IUser) {
  return this.create<IUser>(user);
};
export default model<IUser>('user', UserScheme);
