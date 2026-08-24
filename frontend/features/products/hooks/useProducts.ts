"use client";

import { useQuery } from "@tanstack/react-query";

import ProductService from "../services/product.service";

import type { Product, ProductListResponse } from "../types/product.types";

interface UseProductsParams {
  search?: string;

  category?: string;

  subCategory?: string;

  stockFilter?: string;

  sortBy?: string;

  page?: number;

  limit?: number;
}

export function useProducts({
  search = "",
  category = "",
  subCategory = "",
  stockFilter = "",
  sortBy = "NAME_ASC",
  page = 1,
  limit = 20,
}: UseProductsParams = {}) {
  const query = useQuery<ProductListResponse>({
    queryKey: [
      "products",
      search,
      category,
      subCategory,
      stockFilter,
      sortBy,
      page,
      limit,
    ],

    queryFn: () =>
      ProductService.getProducts({
        search,
        category,
        subCategory,
        stockFilter,
        sortBy,
        page,
        limit,
      }),
  });

  const products: Product[] = query.data?.items ?? [];

  return {
    data: query.data,

    products,

    stats: {
      total: query.data?.pagination.total ?? 0,

      inStock: products.filter((p) => p.stock > p.minimumStock).length,

      lowStock: products.filter((p) => p.stock > 0 && p.stock <= p.minimumStock)
        .length,

      outOfStock: products.filter((p) => p.stock === 0).length,
    },

    pagination: query.data?.pagination,

    isLoading: query.isLoading,

    isFetching: query.isFetching,

    error: query.error,

    refetch: query.refetch,
  };
}
