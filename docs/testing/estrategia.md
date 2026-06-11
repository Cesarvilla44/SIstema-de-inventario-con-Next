# Estrategia de Testing

## La Pirámide de Tests

La pirámide de tests es una metáfora que describe la distribución ideal de tests en un proyecto. Se divide en tres niveles:

### 1. Tests Unitarios (Base de la pirámide)
Son tests rápidos que verifican unidades individuales de código (funciones, componentes, hooks) sin dependencias externas.

**Ejemplos del inventario de Carpintería Los Artesanos:**
- `filterProducts`: Verifica que al buscar "roble" solo devuelve productos como "Tablero roble macizo 40 mm"
- `sortProducts`: Verifica que al ordenar por precio descendente, "Tablero roble" (89,50 €) aparece antes que "Bisagra cazoleta" (2,40 €)
- `isLowStock`: Verifica que un producto con stock 4 se marca como poco stock cuando el umbral es 10
- `formatPrice`: Verifica que 89.5 se formatea como "89,50 €"
- `useFiltersStore`: Verifica que el store de Zustand resetea correctamente los filtros

**Ventajas:**
- Ejecución en milisegundos
- Diagnóstico preciso (saben exactamente qué línea falló)
- Bajo coste de mantenimiento

### 2. Tests de Integración (Capa intermedia)
Verifican que múltiples unidades trabajen juntas correctamente, incluyendo interacciones con APIs, bases de datos y servicios externos.

**Ejemplos del inventario:**
- `ProductList` con MSW: Verifica que el componente muestra los productos recibidos de `/api/products`
- MSW handlers: Verifica que las peticiones a `/api/categories` devuelven las categorías correctas ("Maderas y tableros", "Herrajes")
- API Routes: Verifica que `POST /api/products` crea un producto en la base de datos

**Ventajas:**
- Detectan problemas de integración entre componentes
- Más realistas que los tests unitarios
- Aún relativamente rápidos

### 3. Tests E2E (Cima de la pirámide)
Verifican flujos completos de usuario a través de la aplicación real en un navegador.

**Ejemplos del inventario:**
- Añadir un producto: Verifica que al crear "Lasur para exterior 2,5 L" con precio 24,90 €, aparece en la lista
- Filtrar por categoría: Verifica que al hacer clic en "Herrajes", solo aparecen bisagras y tiradores, no barnices
- Ajustar stock: Verifica que al hacer clic en "+" dos veces, el stock incrementa en 2

**Ventajas:**
- Prueban la aplicación como la usa el usuario real
- Detectan problemas que solo aparecen en el navegador
- Máxima confianza en que el sistema funciona

**Desventajas:**
- Lentos (segundos por test)
- Frágiles (pueden fallar por animaciones, timeouts, etc.)
- Diagnóstico impreciso (saben que "algo falló" pero no qué)

## Diferencia entre beforeAll, beforeEach, afterEach y afterAll

- **beforeAll**: Se ejecuta una vez antes de todos los tests en un describe. Útil para configuraciones costosas (iniciar servidor de base de datos).
- **beforeEach**: Se ejecuta antes de cada test. Útil para resetear el estado (limpiar base de datos, resetear stores).
- **afterEach**: Se ejecuta después de cada test. Útil para limpiar recursos (cerrar conexiones, resetear mocks).
- **afterAll**: Se ejecuta una vez después de todos los tests. Útil para limpiar configuraciones globales (cerrar servidor, detener MSW).

## Proporción Ideal

Una pirámide de tests saludable tiene:
- 70% tests unitarios (rápidos, baratos)
- 20% tests de integración (equilibrio)
- 10% tests E2E (caros, lentos)

Esta proporción maximiza la velocidad de feedback mientras mantiene la confianza en el sistema.
