import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { errors } from 'celebrate';
import { requestLogger, errorLogger } from './middlewares/logger';
import connectDb from './db/database';
import userRouter from './routes/users';
import sanitizeRequestBody from './middlewares/sanitizeRequestBody';
import errorHandler from './middlewares/errorHandler';

dotenv.config();
// TODO Fix port issue
const port = process.env.PORT ?? 3000;
const app = express();
app.use(express.json());
app.use(sanitizeRequestBody);
app.use(requestLogger);

connectDb();
app.get('/', (_: Request, res: Response) => {
  res.send('Hello from Server');
});
app.use('/users', userRouter);

app.use(errorLogger);
app.use(errorHandler);
app.use(errors());
app.listen(3000, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
