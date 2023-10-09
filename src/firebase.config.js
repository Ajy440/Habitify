// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7-0TlBWYQt_0Gdityd_b0d15wq6Ko520",
  authDomain: "habiter-a3c5d.firebaseapp.com",
  projectId: "habiter-a3c5d",
  storageBucket: "habiter-a3c5d.appspot.com",
  messagingSenderId: "115545266017",
  appId: "1:115545266017:web:0f38d7a9a4fed248ee5720",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
