import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/types";

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
  } catch (error: unknown) {
    const apiError: ApiError = {
      error: "Error al crear reporte",
      message: error instanceof Error ? error.message : "Error desconocido",
      statusCode: 500,
    };
    return NextResponse.json(apiError, { status: 500 });
  }
}
