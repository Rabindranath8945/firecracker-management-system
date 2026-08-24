"use client";

import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import ProductService from "../services/product.service";

import type { Product } from "../types/product.types";
import type { ProductFormData } from "../schemas/product.schema";

interface ProductMutationProps {
  mode?: "create" | "edit";

  product: Product | undefined;

  onSuccess?: (product: Product) => void;

  onUpdated?: () => void;
}

export function useProductMutation({
  mode = "create",
  product,
  onSuccess,
  onUpdated,
}: ProductMutationProps) {
  const queryClient = useQueryClient();

  async function saveProduct(
    data: ProductFormData,
  ): Promise<Product | undefined> {
    try {
      console.log("Submitting Product:", data);

      /* ------------------------------------------------------------------ */
      /* UPDATE                                                             */
      /* ------------------------------------------------------------------ */

      if (mode === "edit" && product) {
        const updatedProduct = await ProductService.updateProduct(
          product._id,
          data,
        );

        toast.success("Product updated successfully.");

        await queryClient.invalidateQueries({
          queryKey: ["products"],
        });

        onUpdated?.();

        return updatedProduct;
      }

      /* ------------------------------------------------------------------ */
      /* CREATE                                                             */
      /* ------------------------------------------------------------------ */

      const createdProduct = await ProductService.createProduct(data);

      /* ------------------------------------------------------------------ */
      /* Refresh Product Queries                                            */
      /* ------------------------------------------------------------------ */

      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["next-product-code"],
      });

      /* ------------------------------------------------------------------ */
      /* Success Callback                                                   */
      /* ------------------------------------------------------------------ */

      onSuccess?.(createdProduct);

      toast.success("Product created successfully.");

      return createdProduct;
    } catch (error) {
      console.error(error);

      toast.error(
        mode === "edit"
          ? "Unable to update product."
          : "Unable to create product.",
      );

      return undefined;
    }
  }

  return {
    saveProduct,
  };
}
