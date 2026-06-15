# Diagrama de Arquitectura

## Descripción del Sistema

El Sistema de Inventario es una aplicación full-stack construida con Next.js 16, Prisma ORM y PostgreSQL.

## Componentes del Sistema

### Frontend (Next.js 16)
- **App Router**: Sistema de routing basado en archivos
- **React Components**: Componentes modulares y reutilizables
- **React Query (@tanstack/react-query)**: Data fetching y cache
- **Zustand**: Gestión de estado global
- **UI Components**: Radix UI + TailwindCSS

### Backend (Next.js API Routes)
- **API Routes**: Endpoints RESTful
- **Prisma ORM**: Mapeo objeto-relacional
- **Validación**: Validación de datos en endpoints

### Base de Datos (PostgreSQL)
- **Neon**: PostgreSQL serverless
- **Modelos**: Category, Product, Order, Transfer, Report, Settings

### Testing
- **Vitest**: Tests unitarios y de integración
- **MSW**: Mock Service Worker para mocking de APIs
- **Playwright**: Tests E2E

## Flujo de Datos

```
┌─────────────────┐
│   Navegador     │
│   (React)       │
└────────┬────────┘
         │
         │ HTTP Requests
         │
         ▼
┌─────────────────┐
│  Next.js App    │
│  (Frontend)     │
│                 │
│  - Components   │
│  - React Query  │
│  - Zustand      │
└────────┬────────┘
         │
         │ API Calls
         │
         ▼
┌─────────────────┐
│  API Routes     │
│  (Backend)      │
│                 │
│  - Validation   │
│  - Business     │
│    Logic        │
└────────┬────────┘
         │
         │ Prisma Queries
         │
         ▼
┌─────────────────┐
│  PostgreSQL     │
│  (Neon)         │
│                 │
│  - Data Store   │
│  - Relations    │
└─────────────────┘
```

## Arquitectura de Componentes

### Frontend Components
```
src/
├── app/
│   ├── page.tsx (237 líneas)
│   ├── ordenes/page.tsx
│   ├── transferencias/page.tsx
│   └── reportes/page.tsx
├── components/
│   ├── InventorySidebar.tsx
│   ├── StatsCards.tsx
│   ├── ProductTable.tsx
│   ├── ProductForm.tsx
│   ├── CategoryForm.tsx
│   ├── ProductModal.tsx
│   ├── CategoryModal.tsx
│   ├── InventoryHeader.tsx
│   ├── ProductFilters.tsx
│   └── SettingsModal.tsx
└── hooks/
    └── useInventoryMutations.ts
```

### API Routes
```
src/app/api/
├── products/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── categories/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── ordenes/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── transferencias/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── reportes/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, DELETE)
├── settings/
│   └── route.ts (GET, PUT)
└── theme/
    └── route.ts (POST)
```

## Cómo Crear el Diagrama Visual

Para crear un diagrama visual de la arquitectura, puedes usar:

1. **Excalidraw** (https://excalidraw.com) - Herramienta gratuita y fácil de usar
2. **draw.io** (https://app.diagrams.net) - Herramienta profesional de diagramas
3. **Mermaid.js** - Para diagramas como código

### Recomendación

Usa Excalidraw para crear un diagrama que muestre:
- El navegador en el lado izquierdo
- Next.js App Router en el centro
- API Routes debajo de Next.js
- PostgreSQL a la derecha
- Flechas que muestren el flujo de datos entre componentes

Guarda el diagrama como `docs/arquitectura/diagrama.png`.
