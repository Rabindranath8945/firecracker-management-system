import { z } from "zod";

export const createBusinessSchema = z.object({
  name: z.string().trim().min(2).max(100),

  type: z.string(),

  phone: z.string().trim().optional(),

  email: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().email().optional(),
  ),

  address: z.string().trim().optional(),
});

export const updateBusinessSchema = createBusinessSchema.partial();
