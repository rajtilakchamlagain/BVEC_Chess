import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
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
  
  let count = 0;
  for (const tDoc of tournamentsSnap.docs) {
    const playersSnap = await getDocs(collection(db, 'chess_tournaments', tDoc.id, 'players'));
    playersSnap.forEach(pDoc => {
      const p = pDoc.data();
      if (p.rollNumber && p.rollNumber.toString().trim() === '1') {
          count++;
          console.log(`Document ID: ${pDoc.id}, Name: ${p.name}, Wins: ${p.wins}`);
      }
    });
  }
  
  console.log(`Total times rollNumber is 1: ${count}`);
}

check().then(() => process.exit(0)).catch(console.error);
