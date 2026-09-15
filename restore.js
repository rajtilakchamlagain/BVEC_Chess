import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

// Read firebase.js to get config
const firebaseConfigStr = fs.readFileSync('src/firebase.js', 'utf8');
const configMatch = firebaseConfigStr.match(/const firebaseConfig = ({[\s\S]*?});/);
let firebaseConfig;
eval(`firebaseConfig = ${configMatch[1]}`);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function restore() {
  await setDoc(doc(db, 'chess_tournaments', '7IRTGN'), {
    name: 'Orientation Arena',
    hostName: 'Admin',
    status: 'finished',
    createdAt: new Date(1787304448 * 1000), // Original timestamp
    viewerCode: '7IRTGN'
  });
  
  await setDoc(doc(db, 'chess_tournaments', 'XM43W0'), {
    name: "Boy's Hostel ChessMania",
    hostName: 'Admin',
    status: 'finished',
    createdAt: new Date(1788354856 * 1000), // Original timestamp
    viewerCode: 'XM43W0'
  });
  console.log("Restored basic documents");
}

restore().then(() => process.exit(0)).catch(console.error);
