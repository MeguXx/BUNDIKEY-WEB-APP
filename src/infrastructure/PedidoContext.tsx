import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { EstadoPedido, Pedido } from '../domain/types';
import {
  cambiarEstadoPedido,
  eliminarPedido as eliminarPedidoRemoto,
  guardarPedido,
  suscribirPedidos,
} from './pedidosRepository';
import { useAuth } from './AuthContext';


type PedidoContextValue = {
  pedidos: Pedido[];
  agregarPedido: (payload: Partial<Pedido>) => Promise<void>;
  actualizarPedido: (pedido: Pedido, payload: Partial<Pedido>) => Promise<void>;
  eliminarPedido: (id: string) => Promise<void>;
  cambiarEstado: (id: string, estado: EstadoPedido) => Promise<void>;
};

const PedidoContext = createContext<PedidoContextValue | undefined>(undefined);

export function PedidoProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    if (!user) {
      setPedidos([]);
      return;
    }
    const unsubscribe = suscribirPedidos(setPedidos);
    return () => unsubscribe();
  }, [user]);

  const agregarPedido = async (payload: Partial<Pedido>) => {
    const id = Date.now().toString();
    await guardarPedido(id, { ...payload, fechaRegistro: new Date().toISOString() });
  };

  const actualizarPedido = async (pedido: Pedido, payload: Partial<Pedido>) => {
    await guardarPedido(pedido.id, payload);
  };

  const eliminarPedido = async (id: string) => {
    await eliminarPedidoRemoto(id);
  };

  const cambiarEstado = async (id: string, estado: EstadoPedido) => {
    await cambiarEstadoPedido(id, estado);
  };

  return (
    <PedidoContext.Provider value={{ pedidos, agregarPedido, actualizarPedido, eliminarPedido, cambiarEstado }}>
      {children}
    </PedidoContext.Provider>
  );
}

export function usePedido() {
  const context = useContext(PedidoContext);
  if (!context) throw new Error('usePedido debe usarse dentro de un PedidoProvider');
  return context;
}
