import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfigStr = fs.readFileSync('src/firebase.js', 'utf8');
const configMatch = firebaseConfigStr.match(/const firebaseConfig = ({[\s\S]*?});/);
let firebaseConfig;
eval(`firebaseConfig = ${configMatch[1]}`);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const code = '3S6NG3';
  const q = query(collection(db, 'chess_tournaments'), where('playerCode', '==', code));
  const qSnap = await getDocs(q);
  console.log('Query by playerCode results:', qSnap.size);
  
  const docRef = doc(db, 'chess_tournaments', 'MOC8ML');
  const d = await getDoc(docRef);
  if (d.exists()) {
    console.log('Tournament MOC8ML data:', d.data());
  } else {
    console.log('MOC8ML does not exist!');
  }
}
check().then(() => process.exit(0)).catch(console.error);
