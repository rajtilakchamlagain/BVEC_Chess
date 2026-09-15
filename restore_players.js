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

const players = [
  { id: 'player_52m6enq7m', name: 'Rachayita Deb', wins: 0 },
  { id: 'player_6qmllyy0z', name: 'Chinmay Das', wins: 1 },
  { id: 'player_90zvmz672', name: 'Sushanka Deka', wins: 0 },
  { id: 'player_a79g88tjy', name: 'Adrit Uddipon Bordoloi', wins: 0 },
  { id: 'player_baxh5brdw', name: 'Priyam Deka', wins: 0 },
  { id: 'player_bmk7ccru0', name: 'Pranoy Bora', wins: 0 },
  { id: 'player_cpnglnis9', name: 'Faridul Islam', wins: 3 },
  { id: 'player_fcfa9ajvx', name: 'Raj Dey', wins: 0 },
  { id: 'player_gelpzhy8q', name: 'Farad Hussain Laskar', wins: 1 },
  { id: 'player_hq9ehv4a5', name: 'Liza Pathak', wins: 0 },
  { id: 'player_ifl0iaocu', name: 'Mrinmoy Deka', wins: 3 },
  { id: 'player_kpf9cliup', name: 'Priyanshu Pritam Kalita', wins: 1 },
  { id: 'player_n3r7pdh17', name: 'Shayon Islam', wins: 4 },
  { id: 'player_nz8yx1u86', name: 'Sumit Kumar Roy', wins: 2 },
  { id: 'player_o811s6ee8', name: 'Priyansu Bhagawat', wins: 1 },
  { id: 'player_ogzqqp246', name: 'Ruhan Subba', wins: 0 },
  { id: 'player_ota5cywi1', name: 'Partha Parashar', wins: 0 },
  { id: 'player_yupxtct37', name: 'Anubhav Borah', wins: 0 },
  { id: 'player_fsg0xad25', name: 'Modi', wins: 4 }
];

async function restorePlayers() {
  for (const p of players) {
    await setDoc(doc(db, 'chess_tournaments', '7IRTGN', 'players', p.id), {
      name: p.name,
      wins: p.wins,
      rollNumber: '1',
      matchesPlayed: p.wins // Roughly estimating matches played
    });
    console.log("Restored " + p.name);
  }
}

restorePlayers().then(() => process.exit(0)).catch(console.error);
