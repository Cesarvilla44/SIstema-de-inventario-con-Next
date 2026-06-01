import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function GET(_req: Request, { params }: Params) {
  const report = await prisma.report.findUnique({ where: { id: params.id } });
  if (!report) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(report);
}

export async function DELETE(req: Request, ctx: Params) {
  const urlId = req.url?.split("/api/reportes/")[1]?.split("?")[0];
  const id = ctx?.params?.id || urlId;
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  try {
    await prisma.report.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/reportes/[id]", error);
    if ((error as any)?.code === "P2025") {
      // Ya no existe: tratamos como éxito idempotente
      return NextResponse.json({ ok: true });
    }
    const detail = (error as Error)?.message ?? "Error al eliminar";
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
