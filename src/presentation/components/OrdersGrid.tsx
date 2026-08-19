import React from 'react';
import type { DeliveryState, EstadoPedido, Pedido } from '../../domain/types';
import { webStyles } from '../styles/webStyles';
import { OrderCard } from './OrderCard';

interface Props {
  pedidos: Pedido[];
  activeDeliveries: Record<string, DeliveryState>;
  onOpenPedido: (pedido: Pedido) => void;
  onCambiarEstado: (id: string, estado: EstadoPedido) => void;
  onRastrear: (pedido: Pedido) => void;
}

export const OrdersGrid: React.FC<Props> = ({ pedidos, activeDeliveries, onOpenPedido, onCambiarEstado, onRastrear }) => {
  if (pedidos.length === 0) {
    return (
      <div style={webStyles.pedidosGrid}>
        <div style={webStyles.emptyBox}>No hay pedidos registrados en esta categoría.</div>
      </div>
    );
  }

  return (
    <div style={webStyles.pedidosGrid}>
      {pedidos.map((item) => (
        <OrderCard
          key={item.id}
          item={item}
          deliveryState={activeDeliveries[item.id]}
          onOpen={() => onOpenPedido(item)}
          onMarcarListo={() => onCambiarEstado(item.id, 'LISTO')}
          onRastrear={() => onRastrear(item)}
        />
      ))}
    </div>
  );
};