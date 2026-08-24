import { z } from "zod";

export const createCategorySchema = z.object({
  categoryCode: z.string().trim().min(1, "Category code is required.").max(30),

  name: z.string().trim().min(2, "Category name is required.").max(100),

  description: z.string().optional(),

  image: z.string().optional(),

  isActive: z.boolean().default(true),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;

export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
