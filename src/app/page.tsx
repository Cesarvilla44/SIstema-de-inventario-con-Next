"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useThemeStore } from "@/store/theme";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFiltersStore } from "@/store/filters";

type Category = {
  id: string;
  name: string;
  description: string | null;
};

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  categoryId: string;
  category: Category;
};

const fetchJson = async (input: RequestInfo | URL, init?: RequestInit) => {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload.error || "Error inesperado");
  }

  return res.json();
};

const asNumber = (value: unknown) =>
  typeof value === "number" ? value : Number(value);

function useCategoriesQuery() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetchJson("/api/categories"),
  });
}

function useProductsQuery(filters: {
  search: string;
  categoryId: string | null;
  minStock: number | null;
}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.minStock !== null) params.set("minStock", String(filters.minStock));

  const key = ["products", filters.search, filters.categoryId, filters.minStock];

  return useQuery<Product[]>({
    queryKey: key,
    queryFn: () => fetchJson(`/api/products?${params.toString()}`),
  });
}

const emptyProductForm = {
  id: "",
  name: "",
  description: "",
  price: "",
  stock: "0",
  categoryId: "",
};

const emptyCategoryForm = {
  id: "",
  name: "",
  description: "",
};

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

export default function InventoryPage() {
  const filters = useFiltersStore();
  const queryClient = useQueryClient();
  const { data: categories = [], isLoading: loadingCategories } = useCategoriesQuery();
  const productsKey = ["products", filters.search, filters.categoryId, filters.minStock];
  const { data: products = [], isLoading: loadingProducts } = useProductsQuery(filters);
  const { setTheme } = useThemeStore();

  const [productForm, setProductForm] = useState(emptyProductForm);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const productMutation = useMutation({
    mutationFn: async (payload: typeof productForm) => {
      const body = {
        name: payload.name,
        description: payload.description || null,
        price: Number(payload.price),
        stock: Number(payload.stock),
        categoryId: payload.categoryId,
      };

      if (payload.id) {
        return fetchJson(`/api/products/${payload.id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      }

      return fetchJson("/api/products", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsKey });
      setProductForm(emptyProductForm);
      setProductModalOpen(false);
    },
  });

  const deleteProduct = useMutation({
    mutationFn: (id: string) =>
      fetchJson(`/api/products/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productsKey }),
  });

  const stockMutation = useMutation({
    mutationFn: async ({ id, delta }: { id: string; delta: number }) => {
      const current = products.find((p) => p.id === id);
      const nextStock = Math.max(0, (current?.stock ?? 0) + delta);
      return fetchJson(`/api/products/${id}`, {
        method: "PUT",
        body: JSON.stringify({ stock: nextStock }),
      });
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: productsKey });
      const previous = queryClient.getQueryData<Product[]>(productsKey);

      queryClient.setQueryData<Product[] | undefined>(productsKey, (old) =>
        old?.map((p) =>
          p.id === variables.id
            ? { ...p, stock: Math.max(0, p.stock + variables.delta) }
            : p
        )
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(productsKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productsKey });
    },
  });

  const categoryMutation = useMutation({
    mutationFn: async (payload: typeof categoryForm) => {
      const body = { name: payload.name, description: payload.description || null };
      if (payload.id) {
        return fetchJson(`/api/categories/${payload.id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      }
      return fetchJson("/api/categories", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: productsKey });
      setCategoryForm(emptyCategoryForm);
      setCategoryModalOpen(false);
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) =>
      fetchJson(`/api/categories/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: productsKey });
    },
  });

  const totalStock = useMemo(
    () => products.reduce((acc, p) => acc + p.stock, 0),
    [products]
  );

  const totalValue = useMemo(
    () => products.reduce((acc, p) => acc + p.stock * asNumber(p.price), 0),
    [products]
  );

  const productCount = products.length;
  const categoryCount = categories.length;

  const editingProduct = productForm.id ? "Editando producto" : "Nuevo producto";
  const editingCategory = categoryForm.id ? "Editando categoría" : "Nueva categoría";

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 dark:bg-[#0b1f3d] dark:text-slate-50 overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(59,130,246,0.3),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.3),transparent_32%),radial-gradient(circle_at_60%_80%,rgba(99,102,241,0.32),transparent_34%)]" />
          <div className="absolute inset-x-0 bottom-[-8%] h-[38%] bg-[radial-gradient(120%_120%_at_50%_20%,rgba(59,130,246,0.45),transparent)] blur-3xl opacity-80" />
          <div className="absolute inset-0 animate-[wave_18s_ease-in-out_infinite] bg-[linear-gradient(120deg,rgba(255,255,255,0.1),transparent_35%),linear-gradient(240deg,rgba(255,255,255,0.07),transparent_32%)] opacity-45" />
        </>
      </div>
      <div className="relative mx-auto flex max-w-7xl gap-4 px-4 py-6 md:px-6">
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

        <div className="flex-1 space-y-5">
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
                <Button variant="outline" className="border-slate-300 bg-slate-50 dark:border-white/20 dark:bg-white/10" onClick={() => setSettingsModalOpen(true)}>Ajustes</Button>
                <Button onClick={() => { setCategoryForm(emptyCategoryForm); setCategoryModalOpen(true); }}>+ Categoría</Button>
                <Button onClick={() => { setProductForm(emptyProductForm); setProductModalOpen(true); }} className="bg-emerald-500 hover:bg-emerald-500/90 text-emerald-50">+ Producto</Button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Productos" value={productCount} accent="from-blue-500/60 to-blue-400/20" />
              <StatCard label="Categorías" value={categoryCount} accent="from-emerald-500/60 to-emerald-400/20" />
              <StatCard label="Stock total" value={totalStock} accent="from-indigo-500/60 to-indigo-400/20" />
              <StatCard label="Valor estimado" value={`$${totalValue.toFixed(2)}`} accent="from-amber-500/60 to-amber-400/20" />
            </div>
          </div>

          <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
            <Card className="border text-slate-900 shadow-2xl backdrop-blur border-slate-200 bg-white shadow-slate-200/40 dark:border-white/10 dark:bg-slate-900/5 dark:text-slate-50 dark:shadow-slate-900/40">
              <CardHeader className="border-b border-slate-200 dark:border-white/5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">Listado de productos</CardTitle>
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
                            {categories.map((cat) => (
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
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
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
                      {loadingProducts ? (
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
                                  disabled={stockMutation.isPending}
                                  onClick={() => stockMutation.mutate({ id: product.id, delta: -1 })}
                                >
                                  -
                                </Button>
                                <span className="text-base font-semibold text-slate-900 dark:text-white">{product.stock}</span>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  disabled={stockMutation.isPending}
                                  onClick={() => stockMutation.mutate({ id: product.id, delta: 1 })}
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
                                  onClick={() => {
                                    setProductForm({
                                      id: product.id,
                                      name: product.name,
                                      description: product.description ?? "",
                                      price: String(product.price),
                                      stock: String(product.stock),
                                      categoryId: product.categoryId,
                                    });
                                    setProductModalOpen(true);
                                  }}
                                >
                                  Editar
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  disabled={deleteProduct.isPending}
                                  onClick={() => deleteProduct.mutate(product.id)}
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
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="border shadow-2xl backdrop-blur border-slate-200 bg-white shadow-slate-200/50 text-slate-900 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-50 dark:shadow-slate-900/50">
                <CardHeader className="border-b border-slate-200 dark:border-white/5">
                  <CardTitle className="text-slate-900 dark:text-white">{editingProduct}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-slate-700 dark:text-slate-300">Nombre</Label>
                    <Input
                      value={productForm.name}
                      onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Ej. Monitor 27"
                      className="bg-slate-50 border-slate-300 dark:bg-slate-900/60 dark:border-white/10"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-slate-700 dark:text-slate-300">Descripción</Label>
                    <Input
                      value={productForm.description}
                      onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
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
                        onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))}
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
                        onChange={(e) => setProductForm((p) => ({ ...p, stock: e.target.value }))}
                        min={0}
                        className="bg-slate-50 border-slate-300 dark:bg-slate-900/60 dark:border-white/10"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-slate-700 dark:text-slate-300">Categoría</Label>
                    <Select
                      value={productForm.categoryId || undefined}
                      onValueChange={(val) => setProductForm((p) => ({ ...p, categoryId: val }))}
                    >
                      <SelectTrigger className="bg-slate-50 dark:bg-slate-900">
                        <SelectValue placeholder={loadingCategories ? "Cargando..." : "Selecciona"} />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-slate-900 border border-slate-200 dark:bg-slate-900 dark:text-slate-50 dark:border-white/10">
                        <SelectGroup>
                          <SelectLabel>Categorías</SelectLabel>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-blue-500 hover:bg-blue-500/90 text-white shadow-md shadow-blue-900/30" onClick={() => productMutation.mutate(productForm)} disabled={productMutation.isPending}>
                      {productForm.id ? "Guardar cambios" : "Crear producto"}
                    </Button>
                    <Button variant="ghost" onClick={() => setProductForm(emptyProductForm)} disabled={productMutation.isPending} className="text-slate-900 dark:text-slate-400">
                      Limpiar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-2xl backdrop-blur border-slate-200 bg-white shadow-slate-200/40 text-slate-900 dark:border-white/10 dark:bg-slate-900/5 dark:text-slate-50 dark:shadow-slate-900/40">
                <CardHeader className="border-b border-slate-200 dark:border-white/5">
                  <CardTitle className="text-slate-900 dark:text-white">{editingCategory}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-slate-700 dark:text-slate-300">Nombre</Label>
                    <Input
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm((c) => ({ ...c, name: e.target.value }))}
                      placeholder="Ej. Oficina"
                      className="bg-slate-50 border-slate-300 dark:bg-slate-900/60 dark:border-white/10"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-slate-700 dark:text-slate-300">Descripción</Label>
                    <Input
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm((c) => ({ ...c, description: e.target.value }))}
                      placeholder="Opcional"
                      className="bg-slate-50 border-slate-300 dark:bg-slate-900/60 dark:border-white/10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-blue-500 hover:bg-blue-500/90 text-white shadow-md shadow-blue-900/30" onClick={() => categoryMutation.mutate(categoryForm)} disabled={categoryMutation.isPending}>
                      {categoryForm.id ? "Guardar" : "Crear categoría"}
                    </Button>
                    <Button variant="ghost" onClick={() => setCategoryForm(emptyCategoryForm)} disabled={categoryMutation.isPending} className="text-slate-900 dark:text-slate-400">
                      Limpiar
                    </Button>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-950/50">
                    <div className="px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-900">Categorías</div>
                    <div className="divide-y divide-slate-200 dark:divide-white/5">
                      {loadingCategories ? (
                        <div className="p-3 text-sm text-slate-400 dark:text-slate-900">Cargando...</div>
                      ) : categories.length === 0 ? (
                        <div className="p-3 text-sm text-slate-400 dark:text-slate-900">Sin categorías</div>
                      ) : (
                        categories.map((cat) => (
                          <div key={cat.id} className="flex items-center justify-between px-3 py-2 text-sm">
                            <div>
                              <p className="font-medium text-slate-900 dark:text-slate-50">{cat.name}</p>
                              {cat.description ? <p className="text-xs text-slate-400 dark:text-slate-900">{cat.description}</p> : null}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="secondary"
                                size="xs"
                                className="bg-blue-500 text-white hover:bg-blue-500/90 shadow-md shadow-blue-900/30 border-none"
                                onClick={() => {
                                  setCategoryForm({
                                    id: cat.id,
                                    name: cat.name,
                                    description: cat.description ?? "",
                                  });
                                  setCategoryModalOpen(true);
                                }}
                              >
                                Editar
                              </Button>
                              <Button variant="destructive" size="xs" disabled={deleteCategory.isPending} onClick={() => deleteCategory.mutate(cat.id)}>
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
            </div>
          </section>
        </div>
      </div>

      <Dialog open={productModalOpen} onOpenChange={setProductModalOpen}>
        <DialogContent className="border sm:max-w-md bg-white text-slate-900 border-slate-200 dark:bg-slate-900 dark:text-slate-50 dark:border-white/10">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white">{editingProduct}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-slate-700 dark:text-slate-300">Nombre</Label>
              <Input
                value={productForm.name}
                onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Ej. Monitor 27"
                className="bg-slate-50 border-slate-300 dark:bg-slate-900/60 dark:border-white/10"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-slate-700 dark:text-slate-300">Descripción</Label>
              <Input
                value={productForm.description}
                onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
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
                  onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))}
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
                  onChange={(e) => setProductForm((p) => ({ ...p, stock: e.target.value }))}
                  min={0}
                  className="bg-slate-50 border-slate-300 dark:bg-slate-900/60 dark:border-white/10"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-slate-700 dark:text-slate-300">Categoría</Label>
              <Select
                value={productForm.categoryId || undefined}
                onValueChange={(val) => setProductForm((p) => ({ ...p, categoryId: val }))}
              >
                <SelectTrigger className="bg-slate-50 dark:bg-slate-900">
                  <SelectValue placeholder={loadingCategories ? "Cargando..." : "Selecciona"} />
                </SelectTrigger>
                <SelectContent className="bg-white text-slate-900 border border-slate-200 dark:bg-slate-900 dark:text-slate-50 dark:border-white/10">
                  <SelectGroup>
                    <SelectLabel>Categorías</SelectLabel>
                    {categories.map((cat) => (
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
            <Button variant="ghost" onClick={() => { setProductForm(emptyProductForm); setProductModalOpen(false); }} disabled={productMutation.isPending} className="text-slate-900 dark:text-slate-400">
              Cancelar
            </Button>
            <Button onClick={() => productMutation.mutate(productForm)} disabled={productMutation.isPending}>
              {productForm.id ? "Guardar cambios" : "Crear producto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
        <DialogContent className="border sm:max-w-md bg-white text-slate-900 border-slate-200 dark:bg-slate-900 dark:text-slate-50 dark:border-white/10">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white">{editingCategory}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-slate-700 dark:text-slate-300">Nombre</Label>
              <Input
                value={categoryForm.name}
                onChange={(e) => setCategoryForm((c) => ({ ...c, name: e.target.value }))}
                placeholder="Ej. Oficina"
                className="bg-slate-50 border-slate-300 dark:bg-slate-900/60 dark:border-white/10"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-slate-700 dark:text-slate-300">Descripción</Label>
              <Input
                value={categoryForm.description}
                onChange={(e) => setCategoryForm((c) => ({ ...c, description: e.target.value }))}
                placeholder="Opcional"
                className="bg-slate-50 border-slate-300 dark:bg-slate-900/60 dark:border-white/10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setCategoryForm(emptyCategoryForm); setCategoryModalOpen(false); }} disabled={categoryMutation.isPending} className="text-slate-900 dark:text-slate-400">
              Cancelar
            </Button>
            <Button onClick={() => categoryMutation.mutate(categoryForm)} disabled={categoryMutation.isPending}>
              {categoryForm.id ? "Guardar" : "Crear categoría"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={settingsModalOpen} onOpenChange={setSettingsModalOpen}>
        <DialogContent className="border sm:max-w-md bg-white text-slate-900 border-slate-200 dark:bg-slate-900 dark:text-slate-50 dark:border-white/10">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white">Configuración</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="dark:text-slate-700">Tema</Label>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => setTheme("light")}
                >
                  Claro
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setTheme("dark")}
                >
                  Oscuro
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setSettingsModalOpen(false)} className="text-slate-900 dark:text-slate-400">
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
