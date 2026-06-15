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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types";

interface ProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productForm: {
    id: string;
    name: string;
    description: string;
    price: string;
    stock: string;
    categoryId: string;
  };
  setProductForm: (form: any) => void;
  categories: Category[];
  loadingCategories: boolean;
  onSubmit: () => void;
  isPending: boolean;
}

export function ProductModal({ 
  open, 
  onOpenChange, 
  productForm, 
  setProductForm, 
  categories, 
  loadingCategories, 
  onSubmit,
  isPending 
}: ProductModalProps) {
  const editingProduct = productForm.id ? "Editando producto" : "Nuevo producto";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border sm:max-w-md bg-white text-slate-900 border-slate-200 dark:bg-slate-900 dark:text-slate-50 dark:border-white/10">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">{editingProduct}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-slate-700 dark:text-slate-300">Nombre</Label>
            <Input
              value={productForm.name}
              onChange={(e) => setProductForm((p: any) => ({ ...p, name: e.target.value }))}
              placeholder="Ej. Monitor 27"
              className="bg-slate-50 border-slate-300 dark:bg-slate-900/60 dark:border-white/10"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-slate-700 dark:text-slate-300">Descripción</Label>
            <Input
              value={productForm.description}
              onChange={(e) => setProductForm((p: any) => ({ ...p, description: e.target.value }))}
              placeholder="Opcional"
              className="bg-slate-50 border-slate-300 dark:bg-slate-900/60 dark:border-white/10"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-slate-700 dark:text-slate-300">Precio</Label>
              <Input
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm((p: any) => ({ ...p, price: e.target.value }))}
                min={0}
                step={0.01}
                className="bg-slate-50 border-slate-300 dark:bg-slate-900/60 dark:border-white/10"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-slate-700 dark:text-slate-300">Stock</Label>
              <Input
                type="number"
                value={productForm.stock}
                onChange={(e) => setProductForm((p: any) => ({ ...p, stock: e.target.value }))}
                min={0}
                className="bg-slate-50 border-slate-300 dark:bg-slate-900/60 dark:border-white/10"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-slate-700 dark:text-slate-300">Categoría</Label>
            <Select
              value={productForm.categoryId || undefined}
              onValueChange={(val) => setProductForm((p: any) => ({ ...p, categoryId: val }))}
            >
              <SelectTrigger className="bg-slate-50 dark:bg-slate-900">
                <SelectValue placeholder={loadingCategories ? "Cargando..." : "Selecciona"} />
              </SelectTrigger>
              <SelectContent className="bg-white text-slate-900 border border-slate-200 dark:bg-slate-900 dark:text-slate-50 dark:border-white/10">
                <SelectGroup>
                  <SelectLabel>Categorías</SelectLabel>
                  {[...categories].reverse().map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => { setProductForm({ id: "", name: "", description: "", price: "", stock: "0", categoryId: "" }); onOpenChange(false); }} disabled={isPending} className="text-slate-900 dark:text-slate-400">
            Cancelar
          </Button>
          <Button onClick={onSubmit} disabled={isPending}>
            {productForm.id ? "Guardar cambios" : "Crear producto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
