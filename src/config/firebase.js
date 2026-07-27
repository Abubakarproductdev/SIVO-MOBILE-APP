// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from 'firebase/firestore';

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyAbWh3AuX4cxMx3O7b-631SlYLh9hUs0cM",
  authDomain: "sivoapp1.firebaseapp.com",
  projectId: "sivoapp1",
  storageBucket: "sivoapp1.appspot.com",
  messagingSenderId: "636161238154",
  appId: "1:636161238154:web:53b316739da46e3c833973",
};

// Initialize Firebase
let auth;
let db;
try {
  const app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  db = getFirestore(app);
} catch (error) {
  console.log("Firebase initialization error:", error);
}

export {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  updateDoc,
  setDoc,
};
