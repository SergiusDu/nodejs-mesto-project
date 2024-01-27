import express from 'express';
import dotenv from 'dotenv';
import * as path from 'path';
import connectDb from './db/database';
import router from './routes';

dotenv.config();
const port = parseInt(process.env.PORT ?? '3000', 10);
connectDb();
const app = express();
const buildPath = path.join(__dirname, '../../build');
app.use(express.static(buildPath));
app.use(router);
app.listen(port, () => {
  console.log(`[server]: Приложение запущено на http://localhost:${port}`);
});

export default app;
