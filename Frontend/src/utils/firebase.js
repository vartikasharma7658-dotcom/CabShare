import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD7fI5GvHtuABAZcSk0H7brEEyWq4t7rMc",
  authDomain: "our-cabshare-project-2026.firebaseapp.com",
  projectId: "our-cabshare-project-2026",
  storageBucket: "our-cabshare-project-2026.firebasestorage.app",
  messagingSenderId: "746019696652",
  appId: "1:746019696652:web:b58ec21ae6eed4e3bf3e29",
  measurementId: "G-Q8NXHVQ1X0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

