import Types from 'mongoose';

export interface IUser {
  _id: Types.ObjectId
}

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    export interface Request {
      user?: IUser;
    }
  }
}
