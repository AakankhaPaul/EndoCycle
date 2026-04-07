// ============================================================
//  EndoCycle — Central API Key Configuration
//  ⚠️  This file is listed in .gitignore — DO NOT commit it.
//  Copy config.example.js to config.js and fill in your keys.
// ============================================================

const ENV = {
  // Firebase project configuration
  FIREBASE_API_KEY: "AIzaSyAYIMBpNnGhcy-wzjmUtmOsBo9hU7vfrsc",
  FIREBASE_AUTH_DOMAIN: "endocycle-43b86.firebaseapp.com",
  FIREBASE_PROJECT_ID: "endocycle-43b86",
  FIREBASE_STORAGE_BUCKET: "endocycle-43b86.firebasestorage.app",
  FIREBASE_MESSAGING_ID: "253560551444",
  FIREBASE_APP_ID: "1:253560551444:web:2ea0d511969ed8c4188f01",

  // Google Gemini AI key — REMOVED: Do not put secret keys in this file as it is tracked by Git.
  // We will move this to a secure Vercel Serverless Function instead.
  GEMINI_API_KEY: "",
};

export default ENV;
