import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import SchedulerService from './services/SchedulerService';
import 'reflect-metadata';

import courseRoutes from './routes/courses';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.options('*', cors());

app.use('/api/courses', courseRoutes);

async function init() {
  await SchedulerService.init();
  app.listen(port, () => {
    console.log(`Backend is running at http://localhost:${port}`);
  });
}

init();
