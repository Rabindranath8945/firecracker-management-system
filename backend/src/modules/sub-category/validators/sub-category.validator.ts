import { z } from "zod";

export const createSubCategorySchema = z.object({
  subCategoryCode: z.string().trim().min(1).max(30),

  name: z.string().trim().min(2).max(100),

  category: z.string().min(1, "Category is required."),

  description: z.string().optional(),

  image: z.string().optional(),

  isActive: z.boolean().default(true),
});

export const updateSubCategorySchema = createSubCategorySchema.partial();

export type CreateSubCategoryDto = z.infer<typeof createSubCategorySchema>;

export type UpdateSubCategoryDto = z.infer<typeof updateSubCategorySchema>;
