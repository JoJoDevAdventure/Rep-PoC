// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5WqjYDIEJKI6PyLhv7vww0xvoI5SLBHY",
  authDomain: "replicaide-poc.firebaseapp.com",
  projectId: "replicaide-poc",
  storageBucket: "replicaide-poc.firebasestorage.app",
  messagingSenderId: "1049930447300",
  appId: "1:1049930447300:web:febcae655c291061014c91",
  measurementId: "G-P3GS645QTB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);