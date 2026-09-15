import { initializeApp } from 'firebase/app';
import { getFirestore, doc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfigStr = fs.readFileSync('src/firebase.js', 'utf8');
const configMatch = firebaseConfigStr.match(/const firebaseConfig = ({[\s\S]*?});/);
let firebaseConfig;
eval(`firebaseConfig = ${configMatch[1]}`);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteDemo() {
  const roomCode = '41OMJZ';
  
  // Delete subcollections
  for (const sub of ['players', 'rounds', 'matches']) {
    const snap = await getDocs(collection(db, 'chess_tournaments', roomCode, sub));
    for (const d of snap.docs) {
      await deleteDoc(d.ref);
    }
  }
  
  // Delete main doc
  await deleteDoc(doc(db, 'chess_tournaments', roomCode));
  console.log('Demo1 deleted successfully');
}

deleteDemo().then(() => process.exit(0)).catch(console.error);
