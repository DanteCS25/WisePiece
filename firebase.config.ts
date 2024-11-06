// firebase.config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGlKxCmcjKQoqBkL1kEiBDWVCuEshUV7c",
  authDomain: "wisepiece-777cf.firebaseapp.com",
  projectId: "wisepiece-777cf",
  storageBucket: "wisepiece-777cf.appspot.com",
  messagingSenderId: "54382410375",
  appId: "1:54382410375:web:5a83f249cd132a3dd41622",
  measurementId: "G-6SS6NQBYB8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
export const db = getFirestore(app);

export { auth, firestore, storage };
