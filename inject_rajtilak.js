import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfigStr = fs.readFileSync('src/firebase.js', 'utf8');
const configMatch = firebaseConfigStr.match(/const firebaseConfig = ({[\s\S]*?});/);
let firebaseConfig;
eval(`firebaseConfig = ${configMatch[1]}`);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function injectStats() {
  // Inject Winner
  await setDoc(doc(db, 'chess_tournaments', 'XM43W0', 'players', 'fake_winner_xm'), {
    name: 'Boy\'s Hostel Champion',
    wins: 5,
    matchesPlayed: 5,
    email: 'champion@bvec.in',
    rollNumber: '000000'
  });
  
  // Inject Rajtilak (Runner Up)
  await setDoc(doc(db, 'chess_tournaments', 'XM43W0', 'players', 'rajtilak_xm'), {
    name: 'Rajtilak Chamlagain',
    wins: 4,
    matchesPlayed: 5,
    email: 'rjtiksrm@gmail.com',
    rollNumber: '2481102991',
    photoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocLJl3jD83TYE8YSHvqbwik4_2YNGhNUAQjWK6c7UC_0zx4hIw=s96-c'
  });
  
  console.log("Injected stats for Boy's Hostel ChessMania");
}

injectStats().then(() => process.exit(0)).catch(console.error);
