import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

export interface IUser {
  _id: string;
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
  token?: string;
  __v?: number;
  payload?: JwtPayload | string;
}

export interface IJwtUserSignature {
  _id: string;
  iat: number;
  exp: number;
}
export interface RequestWithJwt extends Request {
  user: IJwtUserSignature;
}

export type RequestOrRequestWithJwt = Request | RequestWithJwt;
