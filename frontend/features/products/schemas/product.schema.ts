import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),

  sku: z.string(),

  barcode: z.string().optional(),

  category: z.string().trim().min(1, "Category is required"),

  purchasePrice: z.number(),

  sellingPrice: z.number(),

  mrp: z.number(),

  openingStock: z.number(),

  minimumStock: z.number(),

  unit: z.string(),

  brand: z.string().optional(),

  hsn: z.string().optional(),

  gst: z.number(),

  description: z.string().optional(),

  active: z.boolean(),
});

export type ProductFormData = z.infer<typeof productSchema>;
