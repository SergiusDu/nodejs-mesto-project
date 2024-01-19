import { Schema, Model, model } from 'mongoose';

interface IUser {
  name: string;
  about: string;
  avatar: string;
}
interface IUserModel extends Model<IUser> {
  createUser(): void;
}

const UserScheme = new Schema<IUser, IUserModel>(
  {
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
    },
  },
);
UserScheme.statics.createUser = function (user: IUser) {
  return this.create<IUser>(user);
};
export default model<IUser>('user', UserScheme);
