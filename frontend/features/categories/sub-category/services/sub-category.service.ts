import { subCategories } from "../data/sub-categories";
import type { SubCategory } from "../types/sub-category";

export { subCategories };

export function getSubCategories(): SubCategory[] {
  return subCategories;
}

export function getSubCategoryById(id: string): SubCategory | undefined {
  return subCategories.find((subCategory) => subCategory.id === id);
}
