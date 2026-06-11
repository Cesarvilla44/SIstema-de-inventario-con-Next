# Tests E2E con Playwright

## Page Object Model (POM)

El Page Object Model es un patrón de diseño que encapsula la lógica de interacción con la página en objetos reutilizables. En lugar de tener selectores dispersos por los tests, se crean clases que representan páginas o componentes.

**Ventajas del POM:**
- **Reutilización**: Los selectores se definen una vez y se reutilizan en múltiples tests.
- **Mantenibilidad**: Si la UI cambia, solo hay que actualizar el Page Object, no todos los tests.
- **Legibilidad**: Los tests leen como lenguaje natural, no como selectores CSS.
- **Separación de concerns**: La lógica de interacción está separada de la lógica de test.

**Ejemplo sin POM:**
```typescript
test("añadir producto", async ({ page }) => {
  await page.goto("/");
  await page.locator("button[name='add-product']").click();
  await page.locator("input[name='name']").fill("Producto");
  await page.locator("input[name='price']").fill("10");
  await page.locator("button[name='save']").click();
});
```

**Ejemplo con POM:**
```typescript
class InventoryPage {
  constructor(private page: Page) {}
  
  async goto() {
    await this.page.goto("/");
  }
  
  async addProduct(name: string, price: string) {
    await this.page.click("button[name='add-product']");
    await this.page.fill("input[name='name']", name);
    await this.page.fill("input[name='price']", price);
    await this.page.click("button[name='save']");
  }
}

test("añadir producto", async ({ page }) => {
  const inventory = new InventoryPage(page);
  await inventory.goto();
  await inventory.addProduct("Producto", "10");
});
```

## Cuándo preferir Test E2E sobre Test de Integración

### Prefiere Test E2E cuando:
1. **El flujo es crítico para el negocio**: El usuario principal necesita que este flujo funcione perfectamente.
2. **Involucra múltiples sistemas**: El flujo atraviesa frontend, backend, base de datos y servicios externos.
3. **La UI es compleja**: Hay interacciones complejas (drag & drop, animaciones, estados visuales).
4. **Hay bugs que solo aparecen en el navegador**: Problemas de CSS, JavaScript, polyfills, etc.

**Ejemplo del inventario:**
- Flujo completo de añadir un producto: Clic en botón → Modal → Formulario → Guardar → Actualización de lista → Toast de éxito. Este flujo involucra UI compleja y es crítico para el negocio.

### Prefiere Test de Integración cuando:
1. **El flujo es simple**: Una petición API y una respuesta.
2. **Es más rápido de testear a nivel de API**: No necesitas el navegador para verificarlo.
3. **Quieres tests más rápidos en CI**: Los tests E2E son lentos y costosos.

**Ejemplo del inventario:**
- Verificar que `POST /api/products` valida correctamente los datos. No necesitas el navegador para esto, un test de integración es suficiente.

## Ejemplos de Tests E2E del Inventario

### Test 1: Añadir Producto
```typescript
test("añadir un nuevo producto aparece en la lista", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /añadir/i }).click();
  await page.getByLabel(/nombre/i).fill("Lasur para exterior 2,5 L");
  await page.getByLabel(/precio/i).fill("24.9");
  await page.getByLabel(/stock/i).fill("8");
  await page.getByRole("button", { name: /guardar/i }).click();
  
  await expect(page.getByText("Lasur para exterior 2,5 L")).toBeVisible();
  await expect(page.getByText("24,90 €")).toBeVisible();
});
```

### Test 2: Filtrar por Categoría
```typescript
test("filtrar por categoría muestra solo los productos de esa categoría", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /herrajes/i }).click();
  
  const productCards = page.locator('[data-testid="product-card"]');
  const count = await productCards.count();

  for (let i = 0; i < count; i++) {
    const category = await productCards.nth(i).locator('[data-testid="product-category"]').textContent();
    expect(category).toContain("Herrajes");
  }
});
```

### Test 3: Ajuste de Stock
```typescript
test("ajuste de stock incrementa correctamente", async ({ page }) => {
  await page.goto("/");
  
  const firstProduct = page.locator('[data-testid="product-card"]').first();
  const stockBefore = await firstProduct.locator('[data-testid="product-stock"]').textContent();
  
  await firstProduct.getByRole("button", { name: "+" }).click();
  await firstProduct.getByRole("button", { name: "+" }).click();
  
  const stockAfter = await firstProduct.locator('[data-testid="product-stock"]').textContent();
  expect(parseInt(stockAfter || "0")).toBe(parseInt(stockBefore || "0") + 2);
});
```

## Buenas Prácticas

1. **Usa selectores estables**: Prefiere `getByRole`, `getByLabel` sobre selectores CSS frágiles.
2. **Espera explícitamente**: Usa `waitForSelector` o `expect(...).toBeVisible()` en lugar de `waitForTimeout`.
3. **Data attributes**: Usa `data-testid` para elementos que no tienen roles o labels naturales.
4. **Aísla los tests**: Cada test debe poder ejecutarse independientemente.
5. **Limpia después de cada test**: Usa `beforeEach` para restablecer el estado de la aplicación.
