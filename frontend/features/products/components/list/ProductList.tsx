"use client";

import ProductListItem from "./ProductListItem";
import { Product } from "../../types/product.types";

interface Props {
  products: Product[];
}

export default function ProductList({ products }: Props) {
  return (
    <div className="space-y-3">
      {products.map((product) => (
        <ProductListItem key={product.id} product={product} />
      ))}
    </div>
  );
}
