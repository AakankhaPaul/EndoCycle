// ============================================================
//  EndoCycle — Config Template
//  Copy this file to config.js and fill in your own keys.
//  config.js is gitignored and should NEVER be committed.
// ============================================================

const ENV = {
  // Firebase project configuration
  // Get these from: https://console.firebase.google.com → Project Settings
  FIREBASE_API_KEY:         "YOUR_FIREBASE_API_KEY",
  FIREBASE_AUTH_DOMAIN:     "YOUR_PROJECT_ID.firebaseapp.com",
  FIREBASE_PROJECT_ID:      "YOUR_PROJECT_ID",
  FIREBASE_STORAGE_BUCKET:  "YOUR_PROJECT_ID.firebasestorage.app",
  FIREBASE_MESSAGING_ID:    "YOUR_MESSAGING_SENDER_ID",
  FIREBASE_APP_ID:          "YOUR_APP_ID",

  // Google Gemini AI key
  // Get this from: https://aistudio.google.com/app/apikey
  GEMINI_API_KEY: "YOUR_GEMINI_API_KEY",
};

export default ENV;
