# Two Cents

A full-stack application with an Express.js backend and React Native frontend for the AllUni hackathon.

## Project Structure

```
two-cents/
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
└── frontend/                # React Native frontend (Expo)
    ├── src/
    │   ├── assets/         # Images, fonts, etc.
    │   ├── components/     # Reusable components
    │   ├── context/        # React context
    │   ├── hooks/          # Custom hooks
    │   ├── navigation/     # Navigation config
    │   ├── screens/        # Screen components
    │   ├── services/       # API services
    │   ├── utils/          # Utility functions
    │   └── App.tsx         # Root component
    ├── app.json
    ├── package.json
    ├── tsconfig.json
    └── README.md
```

## Getting Started

### Backend Setup

Navigate to the backend directory and follow the instructions in `backend/README.md`:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

Navigate to the frontend directory and follow the instructions in `frontend/README.md`:

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

Then select your platform (iOS, Android, or Web).

## Technology Stack

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **MongoDB** with **Mongoose** for database
- **JWT** for authentication
- **CORS** for cross-origin requests
- **bcryptjs** for password hashing

### Frontend
- **React Native** with **Expo**
- **TypeScript** for type safety
- **React Navigation** for routing
- **Axios** for API requests
- **React Context** for state management

## Development

### Available Scripts

#### Backend
```bash
npm run dev      # Start development server with auto-reload
npm run build    # Build TypeScript to JavaScript
npm run lint     # Lint TypeScript files
npm run format   # Format code with Prettier
npm test         # Run tests
```

#### Frontend
```bash
npm start        # Start Expo development server
npm run ios      # Build for iOS
npm run android  # Build for Android
npm run web      # Build for web
npm run lint     # Lint code
npm run format   # Format code
```

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/two-cents
JWT_SECRET=your_jwt_secret_key_here
CORS_ORIGIN=http://localhost:8081
```

### Frontend (.env)
```
EXPO_PUBLIC_API_URL=http://localhost:5000/api
EXPO_PUBLIC_ENVIRONMENT=development
```

## API Documentation

The backend provides RESTful API endpoints. Key endpoints:

- `GET /api/health` - Health check

For more details, see `backend/README.md`

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC
