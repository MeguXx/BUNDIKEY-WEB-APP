import { collection, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { MensajeChat } from '../domain/types';

const COLLECTION = 'chat_interno';

export const suscribirChat = (onChange: (mensajes: MensajeChat[]) => void) => {
  const q = query(collection(db, COLLECTION), orderBy('fecha', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map((docSnap) => docSnap.data() as MensajeChat);
    onChange(docs);
  });
};

export const enviarMensaje = async (autor: string, rol: string, texto: string) => {
  const id = Date.now().toString();
  await setDoc(doc(db, COLLECTION, id), {
    id,
    autor,
    rol,
    texto,
    fecha: new Date().toISOString()
  });
};