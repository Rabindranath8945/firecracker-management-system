"use client";

import { useQuery } from "@tanstack/react-query";

import SubCategoryService from "../services/sub-category.service";

import type { ProductSubCategory } from "@/features/products/types/product.types";

export function useSubCategories(categoryId?: string) {
  return useQuery<ProductSubCategory[]>({
    queryKey: ["sub-categories", categoryId],

    queryFn: () => {
      if (!categoryId) {
        return Promise.resolve([]);
      }

      return SubCategoryService.getByCategory(categoryId);
    },

    enabled: !!categoryId,
  });
}
