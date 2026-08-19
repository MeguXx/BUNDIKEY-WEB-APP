import React from 'react';
import type { User } from 'firebase/auth';
import { webStyles } from '../styles/webStyles';
import { useAuth } from '../../infrastructure/AuthContext';

interface Props {
  user: User;
  onClose: () => void;
}

export const ProfileModal: React.FC<Props> = ({ user, onClose }) => {
  const { dbUser } = useAuth();

  return (
    <div style={webStyles.modalOverlay} className="bk-overlay-enter">
      <div style={webStyles.modalContent} className="bk-modal-enter">
        <h3 style={webStyles.modalTitle}>Perfil del Usuario</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '18px 0 22px' }}>
          <p style={{ margin: 0 }}>
            <strong>Usuario:</strong> {dbUser?.nombre || user.displayName || 'Personal'}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Rol Asignado:</strong> {dbUser?.rol}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Correo:</strong> {user.email}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Servicio Firestore:</strong> Conectado y Sincronizado
          </p>
        </div>
        <button className="bk-btn" onClick={onClose} style={webStyles.modalCloseBtn}>
          Cerrar
        </button>
      </div>
    </div>
  );
};