# BundiKey Web — Panel de Mostrador

Panel web para caja/mostrador de la pastelería BundiKey, construido en **React + TypeScript + Vite**,
sincronizado en tiempo real con el mismo backend **Firebase (Auth + Firestore)** que usa la app móvil (APK).

Este proyecto reemplaza la versión inicial (generada en un único `App.tsx` de ~1000 líneas) por una
**arquitectura por capas**, replicando el mismo criterio de organización que ya se sustentó para el APK
(`domain/`, `infrastructure/`, `presentation/`).

## 📁 Arquitectura

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

## 🎨 Paleta oficial (idéntica a la del APK)

| Token       | Hex       | Uso                              |
|-------------|-----------|-----------------------------------|
| chocolate   | `#412C27` | Marca, textos fuertes, botones    |
| crema       | `#FFFAF2` | Fondo base                        |
| caramelo    | `#D9A05B` | Acentos, foco de inputs           |
| moca        | `#A67B5B` | Texto secundario                  |
| fresa       | `#E68A8C` | Estado EN_PROCESO                 |
| vainilla    | `#E3C9B3` | Bordes y superficies suaves       |
| azul        | `#4A7C82` | Delivery / destino                |
| verde       | `#5B8A5A` | Éxito / en curso                  |
| rojo        | `#C85A5A` | Error / cancelado                 |
| fondoHeader | `#FFF3D8` | Header superior                   |

Tipografía: **Fraunces** (titulares, con carácter editorial/artesanal acorde a una pastelería) +
**Manrope** (texto e interfaz, alta legibilidad).

## 🔗 Por qué esta separación (para la sustentación)

- **`domain/`** — mismo rol que `Pedido.ts` / `catalog.ts` del APK: el contrato de datos, sin lógica.
- **`infrastructure/`** — mismo rol que `firebase.ts`, `database.ts`, `AuthContext.tsx`,
  `PedidoContext.tsx`, `CatalogContext.tsx` del APK: todo lo que habla con el mundo exterior
  (Firebase) vive aislado detrás de Contexts + un repositorio, así la UI nunca llama a Firestore
  directamente.
- **`presentation/`** — componentes puramente visuales, sin conocer Firebase; reciben datos y
  funciones por props o hooks de contexto (`useAuth`, `usePedido`, `useCatalog`).
- **`App.tsx`** — pasó de ~1000 líneas a un orquestador delgado que solo compone piezas.

Esto es exactamente el mismo criterio de capas documentado en `4.1 Estructura del proyecto`
para el APK, aplicado ahora al frontend web, lo que permite sustentar ambos entregables con el
mismo lenguaje arquitectónico ante el jurado.

## ▶️ Cómo correr

```bash
npm install
npm run dev
```

Antes de iniciar, coloca tu logo en `src/assets/logo-bundikey.png`
(instrucciones en `src/assets/LEEME_LOGO.txt`).

## 🔥 Firebase

La configuración (`src/infrastructure/firebase.ts`) apunta al mismo proyecto `la-soleil-app`
que usa el APK — los pedidos creados desde la web y desde el móvil se sincronizan en la
misma colección `pedidos` de Firestore, en tiempo real.
