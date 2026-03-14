import dotenv from 'dotenv';
dotenv.config();
import { updateUser, UserRecord } from './functions/users';
import { Request, Response } from 'express';

import express, { Express } from 'express';
import cors from 'cors';
import { Server } from 'node:http';
import { verifyDatabaseConnection } from './config/database';

// Load environment variables

const app: Express = express();
const initialPort = Number(process.env.PORT || 5000);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to the Two Cents API!');
});

// Routes
import { healthRouter } from './routes/health.routes';
app.use('/api/health', healthRouter);

// Set income
app.put('/users/:userId/income', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { income } = req.body;

  if (income !== null && typeof income !== 'number') {
    return res.status(400).json({ error: 'Income must be a number or null' });
  }

  try {
    const updatedUser: UserRecord | null = await updateUser(userId, { income });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(updatedUser);
  } catch (err) {
    console.error('Failed to update income:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// set pay_period
app.put('/users/:userId/pay_period', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { pay_period } = req.body;

  if (pay_period !== null && typeof pay_period !== 'number') {
    return res.status(400).json({ error: 'Income must be a number or null' });
  }

  try {
    const updatedUser: UserRecord | null = await updateUser(userId, { pay_period });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(updatedUser);
  } catch (err) {
    console.error('Failed to update pay period:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const startServer = (port: number): Server => {
  const server = app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      console.warn(`[server]: Port ${port} is in use, retrying on ${nextPort}...`);
      startServer(nextPort);
      return;
    }

    console.error('[server]: Failed to start server', error);
    process.exit(1);
  });

  return server;
};

startServer(initialPort);

verifyDatabaseConnection().catch((error) => {
  console.error('[database]: PostgreSQL connection failed', error);
});


export default app;
