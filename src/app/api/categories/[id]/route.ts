import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
  } catch (error) {
    console.error("PUT /api/categories/[id]", error);
    return NextResponse.json({ error: "Error al actualizar categoría" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await Promise.resolve(params);
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/categories/[id]", error);
    return NextResponse.json({ error: "Error al eliminar categoría" }, { status: 500 });
  }
}
