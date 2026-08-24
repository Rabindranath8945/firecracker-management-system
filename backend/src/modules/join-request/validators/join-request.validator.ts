import { z } from "zod";

export const createJoinRequestSchema = z.object({
  businessId: z.string(),

  role: z.string().optional(),
});
