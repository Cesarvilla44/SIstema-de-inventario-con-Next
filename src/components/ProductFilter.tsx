"use client";

import { useFiltersStore } from "@/store/filters";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProductFilter() {
  const { search, setSearch, minStock, setMinStock } = useFiltersStore();

  return (
    <div className="flex gap-4 items-end">
      <div className="flex-1">
        <Label htmlFor="search">Buscar</Label>
        <Input
          id="search"
          placeholder="Nombre del producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="w-32">
        <Label htmlFor="minStock">Stock mínimo</Label>
        <Input
          id="minStock"
          type="number"
          placeholder="0"
          value={minStock ?? ""}
          onChange={(e) => setMinStock(e.target.value ? Number(e.target.value) : null)}
        />
      </div>
    </div>
  );
}
