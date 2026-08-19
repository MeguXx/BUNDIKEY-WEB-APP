import React from 'react';
import type { DeliveryState, Pedido } from '../../domain/types';
import { COLORS } from '../../constants/theme';
import { webStyles } from '../styles/webStyles';

interface Props {
  pedido: Pedido;
  deliveryState: DeliveryState;
  onClose: () => void;
}

export const TrackingModal: React.FC<Props> = ({ pedido, deliveryState, onClose }) => {
  const progressLeft = 100 - (deliveryState.timeLeft / deliveryState.maxTime) * 100;

  return (
    <div style={webStyles.modalOverlay} className="bk-overlay-enter">
      <div style={webStyles.modalContent} className="bk-modal-enter">
        <h3 style={webStyles.modalTitle}>Rastreo de {pedido.personalServicio}</h3>
        <p style={{ color: COLORS.moca, fontSize: '14px', margin: '0 0 16px' }}>Destino: {pedido.direccionEntrega}</p>

        <div style={webStyles.statusBox}>
          {deliveryState.status === 'YENDO'
            ? 'En camino a entregar pedido...'
            : deliveryState.status === 'ENTREGANDO'
            ? 'En la puerta entregando...'
            : 'Pedido finalizado. Volviendo a tienda...'}
        </div>

        <div style={webStyles.gpsTrackLine}>
          <div className="bk-scooter-move" style={{ ...webStyles.scooterIcon, left: `${progressLeft}%` }}>
            🛵
          </div>
          <span style={{ position: 'absolute', left: '12px', top: '14px', fontSize: '20px' }}>🏪</span>
          <span style={{ position: 'absolute', right: '12px', top: '14px', fontSize: '20px' }}>🏠</span>
        </div>

        <p style={{ textAlign: 'center', color: COLORS.chocolate, fontWeight: 700, marginTop: '16px' }}>
          Tiempo restante: {deliveryState.timeLeft} min
        </p>

        <button className="bk-btn" onClick={onClose} style={webStyles.modalCloseBtn}>
          Cerrar Rastreo
        </button>
      </div>
    </div>
  );
};
