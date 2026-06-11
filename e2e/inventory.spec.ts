import { test, expect } from "@playwright/test";

test.describe("Inventario de Carpintería Los Artesanos", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("añadir un nuevo producto aparece en la lista", async ({ page }) => {
    // Esperar a que la página cargue
    await page.waitForLoadState("networkidle");

    // Hacer clic en el botón de añadir producto
    await page.getByRole("button", { name: /añadir/i }).first().click();

    // Rellenar el formulario
    await page.getByLabel(/nombre/i).fill("Lasur para exterior 2,5 L");
    await page.getByLabel(/precio/i).fill("24.9");
    await page.getByLabel(/stock/i).fill("8");

    // Guardar el producto
    await page.getByRole("button", { name: /guardar/i }).click();

    // Verificar que el producto aparece en la lista
    await expect(page.getByText("Lasur para exterior 2,5 L")).toBeVisible();
    await expect(page.getByText("24,90 €")).toBeVisible();
  });

  test("filtrar por categoría muestra solo los productos de esa categoría", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // Hacer clic en una categoría (ej: Herrajes)
    await page.getByRole("button", { name: /herrajes/i }).click();

    // Esperar a que se actualice la lista
    await page.waitForTimeout(500);

    // Verificar que todos los productos visibles son de la categoría Herrajes
    // Nota: Este test asume que hay productos con data-testid="product-category"
    // Si no existen, se puede adaptar el selector
    const productCards = page.locator('[data-testid="product-card"]');
    const count = await productCards.count();

    for (let i = 0; i < count; i++) {
      const category = await productCards.nth(i).locator('[data-testid="product-category"]').textContent();
      expect(category).toContain("Herrajes");
    }
  });

  test("ajuste de stock incrementa correctamente", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // Localizar un producto y obtener su stock inicial
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    const stockBefore = await firstProduct.locator('[data-testid="product-stock"]').textContent();

    // Hacer clic en el botón + dos veces
    await firstProduct.getByRole("button", { name: "+" }).click();
    await firstProduct.getByRole("button", { name: "+" }).click();

    // Verificar que el stock se incrementó en 2
    const stockAfter = await firstProduct.locator('[data-testid="product-stock"]').textContent();
    expect(parseInt(stockAfter || "0")).toBe(parseInt(stockBefore || "0") + 2);
  });
});
