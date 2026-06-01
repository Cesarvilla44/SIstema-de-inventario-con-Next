import Link from "next/link";

interface Props {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
}

const mockReports: Record<string, { title: string; owner: string; date: string; notes: string }> = {
  "REP-001": {
    title: "Stock bajo",
    owner: "Equipo Ops",
    date: "2025-04-01",
    notes: "Revisar abastecimiento de línea A y B.",
  },
  "REP-002": {
    title: "Rotación mensual",
    owner: "Analítica",
    date: "2025-04-15",
    notes: "Rotación estable; sugerir promo en categoría periféricos.",
  },
};

export default function ReportDetailPage({ params, searchParams }: Props) {
  const title = Array.isArray(searchParams.title) ? searchParams.title[0] : searchParams.title;
  const date = Array.isArray(searchParams.date) ? searchParams.date[0] : searchParams.date;
  const owner = Array.isArray(searchParams.owner) ? searchParams.owner[0] : searchParams.owner;
  const notes = Array.isArray(searchParams.notes) ? searchParams.notes[0] : searchParams.notes;

  const report = {
    title: title || mockReports[params.id]?.title || "Nuevo reporte",
    owner: owner || mockReports[params.id]?.owner || "Usuario",
    date: date || mockReports[params.id]?.date || new Date().toISOString().slice(0, 10),
    notes: notes || mockReports[params.id]?.notes || "Detalle pendiente.",
  };

  return (
    <main className="min-h-screen bg-[#0b1f3d] text-slate-50">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
        <header className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-slate-900/50 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Reporte</p>
          <h1 className="text-3xl font-semibold">{report.title}</h1>
          <p className="text-sm text-slate-300">ID: {params.id}</p>
          <p className="text-sm text-slate-300">Propietario: {report.owner}</p>
          <p className="text-sm text-slate-300">Fecha: {report.date}</p>
          <div className="mt-4 flex gap-3 text-sm text-slate-200">
            <Link href="/reportes" className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 hover:bg-white/15">
              Volver a reportes
            </Link>
            <Link href="/" className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 hover:bg-white/15">
              Volver a inventario
            </Link>
          </div>
        </header>

        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-xl shadow-slate-900/50">
          <h2 className="text-lg font-semibold">Observaciones</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-200">{report.notes}</p>
        </section>
      </div>
    </main>
  );
}
