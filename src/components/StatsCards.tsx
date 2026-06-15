function StatCard({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <div className="rounded-xl border p-4 shadow-lg border-slate-200 bg-white shadow-slate-200/30 dark:border-white/10 dark:bg-slate-900 dark:from-slate-900/80 dark:to-slate-800/50 dark:shadow-slate-900/30">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-900 dark:text-slate-300">{label}</p>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</span>
        <span className={`inline-flex h-6 items-center rounded-full bg-gradient-to-r px-2 text-[11px] font-semibold text-white/90 ${accent}`}>OK</span>
      </div>
    </div>
  );
}

interface StatsCardsProps {
  productCount: number;
  categoryCount: number;
  totalStock: number;
  totalValue: number;
}

export function StatsCards({ productCount, categoryCount, totalStock, totalValue }: StatsCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Productos" value={productCount} accent="from-blue-500/60 to-blue-400/20" />
      <StatCard label="Categorías" value={categoryCount} accent="from-emerald-500/60 to-emerald-400/20" />
      <StatCard label="Stock total" value={totalStock} accent="from-indigo-500/60 to-indigo-400/20" />
      <StatCard label="Valor estimado" value={`$${totalValue.toFixed(2)}`} accent="from-amber-500/60 to-amber-400/20" />
    </div>
  );
}
