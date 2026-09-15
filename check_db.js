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
  console.log(`Total tournaments: ${tournamentsSnap.size}`);
  
  let rachayitaCount = 0;
  
  for (const tDoc of tournamentsSnap.docs) {
    const playersSnap = await getDocs(collection(db, 'chess_tournaments', tDoc.id, 'players'));
    let found = false;
    playersSnap.forEach(pDoc => {
      const p = pDoc.data();
      if (p.name && p.name.toLowerCase().includes('rachayita')) {
        found = true;
      }
    });
    if (found) {
        rachayitaCount++;
        console.log(`- Found in tournament: ${tDoc.data().name} (ID: ${tDoc.id})`);
    }
  }
  
  console.log(`Total times Rachayita is found: ${rachayitaCount}`);
}

check().then(() => process.exit(0)).catch(console.error);
