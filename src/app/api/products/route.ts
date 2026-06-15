import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const categoryId = searchParams.get("categoryId") ?? undefined;
  const minStock = searchParams.get("minStock");
  const stockNumber = minStock ? Number(minStock) : undefined;

  const products = await prisma.product.findMany({
    where: {
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(stockNumber !== undefined ? { stock: { gte: stockNumber } } : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, stock, categoryId } = body;

    if (!name || price === undefined || !categoryId) {
      return NextResponse.json({ error: "Nombre, precio y categoría son obligatorios" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description ?? null,
        price,
        stock: stock ?? 0,
        categoryId,
      },
      include: { category: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    const apiError: ApiError = {
      error: "Error al crear producto",
      message: error instanceof Error ? error.message : "Error desconocido",
      statusCode: 500,
    };
    return NextResponse.json(apiError, { status: 500 });
  }
}
