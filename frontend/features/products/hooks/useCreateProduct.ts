"use client";

import { toast } from "sonner";
import { productApi } from "../api/product.api";
import type { ProductFormData } from "../schemas/product.schema";

interface Props {
  onSuccess?: (product: { name: string; sku: string }) => void;
}

export function useCreateProduct({ onSuccess }: Props) {
  async function createProduct(data: ProductFormData) {
    try {
      console.log("Creating Product...");

      // const product = await productApi.create(data);

      onSuccess?.({
        name: data.name,
        sku: data.sku,
      });

      toast.success("Product created successfully");
    } catch {
      toast.error("Unable to save product");
    }
  }

  return {
    createProduct,
  };
}
