import {
  ErrorRequestHandler, NextFunction, Request, Response,
} from 'express';

function errorHandler<ErrorRequestHandler>(err: any, req: Request, res: Response, next: NextFunction) {
  res.status(500);
  next();
}
