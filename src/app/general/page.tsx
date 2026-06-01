import Link from "next/link";

export default function GeneralPage() {
  return (
    <main className="min-h-screen bg-[#0b1f3d] text-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
        <header className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-slate-900/50 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300">General</p>
          <h1 className="text-3xl font-semibold">Resumen ejecutivo</h1>
          <p className="text-sm text-slate-300">
            Aquí podrás ver KPIs globales, estados generales y accesos rápidos.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-200">
            <Link
              href="/"
              className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 hover:bg-white/15"
            >
              Ir a Inventario
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-slate-900/40">
            <h2 className="text-lg font-semibold">Pendientes</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              <li>• Definir KPIs de negocio.</li>
              <li>• Conectar panel de órdenes y transferencias.</li>
              <li>• Añadir alertas de stock bajo.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-slate-900/40">
            <h2 className="text-lg font-semibold">Accesos rápidos</h2>
            <div className="mt-3 grid gap-2 text-sm text-slate-200">
              <Link className="rounded-lg bg-white/10 px-3 py-2 hover:bg-white/15" href="/ordenes">
                Órdenes
              </Link>
              <Link className="rounded-lg bg-white/10 px-3 py-2 hover:bg-white/15" href="/transferencias">
                Transferencias
              </Link>
              <Link className="rounded-lg bg-white/10 px-3 py-2 hover:bg-white/15" href="/reportes">
                Reportes
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
