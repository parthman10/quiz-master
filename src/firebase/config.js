// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED, initializeFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCE1piO8ZBLiO_nfbmZ4C-cGJiMRqEzElU",
    authDomain: "quiz-app-leaderboard-944f8.firebaseapp.com",
    projectId: "quiz-app-leaderboard-944f8",
    storageBucket: "quiz-app-leaderboard-944f8.firebasestorage.app",
    messagingSenderId: "794263650376",
    appId: "1:794263650376:web:34e832b54294e8b65ed87d",
    measurementId: "G-H3SBSF736G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with optimized settings
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: true,
  useFetchStreams: false // Changed to false for better compatibility
});

// Enable offline persistence
try {
  enableIndexedDbPersistence(db);
} catch (err) {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support persistence.');
  }
}

export { db };