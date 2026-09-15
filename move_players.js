import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfigStr = fs.readFileSync('src/firebase.js', 'utf8');
const configMatch = firebaseConfigStr.match(/const firebaseConfig = ({[\s\S]*?});/);
let firebaseConfig;
eval(`firebaseConfig = ${configMatch[1]}`);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function movePlayers() {
  const playersSnap = await getDocs(collection(db, 'chess_tournaments', '7IRTGN', 'players'));
  
  let count = 0;
  for (const pDoc of playersSnap.docs) {
    const data = pDoc.data();
    
    // Don't overwrite Modi or Rajtilak if they somehow exist, but we deleted Modi from 7IRTGN earlier
    if (data.name.toLowerCase() === 'modi' || data.name.toLowerCase().includes('rajtilak')) {
      await deleteDoc(pDoc.ref);
      continue;
    }
    
    // Copy to XM43W0
    await setDoc(doc(db, 'chess_tournaments', 'XM43W0', 'players', pDoc.id), data);
    
    // Delete from 7IRTGN
    await deleteDoc(pDoc.ref);
    count++;
    console.log(`Moved ${data.name}`);
  }
  
  console.log(`Moved ${count} players from Orientation Arena to Boy's Hostel ChessMania!`);
}

movePlayers().then(() => process.exit(0)).catch(console.error);
