"use client";

import { useQuery } from "@tanstack/react-query";

import CategoryService from "../services/category.service";

import type { ProductCategory } from "@/features/products/types/product.types";

export function useCategories() {
  return useQuery<ProductCategory[]>({
    queryKey: ["categories"],
    queryFn: CategoryService.getCategories,
  });
}
