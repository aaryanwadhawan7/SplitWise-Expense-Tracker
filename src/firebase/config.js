import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAECoD2vMZTQOHEBmNE7xkO0QYRWVeN93Y",
  authDomain: "splitwise-expense-tracke-58f83.firebaseapp.com",
  projectId: "splitwise-expense-tracke-58f83",
  storageBucket: "splitwise-expense-tracke-58f83.firebasestorage.app",
  messagingSenderId: "433543821371",
  appId: "1:433543821371:web:45082442c96515691c441e",
  measurementId: "G-YNVVL8Y0GV"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);        // for authentication
const db = getFirestore(app);     // for Firestore DB
const storage = getStorage(app);  // for cloud storage
const analytics = getAnalytics(app); // for analytics

// Export firebase instances
export { app, auth, db, storage, analytics };
