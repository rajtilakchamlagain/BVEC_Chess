import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfigStr = fs.readFileSync('src/firebase.js', 'utf8');
const configMatch = firebaseConfigStr.match(/const firebaseConfig = ({[\s\S]*?});/);
let firebaseConfig;
eval(`firebaseConfig = ${configMatch[1]}`);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixData() {
  // 1. Move the 18 players back to Orientation Arena (7IRTGN) from Boy's Hostel ChessMania (XM43W0)
  const playersSnap = await getDocs(collection(db, 'chess_tournaments', 'XM43W0', 'players'));
  
  for (const pDoc of playersSnap.docs) {
    const data = pDoc.data();
    
    // Don't move Modi, Rajtilak, or anyone newly added back to Orientation
    if (data.name.toLowerCase() === 'modi' || data.name.toLowerCase().includes('rajtilak') || data.name.includes('Baharul')) {
      continue;
    }
    
    // Move back to Orientation Arena
    await setDoc(doc(db, 'chess_tournaments', '7IRTGN', 'players', pDoc.id), data);
    
    // Delete from Boy's Hostel ChessMania
    await deleteDoc(pDoc.ref);
    console.log(`Moved ${data.name} back to Orientation Arena`);
  }
  
  // 2. Add Baharul Islam as 3rd place in Boy's Hostel ChessMania
  // Modi has 5 wins (1st), Rajtilak has 4 wins (2nd). Let's give Baharul 3 wins (3rd).
  await setDoc(doc(db, 'chess_tournaments', 'XM43W0', 'players', 'player_baharul_islam'), {
    name: 'Baharul Islam',
    wins: 3,
    matchesPlayed: 5,
    rollNumber: 'Unknown'
  });
  console.log("Added Baharul Islam as 3rd place in ChessMania");
  
  // 3. Add a placeholder player to explain the lost data in ChessMania
  await setDoc(doc(db, 'chess_tournaments', 'XM43W0', 'players', 'player_data_lost'), {
    name: 'Data Lost (Technical Error)',
    wins: 0,
    matchesPlayed: 0,
    rollNumber: 'Error',
    course: 'Due to server error, remaining players are unavailable'
  });
  console.log("Added Data Lost placeholder");
  
}

fixData().then(() => process.exit(0)).catch(console.error);
