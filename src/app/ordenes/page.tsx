"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Order = {
  id: string;
  customer: string;
  status: string;
  amount: number;
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

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: () => fetchJson("/api/ordenes"),
  });

  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState("");
  const [status, setStatus] = useState("Pendiente");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const createOrder = useMutation({
    mutationFn: () =>
      fetchJson("/api/ordenes", {
        method: "POST",
        body: JSON.stringify({ customer, status, amount: Number(amount), date, notes }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setCustomer("");
      setAmount("");
      setNotes("");
      setStatus("Pendiente");
      setDate(new Date().toISOString().slice(0, 10));
      setOpen(false);
      setErrorMsg(null);
    },
    onError: (err: any) => setErrorMsg(err?.message || "No se pudo crear la orden"),
  });

  const deleteOrder = useMutation({
    mutationFn: async (id: string) => {
      setDeletingId(id);
      return fetchJson(`/api/ordenes/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      setDeletingId(null);
      setDeleteError(null);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err: any) => {
      setDeletingId(null);
      setDeleteError(err?.message || "No se pudo borrar");
    },
  });

  const submit = () => {
    if (!customer.trim() || !amount) return;
    setErrorMsg(null);
    createOrder.mutate();
  };

  return (
    <main className="min-h-screen bg-[#0b1f3d] text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
        <header className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-slate-900/50 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Órdenes</p>
          <h1 className="text-3xl font-semibold">Gestión de órdenes</h1>
          <p className="text-sm text-slate-300">Órdenes reales con alta/baja.</p>
          <div className="mt-4 flex gap-3 text-sm text-slate-200">
            <Link href="/" className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 hover:bg-white/15">
              Volver a Inventario
            </Link>
          </div>
        </header>

        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-xl shadow-slate-900/50">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Órdenes recientes</h2>
            <Button onClick={() => setOpen(true)} className="bg-blue-500 hover:bg-blue-500/90 text-white shadow-md shadow-blue-900/30">
              Nueva orden
            </Button>
          </div>
          <div className="overflow-hidden rounded-xl border border-white/10">
            {deleteError ? <p className="px-3 py-2 text-sm text-red-300">{deleteError}</p> : null}
            <table className="min-w-full bg-slate-950/60 text-sm">
              <thead className="bg-[#050915] text-white">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold">ID</th>
                  <th className="px-3 py-3 text-left font-semibold">Cliente</th>
                  <th className="px-3 py-3 text-left font-semibold">Estado</th>
                  <th className="px-3 py-3 text-right font-semibold">Monto</th>
                  <th className="px-3 py-3 text-left font-semibold">Fecha</th>
                  <th className="px-3 py-3 text-left font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="px-3 py-3 text-slate-300" colSpan={6}>
                      Cargando...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td className="px-3 py-3 text-slate-300" colSpan={6}>
                      Sin órdenes
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="px-3 py-2">{o.id}</td>
                      <td className="px-3 py-2">{o.customer}</td>
                      <td className="px-3 py-2">
                        <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-100">{o.status}</span>
                      </td>
                      <td className="px-3 py-2 text-right">${Number(o.amount).toFixed(2)}</td>
                      <td className="px-3 py-2">{o.date?.slice(0, 10)}</td>
                      <td className="px-3 py-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deleteOrder.isPending}
                          onClick={() => deleteOrder.mutate(o.id)}
                        >
                          {deleteOrder.isPending && deletingId === o.id ? "Borrando..." : "Borrar"}
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
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Nueva orden</p>
                <h3 className="text-xl font-semibold">Crear orden</h3>
              </div>
              <button className="text-slate-300 hover:text-white" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="space-y-1">
                <Label>Cliente</Label>
                <Input value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Nombre del cliente" />
              </div>
              <div className="space-y-1">
                <Label>Estado</Label>
                <Input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Pendiente / Procesado" />
              </div>
              <div className="space-y-1">
                <Label>Monto</Label>
                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
              </div>
              <div className="space-y-1">
                <Label>Fecha</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Notas</Label>
                <textarea
                  className="min-h-[80px] w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none placeholder:text-slate-500"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observaciones de la orden"
                />
                {errorMsg ? <p className="text-sm text-red-300">{errorMsg}</p> : null}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={submit} disabled={!customer.trim() || !amount || createOrder.isPending} className="bg-emerald-500 hover:bg-emerald-500/90 text-white">
                  {createOrder.isPending ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
