# Two Cents Backend

Express.js backend skeleton for the Two Cents application.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration.

### Development

Run the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000` by default.

### Building

Build the TypeScript code:
```bash
npm run build
```

### Testing

Run tests:
```bash
npm test
```

### Linting and Formatting

Lint the code:
```bash
npm run lint
```

Format the code:
```bash
npm run format
```

## Project Structure

```
src/
├── index.ts                 # Entry point - Express app setup
├── functions/               # Business logic functions
│   └── health.ts           # Health check function
├── routes/                  # API route definitions
│   ├── health.routes.ts     # Health check routes
│   └── example.routes.ts    # Example route template
└── middleware/              # Custom middleware (future)
```

## API Endpoints

- `GET /api/health` - Health check endpoint

## Adding New Endpoints

1. Create a function in `src/functions/`
2. Create routes in `src/routes/` that use the function
3. Import and mount the router in `src/index.ts`

Example:
```typescript
// src/functions/users.ts
export const getUsers = () => {
  return { users: [] };
};

// src/routes/users.routes.ts
import { Router, Request, Response } from 'express';
import { getUsers } from '../functions/users';

export const usersRouter = Router();
usersRouter.get('/', (req: Request, res: Response) => {
  const result = getUsers();
  res.status(200).json(result);
});

// src/index.ts
import { usersRouter } from './routes/users.routes';
app.use('/api/users', usersRouter);
```

## Database Integration

Database integration will be added later. When ready, add your database client and models in appropriate folders.

## Project Structure

```
src/
├── index.ts                 # Entry point
├── config/                  # Configuration files
│   └── database.ts         # Database connection
├── controllers/            # Request handlers
├── middleware/             # Custom middleware
├── models/                 # Database models
├── routes/                 # API routes
└── utils/                  # Utility functions
```

## API Endpoints

- `GET /api/health` - Health check endpoint
