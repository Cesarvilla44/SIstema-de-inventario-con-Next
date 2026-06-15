import Link from "next/link";

export function InventorySidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-2 rounded-2xl border p-4 shadow-2xl backdrop-blur md:flex border-slate-200 bg-white shadow-slate-200/40 dark:border-white/10 dark:bg-slate-900/5 dark:shadow-slate-900/40">
      <div className="text-sm font-semibold text-slate-900 dark:text-white">Menú</div>
      {[{ label: "General", href: "/general" }, { label: "Inventario", href: "/" }, { label: "Órdenes", href: "/ordenes" }, { label: "Transferencias", href: "/transferencias" }, { label: "Reportes", href: "/reportes" }].map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition bg-slate-200 text-slate-900 font-semibold dark:bg-white/15 dark:text-white dark:font-semibold hover:bg-slate-100 dark:hover:bg-white/10"
        >
          {item.label}
        </Link>
      ))}
    </aside>
  );
}
