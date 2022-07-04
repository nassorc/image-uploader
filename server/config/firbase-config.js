const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
  appId: process.env.FB_APP_ID
};

// creates connection with config object
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = { storage }