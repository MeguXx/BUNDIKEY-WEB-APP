import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth } from './firebase';
import { obtenerDatosUsuario, registrarUsuarioEnBD } from './usuariosRepository';
import type { UsuarioDB } from '../domain/types';

type AuthResult = { success: boolean; message?: string };

type AuthContextValue = {
  user: User | null;
  dbUser: UsuarioDB | null;
  loading: boolean;
  login: (correo: string, password: string) => Promise<AuthResult>;
  register: (data: { correo: string; password: string; nombre: string; telefono?: string; direccion?: string }) => Promise<AuthResult>;
  recoverPassword: (correo: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<UsuarioDB | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userData = await obtenerDatosUsuario(currentUser.uid);
        
        if (userData && userData.activo) {
          setUser(currentUser);
          setDbUser(userData);
        } else {
          await signOut(auth);
          setUser(null);
          setDbUser(null);
        }
      } else {
        setUser(null);
        setDbUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (correo: string, password: string): Promise<AuthResult> => {
    try {
      const res = await signInWithEmailAndPassword(auth, correo, password);
      const userData = await obtenerDatosUsuario(res.user.uid);
      
      if (!userData) {
        await signOut(auth);
        return { success: false, message: 'Tu cuenta no está registrada en la base de datos operativa.' };
      }
      
      if (!userData.activo || userData.rol === 'PENDIENTE') {
        await signOut(auth);
        return { success: false, message: 'Tu cuenta está en revisión. Espera la autorización del Administrador.' };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, message: 'Correo o contraseña incorrectos.' };
    }
  };

  const register = async ({
    correo,
    password,
    nombre,
    telefono,
    direccion
  }: {
    correo: string;
    password: string;
    nombre: string;
    telefono?: string;
    direccion?: string;
  }): Promise<AuthResult> => {
    try {
      const res = await createUserWithEmailAndPassword(auth, correo, password);
      await updateProfile(res.user, { displayName: nombre });
      
      await registrarUsuarioEnBD(res.user.uid, {
        correo,
        nombre,
        telefono: telefono || '',
        direccion: direccion || ''
      });

      await signOut(auth);
      
      return { success: true };
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') return { success: false, message: 'Este correo ya está registrado.' };
      return { success: false, message: 'No se pudo crear la cuenta.' };
    }
  };

  const recoverPassword = async (correo: string): Promise<AuthResult> => {
    try {
      await sendPasswordResetEmail(auth, correo);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'No se pudo enviar el correo de recuperación.' };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setDbUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, dbUser, loading, login, register, recoverPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
}