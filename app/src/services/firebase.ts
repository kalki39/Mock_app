// Import the functions you need from the SDKs you need
// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLmHvfX4fno4OyoncAownr7JS2JlGkZdI",
  authDomain: "mocktestapp-a63bb.firebaseapp.com",
  projectId: "mocktestapp-a63bb",
  storageBucket: "mocktestapp-a63bb.firebasestorage.app",
  messagingSenderId: "763492275127",
  appId: "1:763492275127:web:998115e49cb4f4a2c84e32",
  measurementId: "G-QS2XC11DK6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);