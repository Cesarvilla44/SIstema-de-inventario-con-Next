# Sistema de Inventario (Next.js)

![Node](https://img.shields.io/badge/Node-18%2B-339933?logo=node.js&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)
![React Query](https://img.shields.io/badge/React%20Query-@tanstack-FF4154?logo=reactquery&logoColor=white)
![Turbopack](https://img.shields.io/badge/Dev%20server-Turbopack-orange)
![Vitest](https://img.shields.io/badge/Tests-Vitest-6E9F18?logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/badge/E2E-Playwright-2EAD33?logo=playwright&logoColor=white)

Inventario, reportes, órdenes y transferencias con API REST en la App Router de Next.js y persistencia vía Prisma + PostgreSQL.

## Tabla de contenidos
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Scripts útiles](#scripts-útiles)
- [Arquitectura y stack](#arquitectura-y-stack)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Flujos principales](#flujos-principales)
- [API (resumen)](#api-resumen)
- [Testing](#testing)
- [Notas de desarrollo](#notas-de-desarrollo)

## Requisitos
- Node 18+ (recomendado 20.x)
- PostgreSQL (se usa Neon en desarrollo; configura `DATABASE_URL`)
- npm (incluido con Node)

## Instalación
```bash
npm install
# Aplica migraciones y genera el cliente Prisma
npx prisma migrate dev --name init
npx prisma generate
```

## Variables de entorno
Crear `.env` en la raíz con:
```
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
```

## Scripts útiles
- `npm run dev` — servidor de desarrollo (Next 16 + Turbopack) en http://localhost:3000
- `npm run build` — build de producción
- `npm run start` — serve producción (requiere build previo)
- `npm run lint` — linting
- `npm test` — ejecutar tests unitarios y de integración (Vitest)
- `npm run test:coverage` — ejecutar tests con reporte de cobertura
- `npx playwright test` — ejecutar tests E2E (Playwright)
- `npx prisma migrate dev --name <nombre>` — nueva migración
- `npx prisma generate` — regenerar cliente Prisma tras cambios en `schema.prisma`

## Arquitectura y stack
- **Next.js 16 / App Router**: páginas en `src/app`, rutas API en la misma carpeta.
- **React Query (@tanstack/react-query)**: fetching y cache de API en cliente para tablas/modales.
- **Prisma ORM**: modelos `Category`, `Product`, `Report`, `Order`, `Transfer` sobre PostgreSQL.
- **UI**: componentes ligeros (Button, Input, Label) y estilos en `globals.css`.
- **Testing**: Vitest para unitarios/integración, MSW para mocking de APIs, Playwright para E2E.

## Estructura del proyecto
```
src/
  app/
    api/
      categories/route.ts        # CRUD categorías
      products/route.ts          # CRUD productos
      reportes/route.ts          # GET/POST reportes
      reportes/[id]/route.ts     # GET/DELETE reportes por id
      ordenes/route.ts           # GET/POST órdenes
      ordenes/[id]/route.ts      # GET/PUT/DELETE órdenes
      transferencias/route.ts    # GET/POST transferencias
      transferencias/[id]/route.ts # GET/PUT/DELETE transferencias
    reportes/page.tsx            # listado y alta de reportes (React Query)
    reportes/[id]/page.tsx       # detalle de reporte (server component)
    ordenes/page.tsx             # CRUD de órdenes (modal + tabla)
    transferencias/page.tsx      # CRUD de transferencias (modal + tabla)
    page.tsx                     # home
  components/ui/                 # Button, Input, Label
  lib/
    product-utils.ts             # Utilidades de producto (filter, sort, format)
    product-utils.test.ts        # Tests unitarios de utilidades
  store/
    filters.ts                   # Store de Zustand para filtros
    filters.test.ts              # Tests del store de filtros
  test/
    setup.ts                    # Configuración de Vitest
    mocks/
      handlers.ts               # Handlers de MSW
      server.ts                 # Servidor de MSW
    integration/
      msw.test.ts               # Tests de integración con MSW
e2e/
  inventory.spec.ts             # Tests E2E con Playwright
docs/
  testing/
    estrategia.md               # Estrategia de testing (pirámide)
    integracion.md              # Tests de integración
    e2e.md                      # Tests E2E y Page Object Model
prisma/
  schema.prisma                # modelos y datasource
  seed.ts                      # seed opcional
```

## Flujos principales
- **Reportes**: crear, listar, borrar. Detalle muestra datos pasados por querystring o mock si no existen.
- **Órdenes**: crear con modal, listar y borrar (API `/api/ordenes`).
- **Transferencias**: crear con modal, listar y borrar (API `/api/transferencias`).
- **Inventario**: rutas existentes para productos y categorías vía Prisma.

## API (resumen)
- `GET /api/reportes` — lista reportes
- `POST /api/reportes` — crear { title, owner?, date, notes? }
- `GET /api/reportes/:id` — detalle
- `DELETE /api/reportes/:id` — borrar
- `GET /api/ordenes` / `POST /api/ordenes` — órdenes
- `GET/PUT/DELETE /api/ordenes/:id`
- `GET/POST /api/transferencias` — transferencias
- `GET/PUT/DELETE /api/transferencias/:id`
- `GET/POST /api/products`, `GET/POST /api/categories` — inventario

## Testing

El proyecto implementa una suite completa de tests siguiendo la pirámide de testing:

### Tests Unitarios (Vitest)
- **Utilidades de producto**: `filterProducts`, `sortProducts`, `isLowStock`, `formatPrice` (30 tests)
- **Store de Zustand**: `useFiltersStore` para gestión de filtros (8 tests)
- Ejecución: `npm test`
- Cobertura: `npm run test:coverage`

### Tests de Integración (MSW)
- **Mocking de APIs**: Handlers de MSW para `/api/products` y `/api/categories`
- **Verificación de peticiones**: Tests que interceptan y validan respuestas HTTP (5 tests)
- Documentación: `docs/testing/integracion.md`

### Tests E2E (Playwright)
- **Flujos de usuario**: Añadir producto, filtrar por categoría, ajustar stock (3 tests)
- **Navegador real**: Chromium para simular interacciones reales
- Ejecución: `npx playwright test`
- Documentación: `docs/testing/e2e.md`

### Documentación de Testing
- `docs/testing/estrategia.md`: Explicación de la pirámide de tests y hooks de Vitest
- `docs/testing/integracion.md`: Diferencia entre unitario e integración, MSW vs mocking directo
- `docs/testing/e2e.md`: Page Object Model y cuándo usar E2E vs integración

## Notas de desarrollo
- Tras modificar `prisma/schema.prisma`, ejecuta migración y `prisma generate` antes de correr el server.
- El dev server usa Turbopack; si el puerto 3000 está ocupado, Next levantará en 3001.
- Para seeds, ajusta `prisma/seed.ts` y ejecuta `npx prisma db seed` (si está configurado en `package.json`).
