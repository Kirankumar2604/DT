// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
//import { get } from "http";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "notezy-a29e6.firebaseapp.com",
  projectId: "notezy-a29e6",
  storageBucket: "notezy-a29e6.firebasestorage.app",
  messagingSenderId: "671532383352",
  appId: "1:671532383352:web:06a39833a5a9d2fa96418d",
  measurementId: "G-1KC2KW7CBV"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
//const analytics = getAnalytics(app);