import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryForm: {
    id: string;
    name: string;
    description: string;
  };
  setCategoryForm: (form: any) => void;
  onSubmit: () => void;
  isPending: boolean;
}

export function CategoryModal({ 
  open, 
  onOpenChange, 
  categoryForm, 
  setCategoryForm, 
  onSubmit,
  isPending 
}: CategoryModalProps) {
  const editingCategory = categoryForm.id ? "Editando categoría" : "Nueva categoría";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border sm:max-w-md bg-white text-slate-900 border-slate-200 dark:bg-slate-900 dark:text-slate-50 dark:border-white/10">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">{editingCategory}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
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
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => { setCategoryForm({ id: "", name: "", description: "" }); onOpenChange(false); }} disabled={isPending} className="text-slate-900 dark:text-slate-400">
            Cancelar
          </Button>
          <Button onClick={onSubmit} disabled={isPending}>
            {categoryForm.id ? "Guardar" : "Crear categoría"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
