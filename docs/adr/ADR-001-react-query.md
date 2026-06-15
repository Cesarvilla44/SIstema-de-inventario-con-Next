# ADR-001: React Query para data fetching y cache

## Estado: Aceptado

## Contexto
En un sistema de inventario con múltiples operaciones CRUD (productos, categorías, órdenes, transferencias, reportes), es necesario manejar eficientemente las peticiones a la API, el cache de datos y la sincronización entre componentes.

## Decisión
Usar @tanstack/react-query para data fetching y cache en lugar de fetch directo o Context API.

## Consecuencias positivas
- **Cache automático**: React Query cachea las respuestas de la API automáticamente, reduciendo peticiones innecesarias
- **Revalidación optimista**: Permite actualizar la UI inmediatamente mientras se confirma en el servidor
- **Loading states**: Gestión automática de estados de carga y error
- **Invalidación inteligente**: Los datos se actualizan automáticamente cuando se realizan mutaciones
- **DevTools**: Excelentes herramientas de desarrollo para debugging

## Compromisos
- **Curva de aprendizaje**: Requiere aprender la API de React Query
- **Bundle size**: Añade ~13KB al bundle (minificado + gzipped)
- **Complejidad**: Introduce conceptos adicionales (query keys, invalidation, etc.)

## Alternativas descartadas
- **Fetch directo**: Requiere implementación manual de cache, loading states y error handling
- **SWR**: Similar a React Query pero con menos features y comunidad más pequeña
- **Context API**: No tiene cache automático y causa re-renders innecesarios en toda la app

## Implementación
```typescript
// Ejemplo de uso en src/app/page.tsx
function useProductsQuery(filters: {
  search: string;
  categoryId: string | null;
  minStock: number | null;
}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.minStock !== null) params.set("minStock", String(filters.minStock));

  const key = ["products", filters.search, filters.categoryId, filters.minStock];

  return useQuery<Product[]>({
    queryKey: key,
    queryFn: () => fetchJson(`/api/products?${params.toString()}`),
  });
}
```

## Referencias
- [React Query Documentation](https://tanstack.com/query/latest)
- [Why React Query?](https://tkdodo.eu/blog/why-you-want-react-query)
