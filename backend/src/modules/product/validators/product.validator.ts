import { z } from "zod";

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const createProductSchema = z
  .object({
    productCode: z.string().trim().max(30).optional(),

    name: z.string().trim().min(2, "Product name is required.").max(150),

    category: objectIdSchema.optional(),

    subCategory: objectIdSchema.optional(),

    barcode: z.string().trim().optional(),

    hsnCode: z.string().trim().optional(),

    brand: z.string().trim().optional(),

    unit: z.string().trim().min(1, "Unit is required."),

    purchasePrice: z.number().min(0, "Purchase price cannot be negative."),

    sellingPrice: z.number().min(0, "Selling price cannot be negative."),

    stock: z.number().min(0).default(0),

    minimumStock: z.number().min(0).default(0),

    tax: z.number().min(0).max(100).default(0),

    description: z.string().trim().optional(),

    image: z.string().trim().optional(),

    isActive: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.subCategory && !data.category) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["category"],
        message: "Category is required when sub category is selected.",
      });
    }
  });

export const updateProductSchema = createProductSchema.partial();

export type CreateProductDto = z.infer<typeof createProductSchema>;

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
