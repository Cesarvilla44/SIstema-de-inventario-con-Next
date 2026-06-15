import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/types";

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

export function useInventoryMutations(productsKey: any[], products: Product[]) {
  const queryClient = useQueryClient();

  const productMutation = useMutation({
    mutationFn: async (payload: any) => {
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
    onError: (_err: any, _vars: any, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(productsKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productsKey });
    },
  });

  const categoryMutation = useMutation({
    mutationFn: async (payload: any) => {
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

  return {
    productMutation,
    deleteProduct,
    stockMutation,
    categoryMutation,
    deleteCategory,
  };
}
