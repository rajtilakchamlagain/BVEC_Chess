import { useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function FixDB() {
  useEffect(() => {
    updateDoc(doc(db, 'rooms', 'PF52HZ'), {
      numOwners: 2,
      playerCode: 'PLAYER52',
      viewerCode: 'VIEWER52',
      owners: [
        { name: 'Raju Bhai 11', budget: 10000, isReady: false, pass: '123456' },
        { name: null, budget: 10000, isReady: false, pass: '234567' }
      ]
    }).then(() => console.log('FIXED!'));
  }, []);
  return null;
}
