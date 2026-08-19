import { useEffect, useRef, useState } from 'react';
import type { DeliveryState, Pedido } from '../domain/types';
import { cambiarEstadoPedido } from './pedidosRepository';

// ==========================================
// useDeliveryEngine — extrae la simulación de reparto (YENDO → ENTREGANDO →
// VOLVIENDO) que en el APK vivía embebida dentro de ListadoScreen/App.tsx,
// convirtiéndola en un motor reutilizable e independiente de la UI.
// ==========================================

export function useDeliveryEngine(pedidos: Pedido[]) {
  const activeDeliveries = useRef<Record<string, DeliveryState>>({});
  const [tick, setTick] = useState(0);

  // Reloj de avance del reparto
  useEffect(() => {
    const interval = setInterval(() => {
      let changed = false;

      Object.keys(activeDeliveries.current).forEach((id) => {
        const d = activeDeliveries.current[id];
        if (d.timeLeft > 0) {
          d.timeLeft -= 1;
          changed = true;
        } else if (d.status === 'YENDO') {
          d.status = 'ENTREGANDO';
          d.timeLeft = 2;
          d.maxTime = 2;
          changed = true;
        } else if (d.status === 'ENTREGANDO') {
          d.status = 'VOLVIENDO';
          d.timeLeft = 10;
          d.maxTime = 10;
          changed = true;
          void cambiarEstadoPedido(id, 'ENTREGADO');
        } else if (d.status === 'VOLVIENDO') {
          delete activeDeliveries.current[id];
          changed = true;
        }
      });

      if (changed) setTick((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Activa el motor para pedidos que entran en estado EN_CAMINO
  useEffect(() => {
    pedidos.forEach((p) => {
      if (p.estado === 'EN_CAMINO' && !activeDeliveries.current[p.id]) {
        activeDeliveries.current[p.id] = { timeLeft: 15, status: 'YENDO', maxTime: 15 };
      }
    });
  }, [pedidos]);

  return { activeDeliveries: activeDeliveries.current, tick };
}
