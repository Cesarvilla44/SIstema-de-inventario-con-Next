import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    const { name, description, price, stock, categoryId } = body;

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description: description ?? null,
        price,
        stock,
        categoryId,
      },
      include: { category: true },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("PUT /api/products/[id]", error);
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/products/[id]", error);
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 });
  }
}
