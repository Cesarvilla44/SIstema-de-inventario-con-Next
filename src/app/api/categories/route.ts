import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/types";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });

    const category = await prisma.category.create({
      data: { name, description: description ?? null },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: unknown) {
    const apiError: ApiError = {
      error: "Error al crear categoría",
      message: error instanceof Error ? error.message : "Error desconocido",
      statusCode: 500,
    };
    return NextResponse.json(apiError, { status: 500 });
  }
}
