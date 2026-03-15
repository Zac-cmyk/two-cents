import { Router, Request, Response } from 'express';
import { checkHealth } from '../functions/health';
import { isDatabaseReachable } from '../config/database';

export const healthRouter = Router();

healthRouter.get('/', (req: Request, res: Response) => {
  const result = checkHealth();
  res.status(200).json(result);
});

healthRouter.get('/db', async (req: Request, res: Response) => {
  const reachable = await isDatabaseReachable();

  if (!reachable) {
    res.status(503).json({
      message: 'Database is unreachable',
      connected: false,
    });
    return;
  }

  res.status(200).json({
    message: 'Database is reachable',
    connected: true,
  });
});
