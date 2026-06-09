"use client";

import Link from "next/link";
import { useThemeStore } from "@/store/theme";

export default function GeneralPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 dark:bg-[#0b1f3d] dark:text-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
        <header className="rounded-2xl border p-6 shadow-2xl backdrop-blur border-white/10 bg-slate-900/70 shadow-slate-900/50 dark:border-slate-200 dark:bg-white dark:shadow-slate-200/50">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300 dark:text-slate-600">General</p>
          <h1 className="text-3xl font-semibold text-white dark:text-slate-900">Resumen ejecutivo</h1>
          <p className="text-sm text-slate-300 dark:text-slate-600">
            Aquí podrás ver KPIs globales, estados generales y accesos rápidos.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-200 dark:text-slate-600">
            <Link
              href="/"
              className="rounded-lg border px-3 py-2 border-white/10 bg-white/10 hover:bg-white/15 dark:border-slate-300 dark:bg-slate-50 dark:hover:bg-slate-100"
            >
              Ir a Inventario
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border p-4 shadow-lg border-white/10 bg-slate-900/70 shadow-slate-900/40 dark:border-slate-200 dark:bg-white dark:shadow-slate-200/40">
            <h2 className="text-lg font-semibold text-white dark:text-slate-900">Pendientes</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-200 dark:text-slate-600">
              <li>• Definir KPIs de negocio.</li>
              <li>• Conectar panel de órdenes y transferencias.</li>
              <li>• Añadir alertas de stock bajo.</li>
            </ul>
          </div>
          <div className="rounded-xl border p-4 shadow-lg border-white/10 bg-slate-900/70 shadow-slate-900/40 dark:border-slate-200 dark:bg-white dark:shadow-slate-200/40">
            <h2 className="text-lg font-semibold text-white dark:text-slate-900">Accesos rápidos</h2>
            <div className="mt-3 grid gap-2 text-sm text-slate-200 dark:text-slate-600">
              <Link className="rounded-lg px-3 py-2 bg-white/10 hover:bg-white/15 dark:bg-slate-50 dark:hover:bg-slate-100" href="/ordenes">
                Órdenes
              </Link>
              <Link className="rounded-lg px-3 py-2 bg-white/10 hover:bg-white/15 dark:bg-slate-50 dark:hover:bg-slate-100" href="/transferencias">
                Transferencias
              </Link>
              <Link className="rounded-lg px-3 py-2 bg-white/10 hover:bg-white/15 dark:bg-slate-50 dark:hover:bg-slate-100" href="/reportes">
                Reportes
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
