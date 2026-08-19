import type { CatalogItem } from '../domain/types';

// ==========================================
// CATÁLOGO INICIAL DE BUNDIKEY
// Fuente única de verdad, compartida con el APK (catalog.ts)
// ==========================================
export const initialCatalog: CatalogItem[] = [
  { id: 1, title: 'Club Sándwich', price: 25.0, category: 'Sándwiches', description: 'Cuatro capas de pan de molde, jamón, queso, huevo, tocino y pollo deshilachado con papas crocantes.' },
  { id: 2, title: 'Mixto Caliente', price: 5.0, category: 'Sándwiches', description: '2 capas de pan de molde, jamón y queso + huevo.' },
  { id: 3, title: 'Mixto Completo', price: 6.0, category: 'Sándwiches', description: '2 capas de pan de molde, jamón, queso y huevo.' },
  { id: 4, title: 'Pan con Pollo', price: 6.0, category: 'Sándwiches', description: 'Pan ciabatta relleno de pollo deshilachado, mayonesa especial de la casa y papas al hilo.' },
  { id: 5, title: 'Tamal de Pollo (Solo)', price: 5.0, category: 'Sándwiches', description: 'Porción de tamal.' },
  { id: 6, title: 'Tamal de Pollo', price: 6.0, category: 'Sándwiches', description: 'Tamal de pollo + dos panes.' },
  { id: 7, title: 'Pan con Chicharrón', price: 12.0, category: 'Sándwiches', description: 'Pan con chicharrón relleno de camote y sarza criolla.' },
  { id: 8, title: 'Pan con Butifarra', price: 6.0, category: 'Sándwiches', description: 'Pan ciabatta relleno de jamón del país y sarza criolla.' },
  { id: 9, title: 'Pan con Salchicha Huachana', price: 5.0, category: 'Sándwiches', description: 'Pan ciabatta relleno de salchicha huachana con huevo revuelto.' },
  { id: 10, title: 'Mixto Súper', price: 8.0, category: 'Sándwiches', description: '2 capas de pan de molde relleno de lechuga, tomate, pollo deshilachado, jamón, queso y huevo frito.' },
  { id: 11, title: 'Omelette', price: 7.0, category: 'Sándwiches', description: 'Tortilla de huevo relleno de jamón, queso y tomate, acompañado de tostadas.' },
  { id: 12, title: 'Salchipapa', price: 10.0, category: 'Sándwiches', description: 'Porción de papas crocantes acompañadas con hot dog de ternera.' },
  { id: 13, title: 'Empanada de pollo', price: 5.0, category: 'Pasteles Salados' },
  { id: 14, title: 'Empanada de carne', price: 5.0, category: 'Pasteles Salados' },
  { id: 15, title: 'Pastel de acelga', price: 5.0, category: 'Pasteles Salados' },
  { id: 16, title: 'Fresa', price: 6.5, category: 'Jugos' },
  { id: 17, title: 'Fresa con leche', price: 8.0, category: 'Jugos' },
  { id: 18, title: 'Papaya', price: 6.0, category: 'Jugos' },
  { id: 19, title: 'Papaya con leche', price: 7.5, category: 'Jugos' },
  { id: 20, title: 'Piña', price: 6.0, category: 'Jugos' },
  { id: 21, title: 'Naranja', price: 7.0, category: 'Jugos' },
  { id: 22, title: 'Limonada', price: 5.0, category: 'Jugos' },
  { id: 23, title: 'Surtido', price: 7.0, category: 'Jugos' },
  { id: 24, title: 'Café', price: 4.0, category: 'Bebidas Calientes' },
  { id: 25, title: 'Café con leche', price: 5.0, category: 'Bebidas Calientes' },
  { id: 26, title: 'Infusiones', price: 3.0, category: 'Bebidas Calientes' },
  { id: 27, title: 'Café Big', price: 5.5, category: 'Bebidas Calientes' },
  { id: 28, title: 'Café con leche Big', price: 6.5, category: 'Bebidas Calientes' },
  { id: 29, title: 'Capuccino', price: 6.0, category: 'Bebidas Calientes' },
  { id: 30, title: 'Capuccino con crema', price: 7.0, category: 'Bebidas Calientes' },
  { id: 31, title: 'Frapuccino', price: 7.0, category: 'Bebidas Calientes' },
  { id: 32, title: 'Chocolate caliente', price: 5.5, category: 'Bebidas Calientes' },
  { id: 33, title: 'Tartaleta de Fresa', price: 6.0, category: 'Postres', description: 'Tarta rellena de crema pastelera con base cubierta de chocolate bitter acompañado de fresas selectas bañadas en jalea.' },
  { id: 34, title: 'Crema volteada', price: 4.0, category: 'Postres' },
  { id: 35, title: 'Torta de pecanas', price: 6.0, category: 'Postres' },
  { id: 36, title: 'Pie de manzana', price: 5.5, category: 'Postres' },
  { id: 37, title: 'Torta de chocolate', price: 6.0, category: 'Postres' },
  { id: 38, title: 'Mil hojas de fresa con chantillí', price: 6.0, category: 'Postres' },
  { id: 39, title: 'Torta helada', price: 6.0, category: 'Postres' },
  { id: 40, title: 'Tiramisú', price: 7.0, category: 'Postres' },
  { id: 41, title: 'Tres leches', price: 6.0, category: 'Postres' },
  { id: 42, title: 'Pie de limón', price: 5.5, category: 'Postres' },
  { id: 43, title: 'Selva negra', price: 6.0, category: 'Postres' },
  { id: 44, title: 'Tres leches de lúcuma', price: 6.0, category: 'Postres' },
  { id: 45, title: 'Trufa de chocolate', price: 4.0, category: 'Postres' },
  { id: 46, title: 'Pudin de chocolate y vainilla', price: 4.5, category: 'Postres' },
  { id: 47, title: 'Gelatina', price: 3.0, category: 'Postres' },
  { id: 48, title: 'Cheesecake de maracuyá', price: 8.0, category: 'Postres' },
  { id: 49, title: 'Machu Picchu', price: 16.0, category: 'Cocktails' },
  { id: 50, title: 'Pisco Sour', price: 15.0, category: 'Cocktails' },
  { id: 51, title: 'Cocktail de Algarrobina', price: 15.0, category: 'Cocktails' },
  { id: 52, title: 'Piña Colada', price: 15.0, category: 'Cocktails' },
  { id: 53, title: 'Chilcano', price: 13.0, category: 'Cocktails' },
  { id: 54, title: 'Cuba Libre', price: 13.0, category: 'Cocktails' },
  { id: 55, title: 'Perú Libre', price: 13.0, category: 'Cocktails' },
];

export const districtFees: Record<string, number> = {
  Lince: 3,
  Miraflores: 5,
  'San Isidro': 6,
  Surco: 7,
  Barranco: 6,
  'San Borja': 5,
  Magdalena: 6,
};

export const staffOptions = ['Personal 1', 'Personal 2'];
export const mesas = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
export const tipoAtencionOptions = ['MESA', 'PARA_LLEVAR', 'DELIVERY', 'EVENTO'] as const;
export const estadoOptions = ['PENDIENTE', 'EN_PROCESO', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO'] as const;
