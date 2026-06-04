"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useThemeStore } from "@/store/theme";

type Transfer = {
  id: string;
  from: string;
  to: string;
  items: number;
  date: string;
  notes?: string;
  createdAt?: string;
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

export default function TransfersPage() {
  const queryClient = useQueryClient();
  const { theme } = useThemeStore();
  const { data: transfers = [], isLoading } = useQuery<Transfer[]>({
    queryKey: ["transfers"],
    queryFn: () => fetchJson("/api/transferencias"),
  });

  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [items, setItems] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const createTransfer = useMutation({
    mutationFn: () =>
      fetchJson("/api/transferencias", {
        method: "POST",
        body: JSON.stringify({ from, to, items: Number(items), date, notes }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
      setFrom("");
      setTo("");
      setItems("");
      setNotes("");
      setDate(new Date().toISOString().slice(0, 10));
      setOpen(false);
      setErrorMsg(null);
    },
    onError: (err: any) => setErrorMsg(err?.message || "No se pudo crear la transferencia"),
  });

  const deleteTransfer = useMutation({
    mutationFn: async (id: string) => {
      setDeletingId(id);
      return fetchJson(`/api/transferencias/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      setDeletingId(null);
      setDeleteError(null);
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
    onError: (err: any) => {
      setDeletingId(null);
      setDeleteError(err?.message || "No se pudo borrar");
    },
  });

  const submit = () => {
    if (!from.trim() || !to.trim() || !items) return;
    setErrorMsg(null);
    createTransfer.mutate();
  };

  return (
    <main className={`min-h-screen ${theme === "dark" ? "bg-[#0b1f3d] text-slate-50" : "bg-slate-100 text-slate-900"}`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
        <header className={`rounded-2xl border p-6 shadow-2xl backdrop-blur ${theme === "dark" ? "border-white/10 bg-slate-900/70 shadow-slate-900/50" : "border-slate-200 bg-white shadow-slate-200/50"}`}>
          <p className={`text-xs uppercase tracking-[0.3em] ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>Transferencias</p>
          <h1 className={`text-3xl font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Movimientos entre almacenes</h1>
          <p className={`text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>Transferencias reales con alta/baja.</p>
          <div className={`mt-4 flex gap-3 text-sm ${theme === "dark" ? "text-slate-200" : "text-slate-600"}`}>
            <Link href="/" className={`rounded-lg border px-3 py-2 ${theme === "dark" ? "border-white/10 bg-white/10 hover:bg-white/15" : "border-slate-300 bg-slate-50 hover:bg-slate-100"}`}>
              Volver a Inventario
            </Link>
          </div>
        </header>

        <section className={`rounded-2xl border p-4 shadow-xl ${theme === "dark" ? "border-white/10 bg-slate-900/70 shadow-slate-900/50" : "border-slate-200 bg-white shadow-slate-200/50"}`}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Transferencias recientes</h2>
            <Button onClick={() => setOpen(true)} className="bg-blue-500 hover:bg-blue-500/90 text-white shadow-md shadow-blue-900/30">
              Nueva transferencia
            </Button>
          </div>
          <div className={`overflow-hidden rounded-xl border ${theme === "dark" ? "border-white/10" : "border-slate-200"}`}>
            {deleteError ? <p className="px-3 py-2 text-sm text-red-300">{deleteError}</p> : null}
            <table className={`min-w-full text-sm ${theme === "dark" ? "bg-slate-950/60" : "bg-white"}`}>
              <thead className={theme === "dark" ? "bg-[#050915] text-white" : "bg-slate-50 text-slate-900"}>
                <tr>
                  <th className="px-3 py-3 text-left font-semibold">ID</th>
                  <th className="px-3 py-3 text-left font-semibold">Origen</th>
                  <th className="px-3 py-3 text-left font-semibold">Destino</th>
                  <th className="px-3 py-3 text-right font-semibold">Ítems</th>
                  <th className="px-3 py-3 text-left font-semibold">Fecha</th>
                  <th className="px-3 py-3 text-left font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className={`px-3 py-3 ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`} colSpan={6}>
                      Cargando...
                    </td>
                  </tr>
                ) : transfers.length === 0 ? (
                  <tr>
                    <td className={`px-3 py-3 ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`} colSpan={6}>
                      Sin transferencias
                    </td>
                  </tr>
                ) : (
                  transfers.map((t) => (
                    <tr key={t.id} className={`border-b ${theme === "dark" ? "border-white/10 hover:bg-white/5" : "border-slate-200 hover:bg-slate-50"}`}>
                      <td className="px-3 py-2">
                        <Link className="hover:underline text-blue-400 font-medium" href={`/transferencias/${t.id}`}>
                          {t.id}
                        </Link>
                      </td>
                      <td className="px-3 py-2">
                        <Link className={`hover:underline font-medium ${theme === "dark" ? "text-white" : "text-slate-900"}`} href={`/transferencias/${t.id}`}>
                          {t.from}
                        </Link>
                      </td>
                      <td className="px-3 py-2">
                        <Link className={`hover:underline font-medium ${theme === "dark" ? "text-white" : "text-slate-900"}`} href={`/transferencias/${t.id}`}>
                          {t.to}
                        </Link>
                      </td>
                      <td className="px-3 py-2 text-right">{t.items}</td>
                      <td className="px-3 py-2">{t.date?.slice(0, 10)}</td>
                      <td className="px-3 py-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deleteTransfer.isPending}
                          onClick={() => deleteTransfer.mutate(t.id)}
                        >
                          {deleteTransfer.isPending && deletingId === t.id ? "Borrando..." : "Borrar"}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl backdrop-blur ${theme === "dark" ? "border-white/10 bg-slate-900/90 shadow-slate-950/60" : "border-slate-200 bg-white shadow-slate-200/60"}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={`text-xs uppercase tracking-[0.3em] ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>Nueva transferencia</p>
                <h3 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Crear transferencia</h3>
              </div>
              <button className={theme === "dark" ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"} onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="space-y-1">
                <Label className={theme === "dark" ? "" : "text-slate-700"}>Origen</Label>
                <Input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Almacén origen" className={theme === "dark" ? "" : "bg-slate-50 border-slate-300"} />
              </div>
              <div className="space-y-1">
                <Label className={theme === "dark" ? "" : "text-slate-700"}>Destino</Label>
                <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Almacén destino" className={theme === "dark" ? "" : "bg-slate-50 border-slate-300"} />
              </div>
              <div className="space-y-1">
                <Label className={theme === "dark" ? "" : "text-slate-700"}>Ítems</Label>
                <Input type="number" value={items} onChange={(e) => setItems(e.target.value)} placeholder="0" className={theme === "dark" ? "" : "bg-slate-50 border-slate-300"} />
              </div>
              <div className="space-y-1">
                <Label className={theme === "dark" ? "" : "text-slate-700"}>Fecha</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={theme === "dark" ? "" : "bg-slate-50 border-slate-300"} />
              </div>
              <div className="space-y-1">
                <Label className={theme === "dark" ? "" : "text-slate-700"}>Notas</Label>
                <textarea
                  className={`min-h-[80px] w-full rounded-lg border px-3 py-2 text-sm outline-none placeholder:text-slate-500 ${theme === "dark" ? "border-white/10 bg-slate-900/70 text-slate-50" : "border-slate-300 bg-slate-50 text-slate-900"}`}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observaciones de la transferencia"
                />
                {errorMsg ? <p className="text-sm text-red-300">{errorMsg}</p> : null}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setOpen(false)} className={theme === "dark" ? "" : "text-slate-600"}>
                  Cancelar
                </Button>
                <Button onClick={submit} disabled={!from.trim() || !to.trim() || !items || createTransfer.isPending} className="bg-emerald-500 hover:bg-emerald-500/90 text-white">
                  {createTransfer.isPending ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
