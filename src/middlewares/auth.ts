import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { isValidJwsUserSignature } from '../utils/validation/user';

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookies = req.headers.cookie;
    if (!cookies) {
      return next(new Error(`Не обнаружены куки ${req.url}`));
    }
    const cookieArray = cookies.split(';');
    const jwtToken = cookieArray.find((cookie) => cookie.startsWith('jwt='))?.split('jwt=')[1];
    if (!jwtToken) {
      return next(new Error(`Необходимо авторизоваться ${req.url}`));
    }
    const { payload } = jwt.verify(jwtToken, 'some-secret-key', { complete: true });
    if (!isValidJwsUserSignature(payload)) {
      console.error('Ошибка авторизации', req.url);
      return next(new Error(`Необходимо авторизоваться ${req.url}`));
    }
    req.user = payload;
    return next();
  } catch (e) {
    console.error('Ошибка авторизации', req.url);
    return next(e);
  }
};
