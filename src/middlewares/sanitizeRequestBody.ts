import {NextFunction, Request, Response} from 'express';
import escapeHTML from 'escape-html';

const sanitizeRequestBody = (req: Request, res: Response, next: NextFunction) => {
  if(req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(
      (key: string) => {
        req.body[key as keyof typeof req.body] = escapeHTML(
          req.body[key as keyof typeof req.body]);
      }
    )
  }
  next();
}

export default sanitizeRequestBody;