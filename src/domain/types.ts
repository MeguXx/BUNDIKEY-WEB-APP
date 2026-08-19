export type TipoAtencion = 'MESA' | 'DELIVERY' | 'EVENTO' | 'PARA_LLEVAR';
export type Prioridad = 'BAJA' | 'NORMAL' | 'ALTA';
export type EstadoPedido = 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' | 'EN_CAMINO' | 'ENTREGADO' | 'CANCELADO';

export interface Pedido {
  id: string;
  tipoAtencion: TipoAtencion;
  clienteNombre: string;
  telefono?: string;
  numeroMesa?: string;
  direccionEntrega?: string;
  distrito?: string;
  metodoEntregaEvento?: 'RECOJO' | 'ENVIO';
  personalServicio: string;
  producto: string;
  descripcion?: string;
  prioridad: Prioridad;
  estado: EstadoPedido;
  fechaRegistro: string;
  cantidad: number;
  precio: number;
}

export interface CatalogItem {
  id: number;
  title: string;
  price: number;
  category: string;
  description?: string;
}

export type DeliveryStatus = 'YENDO' | 'ENTREGANDO' | 'VOLVIENDO';

export interface DeliveryState {
  timeLeft: number;
  status: DeliveryStatus;
  maxTime: number;
}

export type TabPrincipal = 'SALA' | 'ENVIOS' | 'HISTORIAL' | 'CATALOGO' | 'USUARIOS';
export type AuthMode = 'LOGIN' | 'REGISTER' | 'RECOVER';

export type RolUsuario = 'ADMIN' | 'CAJA' | 'SALA' | 'COCINA' | 'PENDIENTE';

export interface UsuarioDB {
  uid: string;
  correo: string;
  nombre: string;
  telefono?: string;
  direccion?: string;
  rol: RolUsuario;
  fechaRegistro: string;
  activo: boolean;
}

export interface MensajeChat {
  id: string;
  autor: string;
  rol: string;
  texto: string;
  fecha: string;
}