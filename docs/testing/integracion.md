# Tests de Integración

## Diferencia entre Test Unitario y Test de Integración

### Test Unitario
Verifica una unidad de código de forma aislada, sin dependencias externas reales.

**Ejemplo concreto:**
```typescript
// Test unitario de filterProducts
it("filtra por nombre de forma insensible a mayúsculas", () => {
  const result = filterProducts(mockProducts, "bisagra");
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe("Bisagra cazoleta 35 mm");
});
```
Este test usa datos mockeados (`mockProducts`) y no hace peticiones reales a la API.

### Test de Integración
Verifica que múltiples unidades trabajen juntas, incluyendo dependencias externas reales o simuladas.

**Ejemplo concreto:**
```typescript
// Test de integración con MSW
it("intercepta correctamente la petición GET /api/products", async () => {
  const response = await fetch("/api/products");
  const data = await response.json();
  
  expect(response.status).toBe(200);
  expect(Array.isArray(data)).toBe(true);
  expect(data[0].name).toBe("Tablero roble macizo 40 mm");
});
```
Este test verifica que la aplicación puede hacer peticiones HTTP y procesar las respuestas correctamente.

## Por qué no se puede usar Supertest con Next.js API Routes

Supertest está diseñado para aplicaciones Express, donde tienes una instancia de servidor que puedes iniciar y detener en los tests. Next.js API Routes no funcionan así:

1. **No hay instancia de servidor**: Next.js maneja las rutas internamente, no expone una instancia Express.
2. **Arquitectura diferente**: Las API Routes de Next.js son handlers que Next.js ejecuta bajo demanda, no endpoints HTTP tradicionales.
3. **Edge Runtime**: Algunas API Routes pueden ejecutarse en el Edge, donde Supertest no funciona.

## ¿Qué hace next-test-api-route-handler?

`next-test-api-route-handler` resuelve estos problemas permitiendo:

1. **Importar el handler directamente**: Puedes importar el handler de una API Route como un módulo normal.
2. **Simular peticiones HTTP**: Crea una petición HTTP simulada que se pasa al handler.
3. **Ejecutar el handler en aislamiento**: El handler se ejecuta como lo haría Next.js, pero en el entorno de test.
4. **Verificar la respuesta**: Puedes inspeccionar el status, headers y body de la respuesta.

**Ejemplo:**
```typescript
import { testApiHandler } from "next-test-api-route-handler";
import * as productsHandler from "@/app/api/products/route";

await testApiHandler({
  appHandler: productsHandler,
  async test({ fetch }) {
    const res = await fetch({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test-Listón pino 50x50", price: 4.2 }),
    });
    expect(res.status).toBe(201);
  },
});
```

## MSW vs Mocking Directo

### ¿Por qué MSW es superior a `vi.mock('axios')`?

1. **Realismo**: MSW intercepta peticiones a nivel de red, no a nivel de librería. Esto significa que el código se ejecuta casi igual que en producción.
2. **Reutilización**: Los handlers de MSW se pueden usar en tests, desarrollo y Storybook.
3. **Independencia de librería**: No importa si usas `fetch`, `axios` o otra librería, MSW intercepta todas las peticiones.
4. **Debugging más fácil**: Puedes ver las peticiones en la Network tab del navegador durante los tests.

**Ejemplo con MSW:**
```typescript
import { http, HttpResponse } from "msw";

http.get("/api/products", () => HttpResponse.json(mockProducts))
```

**Ejemplo con vi.mock (menos ideal):**
```typescript
vi.mock('axios', () => ({
  get: () => Promise.resolve({ data: mockProducts })
}));
```

La diferencia es que con MSW, si cambias de `axios` a `fetch`, los tests siguen funcionando. Con `vi.mock`, tienes que actualizar todos los mocks.
