import { z } from "zod";

import { optionalString, requiredString } from "@/lib/validation";

export const productSchema = z.object({
  // =========================
  // Basic Information
  // =========================
  name: requiredString("Product name"),
  sku: requiredString("SKU"),
  barcode: optionalString(),
  category: requiredString("Category"),

  // =========================
  // Pricing
  // =========================
  purchasePrice: z
    .number({
      error: "Purchase price is required",
    })
    .min(1, "Purchase price cannot be negative"),

  sellingPrice: z
    .number({
      error: "Selling price is required",
    })
    .min(1, "Selling price cannot be negative"),

  // mrp: z.number(),

  // =========================
  // Inventory
  // =========================
  openingStock: z
    .number({
      error: "Opening stock is required",
    })
    .min(1, "Opening stock cannot be negative"),

  minimumStock: z
    .number({
      error: "Minimum stock is required",
    })
    .min(1, "Minimum stock cannot be negative"),

  unit: requiredString("Unit"),

  // =========================
  // Tax & Classification
  // =========================
  hsn: optionalString(),

  gst: z
    .number({
      error: "GST is required",
    })
    .min(0)
    .max(100),

  // =========================
  // Additional Information
  // =========================
  brand: optionalString(),
  description: optionalString(),

  // =========================
  // Status
  // =========================
  active: z.boolean(),
});

export const REQUIRED_PRODUCT_FIELDS = {
  name: "Product Name",
  category: "Category",
  purchasePrice: "Purchase Price",
  sellingPrice: "Selling Price",
  openingStock: "Opening Stock",
  minimumStock: "Minimum Stock",
  unit: "Unit",
} as const;

export type ProductFormData = z.infer<typeof productSchema>;
