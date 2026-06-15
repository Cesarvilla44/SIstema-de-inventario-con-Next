import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/types";

export async function GET() {
  const transfers = await prisma.transfer.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(transfers);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { from, to, items, date, notes } = body;

    if (!from || !to || !items || !date) {
      return NextResponse.json({ error: "Origen, destino, items y fecha son obligatorios" }, { status: 400 });
    }

    const transfer = await prisma.transfer.create({
      data: {
        from,
        to,
        items: Number(items),
        date: new Date(date),
        notes: notes ?? null,
      },
    });

    return NextResponse.json(transfer, { status: 201 });
  } catch (error: unknown) {
    const apiError: ApiError = {
      error: "Error al crear transferencia",
      message: error instanceof Error ? error.message : "Error desconocido",
      statusCode: 500,
    };
    return NextResponse.json(apiError, { status: 500 });
  }
}
