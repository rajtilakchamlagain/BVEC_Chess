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
  const tDocId = '7IRTGN';
  const playersSnap = await getDocs(collection(db, 'chess_tournaments', tDocId, 'players'));
  
  let count = 0;
  playersSnap.forEach(pDoc => {
      const p = pDoc.data();
      if (p.name && p.name.toLowerCase().includes('rachayita')) {
          count++;
          console.log(`Document ID: ${pDoc.id}, Wins: ${p.wins}`);
      }
  });
  
  console.log(`Total times Rachayita is found in 7IRTGN: ${count}`);
}

check().then(() => process.exit(0)).catch(console.error);
