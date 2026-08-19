import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Configuración de tu proyecto de Firebase (la-soleil-app)
const firebaseConfig = {
  apiKey: "AIzaSyBbRuavkRQR5YlnaDnIk_FaP2ZpbAd07FQ",
  authDomain: "la-soleil-app.firebaseapp.com",
  projectId: "la-soleil-app",
  storageBucket: "la-soleil-app.firebasestorage.app",
  messagingSenderId: "960163889074",
  appId: "1:960163889074:web:ee52d74e311715454d2eab"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Habilitar la base de datos offline en el navegador
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Persistencia offline falló: Múltiples pestañas abiertas.');
  } else if (err.code === 'unimplemented') {
    console.warn('El navegador no soporta persistencia offline.');
  }
});