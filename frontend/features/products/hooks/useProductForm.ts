"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormData } from "../schemas/product.schema";
import { getProductDefaultValues } from "../constants/productDefaults";

export function useProductForm() {
  return useForm<ProductFormData>({
    resolver: zodResolver(productSchema),

    mode: "onChange",

    defaultValues: getProductDefaultValues(),
  });
}
