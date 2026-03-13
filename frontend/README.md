# Two Cents Frontend

React Native frontend for the Two Cents application built with Expo.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your API configuration.

### Development

Start the development server:
```bash
npm start
```

Then choose your platform:
- **iOS**: Press `i`
- **Android**: Press `a`
- **Web**: Press `w`

### Building

Build the app for iOS:
```bash
npm run ios
```

Build the app for Android:
```bash
npm run android
```

Build for web:
```bash
npm run web
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
├── App.tsx                  # Root component
├── assets/                  # Images, fonts, etc.
├── components/              # Reusable components
├── context/                 # React context for state management
├── hooks/                   # Custom React hooks
├── navigation/              # Navigation configuration
├── screens/                 # Screen components
├── services/                # API services
└── utils/                   # Utility functions
```

## Environment Variables

Configure your API endpoint in `.env`:
```
EXPO_PUBLIC_API_URL=http://your-api-url/api
EXPO_PUBLIC_ENVIRONMENT=development
```

## Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
