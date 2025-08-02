// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and sign in anonymously
export const auth = getAuth(app);
signInAnonymously(auth).catch((error) => {
  console.error('Anonymous sign-in failed:', error);
});

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Test function to verify Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    const testDoc = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Firebase connection test'
    };
    const docRef = await addDoc(collection(db, 'test'), testDoc);
    console.log('Firebase connection successful! Document written with ID: ', docRef.id);
    return true;
  } catch (error) {
    console.error('Firebase connection failed:', error);
    return false;
  }
};

// Make test function available globally for debugging
(window as any).testFirebaseConnection = testFirebaseConnection;

export default app;