import { Button } from "@/components/ui/button";

interface InventoryHeaderProps {
  onSettingsClick: () => void;
  onAddCategory: () => void;
  onAddProduct: () => void;
}

export function InventoryHeader({ onSettingsClick, onAddCategory, onAddProduct }: InventoryHeaderProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur border-slate-200 bg-white shadow-slate-200/50 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-slate-900/50">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-900 dark:text-slate-300">
            Inventario
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-100">Activo</span>
          </div>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Panel de productos</h1>
          <p className="text-sm text-slate-900 dark:text-slate-300">Controla existencias, categorías y stock en tiempo real.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="border-slate-300 bg-slate-50 dark:border-white/20 dark:bg-white/10" onClick={onSettingsClick}>Ajustes</Button>
          <Button onClick={onAddCategory}>+ Categoría</Button>
          <Button onClick={onAddProduct} className="bg-emerald-500 hover:bg-emerald-500/90 text-emerald-50">+ Producto</Button>
        </div>
      </div>
    </div>
  );
}
