// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFACFnh_FRrongvgFbucZ1FkeCgik8DwY",
  authDomain: "ballclicker-91a11.firebaseapp.com",
  projectId: "ballclicker-91a11",
  storageBucket: "ballclicker-91a11.appspot.com",
  messagingSenderId: "811104360453",
  appId: "1:811104360453:web:3cd207bdddd257e635e46c",
  measurementId: "G-LMTPDKSZKP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth
const auth = getAuth(app);
signInAnonymously(auth).catch(error => {
  console.error('Error signing in anonymously:', error);
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db, onAuthStateChanged, doc, setDoc, getDoc };
