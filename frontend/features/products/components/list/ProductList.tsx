"use client";

import ProductListItem from "./ProductListItem";

import type { Product } from "../../types/product.types";

interface ProductListProps {
  loading: boolean;
  products: Product[];
  onDelete: (product: Product) => void;
}

export default function ProductList({
  loading,
  products,
  onDelete,
}: ProductListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-3xl bg-slate-200"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-16">
        <h3 className="text-lg font-semibold text-slate-900">
          No products found
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product) => (
        <ProductListItem
          key={product._id}
          product={product}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
