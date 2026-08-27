import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRnIDws5w2gXeDxFYIebYEOdzFw4kegU4",
  authDomain: "pitchbid-efd24.firebaseapp.com",
  projectId: "pitchbid-efd24",
  storageBucket: "pitchbid-efd24.firebasestorage.app",
  messagingSenderId: "837073947736",
  appId: "1:837073947736:web:ba13760481d5420cf04e2d",
  measurementId: "G-GLX0MJLPCS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getViewerCode() {
  const docRef = doc(db, "chess_tournaments", "D3FQ94");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Found Tournament:", docSnap.data().name);
    console.log("Player Code:", docSnap.data().playerCode);
    console.log("Viewer Code:", docSnap.data().viewerCode);
  } else {
    console.log("No such document!");
  }
  process.exit(0);
}

getViewerCode();
