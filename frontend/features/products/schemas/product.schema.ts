import { z } from "zod";

import { optionalString, requiredString } from "@/lib/validation";

export const productSchema = z.object({
  /* -------------------------------------------------------------------------- */
  /*                              Basic Information                             */
  /* -------------------------------------------------------------------------- */

  productCode: requiredString("Product Code"),

  name: requiredString("Product Name"),

  image: optionalString(),

  barcode: optionalString(),

  category: requiredString("Category"),

  subCategory: requiredString("Sub Category"),

  /* -------------------------------------------------------------------------- */
  /*                                  Pricing                                   */
  /* -------------------------------------------------------------------------- */

  purchasePrice: z
    .number({
      error: "Purchase price is required",
    })
    .min(0, "Purchase price cannot be negative"),

  sellingPrice: z
    .number({
      error: "Selling price is required",
    })
    .min(0, "Selling price cannot be negative"),

  /* -------------------------------------------------------------------------- */
  /*                                 Inventory                                  */
  /* -------------------------------------------------------------------------- */

  stock: z
    .number({
      error: "Opening stock is required",
    })
    .min(0, "Opening stock cannot be negative"),

  minimumStock: z
    .number({
      error: "Minimum stock is required",
    })
    .min(0, "Minimum stock cannot be negative"),

  unit: requiredString("Unit"),

  /* -------------------------------------------------------------------------- */
  /*                           Tax & Classification                             */
  /* -------------------------------------------------------------------------- */

  hsnCode: optionalString(),

  tax: z
    .number({
      error: "GST is required",
    })
    .min(0, "GST cannot be less than 0%")
    .max(100, "GST cannot exceed 100%"),

  /* -------------------------------------------------------------------------- */
  /*                           Additional Information                           */
  /* -------------------------------------------------------------------------- */

  brand: optionalString(),

  description: optionalString(),

  /* -------------------------------------------------------------------------- */
  /*                                   Status                                   */
  /* -------------------------------------------------------------------------- */

  isActive: z.boolean(),
});

export const REQUIRED_PRODUCT_FIELDS = {
  productCode: "Product Code",
  name: "Product Name",
  image: "",
  category: "Category",
  subCategory: "Sub Category",
  purchasePrice: "Purchase Price",
  sellingPrice: "Selling Price",
  stock: "Opening Stock",
  minimumStock: "Minimum Stock",
  unit: "Unit",
} as const;

export type ProductFormData = z.infer<typeof productSchema>;
