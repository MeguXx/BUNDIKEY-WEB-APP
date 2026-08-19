import React from 'react';
import type { DeliveryState, Pedido } from '../../domain/types';
import { COLORS, getEstadoColor } from '../../constants/theme';
import { webStyles } from '../styles/webStyles';

interface Props {
  item: Pedido;
  deliveryState?: DeliveryState;
  onOpen: () => void;
  onMarcarListo: () => void;
  onRastrear: () => void;
}

export const OrderCard: React.FC<Props> = ({ item, deliveryState, onOpen, onMarcarListo, onRastrear }) => {
  const title = item.tipoAtencion === 'MESA' ? `Mesa ${item.numeroMesa}` : item.clienteNombre;
  const isEnvio = item.tipoAtencion === 'DELIVERY' || (item.tipoAtencion === 'EVENTO' && item.metodoEntregaEvento === 'ENVIO');

  return (
    <div className="bk-card" style={webStyles.pedidoCard} onClick={onOpen}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <strong style={{ fontSize: '16px', color: COLORS.chocolate }}>{title}</strong>
          <span style={{ fontSize: '12px', color: COLORS.moca, marginLeft: '6px' }}>({item.tipoAtencion.replace('_', ' ')})</span>
        </div>
        {item.telefono && <span style={{ fontSize: '12px', color: COLORS.moca }}>📞 {item.telefono}</span>}
      </div>

      {isEnvio && item.direccionEntrega && (
        <p style={{ margin: '6px 0 2px', fontSize: '13px', color: COLORS.azul, fontStyle: 'italic' }}>
          📍 Destino: <strong>{item.distrito || item.direccionEntrega}</strong>
        </p>
      )}

      <p style={{ margin: '4px 0', fontSize: '14px', color: COLORS.chocolate }}>
        Atendido por: <strong>{item.personalServicio}</strong>
      </p>
      <p style={{ margin: '4px 0', fontSize: '14px', color: COLORS.chocolate }}>
        Pedido: <strong>{item.producto}</strong>
      </p>
      <p style={{ margin: '4px 0', fontSize: '14px', color: COLORS.chocolate }}>
        Cantidad: {item.cantidad} · <strong>S/ {Number(item.precio || 0).toFixed(2)}</strong>
      </p>

      {isEnvio && deliveryState && (
        <div style={webStyles.etaBox}>
          {deliveryState.status === 'YENDO'
            ? `⏱ Llegando en ${deliveryState.timeLeft} min`
            : deliveryState.status === 'ENTREGANDO'
            ? '📦 Entregando pedido...'
            : `🔁 Retornando (${deliveryState.timeLeft} min)`}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
        <span style={{ ...webStyles.chip, backgroundColor: getEstadoColor(item.estado) }}>{item.estado.replace('_', ' ')}</span>

        {item.tipoAtencion === 'PARA_LLEVAR' && item.estado !== 'ENTREGADO' && item.estado !== 'CANCELADO' && item.estado !== 'LISTO' && (
          <button
            className="bk-btn"
            onClick={(e) => {
              e.stopPropagation();
              onMarcarListo();
            }}
            style={webStyles.actionChipBtn}
          >
            Marcar Listo
          </button>
        )}

        {deliveryState && (
          <button
            className="bk-btn"
            onClick={(e) => {
              e.stopPropagation();
              onRastrear();
            }}
            style={webStyles.trackChipBtn}
          >
            📡 Rastreo GPS
          </button>
        )}
      </div>
    </div>
  );
};