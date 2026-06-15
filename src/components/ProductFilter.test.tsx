import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, renderHook, act } from "@testing-library/react";
import { ProductFilter } from "@/components/ProductFilter";
import { useFiltersStore } from "@/store/filters";

describe("ProductFilter", () => {
  beforeEach(() => {
    useFiltersStore.setState({
      search: "",
      categoryId: null,
      minStock: null,
      setSearch: useFiltersStore.getState().setSearch,
      setCategoryId: useFiltersStore.getState().setCategoryId,
      setMinStock: useFiltersStore.getState().setMinStock,
      reset: useFiltersStore.getState().reset,
    });
  });

  it("renderiza el input de búsqueda", () => {
    render(<ProductFilter />);
    
    expect(screen.getByLabelText("Buscar")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nombre del producto...")).toBeInTheDocument();
  });

  it("renderiza el input de stock mínimo", () => {
    render(<ProductFilter />);
    
    expect(screen.getByLabelText("Stock mínimo")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("0")).toBeInTheDocument();
  });

  it("actualiza el search al escribir en el input", () => {
    const { result } = renderHook(() => useFiltersStore());
    render(<ProductFilter />);
    
    const searchInput = screen.getByLabelText("Buscar");
    fireEvent.change(searchInput, { target: { value: "roble" } });
    
    expect(result.current.search).toBe("roble");
  });

  it("actualiza el minStock al escribir un número", () => {
    const { result } = renderHook(() => useFiltersStore());
    render(<ProductFilter />);
    
    const stockInput = screen.getByLabelText("Stock mínimo");
    fireEvent.change(stockInput, { target: { value: "10" } });
    
    expect(result.current.minStock).toBe(10);
  });

  it("restablece minStock a null al vaciar el input", () => {
    const { result } = renderHook(() => useFiltersStore());
    act(() => {
      result.current.setMinStock(5);
    });
    
    render(<ProductFilter />);
    
    const stockInput = screen.getByLabelText("Stock mínimo");
    fireEvent.change(stockInput, { target: { value: "" } });
    
    expect(result.current.minStock).toBeNull();
  });
});
