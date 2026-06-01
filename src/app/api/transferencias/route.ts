import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
  } catch (error) {
    console.error("POST /api/transferencias", error);
    return NextResponse.json({ error: "Error al crear transferencia" }, { status: 500 });
  }
}
