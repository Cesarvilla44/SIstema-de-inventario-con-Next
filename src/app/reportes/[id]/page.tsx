import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: { id: string } | Promise<{ id: string }>;
}

export default async function ReportDetailPage({ params }: Props) {
  const { id } = await Promise.resolve(params);
  if (!id) return notFound();

  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) return notFound();

  const formattedDate = new Intl.DateTimeFormat("es-ES").format(new Date(report.date));
  const owner = report.owner || "Usuario";
  const notes = report.notes?.trim() || "Sin notas registradas";

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 dark:bg-[#0b1f3d] dark:text-slate-50">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/50 backdrop-blur dark:border-white/10 dark:bg-slate-900/70 dark:shadow-slate-900/50">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-600 dark:text-slate-300">Reporte</p>
          <h1 className="text-3xl font-semibold">{report.title}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">ID: {id}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">Propietario: {owner}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">Fecha: {formattedDate}</p>
          <div className="mt-4 flex gap-3 text-sm text-slate-900 dark:text-slate-200">
            <Link href="/reportes" className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 hover:bg-white/15">
              Volver a reportes
            </Link>
            <Link href="/" className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 hover:bg-white/15">
              Volver a inventario
            </Link>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-slate-900/50">
          <h2 className="text-lg font-semibold">Observaciones</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-900 dark:text-slate-200">{notes}</p>
        </section>
      </div>
    </main>
  );
}
