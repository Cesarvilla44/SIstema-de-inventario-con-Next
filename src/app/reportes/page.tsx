"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useThemeStore } from "@/store/theme";
import { ErrorWithMessage } from "@/lib/types";

type Report = {
  id: string;
  title: string;
  owner: string;
  date: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

const fetchJson = async (input: RequestInfo | URL, init?: RequestInit) => {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload.error || "Error inesperado");
  }
  return res.json();
};

export default function ReportsPage() {
  const queryClient = useQueryClient();
  const { data: reports = [], isLoading } = useQuery<Report[]>({
    queryKey: ["reports"],
    queryFn: () => fetchJson("/api/reportes"),
  });
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const nextId = useMemo(() => `REP-${Date.now()}`, [open]);

  const createReport = useMutation({
    mutationFn: () =>
      fetchJson("/api/reportes", {
        method: "POST",
        body: JSON.stringify({ title, date, notes, owner: "Usuario" }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      setTitle("");
      setNotes("");
      setDate(new Date().toISOString().slice(0, 10));
      setOpen(false);
      setErrorMsg(null);
    },
    onError: (err: ErrorWithMessage) => {
      setErrorMsg(err?.message || "No se pudo guardar el reporte");
    },
  });

  const deleteReport = useMutation({
    mutationFn: async (id: string) => {
      setDeletingId(id);
      return fetchJson(`/api/reportes/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      setDeletingId(null);
      setDeleteError(null);
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (err: ErrorWithMessage) => {
      setDeletingId(null);
      setDeleteError(err?.message || "No se pudo borrar");
    },
  });

  const submit = () => {
    if (!title.trim()) return;
    setErrorMsg(null);
    createReport.mutate();
  };

  const makeHref = (r: Report) => `/reportes/${r.id}`;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 dark:bg-[#0b1f3d] dark:text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
        <header className="rounded-2xl border p-6 shadow-2xl backdrop-blur border-slate-200 bg-white shadow-slate-200/50 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-slate-900/50">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-900 dark:text-slate-300">Reportes</p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Reportes y alertas</h1>
          <p className="text-sm text-slate-900 dark:text-slate-300">Vista demo. Aquí irán gráficos, exportaciones y alertas.</p>
          <div className="mt-4 flex gap-3 text-sm text-slate-200 dark:text-slate-900">
            <Link href="/" className="rounded-lg border px-3 py-2 border-slate-300 bg-slate-900 text-white hover:bg-slate-800 dark:border-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
              Volver a Inventario
            </Link>
          </div>
        </header>

        <section className="rounded-2xl border p-4 shadow-xl border-slate-200 bg-white shadow-slate-200/50 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-slate-900/50">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Reportes disponibles</h2>
            <Button onClick={() => setOpen(true)} className="bg-blue-500 hover:bg-blue-500/90 text-white shadow-md shadow-blue-900/30">
              Nuevo reporte
            </Button>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
            {deleteError ? <p className="px-3 py-2 text-sm text-red-300">{deleteError}</p> : null}
            <table className="min-w-full text-sm bg-white dark:bg-slate-950/60">
              <thead className="bg-slate-50 text-slate-900 dark:bg-[#050915] dark:text-white">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold">ID</th>
                  <th className="px-3 py-3 text-left font-semibold">Título</th>
                  <th className="px-3 py-3 text-left font-semibold">Propietario</th>
                  <th className="px-3 py-3 text-left font-semibold">Fecha</th>
                  <th className="px-3 py-3 text-left font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b border-white/10 hover:bg-white/5 dark:border-slate-200 dark:hover:bg-slate-50">
                    <td className="px-3 py-2">
                      <Link className="hover:underline text-blue-400 dark:text-blue-600" href={makeHref(r)}>
                        {r.id}
                      </Link>
                    </td>
                    <td className="px-3 py-2">
                      <Link className="hover:underline text-slate-900 dark:text-white" href={makeHref(r)}>
                        {r.title}
                      </Link>
                    </td>
                    <td className="px-3 py-2 text-slate-900 dark:text-slate-300">{r.owner}</td>
                    <td className="px-3 py-2 text-slate-900 dark:text-slate-300">{r.date}</td>
                    <td className="px-3 py-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deleteReport.isPending}
                        onClick={() => deleteReport.mutate(r.id)}
                      >
                        {deleteReport.isPending && deletingId === r.id ? "Borrando..." : "Borrar"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl border p-6 shadow-2xl backdrop-blur border-slate-200 bg-white shadow-slate-200/50 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-slate-900/50">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-900 dark:text-slate-300">Nuevo reporte</p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Crear reporte</h3>
                <p className="text-xs text-slate-400 dark:text-slate-900">ID asignado automáticamente: {nextId}</p>
              </div>
              <button className="text-slate-300 hover:text-white dark:text-slate-900 dark:hover:text-slate-900" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="space-y-1">
                <Label className="text-slate-700 dark:text-slate-300">Título</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Alerta de stock" className="bg-slate-50 border-slate-300 dark:bg-slate-900 dark:border-white/10" />
              </div>
              <div className="space-y-1">
                <Label className="text-slate-700 dark:text-slate-300">Fecha</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-slate-50 border-slate-300 dark:bg-slate-900 dark:border-white/10" />
              </div>
              <div className="space-y-1">
                <Label className="text-slate-700 dark:text-slate-300">Observaciones</Label>
                <textarea
                  className="min-h-[100px] w-full rounded-lg border px-3 py-2 text-sm outline-none placeholder:text-slate-500 border-white/10 bg-slate-900/70 text-slate-50 dark:border-slate-300 dark:bg-slate-50 dark:text-slate-900"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe hallazgos o acciones..."
                />
                {errorMsg ? <p className="text-sm text-red-300">{errorMsg}</p> : null}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setOpen(false)} className="text-slate-900 dark:text-slate-400">
                  Cancelar
                </Button>
                <Button onClick={submit} disabled={!title.trim() || createReport.isPending} className="bg-emerald-500 hover:bg-emerald-500/90 text-white">
                  {createReport.isPending ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
