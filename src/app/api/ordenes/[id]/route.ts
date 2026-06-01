import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function GET(_req: Request, { params }: Params) {
  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    const { customer, status, amount, date, notes } = body;
    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        customer,
        status,
        amount: amount !== undefined ? Number(amount) : undefined,
        date: date ? new Date(date) : undefined,
        notes,
      },
    });
    return NextResponse.json(order);
  } catch (error) {
    console.error("PUT /api/ordenes/[id]", error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await prisma.order.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/ordenes/[id]", error);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
