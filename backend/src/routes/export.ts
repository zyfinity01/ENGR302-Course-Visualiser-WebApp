import { Router } from 'express';

const router = Router();

router.get('/csv', (req, res) => {
  res.status(200).send('hello world');
});

export default router;
