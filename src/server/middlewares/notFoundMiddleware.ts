// middlewares/notFound.ts
import { NextFunction, Request, Response } from 'express';
import NotFoundError from '../errors/not-found-error';

export default function notFoundMiddleware(req: Request, res: Response, next: NextFunction) {
  next(new NotFoundError('Страница не найдена'));
}
