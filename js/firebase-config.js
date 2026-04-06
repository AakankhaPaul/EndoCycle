import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import ENV from "../config.js";

// TODO: Replace the following with your app's Firebase project configuration
import ENV from "../config.js";
const firebaseConfig = {
  apiKey: ENV.FIREBASE_API_KEY,
  authDomain: ENV.FIREBASE_AUTH_DOMAIN,
  projectId: ENV.FIREBASE_PROJECT_ID,
  storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: ENV.FIREBASE_MESSAGING_ID,
  appId: ENV.FIREBASE_APP_ID
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase services with the app instance
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export the initialized services for use throughout your application
export { app, auth, db, storage };

