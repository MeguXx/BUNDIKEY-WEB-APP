import type { EstadoPedido } from '../domain/types';

export const COLORS = {
  chocolate: '#412C27',
  chocolateOscuro: '#2C1D19',
  crema: '#FFFAF2',
  caramelo: '#D9A05B',
  moca: '#A67B5B',
  fresa: '#E68A8C',
  blanco: '#FFFFFF',
  vainilla: '#E3C9B3',
  azul: '#4A7C82',
  verde: '#5B8A5A',
  rojo: '#C85A5A',
  fondoHeader: '#FFF3D8',
} as const;

export const FONTS = {
  display: '"Fraunces", "Georgia", serif',
  body: '"Manrope", system-ui, "Segoe UI", Roboto, sans-serif',
};

export const RADIUS = { sm: '8px', md: '12px', lg: '18px', xl: '24px', pill: '999px' };

export const SHADOW = {
  card: '0 4px 16px rgba(65, 44, 39, 0.06)',
  cardHover: '0 10px 28px rgba(65, 44, 39, 0.14)',
  modal: '0 24px 60px rgba(44, 29, 25, 0.35)',
  fab: '0 10px 26px rgba(65, 44, 39, 0.38)',
};

export const getEstadoColor = (estado: EstadoPedido): string => {
  switch (estado) {
    case 'ENTREGADO': return COLORS.moca;
    case 'EN_PREPARACION': return COLORS.fresa;
    case 'EN_CAMINO': return COLORS.azul;
    case 'LISTO': return COLORS.verde;
    case 'CANCELADO': return COLORS.rojo;
    default: return COLORS.caramelo;
  }
};

export const getEstadoLabel = (estado: EstadoPedido): string =>
  estado.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());