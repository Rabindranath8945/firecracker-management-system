"use client";

import { useQuery } from "@tanstack/react-query";

import CategoryService from "../services/category.service";

import type { ProductCategory } from "@/features/products/types/product.types";

export function useCategories() {
  return useQuery<ProductCategory[]>({
    queryKey: ["categories"],

    queryFn: async (): Promise<ProductCategory[]> => {
      const categories = await CategoryService.getCategories();

      return categories.map((category) => ({
        _id: category.id,
        name: category.name,
      }));
    },
  });
}
