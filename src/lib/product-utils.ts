export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  categoryId: string;
  createdAt: string;
}

export interface SortOptions {
  field: "name" | "price" | "stock" | "createdAt";
  order: "asc" | "desc";
}

export function filterProducts(products: Product[], searchQuery: string): Product[] {
  if (!searchQuery.trim()) {
    return products;
  }
  const query = searchQuery.toLowerCase();
  return products.filter((product) =>
    product.name.toLowerCase().includes(query)
  );
}

export function sortProducts(products: Product[], options: SortOptions): Product[] {
  const { field, order } = options;
  const multiplier = order === "asc" ? 1 : -1;

  return [...products].sort((a, b) => {
    let comparison = 0;
    
    if (field === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (field === "price") {
      comparison = a.price - b.price;
    } else if (field === "stock") {
      comparison = a.stock - b.stock;
    } else if (field === "createdAt") {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    
    return comparison * multiplier;
  });
}

export function isLowStock(product: Product, threshold: number): boolean {
  if (threshold < 0) return true;
  if (product.stock === 0) return true;
  return product.stock < threshold;
}

export function formatPrice(price: number): string {
  const rounded = Math.round(price * 100) / 100;
  const formatted = rounded.toFixed(2).replace(".", ",");
  const parts = formatted.split(",");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${parts.join(",")} €`;
}
