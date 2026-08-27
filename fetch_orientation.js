import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyB...", // Needs actual API key, wait I can just use a python script or the existing firebase object if I can import it? 
};
