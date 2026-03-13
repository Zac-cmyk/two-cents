import { Router, Request, Response } from 'express';
import { checkHealth } from '../functions/health';

export const healthRouter = Router();

healthRouter.get('/', (req: Request, res: Response) => {
  const result = checkHealth();
  res.status(200).json(result);
});
