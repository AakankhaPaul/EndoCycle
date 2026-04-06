import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYIMBpNnGhcy-wzjmUtmOsBo9hU7vfrsc",
  authDomain: "endocycle-43b86.firebaseapp.com",
  projectId: "endocycle-43b86",
  storageBucket: "endocycle-43b86.firebasestorage.app",
  messagingSenderId: "253560551444",
  appId: "1:253560551444:web:2ea0d511969ed8c4188f01"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase services with the app instance
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export the initialized services for use throughout your application
export { app, auth, db, storage };
