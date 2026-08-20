import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBRnIDws5w2gXeDxFYIebYEOdzFw4kegU4",
  authDomain: "pitchbid-efd24.firebaseapp.com",
  projectId: "pitchbid-efd24",
  storageBucket: "pitchbid-efd24.firebasestorage.app",
  messagingSenderId: "837073947736",
  appId: "1:837073947736:web:ba13760481d5420cf04e2d",
  measurementId: "G-GLX0MJLPCS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
