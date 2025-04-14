// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDioj_DkvahpD34-Je2fXHAOupl_a5IBkA",
  authDomain: "ctverse-b460e.firebaseapp.com",
  databaseURL: "https://ctverse-b460e-default-rtdb.firebaseio.com",
  projectId: "ctverse-b460e",
  storageBucket: "ctverse-b460e.firebasestorage.app",
  messagingSenderId: "163059560715",
  appId: "1:163059560715:web:113e6d45a2da76653a720e",
  measurementId: "G-J12PKY8SM4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;