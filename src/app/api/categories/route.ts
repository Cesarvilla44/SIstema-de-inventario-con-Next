import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
  } catch (error) {
    console.error("POST /api/categories", error);
    return NextResponse.json({ error: "Error al crear categoría" }, { status: 500 });
  }
}
