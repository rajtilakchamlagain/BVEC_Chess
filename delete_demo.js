import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

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

async function listTournaments() {
  console.log("Listing all tournaments...");
  const snapshot = await getDocs(collection(db, 'chess_tournaments'));
  
  for (const document of snapshot.docs) {
    const data = document.data();
    console.log(`- ${data.name} (ID: ${document.id})`);
    
    // Check for fuzzy match on Demo
    if (data.name && data.name.toLowerCase().includes("demo")) {
      console.log(`>>> Deleting ${data.name}...`);
      const playersSnap = await getDocs(collection(db, 'chess_tournaments', document.id, 'players'));
      for (const pDoc of playersSnap.docs) {
        await deleteDoc(doc(db, 'chess_tournaments', document.id, 'players', pDoc.id));
      }
      await deleteDoc(doc(db, 'chess_tournaments', document.id));
      console.log(`>>> Deleted.`);
    }
  }
  process.exit(0);
}

listTournaments();
