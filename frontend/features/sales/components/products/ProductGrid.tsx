"use client";

import ProductCard from "./ProductCard";
import LoadingProducts from "../shared/LoadingProducts";
import EmptyProducts from "../shared/EmptyProducts";

import type { Product } from "@/features/products/types/product.types";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onAdd: (product: Product, qty: number) => void;
}

export default function ProductGrid({
  products,
  loading = false,
  onAdd,
}: ProductGridProps) {
  if (loading) {
    return <LoadingProducts />;
  }

  if (products.length === 0) {
    return <EmptyProducts />;
  }

  return (
    <section className="space-y-3 pb-28">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} onAdd={onAdd} />
      ))}
    </section>
  );
}
