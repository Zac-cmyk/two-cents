# Two Cents

Backend-only repository for the Two Cents project.

## Status

- The `frontend` folder has been removed and deprecated from this repository.
- React Native setup will be managed manually outside this repo.

## Project Structure

```
two-cents/
└── backend/                 # Express.js backend
    ├── src/
    │   ├── config/         # Configuration files
    │   ├── controllers/    # Request handlers
    │   ├── functions/      # Endpoint business logic
    │   ├── middleware/     # Custom middleware
    │   ├── models/         # Database models
    │   ├── routes/         # API routes
    │   ├── utils/          # Utility functions
    │   └── index.ts        # Entry point
    ├── package.json
    ├── tsconfig.json
    └── README.md
```

## Getting Started

Run the backend locally:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The API runs on `http://localhost:5000` by default.

## API

- `GET /api/health` - Health check

See `backend/README.md` for backend details.
