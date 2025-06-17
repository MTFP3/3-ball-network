// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import { getFunctions } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-functions.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4XJLc3_CLvOhvMsytQzfabgZQt3y5g9",
  authDomain: "ball-network-web.firebaseapp.com",
  projectId: "ball-network-web",
  storageBucket: "ball-network-web.appspot.com",
  messagingSenderId: "749015998465",
  appId: "1:749015998465:web:59ac026f3f4c2ec5da350a",
  measurementId: "G-ZS07SKSRRL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);