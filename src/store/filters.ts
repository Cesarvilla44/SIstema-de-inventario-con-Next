import { create } from "zustand";

interface FiltersState {
  search: string;
  categoryId: string | null;
  minStock: number | null;
  setSearch: (value: string) => void;
  setCategoryId: (id: string | null) => void;
  setMinStock: (value: number | null) => void;
  reset: () => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  search: "",
  categoryId: null,
  minStock: null,
  setSearch: (value) => set({ search: value }),
  setCategoryId: (categoryId) => set({ categoryId }),
  setMinStock: (minStock) => set({ minStock }),
  reset: () => set({ search: "", categoryId: null, minStock: null }),
}));
