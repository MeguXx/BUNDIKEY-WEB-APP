import React from 'react';
import { webStyles } from '../styles/webStyles';
import type { TabPrincipal, RolUsuario } from '../../domain/types';

interface Props {
  activeTab: TabPrincipal;
  onChange: (tab: TabPrincipal) => void;
  rol?: RolUsuario;
}

export const TabBar: React.FC<Props> = ({ activeTab, onChange, rol }) => {
  return (
    <div style={webStyles.tabBar}>
      <div style={webStyles.mainTabGroup}>
        {rol === 'COCINA' ? (
          <button
            className="bk-tab"
            onClick={() => onChange('SALA')}
            style={{ ...webStyles.tabBtn, ...(activeTab === 'SALA' ? webStyles.activeTabBtn : {}) }}
          >
            Cola de Cocina
          </button>
        ) : (
          <>
            <button
              className="bk-tab"
              onClick={() => onChange('SALA')}
              style={{ ...webStyles.tabBtn, ...(activeTab === 'SALA' ? webStyles.activeTabBtn : {}) }}
            >
              Sala
            </button>
            <button
              className="bk-tab"
              onClick={() => onChange('ENVIOS')}
              style={{ ...webStyles.tabBtn, ...(activeTab === 'ENVIOS' ? webStyles.activeTabBtn : {}) }}
            >
              Delivery
            </button>
          </>
        )}
      </div>

      <button
        className="bk-tab"
        onClick={() => onChange('HISTORIAL')}
        title="Historial de Pedidos"
        style={{ ...webStyles.historialTabBtn, ...(activeTab === 'HISTORIAL' ? webStyles.activeHistorialBtn : {}), fontWeight: 800 }}
      >
        Historial
      </button>
    </div>
  );
};