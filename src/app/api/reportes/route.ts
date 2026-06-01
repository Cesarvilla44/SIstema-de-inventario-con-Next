import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const reports = await prisma.report.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(reports);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, owner = "Usuario", date, notes } = body;

    if (!title || !date) {
      return NextResponse.json({ error: "Título y fecha son obligatorios" }, { status: 400 });
    }

    const report = await prisma.report.create({
      data: {
        title,
        owner,
        date: new Date(date),
        notes: notes ?? null,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("POST /api/reportes", error);
    return NextResponse.json({ error: "Error al crear reporte" }, { status: 500 });
  }
}
