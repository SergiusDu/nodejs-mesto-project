import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { isValidJwsUserSignature } from '../utils/validation/user';

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookies = req.headers.cookie;
    if (!cookies) {
      return next(new Error('Необходимо авторизоваться'));
    }
    const cookieArray = cookies.split(';');
    const jwtToken = cookieArray.find((cookie) => cookie.startsWith('jwt='))?.split('jwt=')[1];
    if (!jwtToken) {
      return next(new Error('Необходимо авторизоваться'));
    }
    const { payload } = jwt.verify(jwtToken, 'some-secret-key', { complete: true });
    if (!isValidJwsUserSignature(payload)) return next(new Error('Необходимо авторизоваться'));
    req.user = payload;
    return next();
  } catch (e) {
    return next(e);
  }
};
