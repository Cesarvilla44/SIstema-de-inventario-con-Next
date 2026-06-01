import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function GET(_req: Request, { params }: Params) {
  const transfer = await prisma.transfer.findUnique({ where: { id: params.id } });
  if (!transfer) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(transfer);
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    const { from, to, items, date, notes } = body;
    const transfer = await prisma.transfer.update({
      where: { id: params.id },
      data: {
        from,
        to,
        items: items !== undefined ? Number(items) : undefined,
        date: date ? new Date(date) : undefined,
        notes,
      },
    });
    return NextResponse.json(transfer);
  } catch (error) {
    console.error("PUT /api/transferencias/[id]", error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await prisma.transfer.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/transferencias/[id]", error);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
