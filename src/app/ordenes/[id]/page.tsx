import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: { id: string } | Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await Promise.resolve(params);
  if (!id) return notFound();

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return notFound();

  const formattedDate = new Intl.DateTimeFormat("es-ES").format(new Date(order.date));
  const amount = Number(order.amount).toFixed(2);
  const notes = order.notes?.trim() || "Sin notas registradas";

  return (
    <main className="min-h-screen bg-[#0b1f3d] text-slate-50">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
        <header className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-slate-900/50 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Orden de Venta</p>
          <h1 className="text-3xl font-semibold">Cliente: {order.customer}</h1>
          <p className="text-sm text-slate-300">ID: {id}</p>
          <p className="text-sm text-slate-300">Monto: ${amount}</p>
          <p className="text-sm text-slate-300">Fecha: {formattedDate}</p>
          <div className="mt-2">
            <span className="inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100">
              {order.status}
            </span>
          </div>
          <div className="mt-6 flex gap-3 text-sm text-slate-200">
            <Link href="/ordenes" className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 hover:bg-white/15">
              Volver a órdenes
            </Link>
            <Link href="/" className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 hover:bg-white/15">
              Volver a inventario
            </Link>
          </div>
        </header>

        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-xl shadow-slate-900/50">
          <h2 className="text-lg font-semibold">Observaciones</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-200">{notes}</p>
        </section>
      </div>
    </main>
  );
}
