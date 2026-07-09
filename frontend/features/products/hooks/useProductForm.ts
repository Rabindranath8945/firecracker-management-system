"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateSku } from "../utils/generateSku";
import { productSchema, ProductFormData } from "../schemas/product.schema";

export function useProductForm() {
  return useForm<ProductFormData>({
    resolver: zodResolver(productSchema),

    defaultValues: {
      name: "",

      sku: generateSku(),

      barcode: "",

      category: "",

      purchasePrice: 0,

      sellingPrice: 0,

      mrp: 0,

      openingStock: 0,

      minimumStock: 0,

      unit: "piece",

      brand: "",

      hsn: "",

      gst: 18,

      description: "",

      active: true,
    },

    mode: "onChange",
  });
}
