# ADR-002: Zustand para gestión de estado global

## Estado: Aceptado

## Contexto
El sistema de inventario requiere estado global compartido entre componentes, específicamente para filtros de productos (búsqueda, categoría, stock mínimo) y tema de la aplicación. Es necesario que este estado sea accesible desde múltiples componentes sin causar re-renders innecesarios.

## Decisión
Usar Zustand para gestión de estado global en lugar de React Context API.

## Consecuencias positivas
- **Sin Provider wrapping**: No requiere envolver la app en un Provider
- **Re-renders optimizados**: Solo los componentes que usan el estado se re-renderizan
- **API simple**: Sintaxis más concisa y fácil de usar que Context API
- **TypeScript friendly**: Inferencia de tipos automática
- **Bundle size pequeño**: ~1KB (minificado + gzipped)
- **DevTools**: Excelentes herramientas de desarrollo

## Compromisos
- **Ecosistema más pequeño**: Menos comunidad y recursos que Context API
- **Learning curve**: Requiere aprender una nueva librería

## Alternativas descartadas
- **React Context API**: Causa re-renders en todos los consumidores del Provider, incluso si el estado no cambió
- **Redux**: Overkill para este caso de uso, boilerplate excesivo
- **Jotai**: Similar a Zustand pero con ecosistema más pequeño

## Implementación
```typescript
// src/store/filters.ts
import { create } from 'zustand';

interface FiltersState {
  search: string;
  categoryId: string | null;
  minStock: number | null;
  setSearch: (search: string) => void;
  setCategoryId: (categoryId: string | null) => void;
  setMinStock: (minStock: number | null) => void;
  reset: () => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  search: '',
  categoryId: null,
  minStock: null,
  setSearch: (search) => set({ search }),
  setCategoryId: (categoryId) => set({ categoryId }),
  setMinStock: (minStock) => set({ minStock }),
  reset: () => set({ search: '', categoryId: null, minStock: null }),
}));
```

## Referencias
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Zustand vs Context API](https://dev.to/colbyfayock/5-ways-to-manage-state-in-a-react-app-2h3j)
