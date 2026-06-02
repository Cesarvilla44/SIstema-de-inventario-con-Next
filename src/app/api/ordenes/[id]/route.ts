import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string } | Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await Promise.resolve(params);
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await Promise.resolve(params);
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  try {
    const body = await request.json();
    const { customer, status, amount, date, notes } = body;
    const order = await prisma.order.update({
      where: { id },
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
  const { id } = await Promise.resolve(params);
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  try {
    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("DELETE /api/ordenes/[id]", error);
    if (error?.code === "P2025") {
      // Si no existe, respondemos idempotente
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Error al eliminar orden" }, { status: 500 });
  }
}
