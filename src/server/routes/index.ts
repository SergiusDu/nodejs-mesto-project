import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { errors } from 'celebrate';
import limiter from '../middlewares/limiter';
import sanitizeRequestBody from '../middlewares/sanitizeRequestBody';
import { errorLogger, requestLogger } from '../middlewares/logger';
import userAuthRouter from './user-auth-router';
import { USER_BASE_ROUTE } from '../constants/user';
import userRouter from './user-router';
import { CARD_BASE_ROUTE } from '../constants/card';
import cardRouter from './card-router';
import errorHandler from '../middlewares/errorHandler';
import auth from '../middlewares/auth';
import notFoundMiddleware from '../middlewares/notFoundMiddleware';

const router = Router();

router.use(limiter);
router.use(express.json());
router.use(cookieParser());
router.use(helmet());
router.use(sanitizeRequestBody);
router.use(requestLogger);
router.use(userAuthRouter);
router.use(auth);

router.use(USER_BASE_ROUTE, userRouter);
router.use(CARD_BASE_ROUTE, cardRouter);
router.use(notFoundMiddleware);
router.use(errorLogger);
router.use(errorHandler);
router.use(errors());

export default router;
