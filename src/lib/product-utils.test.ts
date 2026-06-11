import { describe, it, expect } from "vitest";
import { filterProducts, sortProducts, isLowStock, formatPrice } from "@/lib/product-utils";
import type { Product } from "@/lib/product-utils";

const mockProducts: Product[] = [
  { id: "1", name: "Tablero roble macizo 40 mm", price: 89.5, stock: 4, categoryId: "cat-maderas", createdAt: "2024-01-01" },
  { id: "2", name: "Bisagra cazoleta 35 mm", price: 2.4, stock: 0, categoryId: "cat-herrajes", createdAt: "2024-01-02" },
  { id: "3", name: "Barniz mate incoloro 1 L", price: 18.75, stock: 22, categoryId: "cat-acabados", createdAt: "2024-01-03" },
  { id: "4", name: "Tirador latón cromado", price: 8.9, stock: 15, categoryId: "cat-herrajes", createdAt: "2024-01-04" },
];

describe("filterProducts", () => {
  it("devuelve todos los productos con searchQuery vacío", () => {
    expect(filterProducts(mockProducts, "")).toHaveLength(4);
  });

  it("filtra por nombre de forma insensible a mayúsculas", () => {
    const result = filterProducts(mockProducts, "bisagra");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Bisagra cazoleta 35 mm");
  });

  it("filtra por nombre con mayúsculas", () => {
    const result = filterProducts(mockProducts, "BISAGRA");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Bisagra cazoleta 35 mm");
  });

  it("devuelve array vacío cuando no hay coincidencias", () => {
    expect(filterProducts(mockProducts, "taladro")).toHaveLength(0);
  });

  it("devuelve array vacío con array de entrada vacío", () => {
    expect(filterProducts([], "roble")).toHaveLength(0);
  });

  it("filtra por parte del nombre", () => {
    const result = filterProducts(mockProducts, "roble");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Tablero roble macizo 40 mm");
  });

  it("búsqueda que coincide con nombre de categoría pero no con nombre de producto no devuelve filas", () => {
    const result = filterProducts(mockProducts, "Herrajes");
    expect(result).toHaveLength(0);
  });

  it("filtra múltiples coincidencias", () => {
    const result = filterProducts(mockProducts, "mm");
    expect(result).toHaveLength(2);
  });
});

describe("sortProducts", () => {
  it("ordena por nombre ascendente", () => {
    const result = sortProducts(mockProducts, { field: "name", order: "asc" });
    expect(result[0].name).toBe("Barniz mate incoloro 1 L");
    expect(result[3].name).toBe("Tirador latón cromado");
  });

  it("ordena por nombre descendente", () => {
    const result = sortProducts(mockProducts, { field: "name", order: "desc" });
    expect(result[0].name).toBe("Tirador latón cromado");
    expect(result[3].name).toBe("Barniz mate incoloro 1 L");
  });

  it("ordena por precio ascendente", () => {
    const result = sortProducts(mockProducts, { field: "price", order: "asc" });
    expect(result[0].price).toBe(2.4);
    expect(result[3].price).toBe(89.5);
  });

  it("ordena por precio descendente", () => {
    const result = sortProducts(mockProducts, { field: "price", order: "desc" });
    expect(result[0].price).toBe(89.5);
    expect(result[3].price).toBe(2.4);
  });

  it("ordena por stock ascendente", () => {
    const result = sortProducts(mockProducts, { field: "stock", order: "asc" });
    expect(result[0].stock).toBe(0);
    expect(result[3].stock).toBe(22);
  });

  it("ordena por stock descendente", () => {
    const result = sortProducts(mockProducts, { field: "stock", order: "desc" });
    expect(result[0].stock).toBe(22);
    expect(result[3].stock).toBe(0);
  });

  it("ordena por fecha de creación ascendente", () => {
    const result = sortProducts(mockProducts, { field: "createdAt", order: "asc" });
    expect(result[0].createdAt).toBe("2024-01-01");
    expect(result[3].createdAt).toBe("2024-01-04");
  });

  it("ordena por fecha de creación descendente", () => {
    const result = sortProducts(mockProducts, { field: "createdAt", order: "desc" });
    expect(result[0].createdAt).toBe("2024-01-04");
    expect(result[3].createdAt).toBe("2024-01-01");
  });

  it("no muta el array original", () => {
    const originalOrder = [...mockProducts];
    sortProducts(mockProducts, { field: "price", order: "desc" });
    expect(mockProducts).toEqual(originalOrder);
  });
});

describe("isLowStock", () => {
  it("devuelve true cuando el stock está por debajo del umbral", () => {
    expect(isLowStock(mockProducts[0], 10)).toBe(true); // stock=4, umbral=10
  });

  it("devuelve true cuando el stock es exactamente cero", () => {
    expect(isLowStock(mockProducts[1], 5)).toBe(true); // stock=0 (agotado)
  });

  it("devuelve false cuando el stock supera el umbral", () => {
    expect(isLowStock(mockProducts[2], 10)).toBe(false); // stock=22
  });

  it("devuelve false cuando el stock es igual al umbral", () => {
    expect(isLowStock(mockProducts[3], 15)).toBe(false); // stock=15, umbral=15
  });

  it("devuelve true cuando el umbral es 0 y el stock es mayor", () => {
    expect(isLowStock(mockProducts[2], 0)).toBe(false); // stock=22, umbral=0
  });

  it("devuelve true cuando el umbral es 0 y el stock es 0", () => {
    expect(isLowStock(mockProducts[1], 0)).toBe(true); // stock=0, umbral=0
  });

  it("devuelve true cuando el umbral es negativo", () => {
    expect(isLowStock(mockProducts[1], -5)).toBe(true); // stock=0, umbral=-5
  });
});

describe("formatPrice", () => {
  it("formatea el precio con símbolo de euro y dos decimales", () => {
    expect(formatPrice(89.5)).toBe("89,50 €");
  });

  it("maneja correctamente los precios con cero céntimos", () => {
    expect(formatPrice(20)).toBe("20,00 €");
  });

  it("maneja precios con un decimal", () => {
    expect(formatPrice(2.4)).toBe("2,40 €");
  });

  it("maneja precios con tres decimales (redondea)", () => {
    expect(formatPrice(18.756)).toBe("18,76 €");
  });

  it("maneja precios grandes", () => {
    expect(formatPrice(1234.56)).toBe("1.234,56 €");
  });

  it("maneja precio cero", () => {
    expect(formatPrice(0)).toBe("0,00 €");
  });
});
