import { NextFunction, Request, Response } from 'express';
import { constants as errors } from 'http2';
import * as process from 'process';

function errorHandler(err: any, res: Response) {
  const errorStatus = err?.status ?? errors.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const errorMessage = err.message ?? 'Произошла непредвиденная ошибка';
  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: process.env.NODE_ENV === 'development' ? err?.stack : {},
  });
}

export default errorHandler;
