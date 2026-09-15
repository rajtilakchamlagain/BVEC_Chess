import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, deleteDoc, query, where } from 'firebase/firestore';
import fs from 'fs';

// Read firebase.js to get config
const firebaseConfigStr = fs.readFileSync('src/firebase.js', 'utf8');
const configMatch = firebaseConfigStr.match(/const firebaseConfig = ({[\s\S]*?});/);
if (!configMatch) {
  console.error("Could not find firebase config");
  process.exit(1);
}

// Evaluate the config object (safely)
let firebaseConfig;
eval(`firebaseConfig = ${configMatch[1]}`);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteTournament() {
  const tournamentsRef = collection(db, 'chess_tournaments');
  const q = query(tournamentsRef, where('name', '==', 'BVEC Hostels ChessMania'));
  
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    console.log("No tournament found with that exact name. Trying to search all...");
    const allSnaps = await getDocs(tournamentsRef);
    allSnaps.forEach(d => {
       if (d.data().name.includes("BVEC Hostel") || d.data().name.includes("BVEC Hostels ChessMania")) {
           console.log("Found matching: ", d.data().name, " (ID:", d.id, ")");
       }
    });
    return;
  }

  for (const document of querySnapshot.docs) {
    console.log(`Deleting ${document.data().name} (${document.id})...`);
    
    // Delete subcollections (players, rounds) if possible, though Firebase doesn't make it easy from client SDK.
    // We'll delete the main document and let the players/rounds become orphaned (or delete them manually).
    
    const playersSnap = await getDocs(collection(db, 'chess_tournaments', document.id, 'players'));
    for (const p of playersSnap.docs) {
        await deleteDoc(p.ref);
    }
    
    const roundsSnap = await getDocs(collection(db, 'chess_tournaments', document.id, 'rounds'));
    for (const r of roundsSnap.docs) {
        await deleteDoc(r.ref);
    }

    await deleteDoc(document.ref);
    console.log(`Deleted successfully.`);
  }
}

deleteTournament().then(() => {
    console.log("Done");
    process.exit(0);
}).catch(console.error);
