import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFiltersStore } from "@/store/filters";

describe("useFiltersStore", () => {
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

  it("el estado inicial tiene search vacío y ninguna categoría seleccionada", () => {
    const { result } = renderHook(() => useFiltersStore());
    expect(result.current.search).toBe("");
    expect(result.current.categoryId).toBeNull();
    expect(result.current.minStock).toBeNull();
  });

  it("setSearch actualiza el valor de búsqueda", () => {
    const { result } = renderHook(() => useFiltersStore());
    act(() => {
      result.current.setSearch("roble");
    });
    expect(result.current.search).toBe("roble");
  });

  it("setCategoryId actualiza la categoría seleccionada", () => {
    const { result } = renderHook(() => useFiltersStore());
    act(() => {
      result.current.setCategoryId("cat-maderas");
    });
    expect(result.current.categoryId).toBe("cat-maderas");
  });

  it("setCategoryId puede establecer null para deseleccionar", () => {
    const { result } = renderHook(() => useFiltersStore());
    act(() => {
      result.current.setCategoryId("cat-herrajes");
    });
    expect(result.current.categoryId).toBe("cat-herrajes");
    
    act(() => {
      result.current.setCategoryId(null);
    });
    expect(result.current.categoryId).toBeNull();
  });

  it("setMinStock actualiza el stock mínimo", () => {
    const { result } = renderHook(() => useFiltersStore());
    act(() => {
      result.current.setMinStock(10);
    });
    expect(result.current.minStock).toBe(10);
  });

  it("setMinStock puede establecer null", () => {
    const { result } = renderHook(() => useFiltersStore());
    act(() => {
      result.current.setMinStock(5);
    });
    expect(result.current.minStock).toBe(5);
    
    act(() => {
      result.current.setMinStock(null);
    });
    expect(result.current.minStock).toBeNull();
  });

  it("reset devuelve todos los filtros a sus valores iniciales", () => {
    const { result } = renderHook(() => useFiltersStore());
    act(() => {
      result.current.setCategoryId("cat-maderas");
      result.current.setSearch("roble");
      result.current.setMinStock(10);
    });
    
    expect(result.current.search).toBe("roble");
    expect(result.current.categoryId).toBe("cat-maderas");
    expect(result.current.minStock).toBe(10);
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.search).toBe("");
    expect(result.current.categoryId).toBeNull();
    expect(result.current.minStock).toBeNull();
  });

  it("reset funciona cuando solo algunos filtros están activos", () => {
    const { result } = renderHook(() => useFiltersStore());
    act(() => {
      result.current.setSearch("bisagra");
    });
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.search).toBe("");
    expect(result.current.categoryId).toBeNull();
    expect(result.current.minStock).toBeNull();
  });
});
