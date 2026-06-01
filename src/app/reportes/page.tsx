"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    onError: (err: any) => {
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
    onError: (err: any) => {
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
    <main className="min-h-screen bg-[#0b1f3d] text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
        <header className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-slate-900/50 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Reportes</p>
          <h1 className="text-3xl font-semibold">Reportes y alertas</h1>
          <p className="text-sm text-slate-300">Vista demo. Aquí irán gráficos, exportaciones y alertas.</p>
          <div className="mt-4 flex gap-3 text-sm text-slate-200">
            <Link href="/" className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 hover:bg-white/15">
              Volver a Inventario
            </Link>
          </div>
        </header>

        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-xl shadow-slate-900/50">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Reportes disponibles</h2>
            <Button onClick={() => setOpen(true)} className="bg-blue-500 hover:bg-blue-500/90 text-white shadow-md shadow-blue-900/30">
              Nuevo reporte
            </Button>
          </div>
          <div className="overflow-hidden rounded-xl border border-white/10">
            {deleteError ? <p className="px-3 py-2 text-sm text-red-300">{deleteError}</p> : null}
            <table className="min-w-full bg-slate-950/60 text-sm">
              <thead className="bg-[#050915] text-white">
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
                  <tr key={r.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="px-3 py-2">
                      <Link className="hover:underline" href={makeHref(r)}>
                        {r.id}
                      </Link>
                    </td>
                    <td className="px-3 py-2">
                      <Link className="hover:underline" href={makeHref(r)}>
                        {r.title}
                      </Link>
                    </td>
                    <td className="px-3 py-2">{r.owner}</td>
                    <td className="px-3 py-2">{r.date}</td>
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
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Nuevo reporte</p>
                <h3 className="text-xl font-semibold">Crear reporte</h3>
                <p className="text-xs text-slate-400">ID asignado automáticamente: {nextId}</p>
              </div>
              <button className="text-slate-300 hover:text-white" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="space-y-1">
                <Label>Título</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Alerta de stock" />
              </div>
              <div className="space-y-1">
                <Label>Fecha</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="[color-scheme:dark] text-white" />
              </div>
              <div className="space-y-1">
                <Label>Observaciones</Label>
                <textarea
                  className="min-h-[100px] w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none placeholder:text-slate-500"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe hallazgos o acciones..."
                />
                {errorMsg ? <p className="text-sm text-red-300">{errorMsg}</p> : null}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setOpen(false)}>
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
