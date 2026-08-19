import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBbRuavkRQR5YlnaDnIk_FaP2ZpbAd07FQ',
  authDomain: 'la-soleil-app.firebaseapp.com',
  projectId: 'la-soleil-app',
  storageBucket: 'la-soleil-app.firebasestorage.app',
  messagingSenderId: '960163889074',
  appId: '1:960163889074:web:ee52d74e311715454d2eab',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Persistencia offline falló: Múltiples pestañas abiertas.');
  } else if (err.code === 'unimplemented') {
    console.warn('El navegador no soporta persistencia offline.');
  }
});
