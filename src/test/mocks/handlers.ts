import { http, HttpResponse } from "msw";
import type { Product } from "@/lib/product-utils";

const mockProducts: Product[] = [
  { id: "1", name: "Tablero roble macizo 40 mm", price: 89.5, stock: 12, categoryId: "cat-maderas", createdAt: "2024-01-01" },
  { id: "2", name: "Bisagra cazoleta 35 mm", price: 2.4, stock: 0, categoryId: "cat-herrajes", createdAt: "2024-01-02" },
  { id: "3", name: "Barniz mate incoloro 1 L", price: 18.75, stock: 22, categoryId: "cat-acabados", createdAt: "2024-01-03" },
  { id: "4", name: "Tirador latón cromado", price: 8.9, stock: 15, categoryId: "cat-herrajes", createdAt: "2024-01-04" },
  { id: "5", name: "Listón pino 50x50 mm", price: 4.2, stock: 45, categoryId: "cat-maderas", createdAt: "2024-01-05" },
  { id: "6", name: "Lasur para exterior 2,5 L", price: 24.9, stock: 8, categoryId: "cat-acabados", createdAt: "2024-01-06" },
  { id: "7", name: "Tornillo 4x40 mm (pack 100)", price: 5.5, stock: 30, categoryId: "cat-herrajes", createdAt: "2024-01-07" },
  { id: "8", name: "Tablero contrachapado 18 mm", price: 42.0, stock: 18, categoryId: "cat-maderas", createdAt: "2024-01-08" },
];

export const handlers = [
  http.get("/api/products", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search");
    const categoryId = url.searchParams.get("categoryId");
    const minStock = url.searchParams.get("minStock");

    let filtered = [...mockProducts];

    if (search) {
      filtered = filtered.filter((p) => 
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryId) {
      filtered = filtered.filter((p) => p.categoryId === categoryId);
    }

    if (minStock) {
      filtered = filtered.filter((p) => p.stock >= Number(minStock));
    }

    return HttpResponse.json(filtered);
  }),

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
      { 
        id: "cat-maderas", 
        name: "Maderas y tableros", 
        description: "Roble, pino y tableros contrachapados" 
      },
      { 
        id: "cat-herrajes", 
        name: "Herrajes", 
        description: "Bisagras, tiradores y tornillería" 
      },
      { 
        id: "cat-acabados", 
        name: "Acabados", 
        description: "Barnices, lasures y aceites" 
      },
    ])
  ),
];
