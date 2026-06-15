import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import { useFiltersStore } from "@/store/filters";

interface ProductFiltersProps {
  categories: Category[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const filters = useFiltersStore();

  return (
    <div className="flex flex-wrap gap-3 text-sm text-slate-900 dark:text-slate-200">
      <div className="flex flex-1 min-w-[220px] items-center gap-2">
        <Input
          placeholder="Buscar nombre o descripción"
          value={filters.search}
          onChange={(e) => filters.setSearch(e.target.value)}
          className="bg-slate-50 border-slate-300 dark:bg-slate-900/60 dark:border-white/10"
        />
      </div>
      <div className="flex items-center gap-2 min-w-[200px]">
        <Label className="text-xs text-slate-900 dark:text-slate-300">Categoría</Label>
        <Select
          value={filters.categoryId ?? "all"}
          onValueChange={(val) => filters.setCategoryId(val === "all" ? null : val)}
        >
          <SelectTrigger className="w-[200px] bg-slate-50 dark:bg-slate-900">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent className="bg-white text-slate-900 border border-slate-200 dark:bg-slate-900 dark:text-slate-50 dark:border-white/10">
            <SelectGroup>
              <SelectLabel>Todas</SelectLabel>
              <SelectItem value="all">Todas</SelectItem>
              {[...categories].reverse().map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Label className="text-xs text-slate-900 dark:text-slate-300">Stock ≥</Label>
        <Input
          type="number"
          className="w-28 bg-slate-50 border-slate-300 dark:bg-slate-900/60 dark:border-white/10"
          value={filters.minStock ?? ""}
          onChange={(e) => filters.setMinStock(e.target.value ? Number(e.target.value) : null)}
        />
      </div>
      <Button variant="ghost" className="text-xs text-slate-900 dark:text-slate-200" onClick={() => filters.reset()}>
        Limpiar filtros
      </Button>
    </div>
  );
}
