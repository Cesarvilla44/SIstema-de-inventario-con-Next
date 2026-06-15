export type Category = {
  id: string;
  name: string;
  description: string | null;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  categoryId: string;
  category: Category;
};
