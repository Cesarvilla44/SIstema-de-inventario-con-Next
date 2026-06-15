import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/types";

interface Params {
  params: { id: string } | Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await Promise.resolve(params);
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });

    const category = await prisma.category.update({
      where: { id },
      data: { name, description: description ?? null },
    });

    return NextResponse.json(category);
  } catch (error: unknown) {
    const apiError: ApiError = {
      error: "Error al actualizar categoría",
      message: error instanceof Error ? error.message : "Error desconocido",
      statusCode: 500,
    };
    return NextResponse.json(apiError, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await Promise.resolve(params);
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const apiError: ApiError = {
      error: "Error al eliminar categoría",
      message: error instanceof Error ? error.message : "Error desconocido",
      statusCode: 500,
    };
    return NextResponse.json(apiError, { status: 500 });
  }
}
