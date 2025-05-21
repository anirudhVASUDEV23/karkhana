# Project Cost Tracker

A web application for tracking project expenses efficiently. Built with React, Redux Toolkit, Firebase, and Chakra UI.

## Features

- User authentication with Firebase
- Add, edit, and delete project items with costs
- Add, edit, and delete other miscellaneous costs
- Real-time calculation of total project costs
- Responsive design that works on mobile, tablet, and desktop
- Secure data storage with Firebase Firestore

## Setup Instructions

1. Create a Firebase project:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Enable Firebase Authentication with email/password
   - Create a Firestore database in production mode

2. Update Firebase configuration:
   - In the Firebase console, go to Project settings
   - Under "Your apps", register a web app
   - Copy the Firebase config object
   - Replace the placeholder values in `src/firebase/config.ts` with your actual Firebase configuration

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

- `/src/components`: UI components organized by feature
- `/src/firebase`: Firebase configuration
- `/src/store`: Redux store configuration and slices
- `/src/types`: TypeScript type definitions

## Technologies Used

- React.js - UI library
- Redux Toolkit - State management
- Chakra UI - Component library
- Firebase Authentication - User authentication
- Firebase Firestore - Cloud database
- TypeScript - Type safety

## Deployment

To build the application for production:

```
npm run build
```

You can then deploy the contents of the `dist` directory to any static site hosting service.