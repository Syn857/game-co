// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvyQVDbDEuV1G422xmcj6MkBU-QU6lv9M",
  authDomain: "game-4fd04.firebaseapp.com",
  projectId: "game-4fd04",
  storageBucket: "game-4fd04.firebasestorage.app",
  messagingSenderId: "346938479519",
  appId: "1:346938479519:web:817cb0e485a1a3d27d23aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;