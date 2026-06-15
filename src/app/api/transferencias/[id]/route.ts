import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/types";

interface Params {
  params: { id: string } | Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await Promise.resolve(params);
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  const transfer = await prisma.transfer.findUnique({ where: { id } });
  if (!transfer) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(transfer);
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await Promise.resolve(params);
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  try {
    const body = await request.json();
    const { from, to, items, date, notes } = body;
    const transfer = await prisma.transfer.update({
      where: { id },
      data: {
        from,
        to,
        items: items !== undefined ? Number(items) : undefined,
        date: date ? new Date(date) : undefined,
        notes,
      },
    });
    return NextResponse.json(transfer);
  } catch (error: unknown) {
    const apiError: ApiError = {
      error: "Error al actualizar",
      message: error instanceof Error ? error.message : "Error desconocido",
      statusCode: 500,
    };
    return NextResponse.json(apiError, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await Promise.resolve(params);
  try {
    await prisma.transfer.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const apiError: ApiError = {
      error: "Error al eliminar",
      message: error instanceof Error ? error.message : "Error desconocido",
      statusCode: 500,
    };
    return NextResponse.json(apiError, { status: 500 });
  }
}
