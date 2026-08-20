import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

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

async function patch() {
  const rooms = await getDocs(collection(db, 'rooms'));
  for (const r of rooms.docs) {
    const players = await getDocs(collection(db, 'rooms', r.id, 'players'));
    for (const p of players.docs) {
      if (p.data().basePrice === 500) {
        await updateDoc(doc(db, 'rooms', r.id, 'players', p.id), { basePrice: 200 });
        console.log(`Updated ${p.id} in ${r.id}`);
      }
    }
  }
  console.log("Done");
  process.exit(0);
}
patch();
