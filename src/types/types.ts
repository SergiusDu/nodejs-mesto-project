export interface IUser {
  _id: string;
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    export interface Request {
      user?: Partial<IUser>;
    }
  }
}
