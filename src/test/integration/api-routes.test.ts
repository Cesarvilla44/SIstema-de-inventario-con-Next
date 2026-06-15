import { describe, it, expect } from "vitest";
import { testApiHandler } from "next-test-api-route-handler";
import * as productsHandler from "@/app/api/products/route";
import * as categoriesHandler from "@/app/api/categories/route";

describe("API Routes Integration", () => {
  describe("POST /api/products", () => {
    it("devuelve 400 cuando faltan datos obligatorios", async () => {
      await testApiHandler({
        appHandler: productsHandler,
        async test({ fetch }) {
          const res = await fetch({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: "Test",
              // falta price y categoryId
            }),
          });
          expect(res.status).toBe(400);
          
          const data = await res.json();
          expect(data.error).toBeDefined();
        },
      });
    });

    it("devuelve 400 cuando falta el precio", async () => {
      await testApiHandler({
        appHandler: productsHandler,
        async test({ fetch }) {
          const res = await fetch({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: "Test",
              categoryId: "cat-maderas",
              // falta price
            }),
          });
          expect(res.status).toBe(400);
        },
      });
    });

    it("devuelve 400 cuando falta la categoría", async () => {
      await testApiHandler({
        appHandler: productsHandler,
        async test({ fetch }) {
          const res = await fetch({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: "Test",
              price: 10,
              // falta categoryId
            }),
          });
          expect(res.status).toBe(400);
        },
      });
    });
  });

  describe("GET /api/categories", () => {
    it("devuelve lista de categorías", async () => {
      await testApiHandler({
        appHandler: categoriesHandler,
        async test({ fetch }) {
          const res = await fetch({
            method: "GET",
          });
          expect(res.status).toBe(200);
          
          const data = await res.json();
          expect(Array.isArray(data)).toBe(true);
        },
      });
    });
  });
});
