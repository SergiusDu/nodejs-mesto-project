import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { isValidJwsUserSignature } from '../utils/validation/user';
import { IJwtUserSignature } from '../types/user';
import NotAuthorizedError from '../errors/not-authorized-error';
import {
  getJwtTokenFromBearer,
  getJwtTokenFromCookies,
} from '../utils/server-api';

export default (req: Request, _: Response, next: NextFunction) => {
  new Promise<void>((resolve, reject) => {
    const jwtToken = getJwtTokenFromCookies(req.headers.cookie)
      ?? getJwtTokenFromBearer(req.headers.authorization);
    if (!jwtToken) {
      reject(new NotAuthorizedError(`Необходимо авторизоваться ${req.url}`));
      return;
    }
    try {
      const payload = jwt.verify(jwtToken, 'some-secret-key') as unknown as IJwtUserSignature;
      if (!isValidJwsUserSignature(payload)) {
        reject(new NotAuthorizedError(`Ошибка авторизации. Необходимо авторизоваться ${req.url}`));
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
