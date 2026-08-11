"use client";

import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import ProductService from "../services/product.service";

import type { Product } from "../types/product.types";
import type { ProductFormData } from "../schemas/product.schema";

interface ProductMutationProps {
  mode?: "create" | "edit";

  product: Product | undefined;

  onSuccess?: (product: { name: string; productCode: string }) => void;

  onUpdated?: () => void;
}

export function useProductMutation({
  mode = "create",
  product,
  onSuccess,
  onUpdated,
}: ProductMutationProps) {
  const queryClient = useQueryClient();
  async function saveProduct(data: ProductFormData) {
    try {
      console.log("Submitting Product:", data);

      if (mode === "edit" && product) {
        await ProductService.updateProduct(product._id, data);

        toast.success("Product updated successfully.");

        onUpdated?.();

        return;
      }

      await ProductService.createProduct(data);

      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["next-product-code"],
      });

      onSuccess?.({
        name: data.name,
        productCode: data.productCode,
      });

      toast.success("Product created successfully.");
    } catch (error) {
      console.error(error);

      toast.error(
        mode === "edit"
          ? "Unable to update product."
          : "Unable to create product.",
      );
    }
  }

  return {
    saveProduct,
  };
}
