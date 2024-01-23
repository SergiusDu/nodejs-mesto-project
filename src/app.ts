import express from 'express';
import dotenv from 'dotenv';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import { errorLogger, requestLogger } from './middlewares/logger';
import connectDb from './db/database';
import userRouter from './routes/user-router';
import sanitizeRequestBody from './middlewares/sanitizeRequestBody';
import errorHandler from './middlewares/errorHandler';
import cardRouter from './routes/card-router';
import auth from './middlewares/auth';
import userAuthRouter from './routes/user-auth-router';

dotenv.config();
// TODO Fix port issue
const port = process.env.PORT ?? 3000;
connectDb();
export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(sanitizeRequestBody);
app.use(requestLogger);

app.use(userAuthRouter);

app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(errorLogger);
app.use(errorHandler);
app.use(errors());
app.listen(3000, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
