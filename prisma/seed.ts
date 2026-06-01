import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const categories = await Promise.all(
    [
      { name: "Electrónica", description: "Dispositivos y accesorios" },
      { name: "Oficina", description: "Material de oficina" },
      { name: "Almacén", description: "Herramientas y consumibles" },
    ].map((data) => prisma.category.create({ data }))
  );

  const catMap = Object.fromEntries(
    categories.map((c: { id: string; name: string }) => [c.name, c.id] as const)
  );

  await prisma.product.createMany({
    data: [
      {
        name: "Laptop 14\"",
        description: "Ultrabook 16GB RAM",
        price: 1299.99,
        stock: 12,
        categoryId: catMap["Electrónica"],
      },
      {
        name: "Monitor 27\"",
        description: "QHD IPS",
        price: 329.0,
        stock: 8,
        categoryId: catMap["Electrónica"],
      },
      {
        name: "Mouse inalámbrico",
        price: 29.99,
        stock: 40,
        categoryId: catMap["Electrónica"],
      },
      {
        name: "Silla ergonómica",
        price: 189.5,
        stock: 15,
        categoryId: catMap["Oficina"],
      },
      {
        name: "Escritorio ajustable",
        price: 399.0,
        stock: 6,
        categoryId: catMap["Oficina"],
      },
      {
        name: "Cuaderno A5",
        price: 3.5,
        stock: 120,
        categoryId: catMap["Oficina"],
      },
      {
        name: "Cinta de embalar",
        price: 2.4,
        stock: 200,
        categoryId: catMap["Almacén"],
      },
      {
        name: "Guantes de nitrilo",
        price: 12.99,
        stock: 90,
        categoryId: catMap["Almacén"],
      },
      {
        name: "Caja plástica 30L",
        price: 9.75,
        stock: 55,
        categoryId: catMap["Almacén"],
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
