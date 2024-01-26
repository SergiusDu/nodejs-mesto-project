import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { isValidJwsUserSignature } from '../utils/validation/user';
import { IJwtUserSignature } from '../types/user';

export default (req: Request, _: Response, next: NextFunction) => {
  new Promise<void>((resolve, reject) => {
    const cookies = req.headers.cookie;
    if (!cookies) {
      reject(new Error(`Не обнаружены куки ${req.url}`));
      return;
    }
    const cookieArray = cookies.split(';');
    const jwtToken = cookieArray.find((cookie) => cookie.startsWith('jwt='))?.split('jwt=')[1];
    if (!jwtToken) {
      reject(new Error(`Необходимо авторизоваться ${req.url}`));
      return;
    }
    try {
      const payload = jwt.verify(jwtToken, 'some-secret-key') as unknown as IJwtUserSignature;
      if (!isValidJwsUserSignature(payload)) {
        reject(new Error(`Ошибка авторизации. Необходимо авторизоваться ${req.url}`));
        return;
      }
      req.user = payload;
      resolve();
    } catch (e) {
      reject(e);
    }
  })
    .then(() => next())
    .catch((e) => {
      next(e);
    });
};
