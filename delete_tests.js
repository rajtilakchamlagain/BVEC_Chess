import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";

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

async function deleteTests() {
  console.log("Fetching tournaments...");
  const q = collection(db, 'chess_tournaments');
  const snapshot = await getDocs(q);
  
  let deletedCount = 0;
  for (const document of snapshot.docs) {
    const data = document.data();
    if (data.name && data.name.toLowerCase().includes('test')) {
      console.log(`Deleting tournament: ${data.name} (ID: ${document.id})`);
      await deleteDoc(doc(db, 'chess_tournaments', document.id));
      deletedCount++;
    }
  }
  
  console.log(`Successfully deleted ${deletedCount} test tournaments.`);
  process.exit(0);
}

deleteTests().catch(console.error);
