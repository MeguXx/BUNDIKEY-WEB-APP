import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import type { EstadoPedido, Pedido } from '../domain/types';

const COLLECTION = 'pedidos';

export const suscribirPedidos = (onChange: (pedidos: Pedido[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTION), orderBy('fechaRegistro', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Pedido[];
    onChange(docs);
  });
};

export const guardarPedido = async (id: string, payload: Partial<Pedido>) => {
  await setDoc(doc(db, COLLECTION, id), { id, ...payload }, { merge: true });
};

export const cambiarEstadoPedido = async (id: string, estado: EstadoPedido) => {
  await setDoc(doc(db, COLLECTION, id), { estado }, { merge: true });
};

export const eliminarPedido = async (id: string) => {
  await deleteDoc(doc(db, COLLECTION, id));
};
