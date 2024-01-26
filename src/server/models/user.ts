import { Model, model, Schema } from 'mongoose';
import { IUser } from '../types/user';
import {
  USER_ABOUT_KEY,
  USER_ABOUT_MAX_LENGTH,
  USER_ABOUT_MIN_LENGTH,
  USER_DEFAULT_ABOUT,
  USER_DEFAULT_AVATAR,
  USER_DEFAULT_NAME,
  USER_EMAIL_KEY,
  USER_EMAIL_MAX_LENGTH,
  USER_EMAIL_MIN_LENGTH,
  USER_MONGOOSE_MODEL_NAME,
  USER_NAME_KEY,
  USER_NAME_MAX_LENGTH,
  USER_NAME_MIN_LENGTH,
  USER_PASSWORD_KEY,
} from '../constants/user';
import {
  MONGOOSE_EMAIL_VALIDATOR,
  MONGOOSE_URL_VALIDATOR,
} from '../utils/validation/common';
import {
  mongooseMaxLimitsDescriber,
  mongooseMinLimitsDescriber,
  mongooseRequiredFieldDescriber as mongooseRequiredFieldSecriber,
} from '../utils/server-api';

interface IUserModel extends Model<IUser> {
  createUser(): void;
}

const UserScheme = new Schema<IUser, IUserModel>({
  email: {
    type: String,
    minlength: mongooseMinLimitsDescriber(USER_EMAIL_MIN_LENGTH, USER_EMAIL_KEY),
    maxlength: mongooseMaxLimitsDescriber(USER_EMAIL_MAX_LENGTH, USER_EMAIL_KEY),
    required: mongooseRequiredFieldSecriber(USER_EMAIL_KEY),
    unique: true,
    index: true,
    validate: MONGOOSE_EMAIL_VALIDATOR,
  },
  password: {
    type: String,
    required: mongooseRequiredFieldSecriber(USER_PASSWORD_KEY),
    select: false,
  },
  name: {
    type: String,
    minlength: mongooseMinLimitsDescriber(USER_NAME_MIN_LENGTH, USER_NAME_KEY),
    maxlength: mongooseMaxLimitsDescriber(USER_NAME_MAX_LENGTH, USER_NAME_KEY),
    default: USER_DEFAULT_NAME,
  },
  about: {
    type: String,
    minlength: mongooseMinLimitsDescriber(USER_ABOUT_MIN_LENGTH, USER_ABOUT_KEY),
    maxlength: mongooseMaxLimitsDescriber(USER_ABOUT_MAX_LENGTH, USER_ABOUT_KEY),
    default: USER_DEFAULT_ABOUT,
  },
  avatar: {
    type: String,
    default: USER_DEFAULT_AVATAR,
    validate: MONGOOSE_URL_VALIDATOR,
  },
}, {
  versionKey: false,
});
UserScheme.statics.createUser = function createUser(user: IUser) {
  return this.create<IUser>(user);
};
export default model<IUser>(USER_MONGOOSE_MODEL_NAME, UserScheme);
