import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, status = "Pendiente", amount, date, notes } = body;

    if (!customer || !amount || !date) {
      return NextResponse.json({ error: "Cliente, monto y fecha son obligatorios" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        customer,
        status,
        amount: Number(amount),
        date: new Date(date),
        notes: notes ?? null,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("POST /api/ordenes", error);
    return NextResponse.json({ error: "Error al crear orden" }, { status: 500 });
  }
}
