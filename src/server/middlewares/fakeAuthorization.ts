import { NextFunction, Request, Response } from 'express';

function fakeAuthorization(req: Request, _: Response, next: NextFunction) {
  req.user = {
    _id: '65a2f41412d10cc4907718c1',
  };
  next();
}

export default fakeAuthorization;
