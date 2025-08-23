// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  collection,
  deleteDoc,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_apiKey,
  authDomain: import.meta.env.VITE_FB_authDomain,
  projectId: import.meta.env.VITE_FB_projectId,
  storageBucket: import.meta.env.VITE_FB_storageBucket,
  messagingSenderId: import.meta.env.VITE_FB_messagingSenderId,
  appId: import.meta.env.VITE_FB_appId,
  measurementId: import.meta.env.VITE_FB_measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
};
export const storage = getStorage(app);
export { ref, uploadBytes, getDownloadURL };
export const db = getFirestore(app);
export { doc, setDoc, addDoc, getDoc, getDocs, collection, deleteDoc };
