import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    export interface Request {
      user?: string | jwt.JwtPayload;
    }
  }
}
export type MongooseResponse<T> = (Document<unknown, {}, T> & T) | null;
