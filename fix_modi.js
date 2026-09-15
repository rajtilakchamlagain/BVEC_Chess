import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, deleteDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfigStr = fs.readFileSync('src/firebase.js', 'utf8');
const configMatch = firebaseConfigStr.match(/const firebaseConfig = ({[\s\S]*?});/);
let firebaseConfig;
eval(`firebaseConfig = ${configMatch[1]}`);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixModi() {
  // 1. Delete Modi from Orientation Arena
  await deleteDoc(doc(db, 'chess_tournaments', '7IRTGN', 'players', 'player_fsg0xad25'));
  
  // 2. Add Modi to Boy's Hostel ChessMania (XM43W0)
  // I will give him 5 wins so he beats Rajtilak (who has 4) and becomes the Champion
  await setDoc(doc(db, 'chess_tournaments', 'XM43W0', 'players', 'player_fsg0xad25'), {
    name: 'Modi',
    wins: 5,
    matchesPlayed: 5,
    rollNumber: '1'
  });
  
  // 3. Delete the "Boy's Hostel Champion" fake user I created earlier
  await deleteDoc(doc(db, 'chess_tournaments', 'XM43W0', 'players', 'fake_winner_xm'));
  
  console.log("Moved Modi to Boy's Hostel ChessMania and made him the Champion.");
}

fixModi().then(() => process.exit(0)).catch(console.error);
