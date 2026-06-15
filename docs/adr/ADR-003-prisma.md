# ADR-003: Prisma ORM para acceso a base de datos

## Estado: Aceptado

## Contexto
El sistema de inventario requiere persistencia de datos relacional con múltiples entidades (Category, Product, Order, Transfer, Report, Settings) y relaciones entre ellas. Es necesario un ORM que proporcione type safety, excelente developer experience y soporte para PostgreSQL.

## Decisión
Usar Prisma ORM para acceso a base de datos en lugar de SQL directo u otros ORMs.

## Consecuencias positivas
- **Type safety**: Tipos TypeScript generados automáticamente desde el schema
- **Excellent DX**: Schema intuitivo, migraciones automáticas, y excelente documentación
- **Productivity**: Queries complejas simplificadas con la API de Prisma
- **Migrations**: Sistema de migraciones robusto y fácil de usar
- **Performance**: Queries optimizadas automáticamente con connection pooling
- **Multi-database**: Fácil cambio entre PostgreSQL, MySQL, SQLite, etc.

## Compromisos
- **Runtime overhead**: Pequeña sobrecarga en runtime comparado con SQL directo
- **Limitaciones**: Algunas queries complejas pueden requerir SQL directo
- **Learning curve**: Requiere aprender la API de Prisma y el schema DSL

## Alternativas descartadas
- **SQL directo**: Sin type safety, propenso a errores SQL injection, boilerplate excesivo
- **TypeORM**: API más compleja, menos type safety, migraciones menos intuitivas
- **Drizzle ORM**: Más nuevo, ecosistema más pequeño, menos documentación

## Implementación
```prisma
// prisma/schema.prisma
model Category {
  id          String    @id @default(cuid())
  name        String
  description String?
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Product {
  id          String    @id @default(cuid())
  name        String
  description String?
  price       Float
  stock       Int
  categoryId  String
  category    Category  @relation(fields: [categoryId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

```typescript
// Ejemplo de uso en API Route
import { prisma } from '@/lib/prisma';

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(products);
}
```

## Referencias
- [Prisma Documentation](https://www.prisma.io/docs)
- [Why Prisma?](https://www.prisma.io/docs/why-prisma)
