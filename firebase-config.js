// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFACFnh_FRrongvgFbucZ1FkeCgik8DwY",
  authDomain: "ballclicker-91a11.firebaseapp.com",
  projectId: "ballclicker-91a11",
  storageBucket: "ballclicker-91a11.appspot.com",
  messagingSenderId: "811104360453",
  appId: "1:811104360453:web:72742714e37a51ed35e46c",
  measurementId: "G-NB1XDEQ7M9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Sign in anonymously
signInAnonymously(auth).catch(error => {
  console.error('Error signing in anonymously:', error);
});

export { auth, db, onAuthStateChanged, doc, setDoc, getDoc };
