import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";

describe("MSW Integration", () => {
  it("intercepta correctamente la petición GET /api/products", async () => {
    const response = await fetch("/api/products");
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(8);
    expect(data[0].name).toBe("Tablero roble macizo 40 mm");
  });

  it("intercepta correctamente la petición GET /api/categories", async () => {
    const response = await fetch("/api/categories");
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(3);
    expect(data[0].name).toBe("Maderas y tableros");
  });

  it("intercepta correctamente la petición POST /api/products", async () => {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test-Producto",
        price: 10.5,
        stock: 5,
        categoryId: "cat-maderas",
      }),
    });
    
    const data = await response.json();
    
    expect(response.status).toBe(201);
    expect(data.name).toBe("Test-Producto");
    expect(data.price).toBe(10.5);
    expect(data.id).toBeDefined();
  });

  it("devuelve 400 cuando faltan datos en POST /api/products", async () => {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test" }),
    });
    
    expect(response.status).toBe(400);
  });

  it("puede sobrescribir handlers temporalmente", async () => {
    server.use(
      http.get("/api/products", () => HttpResponse.json([{ id: "1", name: "Mock Override" }]))
    );
    
    const response = await fetch("/api/products");
    const data = await response.json();
    
    expect(data).toHaveLength(1);
    expect(data[0].name).toBe("Mock Override");
    
    server.resetHandlers();
  });
});
