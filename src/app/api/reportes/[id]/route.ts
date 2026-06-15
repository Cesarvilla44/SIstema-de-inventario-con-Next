import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/types";

interface Params {
  params: { id: string } | Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await Promise.resolve(params);
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(report);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await Promise.resolve(params);
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  try {
    await prisma.report.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      // Ya no existe: tratamos como éxito idempotente
      return NextResponse.json({ ok: true });
    }
    const apiError: ApiError = {
      error: "Error al eliminar reporte",
      message: error instanceof Error ? error.message : "Error desconocido",
      statusCode: 500,
    };
    return NextResponse.json(apiError, { status: 500 });
  }
}
