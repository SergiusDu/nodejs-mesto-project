import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import * as process from 'process';
import { errors } from 'celebrate';
import connectDb from './db/database';
import userRouter from './routes/users';
import sanitizeRequestBody from './middlewares/sanitizeRequestBody';

dotenv.config();
const port = process.env['PORT '] ?? 3000;
const app = express();
app.use(express.json());
app.use(sanitizeRequestBody);
connectDb();
app.get('/', (_: Request, res: Response) => {
  res.send('Hello from Server');
});
app.use('/users', userRouter);
app.use(errors());
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
