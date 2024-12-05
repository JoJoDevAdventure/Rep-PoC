// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMP7Tw80flfB_XlEAIsY9esWG2mfg_pYg",
  authDomain: "replicaide-615a1.firebaseapp.com",
  projectId: "replicaide-615a1",
  storageBucket: "replicaide-615a1.firebasestorage.app",
  messagingSenderId: "323931589730",
  appId: "1:323931589730:web:f5d830c4daadc9ed05d53b",
  measurementId: "G-MJX38KY2VX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);