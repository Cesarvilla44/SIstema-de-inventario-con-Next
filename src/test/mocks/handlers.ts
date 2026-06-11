import { http, HttpResponse } from "msw";
import type { Product } from "@/lib/product-utils";

const mockProducts: Product[] = [
  { id: "1", name: "Tablero roble macizo 40 mm", price: 89.5, stock: 12, categoryId: "cat-maderas", createdAt: "2024-01-01" },
  { id: "2", name: "Bisagra cazoleta 35 mm", price: 2.4, stock: 0, categoryId: "cat-herrajes", createdAt: "2024-01-02" },
  { id: "3", name: "Barniz mate incoloro 1 L", price: 18.75, stock: 22, categoryId: "cat-acabados", createdAt: "2024-01-03" },
];

export const handlers = [
  http.get("/api/products", () => HttpResponse.json(mockProducts)),

  http.post("/api/products", async ({ request }) => {
    const body = await request.json() as Partial<Product>;
    if (!body.name || body.price === undefined) {
      return HttpResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: body.name,
      price: body.price,
      stock: body.stock ?? 0,
      categoryId: body.categoryId ?? "cat-maderas",
      createdAt: new Date().toISOString(),
    };
    return HttpResponse.json(newProduct, { status: 201 });
  }),

  http.patch("/api/products/:id/stock", async ({ params, request }) => {
    const { stock } = await request.json() as { stock: number };
    const product = mockProducts.find((p) => p.id === params.id);
    if (!product) return HttpResponse.json({ error: "No encontrado" }, { status: 404 });
    return HttpResponse.json({ ...product, stock });
  }),

  http.get("/api/categories", () =>
    HttpResponse.json([
      { id: "cat-maderas", name: "Maderas y tableros", description: "Roble, pino y tableros contrachapados" },
      { id: "cat-herrajes", name: "Herrajes", description: "Bisagras, tiradores y tornillería" },
    ])
  ),
];
