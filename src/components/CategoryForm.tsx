import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from "@/types";

interface CategoryFormProps {
  categoryForm: {
    id: string;
    name: string;
    description: string;
  };
  setCategoryForm: (form: any) => void;
  categories: Category[];
  loadingCategories: boolean;
  onSubmit: () => void;
  onClear: () => void;
  isPending: boolean;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  deletePending: boolean;
}

export function CategoryForm({ 
  categoryForm, 
  setCategoryForm, 
  categories, 
  loadingCategories, 
  onSubmit, 
  onClear,
  isPending,
  onEditCategory,
  onDeleteCategory,
  deletePending
}: CategoryFormProps) {
  const editingCategory = categoryForm.id ? "Editando categoría" : "Nueva categoría";

  return (
    <Card className="border shadow-2xl backdrop-blur border-slate-200 bg-white shadow-slate-200/40 text-slate-900 dark:border-white/10 dark:bg-slate-900/5 dark:text-slate-50 dark:shadow-slate-900/40">
      <CardHeader className="border-b border-slate-200 dark:border-white/5">
        <CardTitle className="text-slate-900 dark:text-white">{editingCategory}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <Label className="text-slate-700 dark:text-slate-300">Nombre</Label>
          <Input
            value={categoryForm.name}
            onChange={(e) => setCategoryForm((c: any) => ({ ...c, name: e.target.value }))}
            placeholder="Ej. Oficina"
            className="bg-slate-50 border-slate-300 dark:bg-slate-900/60 dark:border-white/10"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-slate-700 dark:text-slate-300">Descripción</Label>
          <Input
            value={categoryForm.description}
            onChange={(e) => setCategoryForm((c: any) => ({ ...c, description: e.target.value }))}
            placeholder="Opcional"
            className="bg-slate-50 border-slate-300 dark:bg-slate-900/60 dark:border-white/10"
          />
        </div>
        <div className="flex gap-2">
          <Button className="flex-1 bg-blue-500 hover:bg-blue-500/90 text-white shadow-md shadow-blue-900/30" onClick={onSubmit} disabled={isPending}>
            {categoryForm.id ? "Guardar" : "Crear categoría"}
          </Button>
          <Button variant="ghost" onClick={onClear} disabled={isPending} className="text-slate-900 dark:text-slate-400">
            Limpiar
          </Button>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-950/50">
          <div className="px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-900 dark:text-white">Categorías</div>
          <div className="divide-y divide-slate-200 dark:divide-white/5">
            {loadingCategories ? (
              <div className="p-3 text-sm text-slate-400 dark:text-slate-900">Cargando...</div>
            ) : categories.length === 0 ? (
              <div className="p-3 text-sm text-slate-400 dark:text-slate-900">Sin categorías</div>
            ) : (
              [...categories].reverse().map((cat) => (
                <div key={cat.id} className="flex items-center justify-between px-3 py-2 text-sm">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-50">{cat.name}</p>
                    {cat.description ? <p className="text-xs text-slate-500 dark:text-slate-400">{cat.description}</p> : null}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="xs"
                      className="bg-blue-500 text-white hover:bg-blue-500/90 shadow-md shadow-blue-900/30 border-none"
                      onClick={() => onEditCategory(cat)}
                    >
                      Editar
                    </Button>
                    <Button variant="destructive" size="xs" disabled={deletePending} onClick={() => onDeleteCategory(cat.id)}>
                      Borrar
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
