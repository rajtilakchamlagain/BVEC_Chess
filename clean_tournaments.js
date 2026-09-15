import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import fs from 'fs';

// Read firebase.js to get config
const firebaseConfigStr = fs.readFileSync('src/firebase.js', 'utf8');
const configMatch = firebaseConfigStr.match(/const firebaseConfig = ({[\s\S]*?});/);
let firebaseConfig;
eval(`firebaseConfig = ${configMatch[1]}`);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteTournament(id) {
  console.log(`Deleting tournament: ${id}...`);
  const playersSnap = await getDocs(collection(db, 'chess_tournaments', id, 'players'));
  for (const p of playersSnap.docs) {
      await deleteDoc(p.ref);
  }
  const roundsSnap = await getDocs(collection(db, 'chess_tournaments', id, 'rounds'));
  for (const r of roundsSnap.docs) {
      await deleteDoc(r.ref);
  }
  await deleteDoc(doc(db, 'chess_tournaments', id));
  console.log(`Deleted ${id} successfully.`);
}

async function run() {
  await deleteTournament('7IRTGN'); // Orientation Arena
  await deleteTournament('XM43W0'); // Boy's Hostel ChessMania
  console.log("Cleanup complete");
}

run().then(() => process.exit(0)).catch(console.error);
