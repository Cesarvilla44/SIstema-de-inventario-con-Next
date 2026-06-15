"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useThemeStore } from "@/store/theme";
import { useFiltersStore } from "@/store/filters";
import { InventorySidebar } from "@/components/InventorySidebar";
import { StatsCards } from "@/components/StatsCards";
import { ProductTable } from "@/components/ProductTable";
import { ProductForm } from "@/components/ProductForm";
import { CategoryForm } from "@/components/CategoryForm";
import { ProductModal } from "@/components/ProductModal";
import { CategoryModal } from "@/components/CategoryModal";
import { InventoryHeader } from "@/components/InventoryHeader";
import { ProductFilters } from "@/components/ProductFilters";
import { SettingsModal } from "@/components/SettingsModal";
import { useInventoryMutations } from "@/hooks/useInventoryMutations";
import { Category, Product } from "@/types";

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

export default function InventoryPage() {
  const filters = useFiltersStore();
  const { data: categories = [], isLoading: loadingCategories } = useCategoriesQuery();
  const productsKey = ["products", filters.search, filters.categoryId, filters.minStock];
  const { data: products = [], isLoading: loadingProducts } = useProductsQuery(filters);
  const { setTheme } = useThemeStore();

  const [productForm, setProductForm] = useState(emptyProductForm);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const {
    productMutation,
    deleteProduct,
    stockMutation,
    categoryMutation,
    deleteCategory,
  } = useInventoryMutations(productsKey, products);

  const asNumber = (value: unknown) =>
    typeof value === "number" ? value : Number(value);

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
        <InventorySidebar />

        <div className="flex-1 space-y-5">
          <InventoryHeader 
            onSettingsClick={() => setSettingsModalOpen(true)}
            onAddCategory={() => { setCategoryForm(emptyCategoryForm); setCategoryModalOpen(true); }}
            onAddProduct={() => { setProductForm(emptyProductForm); setProductModalOpen(true); }}
          />
          
          <StatsCards 
            productCount={productCount}
            categoryCount={categoryCount}
            totalStock={totalStock}
            totalValue={totalValue}
          />

          <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
            <Card className="border text-slate-900 shadow-2xl backdrop-blur border-slate-200 bg-white shadow-slate-200/40 dark:border-white/10 dark:bg-slate-900/5 dark:text-slate-50 dark:shadow-slate-900/40">
              <CardHeader className="border-b border-slate-200 dark:border-white/5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">Listado de productos</CardTitle>
                  <ProductFilters categories={categories} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProductTable 
                  products={products}
                  categories={categories}
                  loading={loadingProducts}
                  onEdit={(product) => {
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
                  onDelete={(id) => deleteProduct.mutate(id)}
                  onStockChange={(id, delta) => stockMutation.mutate({ id, delta })}
                  stockMutationPending={stockMutation.isPending}
                  deletePending={deleteProduct.isPending}
                />
              </CardContent>
            </Card>

            <div className="space-y-4">
              <ProductForm 
                productForm={productForm}
                setProductForm={setProductForm}
                categories={categories}
                loadingCategories={loadingCategories}
                onSubmit={() => productMutation.mutate(productForm)}
                onClear={() => setProductForm(emptyProductForm)}
                isPending={productMutation.isPending}
              />

              <CategoryForm 
                categoryForm={categoryForm}
                setCategoryForm={setCategoryForm}
                categories={categories}
                loadingCategories={loadingCategories}
                onSubmit={() => categoryMutation.mutate(categoryForm)}
                onClear={() => setCategoryForm(emptyCategoryForm)}
                isPending={categoryMutation.isPending}
                onEditCategory={(category) => {
                  setCategoryForm({
                    id: category.id,
                    name: category.name,
                    description: category.description ?? "",
                  });
                  setCategoryModalOpen(true);
                }}
                onDeleteCategory={(id) => deleteCategory.mutate(id)}
                deletePending={deleteCategory.isPending}
              />
            </div>
          </section>
        </div>
      </div>

      <ProductModal 
        open={productModalOpen}
        onOpenChange={setProductModalOpen}
        productForm={productForm}
        setProductForm={setProductForm}
        categories={categories}
        loadingCategories={loadingCategories}
        onSubmit={() => productMutation.mutate(productForm)}
        isPending={productMutation.isPending}
      />

      <CategoryModal 
        open={categoryModalOpen}
        onOpenChange={setCategoryModalOpen}
        categoryForm={categoryForm}
        setCategoryForm={setCategoryForm}
        onSubmit={() => categoryMutation.mutate(categoryForm)}
        isPending={categoryMutation.isPending}
      />

      <SettingsModal 
        open={settingsModalOpen}
        onOpenChange={setSettingsModalOpen}
        onThemeChange={setTheme}
      />
    </main>
  );
}
