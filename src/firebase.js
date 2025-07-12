// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyB5hYdZ82zv7tOldWtfS0tzOvUZvZR3nOc",

  authDomain: "super-mall-7cd2d.firebaseapp.com",

  projectId: "super-mall-7cd2d",

  storageBucket: "super-mall-7cd2d.firebasestorage.app",

  messagingSenderId: "627381076263",

  appId: "1:627381076263:web:adfef19f5b4a86f3b66902",

  measurementId: "G-SW3XYM7F1E"

};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export {app, auth, db}