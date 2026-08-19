import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../infrastructure/firebase';
import { COLORS } from '../../constants/theme';
import { webStyles } from '../styles/webStyles';
import logoBundiKey from '../../assets/logo-bundikey.png';
import type { UsuarioDB } from '../../domain/types';

interface Props {
  dbUser: UsuarioDB;
  activeTab: string;
  pendientesCount: number;
  onNavigate: (tab: string) => void;
  onOpenCierre: () => void;
  onToggleChat: () => void;
}

export const Header: React.FC<Props> = ({ dbUser, activeTab, pendientesCount, onNavigate, onOpenCierre, onToggleChat }) => {
  const isSubView = activeTab === 'CATALOGO' || activeTab === 'USUARIOS';

  return (
    <header style={webStyles.header}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <img src={logoBundiKey} alt="BundiKey" style={{ height: '40px' }} />
        <span style={webStyles.onlineTag}>● En vivo</span>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ color: COLORS.moca, fontSize: '13px', marginRight: '10px', fontWeight: 'bold' }}>
          {dbUser.nombre} ({dbUser.rol})
        </span>
        
        {isSubView && (
          <button className="bk-btn" onClick={() => onNavigate('SALA')} style={{ ...webStyles.headerNavBtn, backgroundColor: COLORS.caramelo, color: COLORS.chocolate, fontSize: '13px' }}>
            Panel Principal
          </button>
        )}

        <button className="bk-btn" onClick={onToggleChat} style={{ ...webStyles.headerNavBtn, backgroundColor: COLORS.azul, fontSize: '13px' }}>
          Chat
        </button>

        {(dbUser.rol === 'CAJA' || dbUser.rol === 'ADMIN') && (
          <button className="bk-btn" onClick={onOpenCierre} style={{ ...webStyles.headerNavBtn, backgroundColor: COLORS.verde, fontSize: '13px' }}>
            Cierre Caja
          </button>
        )}

        {dbUser.rol === 'ADMIN' && (
          <>
            <button className="bk-btn" onClick={() => onNavigate('USUARIOS')} style={{ ...webStyles.headerNavBtn, position: 'relative' }}>
              Usuarios
              {pendientesCount > 0 && <span style={webStyles.badge}>{pendientesCount}</span>}
            </button>
            <button className="bk-btn" onClick={() => onNavigate('CATALOGO')} style={webStyles.headerNavBtn}>
              Catálogo
            </button>
          </>
        )}
        <button className="bk-btn" onClick={() => signOut(auth)} style={webStyles.logoutBtn}>
          Salir
        </button>
      </div>
    </header>
  );
};