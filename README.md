# Sistema de Inventario (Next.js)

![Node](https://img.shields.io/badge/Node-18%2B-339933?logo=node.js&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)
![React Query](https://img.shields.io/badge/React%20Query-@tanstack-FF4154?logo=reactquery&logoColor=white)
![Turbopack](https://img.shields.io/badge/Dev%20server-Turbopack-orange)

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
- `npx prisma migrate dev --name <nombre>` — nueva migración
- `npx prisma generate` — regenerar cliente Prisma tras cambios en `schema.prisma`

## Arquitectura y stack
- **Next.js 16 / App Router**: páginas en `src/app`, rutas API en la misma carpeta.
- **React Query (@tanstack/react-query)**: fetching y cache de API en cliente para tablas/modales.
- **Prisma ORM**: modelos `Category`, `Product`, `Report`, `Order`, `Transfer` sobre PostgreSQL.
- **UI**: componentes ligeros (Button, Input, Label) y estilos en `globals.css`.

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
prisma/
  schema.prisma                  # modelos y datasource
  seed.ts                        # seed opcional
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

## Notas de desarrollo
- Tras modificar `prisma/schema.prisma`, ejecuta migración y `prisma generate` antes de correr el server.
- El dev server usa Turbopack; si el puerto 3000 está ocupado, Next levantará en 3001.
- Para seeds, ajusta `prisma/seed.ts` y ejecuta `npx prisma db seed` (si está configurado en `package.json`).
