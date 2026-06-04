"use client";

import Link from "next/link";
import { useThemeStore } from "@/store/theme";

export default function GeneralPage() {
  const { theme } = useThemeStore();

  return (
    <main className={`min-h-screen ${theme === "dark" ? "bg-[#0b1f3d] text-slate-50" : "bg-slate-100 text-slate-900"}`}>
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
        <header className={`rounded-2xl border p-6 shadow-2xl backdrop-blur ${theme === "dark" ? "border-white/10 bg-slate-900/70 shadow-slate-900/50" : "border-slate-200 bg-white shadow-slate-200/50"}`}>
          <p className={`text-xs uppercase tracking-[0.3em] ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>General</p>
          <h1 className={`text-3xl font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Resumen ejecutivo</h1>
          <p className={`text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
            Aquí podrás ver KPIs globales, estados generales y accesos rápidos.
          </p>
          <div className={`mt-4 flex flex-wrap gap-3 text-sm ${theme === "dark" ? "text-slate-200" : "text-slate-600"}`}>
            <Link
              href="/"
              className={`rounded-lg border px-3 py-2 ${theme === "dark" ? "border-white/10 bg-white/10 hover:bg-white/15" : "border-slate-300 bg-slate-50 hover:bg-slate-100"}`}
            >
              Ir a Inventario
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <div className={`rounded-xl border p-4 shadow-lg ${theme === "dark" ? "border-white/10 bg-slate-900/70 shadow-slate-900/40" : "border-slate-200 bg-white shadow-slate-200/40"}`}>
            <h2 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Pendientes</h2>
            <ul className={`mt-3 space-y-2 text-sm ${theme === "dark" ? "text-slate-200" : "text-slate-600"}`}>
              <li>• Definir KPIs de negocio.</li>
              <li>• Conectar panel de órdenes y transferencias.</li>
              <li>• Añadir alertas de stock bajo.</li>
            </ul>
          </div>
          <div className={`rounded-xl border p-4 shadow-lg ${theme === "dark" ? "border-white/10 bg-slate-900/70 shadow-slate-900/40" : "border-slate-200 bg-white shadow-slate-200/40"}`}>
            <h2 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Accesos rápidos</h2>
            <div className={`mt-3 grid gap-2 text-sm ${theme === "dark" ? "text-slate-200" : "text-slate-600"}`}>
              <Link className={`rounded-lg px-3 py-2 ${theme === "dark" ? "bg-white/10 hover:bg-white/15" : "bg-slate-50 hover:bg-slate-100"}`} href="/ordenes">
                Órdenes
              </Link>
              <Link className={`rounded-lg px-3 py-2 ${theme === "dark" ? "bg-white/10 hover:bg-white/15" : "bg-slate-50 hover:bg-slate-100"}`} href="/transferencias">
                Transferencias
              </Link>
              <Link className={`rounded-lg px-3 py-2 ${theme === "dark" ? "bg-white/10 hover:bg-white/15" : "bg-slate-50 hover:bg-slate-100"}`} href="/reportes">
                Reportes
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
