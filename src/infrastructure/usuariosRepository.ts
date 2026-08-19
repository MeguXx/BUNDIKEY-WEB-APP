import { collection, doc, getDoc, onSnapshot, query, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { UsuarioDB, RolUsuario } from '../domain/types';

const COLLECTION = 'usuarios';

export const registrarUsuarioEnBD = async (uid: string, data: Partial<UsuarioDB>) => {
  await setDoc(doc(db, COLLECTION, uid), {
    uid,
    ...data,
    rol: 'PENDIENTE',
    activo: false,
    fechaRegistro: new Date().toISOString(),
  }, { merge: true });
};

export const obtenerDatosUsuario = async (uid: string): Promise<UsuarioDB | null> => {
  const snap = await getDoc(doc(db, COLLECTION, uid));
  return snap.exists() ? (snap.data() as UsuarioDB) : null;
};

export const actualizarAccesoUsuario = async (uid: string, rol: RolUsuario, activo: boolean) => {
  await setDoc(doc(db, COLLECTION, uid), { rol, activo }, { merge: true });
};

export const suscribirUsuarios = (onChange: (usuarios: UsuarioDB[]) => void) => {
  const q = query(collection(db, COLLECTION));
  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map((docSnap) => docSnap.data() as UsuarioDB);
    docs.sort((a, b) => (a.rol === 'PENDIENTE' ? -1 : b.rol === 'PENDIENTE' ? 1 : 0));
    onChange(docs);
  });
};