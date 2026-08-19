# BundiKey Web — Panel de Mostrador

Panel web para caja/mostrador de la pastelería cafetería BundiKey del curso de Idat EFSRT 3 Proyecto de Aplicación Empresarial, construido en base de **React + TypeScript + SQL SERVER**,
sincronizado en tiempo real con el mismo backend.

## Cómo correr

```bash
npm install
npm run dev


## Arquitectura

```
src/
├── domain/
│   └── types.ts                 # Tipos e interfaces del negocio (Pedido, CatalogItem, Estado, etc.)
│
├── constants/
│   ├── theme.ts                 # Paleta oficial BundiKey, tipografía, radios y sombras
│   └── catalog.ts                # Catálogo inicial y tarifas de delivery por distrito
│
├── infrastructure/
│   ├── firebase.ts               # Inicialización de Firebase (Auth + Firestore)
│   ├── pedidosRepository.ts      # Acceso a Firestore (CRUD de pedidos) — capa de datos pura
│   ├── AuthContext.tsx           # Contexto de sesión (login / registro / recuperar / logout)
│   ├── PedidoContext.tsx         # Contexto de pedidos, suscrito en tiempo real a Firestore
│   ├── CatalogContext.tsx        # Contexto del catálogo e inventario
│   └── useDeliveryEngine.ts      # Motor de simulación de reparto (YENDO → ENTREGANDO → VOLVIENDO)
│
├── presentation/
│   ├── styles/
│   │   ├── webStyles.ts          # Diccionario de estilos (equivalente a StyleSheet.create del APK)
│   │   └── global.css            # Tipografía, hover/focus y micro-animaciones
│   └── components/
│       ├── AuthScreen.tsx        # Pantalla de Login / Registro / Recuperación
│       ├── Header.tsx            # Barra superior (logo, usuario, navegación)
│       ├── TabBar.tsx            # Pestañas Sala / Delivery / Historial
│       ├── OrdersGrid.tsx        # Grilla de pedidos filtrados
│       ├── OrderCard.tsx         # Tarjeta individual de pedido
│       ├── CatalogView.tsx       # Gestión de precios e inventario
│       ├── PedidoFormModal.tsx   # Modal de creación/edición de pedidos
│       ├── TrackingModal.tsx     # Modal animado de rastreo GPS
│       └── ProfileModal.tsx      # Modal de perfil de usuario
│
├── App.tsx                       # Orquestador: compone providers + pantallas, sin lógica de negocio
└── main.tsx                      # Punto de entrada de React
```

```

Antes de iniciar, coloca tu logo en `src/assets/logo-bundikey.png`
(instrucciones en `src/assets/LEEME_LOGO.txt`).


