import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFiltersStore } from "@/store/filters";
import { Category, Product } from "@/types";

const asNumber = (value: unknown) =>
  typeof value === "number" ? value : Number(value);

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onStockChange: (id: string, delta: number) => void;
  stockMutationPending: boolean;
  deletePending: boolean;
}

export function ProductTable({ 
  products, 
  categories, 
  loading, 
  onEdit, 
  onDelete, 
  onStockChange,
  stockMutationPending,
  deletePending 
}: ProductTableProps) {
  const filters = useFiltersStore();

  return (
    <div className="rounded-xl border shadow-lg overflow-hidden border-slate-200 bg-white shadow-slate-200/40 dark:border-white/15 dark:bg-slate-900/80 dark:shadow-slate-900/40">
      <Table>
        <TableHeader className="sticky top-0 shadow-sm bg-slate-50 text-slate-900 dark:bg-[#050915] dark:text-white">
          <TableRow>
            <TableHead className="text-slate-900 drop-shadow-sm dark:text-white">Producto</TableHead>
            <TableHead className="text-slate-900 drop-shadow-sm dark:text-white">Categoria</TableHead>
            <TableHead className="text-right text-slate-900 drop-shadow-sm dark:text-white">Precio</TableHead>
            <TableHead className="text-center text-slate-900 drop-shadow-sm dark:text-white">Stock</TableHead>
            <TableHead className="text-left text-slate-900 drop-shadow-sm dark:text-white">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-slate-400 dark:text-slate-900">
                Cargando productos...
              </TableCell>
            </TableRow>
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-slate-400 dark:text-slate-900">
                No hay productos con los filtros actuales.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id} className="border-b border-slate-200 bg-slate-50/20 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/10">
                <TableCell className="max-w-[240px]">
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-semibold text-slate-900 dark:text-white">{product.name}</span>
                    {product.description ? (
                      <span className="text-xs line-clamp-2 text-slate-900 dark:text-slate-200">{product.description}</span>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:border-white/20">
                    {product.category?.name ?? "Sin categoría"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${asNumber(product.price).toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={stockMutationPending}
                      onClick={() => onStockChange(product.id, -1)}
                    >
                      -
                    </Button>
                    <span className="text-base font-semibold text-slate-900 dark:text-white">{product.stock}</span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={stockMutationPending}
                      onClick={() => onStockChange(product.id, 1)}
                    >
                      +
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-left">
                  <div className="flex justify-start gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-blue-500 text-white hover:bg-blue-500/90 shadow-md shadow-blue-900/30 border-none"
                      onClick={() => onEdit(product)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deletePending}
                      onClick={() => onDelete(product.id)}
                    >
                      Borrar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <p className="px-4 py-3 text-sm text-slate-400 dark:text-slate-900">Actualización de stock optimista con rollback.</p>
    </div>
  );
}
