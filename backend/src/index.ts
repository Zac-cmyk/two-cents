import dotenv from 'dotenv';
dotenv.config();

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
