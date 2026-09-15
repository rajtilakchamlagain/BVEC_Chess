import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfigStr = fs.readFileSync('src/firebase.js', 'utf8');
const configMatch = firebaseConfigStr.match(/const firebaseConfig = ({[\s\S]*?});/);
let firebaseConfig;
eval(`firebaseConfig = ${configMatch[1]}`);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const tournamentsSnap = await getDocs(collection(db, 'chess_tournaments'));
  
  for (const tDoc of tournamentsSnap.docs) {
    const playersSnap = await getDocs(collection(db, 'chess_tournaments', tDoc.id, 'players'));
    playersSnap.forEach(pDoc => {
      const p = pDoc.data();
      if (p.name && p.name.toLowerCase().includes('rajtilak')) {
          console.log(`Found Rajtilak in ${tDoc.data().name}:`, p);
      }
    });
  }
}

check().then(() => process.exit(0)).catch(console.error);
