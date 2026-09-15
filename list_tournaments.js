import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import fs from 'fs';

// Read firebase.js to get config
const firebaseConfigStr = fs.readFileSync('src/firebase.js', 'utf8');
const configMatch = firebaseConfigStr.match(/const firebaseConfig = ({[\s\S]*?});/);
let firebaseConfig;
eval(`firebaseConfig = ${configMatch[1]}`);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const tournamentsSnap = await getDocs(collection(db, 'chess_tournaments'));
  console.log(`Total tournaments: ${tournamentsSnap.size}`);
  
  for (const tDoc of tournamentsSnap.docs) {
    console.log(`- ID: ${tDoc.id}, Name: ${tDoc.data().name}, createdAt: ${tDoc.data().createdAt}`);
  }
}

check().then(() => process.exit(0)).catch(console.error);
