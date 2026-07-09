"use client";

import { toast } from "sonner";

import { productApi } from "../api/product.api";

export function useCreateProduct() {
  async function createProduct(data: any) {
    try {
      console.log("Creating Product...");

      // Later
      // await productApi.create(data);

      console.log(data);

      toast.success("Product saved successfully");
    } catch {
      toast.error("Unable to save product");
    }
  }

  return {
    createProduct,
  };
}
