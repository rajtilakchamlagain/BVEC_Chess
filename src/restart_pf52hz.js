import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc, writeBatch } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBRnIDws5w2gXeDxFYIebYEOdzFw4kegU4",
  authDomain: "pitchbid-efd24.firebaseapp.com",
  projectId: "pitchbid-efd24",
  storageBucket: "pitchbid-efd24.firebasestorage.app",
  messagingSenderId: "837073947736",
  appId: "1:837073947736:web:ba13760481d5420cf04e2d",
  measurementId: "G-GLX0MJLPCS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function restartRoom() {
  const roomCode = 'PF52HZ';
  try {
    const players = await getDocs(collection(db, 'rooms', roomCode, 'players'));
    const batch = writeBatch(db);
    
    players.docs.forEach(p => {
      batch.update(doc(db, 'rooms', roomCode, 'players', p.id), {
        status: 'pending',
        soldTo: null,
        soldPrice: null
      });
    });
    
    await batch.commit();

    await updateDoc(doc(db, 'rooms', roomCode), {
      status: 'waiting',
      activePlayerId: null,
      currentBid: 0,
      highestBidder: 'None',
      previousPlayerId: null,
      timeLeft: 13
    });

    console.log(`Successfully restarted room ${roomCode}`);
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}
restartRoom();
