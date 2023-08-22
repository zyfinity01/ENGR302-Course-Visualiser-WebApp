import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import UpdateService from './services/UpdateService';

import exportRoutes from './routes/export';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.options('*', cors());

app.use('/api/export', exportRoutes);

async function init() {
  if (UpdateService.shouldUpdate()) {
    console.log('Fetching course data before launching');
    await UpdateService.update();
  }

  app.listen(port, () => {
    console.log(`Backend is running at http://localhost:${port}`);
  });
}

init();
