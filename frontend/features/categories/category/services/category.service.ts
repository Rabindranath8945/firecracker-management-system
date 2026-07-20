import { categories } from "../data/catagories";
import type { Category } from "../types/category";

export { categories };

export function getCategories(): Category[] {
  return categories;
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((category) => category.id === id);
}
