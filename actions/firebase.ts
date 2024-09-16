// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBazGFYGtzN5FA7zHv9lObU_nGu36-FIqU",
  authDomain: "career-sphere.firebaseapp.com",
  projectId: "career-sphere",
  storageBucket: "career-sphere.appspot.com",
  messagingSenderId: "361297494012",
  appId: "1:361297494012:web:5d56e5a5b5e5174d2d7c79",
  measurementId: "G-H6P9537G9M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// For authentication
export const auth = getAuth(app);   
// Firestore database        
export const db = getFirestore(app);  
// Cloud storage      
export const storage = getStorage(app);     
const analytics = getAnalytics(app);