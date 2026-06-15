import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from "@/types";

interface ProductFormProps {
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
  onClear: () => void;
  isPending: boolean;
}

export function ProductForm({ 
  productForm, 
  setProductForm, 
  categories, 
  loadingCategories, 
  onSubmit, 
  onClear,
  isPending 
}: ProductFormProps) {
  const editingProduct = productForm.id ? "Editando producto" : "Nuevo producto";

  return (
    <Card className="border shadow-2xl backdrop-blur border-slate-200 bg-white shadow-slate-200/50 text-slate-900 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-50 dark:shadow-slate-900/50">
      <CardHeader className="border-b border-slate-200 dark:border-white/5">
        <CardTitle className="text-slate-900 dark:text-white">{editingProduct}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
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
        <div className="flex gap-2">
          <Button className="flex-1 bg-blue-500 hover:bg-blue-500/90 text-white shadow-md shadow-blue-900/30" onClick={onSubmit} disabled={isPending}>
            {productForm.id ? "Guardar cambios" : "Crear producto"}
          </Button>
          <Button variant="ghost" onClick={onClear} disabled={isPending} className="text-slate-900 dark:text-slate-400">
            Limpiar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
